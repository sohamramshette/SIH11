import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage component
 * 404 error page with navigational return link
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl font-extrabold text-blue-900 block mb-2">404</span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-600 text-sm mb-6">
          The requested page does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-900 hover:bg-blue-800 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
