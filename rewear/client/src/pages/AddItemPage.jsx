import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AddItem from '../components/items/AddItem';

const AddItemPage = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Add New Item</h1>
      <Row>
        <Col>
          <AddItem />
        </Col>
      </Row>
    </Container>
  );
};

export default AddItemPage;