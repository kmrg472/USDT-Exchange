import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Remove loading screen
const loadingScreen = document.querySelector('.loading-screen');
if (loadingScreen) {
  setTimeout(() => {
    loadingScreen.remove();
  }, 500);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);
      },
      (err) => {
        console.log('ServiceWorker registration failed:', err);
      }
    );
  });
}
