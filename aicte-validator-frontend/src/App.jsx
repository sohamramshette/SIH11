import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import { DemoStateProvider } from './context/DemoStateContext';
import ErrorBoundary from './components/common/ErrorBoundary';

/**
 * Root Application Component
 */
const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <DemoStateProvider>
          <AppRoutes />
        </DemoStateProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
