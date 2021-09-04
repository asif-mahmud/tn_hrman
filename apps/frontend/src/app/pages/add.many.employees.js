import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useAddManyEmployees } from '../hooks/add.many.employees';

export default function () {
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadFile, state] = useAddManyEmployees();

  let totalInserted = 0;
  if (state.data && state.data.employees) {
    totalInserted = state.data.employees.length;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header as="h5">Add employees</Card.Header>
            <Card.Body>
              <p>
                You can add multiple employees at once by uploading a csv file
                with this format -
              </p>
              <p>
                <code>first name,last name,email,...</code>
              </p>
              <p>
                Select a file and click upload to add many employees at once.
              </p>

              {/* server error message */}
              {state.error && <Alert variant="danger">{state.error}</Alert>}

              {/* success message */}
              {state.data && (
                <Alert variant="success">
                  <p>Successfully added data.</p>
                  <p>
                    Total rows found: <b>{state.data.rowsGot}</b> <br />
                    Total rows inserted: <b>{totalInserted}</b> <br />
                    Invalid rows found: <b>{state.data.invalidRows}</b> <br />
                    Already existing entries: <b>{state.data.existingRows}</b>
                    <br />
                    Total skipped rows: <b>{state.data.totalSkippedRows}</b>
                  </p>
                </Alert>
              )}

              {/* file upload form */}
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  // check if we have file set
                  if (file) {
                    console.log('Uploading...');
                    uploadFile(file);
                  } else {
                    setErrorMsg('Select a csv file first');
                  }
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Select CSV File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const selectedFile = files[0];
                        // checking mimetype from client side
                        // not a reliable solution, but will do for most use cases
                        if (selectedFile.type === 'text/csv') {
                          setFile(selectedFile);
                          setErrorMsg('');
                        } else {
                          setErrorMsg('Wrong file type selected');
                        }
                      }
                    }}
                  />
                  <Form.Text className="text-danger">{errorMsg}</Form.Text>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 mb-3"
                  disabled={state.loading}
                >
                  Upload
                </Button>
              </Form>
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
