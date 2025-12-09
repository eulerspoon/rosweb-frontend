import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getProfile } from '../store/slices/authSlice';
import { getCartIcon } from '../store/slices/routeSlice';
import { RootState, AppDispatch } from '../store';

const AppNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { cartItemsCount } = useSelector((state: RootState) => state.route);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
      dispatch(getCartIcon());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ROSWeb
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/commands">
              Команды
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/routes">
                  Мои маршруты
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Личный кабинет
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                {cartItemsCount > 0 && (
                  <Nav.Link as={Link} to="/route/current" className="position-relative">
                    <i className="bi bi-cart3"></i>
                    <Badge 
                      bg="danger" 
                      pill 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {cartItemsCount}
                    </Badge>
                  </Nav.Link>
                )}
                <Navbar.Text className="me-3">
                  Привет, {user?.username}!
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Вход
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;