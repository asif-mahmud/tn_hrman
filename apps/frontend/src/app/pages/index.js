import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const linkInfo = [
  {
    to: '/add-employee',
    text: 'Add one employee',
  },
  {
    to: '/add-many-employees',
    text: 'Add many employees at once',
  },
  {
    to: '/list-employees',
    text: 'List of employees',
  },
  {
    to: '/send-email',
    text: 'Send email',
  },
];

export default function () {
  return (
    <Container>
      <Row className="mb-5">
        <Col>
          <Alert variant="info">
            <h3 className="text-center">Welcome to HR Manager</h3>
            <p className="mt-5">
              Manage your employee accounts, send them emails any time in simple
              and efficient way. You can add one or multiple employees at a
              time. You can send emails to one or more employees with a single
              go.
            </p>
          </Alert>
        </Col>
      </Row>
      <Row className="flex-wrap">
        {linkInfo.map((info) => (
          <Col className="d-flex mb-3" key={info.to}>
            <Button
              as={Link}
              to={info.to}
              className="d-flex justify-content-center align-items-center w-100"
            >
              {info.text}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
