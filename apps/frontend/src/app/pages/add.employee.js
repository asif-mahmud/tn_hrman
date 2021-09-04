import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useAddEmployee } from '../hooks/add.employee';
import { FormFieldError } from '../components/form.field.error';

import Schema from '@validators';

export default function () {
  const [addEmployee, state] = useAddEmployee();

  return (
    <Container fluid="md">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header as="h5">Add employee</Card.Header>
            <Card.Body>
              <p>
                Please fill up the following form and click submit to add a new
                employee to the company.
              </p>

              {/* server error message */}
              {state.error && <Alert variant="danger">{state.error}</Alert>}

              {/* success message */}
              {state.data && (
                <Alert variant="success">Successfully added an employee</Alert>
              )}

              {/* add employee form */}
              <Formik
                initialValues={{ firstName: '', lastName: '', email: '' }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log(values);
                  addEmployee(values);
                  setSubmitting(false);
                }}
                validationSchema={Schema.Employee}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
                    {/* first name */}
                    <Form.Group className="mb-3">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={props.values.firstName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <FormFieldError name="firstName" />
                    </Form.Group>

                    {/* last name */}
                    <Form.Group className="mb-3">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={props.values.lastName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <FormFieldError name="lastName" />
                    </Form.Group>

                    {/* email */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={props.values.email}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <FormFieldError name="email" />
                    </Form.Group>

                    {/* submit button */}
                    <Button
                      type="submit"
                      className="w-100 mb-3"
                      disabled={state.loading || props.isSubmitting}
                    >
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
              <p>
                or{' '}
                <Link to="/list-employees">
                  check out full list of employees
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
