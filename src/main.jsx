import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/base.css';
import './styles/sections.css';
import './styles/overlays.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<p style={{ padding: 40, color: '#B8BAC5' }}>Something went wrong. Please refresh the page.</p>}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
