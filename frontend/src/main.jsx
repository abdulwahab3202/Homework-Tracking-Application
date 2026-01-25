import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { HomeworkContextProvider } from './context/HomeworkContext.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HomeworkContextProvider>
          <App />
          <Toaster position="top-right" reverseOrder={false} />
        </HomeworkContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);