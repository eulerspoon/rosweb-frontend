import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutes } from '../store/slices/routeSlice';
import { RootState, AppDispatch } from '../store';
import Breadcrumbs from '../components/Breadcrumbs';

const RoutesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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
      formed: { variant: 'primary', text: 'Сформирована' },
      approved: { variant: 'success', text: 'Подтверждена' },
      in_progress: { variant: 'warning', text: 'В процессе' },
      completed: { variant: 'success', text: 'Завершена' },
      cancelled: { variant: 'danger', text: 'Отменена' },
    };
    const statusInfo = statusMap[status] || { variant: 'light', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const breadcrumbItems = [
    { label: 'Мои заявки' }
  ];

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          Пожалуйста, войдите в систему для просмотра заявок
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
            <h1>Мои заявки</h1>
            <Link to="/route/create">
              <Button variant="primary">Создать новую заявку</Button>
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
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата формирования</th>
                  <th>Количество команд</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {routes.length > 0 ? (
                  routes.map((route) => (
                    <tr key={route.id}>
                      <td>#{route.id}</td>
                      <td>{getStatusBadge(route.status)}</td>
                      <td>{formatDate(route.created_at)}</td>
                      <td>{formatDate(route.formed_at)}</td>
                      <td>{route.route_commands?.length || 0}</td>
                      <td>
                        <Link to={`/route/${route.id}`}>
                          <Button variant="outline-primary" size="sm">
                            Просмотреть
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      У вас пока нет заявок
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