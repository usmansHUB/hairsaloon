import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { globalStyles } from './styles/stitches.config';

globalStyles();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
