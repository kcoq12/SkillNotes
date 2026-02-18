import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global error handler for non-React errors
window.onerror = function (message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML += `<div style="color: red; padding: 20px;">
      <h3>Global Error:</h3>
      <pre>${message} at ${source}:${lineno}:${colno}</pre>
      <pre>${error && error.stack}</pre>
    </div>`;
  }
};

window.onunhandledrejection = function (event) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML += `<div style="color: red; padding: 20px;">
      <h3>Unhandled Rejection:</h3>
      <pre>${event.reason}</pre>
    </div>`;
  }
};

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  document.body.innerHTML += `<h1>Critical Render Error: ${e.message}</h1>`;
}
