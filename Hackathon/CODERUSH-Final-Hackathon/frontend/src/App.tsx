import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
