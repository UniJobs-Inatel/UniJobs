import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login'; // Ajuste o caminho conforme necessário

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Outras rotas podem ser adicionadas aqui */}
    </Routes>
  </Router>
);

export default AppRoutes;