import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './MainPage.css';

const MainPage: React.FC = () => {
  return (
    <div className="main-page-container">
      <div className="background-gif"></div>
      
      <Container className="content-overlay">
        <Row className="my-5">
          <Col>
            <h1 className="text-center mb-4 text-white">Добро пожаловать в ROSWeb</h1>
            <p className="text-center lead text-white">
              Система управления командами ROS для робототехники
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Card className="h-100 card-transparent">
              <Card.Body>
                <Card.Title>Управление командами</Card.Title>
                <Card.Text>
                  Создавайте команды для управления роботом
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 card-transparent">
              <Card.Body>
                <Card.Title>Планирование маршрутов</Card.Title>
                <Card.Text>
                  Формируйте маршруты из последовательности команд
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 card-transparent">
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
    </div>
  );
};

export default MainPage;