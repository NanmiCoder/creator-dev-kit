import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store';
import './styles.css';

store.connect();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
