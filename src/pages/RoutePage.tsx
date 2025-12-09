import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Badge, Form, Alert, Spinner, Modal 
} from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getRoute, updateRouteCommand, deleteRouteCommand, formRoute, getCurrentDraft,
  updateRoute, calculateWithGoService
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
  const [areaType, setAreaType] = useState(''); // Для поля "тип внешней среды"

  useEffect(() => {
    if (currentRoute) {
      console.log('Current route structure:', currentRoute);
      console.log('Route commands:', currentRoute.route_commands);
      if (currentRoute.route_commands.length > 0) {
        console.log('First route command:', currentRoute.route_commands[0]);
        console.log('Available fields:', Object.keys(currentRoute.route_commands[0]));
      }
    }
  }, [currentRoute]);
  
  useEffect(() => {
    console.log('RoutePage useEffect, id:', id, 'user:', user);
    
    if (user) {
      if (id === 'current') {
        console.log('Loading current draft');
        dispatch(getCurrentDraft());
      } else if (id) {
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          console.log('Loading route with id:', numericId);
          dispatch(getRoute(numericId));
        } else {
          console.error('Invalid route id:', id);
        }
      }
    }
  }, [dispatch, id, user]);

  // Загружаем данные черновика при монтировании
  useEffect(() => {
    if (currentRoute) {
      setAreaType(currentRoute.area || '');
    }
  }, [currentRoute]);

  const handleFormRoute = () => {
    if (currentRoute?.status === 'draft') {
      dispatch(formRoute(currentRoute.id))
        .unwrap()
        .then(() => {
          setShowConfirmModal(false);
          // После формирования перенаправляем на список маршрутов
          navigate('/routes');
          // Или перезагружаем страницу черновика
          // window.location.reload();
        })
        .catch((error) => {
          console.error('Form route error:', error);
        });
    }
  };

  const handleUpdateCommand = (commandId: number) => {
    dispatch(updateRouteCommand({ id: commandId, data: editValues }));
    setEditingItem(null);
  };

  const handleDeleteCommand = (commandId: number) => {
    if (window.confirm('Удалить команду из маршрута?')) {
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
          {error || 'Маршрут не найден'}
        </Alert>
      </Container>
    );
  }

  const isDraft = currentRoute.status === 'draft';
  const breadcrumbItems = [
    { label: 'Мои маршруты', path: '/routes' },
    { label: `Маршрут #${currentRoute.id}` }
  ];

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      
      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Маршрут #{currentRoute.id}</h1>
              <Badge bg={isDraft ? 'secondary' : 'primary'}>
                {isDraft ? 'Черновик' : 'Сформирован'}
              </Badge>
            </div>
            
            {isDraft && currentRoute.route_commands.length > 0 && (
              <Button 
                variant="success" 
                onClick={() => setShowConfirmModal(true)}
              >
                Сформировать маршрут
              </Button>
            )}
          </div>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Информация о маршруте</Card.Title>
              <Row>
                <Col md={6}>
                  {/* <p><strong>Статус:</strong> {currentRoute.status}</p> */}
                  <p><strong>Дата создания:</strong> {new Date(currentRoute.created_at).toLocaleDateString('ru-RU')}</p>
                  {currentRoute.formed_at && (
                    <p><strong>Дата формирования:</strong> {new Date(currentRoute.formed_at).toLocaleDateString('ru-RU')}</p>
                  )}
                </Col>
                <Col md={6}>
                  <p><strong>Создатель:</strong> {currentRoute.creator_name}</p>
                  <p><strong>Результат:</strong> {currentRoute.result ? currentRoute.result : "не рассчитан"}</p>
                  {/* КНОПКА РАСЧЁТА */}
                  {!currentRoute.result && (
                    <div className="mt-3">
                      <Button 
                        variant="info" 
                        onClick={() => dispatch(calculateWithGoService(currentRoute.id))}
                        size="sm"
                      >
                        <i className="bi bi-calculator me-2"></i>
                        Рассчитать через Go-сервис
                      </Button>
                      <p className="text-muted mt-1 small">
                        <i className="bi bi-info-circle me-1"></i>
                        Расчёт займёт 5-10 секунд
                      </p>
                    </div>
                  )}
                </Col>
              </Row>
              
              {/* Поле "Тип внешней среды" */}
              <Form.Group className="mb-3">
                <Form.Label><strong>Тип внешней среды:</strong></Form.Label>
                {isDraft ? (
                  <Form.Control
                    type="text"
                    placeholder="Введите тип внешней среды"
                    value={areaType}
                    onChange={(e) => setAreaType(e.target.value)}
                    onBlur={() => {
                      // Сохраняем при потере фокуса
                      if (currentRoute && areaType !== currentRoute.area) {
                        dispatch(updateRoute({ 
                          id: currentRoute.id, 
                          data: { area: areaType } 
                        }));
                        
                        // Опционально: сразу обновляем состояние currentRoute
                        // Это улучшит UX - пользователь сразу увидит сохраненное значение
                        // dispatch(getRoute(currentRoute.id)); // Или dispatch(getCurrentDraft()); если это черновик
                      }
                    }}
                  />
                ) : (
                  <p>{currentRoute.area || 'Не указан'}</p>
                )}
              </Form.Group>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Команды в маршруте ({currentRoute.route_commands.length})</span>
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
                      {/* <th>Описание</th> */}
                      <th>Скорость</th>
                      <th>Значение</th>
                      <th>Количество</th>
                      {isDraft && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoute.route_commands.map((rc) => (
                      <tr key={rc.id}>
                        <td>{rc.command_name}</td>
                        {/* <td>{rc.command.description}</td> */}
                        {/* <td>{rc.command_name || rc.command?.name || 'Название команды'}</td> */}
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
                  В маршруте пока нет команд. Вы можете их добавить.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно подтверждения формирования */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение формирования маршрута</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите сформировать маршрут? После формирования редактирование будет невозможно.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Отмена
          </Button>
          <Button variant="success" onClick={handleFormRoute}>
            Сформировать маршрут
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RoutePage;