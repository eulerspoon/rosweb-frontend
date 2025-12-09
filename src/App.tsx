import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import AppNavbar from './components/Navbar';
import MainPage from './pages/MainPage';
import CommandsPage from './pages/CommandsPage';
import CommandDetailsPage from './pages/CommandDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RoutesPage from './pages/RoutesPage';
import RoutePage from './pages/RoutePage';
import PrivateRoute from './components/PrivateRoute';

// Компонент для инициализации
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Можно добавить инициализацию при необходимости
  }, [dispatch]);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppInitializer>
          <div className="App">
            <AppNavbar />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/commands" element={<CommandsPage />} />
              <Route path="/command/:id" element={<CommandDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Защищенные маршруты */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/routes" element={
                <PrivateRoute>
                  <RoutesPage />
                </PrivateRoute>
              } />
              <Route path="/route/:id" element={
                <PrivateRoute>
                  <RoutePage />
                </PrivateRoute>
              } />
              <Route path="/route/current" element={
                <PrivateRoute>
                  <Navigate to="/routes" replace />
                </PrivateRoute>
              } />
              
              {/* 404 страница */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AppInitializer>
      </Router>
    </Provider>
  );
}

export default App;