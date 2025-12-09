import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, logout } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import Breadcrumbs from '../components/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setIsEditing(false);
    await dispatch(getProfile());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const breadcrumbItems = [
    { label: 'Личный кабинет' }
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
      
      <Row className="mt-4">
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Личный кабинет</h3>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </Card.Header>
            <Card.Body>
              {!isEditing ? (
                <>
                  <div className="mb-4">
                    <h5>Информация о пользователе</h5>
                    <p><strong>Имя пользователя:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email || 'Не указан'}</p>
                    <p><strong>Имя:</strong> {user.first_name || 'Не указано'}</p>
                    <p><strong>Фамилия:</strong> {user.last_name || 'Не указана'}</p>
                    <p><strong>Роль:</strong> {user.is_staff ? 'Модератор' : 'Пользователь'}</p>
                  </div>
                  
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Редактировать профиль
                  </Button>
                </>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Сохранение...
                        </>
                      ) : (
                        'Сохранить'
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Отмена
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;