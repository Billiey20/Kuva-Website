import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientLayout from './components/layout/PatientLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Patient Portal Routes */}
        <Route element={<PatientLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Receptionist Dashboard Routes */}
        <Route path="/root" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
