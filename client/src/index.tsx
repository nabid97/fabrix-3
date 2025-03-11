import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import configureAmplify from './config/amplifyConfig';
import ErrorBoundary from './components/common/ErrorBoundary';

// Initialize Amplify BEFORE rendering anything
configureAmplify();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);