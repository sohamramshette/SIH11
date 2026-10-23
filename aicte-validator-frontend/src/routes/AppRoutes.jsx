import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Public pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

// Dashboard pages
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import CollegeDashboard from '../pages/dashboards/CollegeDashboard';
import VerificationDashboard from '../pages/dashboards/VerificationDashboard';
import SeniorOfficerDashboard from '../pages/dashboards/SeniorOfficerDashboard';

/**
 * Centralized Application Routing
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Role-Specific Dashboards wrapped in ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/college" element={<CollegeDashboard />} />
        <Route path="/verification" element={<VerificationDashboard />} />
        <Route path="/senior-officer" element={<SeniorOfficerDashboard />} />
      </Route>

      {/* 404 Catch-All Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
