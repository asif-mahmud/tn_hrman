import * as multer from 'multer';
import * as Yup from 'yup';
import * as csvparse from 'csv-parse';
import { Op } from 'sequelize';
import * as Nodemailer from 'nodemailer';

import Employee from '../models/employees';

import Schema from '@validators';

const InternalError = {
  error: 'Something went wrong, please try again later.',
};

const mailer = Nodemailer.createTransport({
  host: process.env.NX_MAIL_HOST || '',
  port: parseInt(process.env.NX_MAIL_PORT || '0'),
  auth: {
    user: process.env.NX_MAIL_USER || '',
    pass: process.env.NX_MAIL_PASS || '',
  },
});

/**
 * Add one employe at a time.
 * Expects json input with this type -
 *
 * {
 * "firstName": string,
 * "lastName" : string,
 * "email": string,
 * }
 *
 * upon successful insertion, will return the inserted employee
 * instance or error
 */
async function AddEmployee(req, res) {
  // validate incoming data
  Schema.Employee.validate(req.body)
    .then((val) => {
      // check if any employee exists with same email address
      Employee.findOne({ where: { email: val.email } })
        .then((found) => {
          if (found) {
            res.json({
              error: `Employee with email "${val.email}" already exists.`,
            });
            return;
          }
          // no employee found with same email, so create one
          Employee.create(val)
            .then((employee) => {
              // send back newly created employee instance
              res.json({ data: employee });
            })
            .catch((err) => {
              console.log(err); // TODO: should use logger
              res.json(InternalError);
            });
        })
        .catch((err) => {
          // add employee to database
          console.log(err); // TODO: should use logger
          res.json(InternalError);
        });
    })
    .catch((err) => {
      // some validation error happened
      res.json({ error: err.message });
    });
}

function filterByNewEmails(employees, emails, onData, onError) {
  // assuming employees is non-null list
  if (emails && emails.length > 0) {
    Employee.findAll({
      where: {
        email: {
          [Op.in]: emails,
        },
      },
    })
      .then((list) => {
        // check if no employee found
        if (!list) {
          onData([]); // send in empty array
          return;
        }
        // found non-null list of employees
        let filtered = employees.filter((e) => {
          let duplicate = false;
          for (let i = 0; i < list.length; i++) {
            if (e.email === list[i].email) {
              duplicate = true;
              return;
            }
          }
          return !duplicate;
        });
        onData(filtered);
      })
      .catch((e) => {
        // error happened
        onError(e);
      });
  } else {
    // emails is empty list or null
    onData(employees);
  }
}

/**
 * Add many employee to the database at once.
 * Expects form field "file" as file data
 * upon success, returns this type -
 * {
 * "rowsGot" : number,
 * "invalidRows": number,
 * "existingRows": number,
 * "totalSkippedRows": number,
 * "employees": []Employee,
 *}
 * or error
 * NOTE: this could be improved more by returning existing
 * and invalid employee list as well to let user know
 * what exactly happened.
 */
function AddManyEmployees(req, res) {
  Employee.count().then((c) => {
    console.log(`Count: ${c}`);
  });
  multer().single('file')(req, res, (err) => {
    // check for file upload error
    if (err) {
      res.json(InternalError);
      return;
    }

    // parse, validate and collect data set
    let data = []; // incoming data set
    let emails = []; // incoming non-empty email list
    let error = null; // parsing error
    let rows = 0; // total incoming rows
    const parser = csvparse();
    parser.on('readable', () => {
      let row;
      while ((row = parser.read())) {
        rows++; // found a row, whether or not it is invalid
        // each row must have at least 3 columns
        if (row.length < 3) {
          continue;
        }
        // validate with schema
        try {
          const employee = Schema.Employee.validateSync({
            firstName: row[0],
            lastName: row[1],
            email: row[2],
          });
          emails.push(employee.email);
          data.push(employee);
        } catch (e) {
          // skipping validation error for bulk insertion
        }
      }
    });
    parser.on('error', (err) => {
      console.log(err); // TODO: use logger
      error = err;
    });
    parser.write(req.file.buffer);
    parser.end();
    // TODO: should delete temporary file saved by multer

    // check for csv parsing error
    if (error) {
      res.json({ error: 'Invalid CSV file' });
      return;
    }

    // filter dataset based on non-existing emails
    filterByNewEmails(
      data,
      emails,
      (filtered) => {
        // filtered dataset is empty
        if (!filtered || filtered.length === 0) {
          res.json({ error: 'Empty dataset or no new employee found' });
          return;
        }
        // insert filtered dataset
        Employee.bulkCreate(filtered)
          .then((list) => {
            res.json({
              data: {
                rowsGot: rows,
                invalidRows: rows - data.length,
                existingRows: data.length - list.length,
                totalSkippedRows: rows - list.length,
                employees: list,
              },
            });
          })
          .catch((err) => {
            console.log(err); // TODO: use logger
            res.json(InternalError);
          });
      },
      (err) => {
        console.log(err); // TODO: use logger
        res.json(InternalError);
        return;
      }
    );
  });
}

