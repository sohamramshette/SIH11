import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component Placeholder
 * 
 * NOTE: Authentication and role-based authorization are not yet implemented.
 * This is a pass-through placeholder for Phase 2/3 auth integration.
 * Do not simulate fake authentication or fake roles.
 */
const ProtectedRoute = ({ children, _allowedRoles = [] }) => {
  // Placeholder pass-through. In future phases, token validation and role checks
  // will be plugged in via the auth service / context.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
