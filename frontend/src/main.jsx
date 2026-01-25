import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomeworkContextProvider } from './context/HomeWorkContext';
import { Toaster } from 'react-hot-toast';

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