import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutes } from '../store/slices/routeSlice';
import { RootState, AppDispatch } from '../store';
import Breadcrumbs from '../components/Breadcrumbs';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { routes, loading, error } = useSelector((state: RootState) => state.route);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getRoutes());
    }
  }, [dispatch, user]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string; text: string }> = {
      draft: { variant: 'secondary', text: 'Черновик' },
      formed: { variant: 'primary', text: 'Сформирован' },
      approved: { variant: 'success', text: 'Подтверждена' },
      in_progress: { variant: 'warning', text: 'В процессе' },
      completed: { variant: 'success', text: 'Завершен' },
      cancelled: { variant: 'danger', text: 'Отменен' },
    };
    const statusInfo = statusMap[status] || { variant: 'light', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatResult = (result: string | null, status: string) => {
    if (!result) {
      if (status === 'completed') return 'Выполнено успешно';
      if (status === 'cancelled') return 'Отменено';
      return 'Нет данных';
    }
    
    // Укоротим длинный результат для таблицы
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
    { label: 'Мои маршруты' }
  ];

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          Пожалуйста, войдите в систему для просмотра маршрутов
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
            <h1>Мои маршруты</h1>
            <Link to="/route/current">
              <Button variant="primary">Текущий маршрут-черновик</Button>
            </Link>
          </div>

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
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата формирования</th>
                  <th>Количество команд</th>
                  <th>Результат</th>
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
                      <td>{getStatusBadge(route.status)}</td>
                      <td>{formatDate(route.created_at)}</td>
                      <td>{formatDate(route.formed_at)}</td>
                      <td>{route.route_commands?.length || 0}</td>
                      <td 
                        title={route.result || ''} // Подсказка при наведении
                        className="result-cell"
                      >
                        {formatResult(route.result, route.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">  {/* Изменили colSpan с 6 на 5 */}
                      У вас пока нет маршрутов
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