import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import { NavLink } from 'react-router-dom';

import styles from './navbar.module.css';

export default function () {
  return (
    <Navbar fixed="top" bg="dark" variant="dark" expand="md">
      <Container fluid>
        {/* Brand/home page link*/}
        <Navbar.Brand as={NavLink} to="/">
          HR Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll"></Navbar.Toggle>
        <Navbar.Collapse className="justify-content-end">
          <Nav navbarScroll>
            {/* Employee management navigation links */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" className={styles.dropdownBtn}>
                Employees
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" className={styles.dropdownMenu}>
                <Dropdown.Item as={NavLink} to="/add-employee">
                  Add one
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/add-many-employees">
                  Add multiple
                </Dropdown.Item>

                <Dropdown.Item as={NavLink} to="/list-employees">
                  All Employees
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* Email page link */}
            <Nav.Link as={NavLink} to="/send-email">
              Send Email
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
