import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Badge, Form, Alert, Spinner, Modal 
} from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getRoute, updateRouteCommand, deleteRouteCommand, formRoute 
} from '../store/slices/routeSlice';
import { RootState, AppDispatch } from '../store';
import Breadcrumbs from '../components/Breadcrumbs';

const RoutePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRoute, loading, error } = useSelector((state: RootState) => state.route);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ speed: 0.5, value: 1.0, quantity: 1 });

  useEffect(() => {
    if (id && user) {
      dispatch(getRoute(parseInt(id)));
    }
  }, [dispatch, id, user]);

  const handleFormRoute = () => {
    if (id && currentRoute?.status === 'draft') {
      dispatch(formRoute(parseInt(id)));
      setShowConfirmModal(false);
    }
  };

  const handleUpdateCommand = (commandId: number) => {
    dispatch(updateRouteCommand({ id: commandId, data: editValues }));
    setEditingItem(null);
  };

  const handleDeleteCommand = (commandId: number) => {
    if (window.confirm('Удалить команду из заявки?')) {
      dispatch(deleteRouteCommand(commandId));
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          Пожалуйста, войдите в систему
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error || !currentRoute) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'Заявка не найдена'}
        </Alert>
      </Container>
    );
  }

  const isDraft = currentRoute.status === 'draft';
  const breadcrumbItems = [
    { label: 'Мои заявки', path: '/routes' },
    { label: `Заявка #${currentRoute.id}` }
  ];

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      
      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Заявка #{currentRoute.id}</h1>
              <Badge bg={isDraft ? 'secondary' : 'primary'}>
                {isDraft ? 'Черновик' : 'Сформирована'}
              </Badge>
            </div>
            
            {isDraft && currentRoute.route_commands.length > 0 && (
              <Button 
                variant="success" 
                onClick={() => setShowConfirmModal(true)}
              >
                Сформировать заявку
              </Button>
            )}
          </div>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Информация о заявке</Card.Title>
              <Row>
                <Col md={6}>
                  <p><strong>Статус:</strong> {currentRoute.status}</p>
                  <p><strong>Дата создания:</strong> {new Date(currentRoute.created_at).toLocaleDateString('ru-RU')}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Создатель:</strong> {currentRoute.creator_name}</p>
                  {currentRoute.formed_at && (
                    <p><strong>Дата формирования:</strong> {new Date(currentRoute.formed_at).toLocaleDateString('ru-RU')}</p>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Команды в заявке ({currentRoute.route_commands.length})</span>
                {isDraft && (
                  <Link to="/commands">
                    <Button variant="outline-primary" size="sm">
                      Добавить команды
                    </Button>
                  </Link>
                )}
              </Card.Title>
              
              {currentRoute.route_commands.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Команда</th>
                      <th>Описание</th>
                      <th>Скорость</th>
                      <th>Значение</th>
                      <th>Количество</th>
                      {isDraft && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoute.route_commands.map((rc) => (
                      <tr key={rc.id}>
                        <td>{rc.command.name}</td>
                        <td>{rc.command.description}</td>
                        <td>
                          {editingItem === rc.id ? (
                            <Form.Control
                              type="number"
                              step="0.1"
                              min="0.1"
                              max="2.0"
                              value={editValues.speed}
                              onChange={(e) => setEditValues({
                                ...editValues,
                                speed: parseFloat(e.target.value)
                              })}
                            />
                          ) : (
                            rc.speed
                          )}
                        </td>
                        <td>
                          {editingItem === rc.id ? (
                            <Form.Control
                              type="number"
                              step="0.1"
                              min="0.1"
                              max="10.0"
                              value={editValues.value}
                              onChange={(e) => setEditValues({
                                ...editValues,
                                value: parseFloat(e.target.value)
                              })}
                            />
                          ) : (
                            rc.value
                          )}
                        </td>
                        <td>
                          {editingItem === rc.id ? (
                            <Form.Control
                              type="number"
                              min="1"
                              max="10"
                              value={editValues.quantity}
                              onChange={(e) => setEditValues({
                                ...editValues,
                                quantity: parseInt(e.target.value)
                              })}
                            />
                          ) : (
                            rc.quantity
                          )}
                        </td>
                        {isDraft && (
                          <td>
                            {editingItem === rc.id ? (
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => handleUpdateCommand(rc.id)}
                                >
                                  Сохранить
                                </Button>
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => setEditingItem(null)}
                                >
                                  Отмена
                                </Button>
                              </div>
                            ) : (
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingItem(rc.id);
                                    setEditValues({
                                      speed: rc.speed,
                                      value: rc.value,
                                      quantity: rc.quantity
                                    });
                                  }}
                                >
                                  Изменить
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDeleteCommand(rc.id)}
                                >
                                  Удалить
                                </Button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  В заявке пока нет команд. Добавьте команды со страницы услуг.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно подтверждения формирования */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение формирования заявки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите сформировать заявку? После формирования редактирование будет невозможно.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Отмена
          </Button>
          <Button variant="success" onClick={handleFormRoute}>
            Сформировать заявку
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RoutePage;