import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LegalPages, { isCompanyPage } from './LegalPages';
import './index.css';

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isCompanyPage(currentPath) ? <LegalPages path={currentPath}/> : <App />}
  </React.StrictMode>,
);
