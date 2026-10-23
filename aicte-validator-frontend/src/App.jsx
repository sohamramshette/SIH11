import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import { DemoStateProvider } from './context/DemoStateContext';

/**
 * Root Application Component
 */
const App = () => {
  return (
    <BrowserRouter>
      <DemoStateProvider>
        <AppRoutes />
      </DemoStateProvider>
    </BrowserRouter>
  );
};

export default App;
