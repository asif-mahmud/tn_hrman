import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

import { EmployeePagination } from '../components/employee.pagination';

export default function () {
  return (
    <Container>
      <Row>
        <Col>
          <Container fluid>
            <p>
              This is a list of the employees in the company. To add more
              employee profiles,{' '}
              <Link to="/add-employee">click here to add one by one</Link> or{' '}
              <Link to="/add-many-employees">
                click here to add many at once
              </Link>{' '}
              . If you wish to send email to one or more employees please{' '}
              <Link to="/send-email">check out this page</Link>.
            </p>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col>
          <EmployeePagination />
        </Col>
      </Row>
    </Container>
  );
}
