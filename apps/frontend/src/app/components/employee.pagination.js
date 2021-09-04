import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useGetEmployees } from '../hooks/get.employees';

export function EmployeePageNavigation({
  cursor,
  setCursor,
  pageSize,
  setPageSize,
  hasNext,
  hasPrev,
}) {
  cursor = cursor || 0;
  pageSize = pageSize || 5;

  return (
    <Row>
      <Col
        className="d-flex justify-content-start align-items-center"
        xs={7}
        sm={6}
      >
        <Form.Group as={Row}>
          <Form.Label column>Rows/page:</Form.Label>
          <Col>
            <Form.Select
              value={pageSize}
              onChange={(v) => {
                if (setPageSize) {
                  setPageSize(parseInt(v.target.value));
                }
              }}
            >
              {[5, 10, 25].map((v) => (
                <option value={v.toString()} key={v}>
                  {v}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
      </Col>
      <Col
        className="d-flex justify-content-end align-items-center"
        xs={5}
        sm={6}
      >
        <ButtonGroup>
          <Button
            disabled={!hasPrev}
            onClick={() => {
              if (setCursor) {
                setCursor(Math.max(cursor - pageSize, 0));
              }
            }}
          >
            <span className="d-none d-sm-block"> {'< '} Previous</span>
            <span className="d-block d-sm-none"> {'< '}</span>
          </Button>
          <Button
            disabled={!hasNext}
            onClick={() => {
              if (setCursor) {
                setCursor(cursor + pageSize);
              }
            }}
          >
            <span className="d-none d-sm-block">Next {' >'}</span>
            <span className="d-block d-sm-none">{' >'}</span>
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
}

export function EmployeePagination({
  selectable,
  selected,
  onSelectionChanged,
}) {
  const [getEmployees, state] = useGetEmployees();
  const [employees, setEmployees] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [curPage, setCurPage] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  /* const [selected, setSelected] = useState([]); */

  // making sure it is an array
  selected = (selected && selected) || [];

  /* fetch data when needed */
  useEffect(() => {
    if (cursor === 0 && !state.data) {
      // fetch first page regardless
      getEmployees({ first: pageSize, after: 0 });
    } else {
      const page = employees.slice(cursor, cursor + pageSize);
      if (page.length === 0 || page.length < pageSize) {
        // we will try to refetch the last page in case
        // more employees were added meanwhile
        getEmployees({ first: pageSize, after: cursor });
      }
    }
  }, [cursor, pageSize]);

  /* insert incoming data to employees array */
  /* NOTE: this does not takes deletion/fragmentation of id/cursor into account */
  useEffect(() => {
    if (state.data) {
      const data = state.data;
      const empl = data.employees;
      const firstPart = employees.slice(0, Math.max(data.start - 1, 0));
      const rest = employees.slice(data.end);
      setEmployees(firstPart.concat(empl).concat(rest));
    }
  }, [state.data]);

  /* calculate current page */
  /* NOTE: this does not takes deletion/fragmentation of id/cursor into account */
  useEffect(() => {
    if (employees.length > 0) {
      const page = employees.slice(cursor, cursor + pageSize);
      setCurPage(page);
    }
  }, [employees, cursor, pageSize, setCurPage]);

  /* determine if there are more pages */
  useEffect(() => {
    if (curPage.length === 0) {
      setHasNext(false);
      setHasPrev(false);
    } else {
      if (cursor > employees[0].id) {
        setHasPrev(true);
      } else {
        setHasPrev(false);
      }

      const lastEmployeeId = employees[employees.length - 1].id;
      const curPageEnd = cursor + pageSize;
      const total = state.data ? state.data.total : 0;
      if (curPageEnd < lastEmployeeId || curPageEnd < total) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
  }, [curPage, cursor, pageSize, employees, state.data]);

  const toggleSelected = (id) => {
    let filtered = selected.filter((s) => s !== id);
    if (filtered.length === selected.length) {
      // id is not in the selected list, add it
      filtered = filtered.concat(id);
    }
    // let the parent component know about selection change
    if (onSelectionChanged) {
      onSelectionChanged(filtered);
    }
  };

  const isSelected = (id) => {
    return selected.filter((s) => s === id).length > 0;
  };

  return (
    <>
      <Container fluid>
        {/* page navigation controls */}
        <EmployeePageNavigation
          cursor={cursor}
          pageSize={pageSize}
          setCursor={setCursor}
          setPageSize={setPageSize}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />

        {/* employee list table */}
        <Row className="mb-3 mt-3">
          <Col>
            <Table
              striped
              bordered
              hover={selectable}
              responsive
              className="mb-0"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {/* empty data set */}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={4}>No data found</td>
                  </tr>
                )}

                {/* loading more data */}
                {state.loading && (
                  <tr>
                    <td colSpan={4}>Loading ...</td>
                  </tr>
                )}

                {/* show rows */}
                {curPage.length > 0 &&
                  !state.loading &&
                  curPage.map((employee) => (
                    <tr
                      key={employee.id}
                      style={{ cursor: selectable ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (selectable) {
                          toggleSelected(employee.id);
                        }
                      }}
                    >
                      <td
                        style={{
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          width: '100%',
                          borderRight: 'none',
                        }}
                      >
                        {selectable && (
                          <Form.Check
                            inline
                            checked={isSelected(employee.id)}
                            onChange={() => {
                              toggleSelected(employee.id);
                            }}
                          ></Form.Check>
                        )}
                        {employee.id}
                      </td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.email}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* page navigation controls */}
        <EmployeePageNavigation
          cursor={cursor}
          pageSize={pageSize}
          setCursor={setCursor}
          setPageSize={setPageSize}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </Container>
    </>
  );
}
