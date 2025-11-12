import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AppNavbar from './components/Navbar';
import MainPage from './pages/MainPage';
import CommandsPage from './pages/CommandsPage';
import CommandDetailsPage from './pages/CommandDetailsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/commands" element={<CommandsPage />} />
          <Route path="/command/:id" element={<CommandDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;