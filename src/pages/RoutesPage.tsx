import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, Row, Col, Table, Button, Badge, Spinner, Alert, 
  Card, Form, InputGroup, FormControl 
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutes } from '../store/slices/routeSlice';
import { 
  setStatusFilter,
  setDateFromFilter,
  setDateToFilter,
  setCreatorUsernameFilter,
  setSearchParams,
  resetFilters,
  setPolling,
} from '../store/slices/moderatorSlice';
import { RootState, AppDispatch } from '../store';
import Breadcrumbs from '../components/Breadcrumbs';
import ModeratorActions from '../components/ModeratorActions';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { routes, loading, error } = useSelector((state: RootState) => state.route);
  const { user } = useSelector((state: RootState) => state.auth);
  const { filters, isPolling } = useSelector((state: RootState) => state.moderator);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isModerator = user?.is_staff || false;

  // Функция для загрузки данных с фильтрами
  const loadRoutes = () => {
    if (user) {
      const params: any = {};
      
      if (filters.searchParams.status) params.status = filters.searchParams.status;
      if (filters.searchParams.date_from) params.date_from = filters.searchParams.date_from;
      if (filters.searchParams.date_to) params.date_to = filters.searchParams.date_to;
      if (filters.searchParams.creator_username) params.creator_username = filters.searchParams.creator_username;
      
      dispatch(getRoutes(params));
    }
  };

  // Основной useEffect для загрузки данных
  useEffect(() => {
    loadRoutes();
    
    // Если модератор и включен polling
    if (isModerator && isPolling) {
      pollingRef.current = setInterval(() => {
        loadRoutes();
      }, 5000); // Обновляем каждые 5 секунд
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [dispatch, user, filters.searchParams, isModerator, isPolling]);

  // Обработчик поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('HandleSearch called with filters:', filters);
    
    const searchParams: any = {};
    if (filters.status) searchParams.status = filters.status;
    if (filters.dateFrom) searchParams.date_from = filters.dateFrom;
    if (filters.dateTo) searchParams.date_to = filters.dateTo;
    if (filters.creatorUsername) searchParams.creator_username = filters.creatorUsername;

    console.log('Search params to send:', searchParams);
    
    dispatch(setSearchParams(searchParams));
  };

  // Сброс фильтров
  const handleReset = () => {
    dispatch(resetFilters());
    loadRoutes();
  };

  // Переключение polling
  const togglePolling = () => {
    dispatch(setPolling(!isPolling));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string; text: string }> = {
      draft: { variant: 'secondary', text: 'Черновик' },
      formed: { variant: 'primary', text: 'Сформирован' },
      approved: { variant: 'success', text: 'Подтверждена' },
      in_progress: { variant: 'warning', text: 'В процессе' },
      completed: { variant: 'success', text: 'Завершен' },
      cancelled: { variant: 'danger', text: 'Отклонен' },
    };
    const statusInfo = statusMap[status] || { variant: 'light', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatResult = (result: string | null, status: string) => {
    if (!result) {
      if (status === 'completed') return 'Выполнено успешно';
      if (status === 'cancelled') return 'Отменено';
      return 'Не рассчитан';
    }
    
    if (result.length > 50) {
      return result.substring(0, 47) + '...';
    }
    return result;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const breadcrumbItems = [
    { label: isModerator ? 'Управление заявками' : 'Мои маршруты' }
  ];

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          Пожалуйста, войдите в систему
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      
      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>{isModerator ? 'Управление заявками' : 'Мои маршруты'}</h1>
              {isModerator && (
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    type="switch"
                    id="polling-switch"
                    label="Автообновление"
                    checked={isPolling}
                    onChange={togglePolling}
                    className="me-3"
                  />
                  {isPolling && (
                    <Badge bg="info" className="ms-2">
                      <Spinner animation="border" size="sm" className="me-1" />
                      Live
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Link to="/route/current">
              <Button variant="primary">
                {isModerator ? 'Создать черновик' : 'Текущий маршрут-черновик'}
              </Button>
            </Link>
          </div>

          {/* Фильтры для модератора */}
          {isModerator && (
            <Card className="mb-4">
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Статус:</Form.Label>
                        <Form.Select
                          value={filters.status}
                          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                        >
                          <option value="">Все статусы</option>
                          <option value="formed">Сформирован</option>
                          <option value="completed">Завершен</option>
                          <option value="cancelled">Отклонен</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Дата формирования с:</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => dispatch(setDateFromFilter(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Дата формирования по:</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => dispatch(setDateToFilter(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Создатель:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Имя пользователя"
                          value={filters.creatorUsername}
                          onChange={(e) => dispatch(setCreatorUsernameFilter(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="primary" type="submit">
                      Найти
                    </Button>
                    <Button variant="outline-secondary" onClick={handleReset}>
                      Сбросить
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <Table striped bordered hover responsive className="route-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {isModerator && <th>Создатель</th>}
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата формирования</th>
                  <th>Количество команд</th>
                  <th>Результат</th>
                  {isModerator && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {routes.length > 0 ? (
                  routes.map((route) => (
                    <tr 
                      key={route.id}
                      onClick={() => navigate(`/route/${route.id}`)}
                      style={{ cursor: 'pointer' }}
                      className="route-row"
                    >
                      <td>#{route.id}</td>
                      {isModerator && (
                        <td>{route.creator_name || 'Неизвестно'}</td>
                      )}
                      <td>{getStatusBadge(route.status)}</td>
                      <td>{formatDate(route.created_at)}</td>
                      <td>{formatDate(route.formed_at)}</td>
                      <td>{route.route_commands?.length || 0}</td>
                      <td 
                        title={route.result || ''}
                        className="result-cell"
                      >
                        {formatResult(route.result, route.status)}
                      </td>
                      {isModerator && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <ModeratorActions 
                            routeId={route.id} 
                            status={route.status} 
                          />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isModerator ? 8 : 7} className="text-center">
                      Заявки не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RoutesPage;