/**
 * Pagination query schema
 */
const pageQuerySchema = Yup.object().shape({
  first: Yup.number('First must be a number')
    .required('First is required')
    .min(0, 'First can not be lower than 0')
    .max(25, 'First must be less than or equal to 25'),
  after: Yup.number('After must be a number')
    .required('After is required')
    .min(0, 'After can not be lower than 0'),
});

/**
 * Get employee list.
 * This provides a very simple forward pagination system based on cursor.
 * Expects following parameters as json request -
 * {
 * "first": number,
 * "after": number
 * }
 * Upon success returns data of following type -
 * {
 * "total" : number,
 * "start": number,
 * "end": number,
 * "employees": []Employees
 * }
 * or error
 */
function GetEmployees(req, res) {
  // validate query data
  pageQuerySchema
    .validate(req.body)
    .then((query) => {
      // fetch employee list from database
      Employee.findAndCountAll({
        offset: query.after,
        limit: query.first,
      })
        .then((result) => {
          const len = result.rows.length;
          const startId = (len && result.rows[0].id) || 0;
          const endId = (len && result.rows[len - 1].id) || 0;
          res.json({
            data: {
              total: result.count,
              start: startId,
              end: endId,
              employees: result.rows,
            },
          });
        })
        .catch((err) => {
          console.log(err); // TODO: use logger
          res.json(InternalError);
        });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
}

const emailParams = Yup.object().shape({
  employees: Yup.array()
    .of(Yup.number().min(0, 'Employee id must be higher than 0'))
    .min(1, 'One or more employee must be selected'),
  email: Schema.Email,
});

function SendEmail(res, to, email) {
  // convert to into a list of recipients anyway
  to = to || [];
  if (typeof to === 'string' || to instanceof String) {
    to = [to];
  }

  // send email
  mailer.sendMail(
    {
      to: to,
      subject: (email && email.subject) || '',
      text: (email && email.body) || 'Empty message',
    },
    (err, info) => {
      if (err) {
        res.json({ error: err.message });
        return;
      }

      // respond with status
      const accepted = info.accepted.length;
      const rejected = info.rejected.length;
      res.json({
        data: {
          success: true,
          sent: accepted,
          rejected: rejected,
        },
      });
    }
  );
}

const emailConfig = Yup.object().shape({
  host: Yup.string().required('Mail host required'),
  port: Yup.number()
    .required('Mail port required')
    .moreThan(0, 'Mail port can not be 0'),
  user: Yup.string().required('Mail user required'),
  password: Yup.string().required('Mail password required'),
});

function CheckConfigAndSendEmail(res, to, email) {
  emailConfig
    .validate({
      host: process.env.NX_MAIL_HOST,
      port: parseInt(process.env.NX_MAIL_PORT || '0'),
      user: process.env.NX_MAIL_USER,
      password: process.env.NX_MAIL_PASS,
    })
    .then(() => {
      SendEmail(res, to, email);
    })
    .catch(() => {
      console.log('Mail server not configured, skipping mail sending');
      res.json({
        data: {
          success: true,
        },
      });
    });
}

function SendEmailToEmployees(req, res) {
  emailParams
    .validate(req.body)
    .then((params) => {
      // collect employee emails from database
      Employee.findAll({
        where: {
          id: {
            [Op.in]: params.employees,
          },
        },
      })
        .then((employees) => {
          if (employees) {
            // TODO: should check whether or not each incoming
            // id was found
            const emailAddresses = employees.map((e) => e.email);
            // try sending email
            CheckConfigAndSendEmail(res, emailAddresses, params.email);
          } else {
            res.json({ error: 'Employees not found' });
          }
        })
        .catch((err) => {
          console.log(err); // TODO: use logger
          res.json(InternalError);
        });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
}

export default function AddEmployeeRoutes(app) {
  app.post('/api/employees/add-one', AddEmployee);
  app.post('/api/employees/add-many', AddManyEmployees);
  app.post('/api/employees', GetEmployees);
  app.post('/api/send-email', SendEmailToEmployees);
}
