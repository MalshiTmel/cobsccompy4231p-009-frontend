import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
