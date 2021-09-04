import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

export function Wizard({ children, title, curPage, setCurPage }) {
  const pageCount = (children && children.length) || 0;
  curPage = curPage || 0;
  title = title || 'Wizard';
  const hasPrev = curPage > 0;
  const hasNext = curPage < pageCount - 1;
  const curChild = (children && children[curPage]) || null;

  return (
    <Card>
      <Card.Header>
        <div className="d-flex flex-nowrap">
          <div className="d-flex justify-content-start flex-shrink-1">
            <Button
              disabled={!hasPrev}
              onClick={() => {
                setCurPage(curPage - 1);
              }}
            >
              Prev
            </Button>
          </div>
          <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
            <h5 className="mb-0">{title}</h5>
          </div>
          <div className="d-flex justify-content-end flex-shrink-1">
            <Button
              disabled={!hasNext}
              onClick={() => {
                setCurPage(curPage + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>{curChild}</Card.Body>
    </Card>
  );
}
