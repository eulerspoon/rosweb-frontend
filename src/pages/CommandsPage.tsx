import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useCommands } from '../hooks/useCommands';
import CommandCard from '../components/CommandCard';
import Breadcrumbs from '../components/Breadcrumbs';

const CommandsPage: React.FC = () => {
  const [nameQuery, setNameQuery] = useState<string>('');
  const [rosCommandQuery, setRosCommandQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useState<{name?: string; ros_command?: string}>({});
  
  const { commands, loading, error } = useCommands(searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Собираем параметры поиска (только непустые значения)
    const params: {name?: string; ros_command?: string} = {};
    if (nameQuery.trim()) params.name = nameQuery.trim();
    if (rosCommandQuery.trim()) params.ros_command = rosCommandQuery.trim();
    
    setSearchParams(params);
  };

  const handleReset = () => {
    setNameQuery('');
    setRosCommandQuery('');
    setSearchParams({});
  };

  const breadcrumbItems = [
    { label: 'Команды' }
  ];

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      
      <Row className="my-4">
        <Col>
          <h1>Команды ROS для JetBot</h1>
          
          {/* Форма поиска */}
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Фильтр по названию:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Введите название команды..."
                        value={nameQuery}
                        onChange={(e) => setNameQuery(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Фильтр по ROS команде:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Введите ROS команду..."
                        value={rosCommandQuery}
                        onChange={(e) => setRosCommandQuery(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={2} className="d-flex align-items-end">
                    <div className="d-grid gap-2 w-100">
                      <Button variant="primary" type="submit" className="mb-2">
                        Найти
                      </Button>
                      <Button variant="outline-secondary" onClick={handleReset}>
                        Сбросить
                      </Button>
                    </div>
                  </Col>
                </Row>
                
              </Form>
            </Card.Body>
          </Card>

          {/* Информация о поиске */}
          {(searchParams.name || searchParams.ros_command) && (
            <Alert variant="info" className="mb-4">
              <strong>Параметры поиска:</strong>
              {searchParams.name && ` Название: "${searchParams.name}"`}
              {searchParams.ros_command && ` ROS команда: "${searchParams.ros_command}"`}
              {` (найдено: ${commands.length})`}
            </Alert>
          )}

          {/* Состояние загрузки */}
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </Spinner>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {/* Сетка команд */}
          <Row>
            {commands.map(command => (
              <Col key={command.id} sm={6} md={4} lg={3} className="mb-4">
                <CommandCard command={command} />
              </Col>
            ))}
          </Row>

          {/* Сообщение если нет команд */}
          {!loading && commands.length === 0 && (
            <div className="text-center my-5">
              <p>Команды не найдены</p>
              {(searchParams.name || searchParams.ros_command) && (
                <Button variant="outline-primary" onClick={handleReset}>
                  Показать все команды
                </Button>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CommandsPage;