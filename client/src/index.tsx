import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import configureAmplify from './config/amplifyConfig';
import App from './App';

// Call the configuration function to set up Amplify
configureAmplify();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);