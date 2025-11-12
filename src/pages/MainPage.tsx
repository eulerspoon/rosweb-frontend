import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const MainPage: React.FC = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1 className="text-center mb-4">Добро пожаловать в ROSWeb</h1>
          <p className="text-center lead">
            Система управления командами ROS для робототехники
          </p>
        </Col>
      </Row>
      
      <Row>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Управление командами</Card.Title>
              <Card.Text>
                Создавайте команды для управления роботом
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Планирование маршрутов</Card.Title>
              <Card.Text>
                Формируйте маршруты из последовательности команд
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Визуализация результата</Card.Title>
              <Card.Text>
                Отслеживайте положение робота по завершении маршрута
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;