import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import FinesPage from './pages/FinesPage';
import InfractionsPage from './pages/InfractionsPage';
import MainLayout from './layouts/MainLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AgentDashboardPage from './pages/AgentDashboardPage';
import LocalPaymentSimulator from './pages/LocalPaymentSimulator';
import PrintingPage from './pages/PrintingPage';
import MotorcyclesPage from './pages/MotorcyclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import MotorcycleDetailPage from './pages/MotorcycleDetailPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import ReportsPage from './pages/ReportsPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/local-payment-simulator" element={<LocalPaymentSimulator />} />
      <Route
        path="/"
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        {user?.role === 'Superviseur' ? (
          <>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="vehicles/:id" element={<VehicleDetailPage />} />
            <Route path="motorcycles" element={<MotorcyclesPage />} />
            <Route path="motorcycles/:id" element={<MotorcycleDetailPage />} />
            <Route path="fines" element={<FinesPage />} />
            <Route path="infractions" element={<InfractionsPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agents/:id" element={<AgentDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<div className="p-4">Settings Page for Admin</div>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : user?.role === 'Agent' ? (
          <>
            <Route index element={<Navigate to="/agent-dashboard" replace />} />
            <Route path="agent-dashboard" element={<AgentDashboardPage />} />
            <Route path="printing" element={<PrintingPage />} />
            <Route path="settings" element={<div className="p-4">Settings Page for Agent</div>} />
            <Route path="*" element={<Navigate to="/agent-dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;