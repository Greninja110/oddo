import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Register />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;