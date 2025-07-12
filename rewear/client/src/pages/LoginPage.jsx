import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Body>
              <Login />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;