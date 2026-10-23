import React from 'react';
import { Outlet } from 'react-router-dom';
import GovernmentBar from '../components/landing/GovernmentBar';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/**
 * PublicLayout provides the standard outer shell for public routes.
 * Wraps nested routes rendered through Outlet or children.
 */
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <GovernmentBar />
      <Navbar />
      <main className="flex-1">
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
