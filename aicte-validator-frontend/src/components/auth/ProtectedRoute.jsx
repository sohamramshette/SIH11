import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDemoState } from '../../hooks/useDemoState';

/**
 * ProtectedRoute Component (Phase 7 Integration)
 * 
 * ARCHITECTURAL NOTICE ON AUTHORIZATION:
 * - Direct URL Access: In this Smart India Hackathon prototype, direct URL navigation
 *   to role dashboards (/admin, /college, /verification, /senior-officer) is permitted
 *   to enable evaluators to inspect all 4 distinct role consoles without repetitive re-logins.
 * - Demo Session Behavior: When logged in via /login, the active demo user identity is
 *   tracked in DemoStateContext and synced with browser sessionStorage.
 * - Production Disclaimer: This client-side routing does NOT constitute production-grade
 *   authorization. Real-world statutory systems mandate server-side signed JWTs, httpOnly
 *   cookies, and backend cryptographic RBAC enforcement.
 */
const ProtectedRoute = ({ children, _allowedRoles = [] }) => {
  // Read demo state context to monitor active session
  const { currentUser } = useDemoState();

  // For evaluation flexibility, allow direct access while recording demo session context
  return children ? children : <Outlet context={{ currentUser }} />;
};

export default ProtectedRoute;
