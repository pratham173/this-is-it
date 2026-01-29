import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './services/serviceWorkerRegistration';
import { initDB } from './services/offlineStorage';

// Initialize IndexedDB
initDB().catch(console.error);

// Register service worker (only in production)
registerServiceWorker().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
