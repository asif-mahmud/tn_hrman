import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Wizard } from '../components/wizard';
import { EmployeePagination } from '../components/employee.pagination';
import { FormFieldError } from '../components/form.field.error';
import { useSendEmail } from '../hooks/send.email';

import Schema from '@validators';

export default function () {
  const [curPage, setCurPage] = useState(0);
  const [selected, setSelectedEmployees] = useState([]);
  const [sendEmail, state] = useSendEmail();
  const titles = ['1. Select employees', '2. Send email'];

  return (
    <Container>
      <Row>
        <Col>
          <Wizard
            curPage={curPage}
            setCurPage={setCurPage}
            title={titles[curPage]}
          >
            {/* First page: select employees */}
            <div className="d-flex flex-column">
              <Container fluid>
                {' '}
                <p>
                  Select one or more employees from the following table and
                  click next at top-right of the page.
                </p>
              </Container>
              <EmployeePagination
                selectable
                selected={selected}
                onSelectionChanged={setSelectedEmployees}
              />
            </div>

            {/* Second page: send email form */}
            <div className="d-flex flex-column">
              <Container fluid>
                <Row>
                  <Col>
                    <p>
                      {selected.length === 0 && (
                        <Alert variant="danger">
                          No employee has been selected. Please go to previous
                          page and select a few employees first.
                        </Alert>
                      )}
                      {selected.length > 0 &&
                        `${selected.length} employee/s are selected. Please fill up the form and click send to send email to all of them.`}
                    </p>
                  </Col>
                </Row>

                {/* server error */}
                {!state.loading && state.error && (
                  <Row>
                    <Col>
                      <Alert variant="danger">{state.error}</Alert>
                    </Col>
                  </Row>
                )}

                {/* success message */}
                {!state.loading && state.data && (
                  <Row>
                    <Col>
                      <Alert variant="success">
                        Email was sent successfully
                      </Alert>
                    </Col>
                  </Row>
                )}

                {/* email form */}
                <Row>
                  <Col>
                    <Formik
                      initialValues={{ subject: '', body: '' }}
                      validationSchema={Schema.Email}
                      onSubmit={(values, { setSubmitting }) => {
                        if (selected && selected.length > 0) {
                          sendEmail({ employees: selected, email: values });
                        }
                        setSubmitting(false);
                      }}
                    >
                      {(props) => (
                        <Form onSubmit={props.handleSubmit}>
                          {/* email subject */}
                          <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                              type="text"
                              name="subject"
                              value={props.values.subject}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                            <FormFieldError name="subject" />
                          </Form.Group>

                          {/* email body */}
                          <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={5}
                              name="body"
                              value={props.values.body}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                            <FormFieldError name="body" />
                          </Form.Group>

                          <Button
                            type="submit"
                            className="w-100"
                            disabled={
                              state.loading ||
                              !selected ||
                              selected.length === 0
                            }
                          >
                            Send
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </Col>
                </Row>
              </Container>
            </div>
          </Wizard>
        </Col>
      </Row>
    </Container>
  );
}
