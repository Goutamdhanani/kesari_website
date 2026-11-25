import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AdminApp } from './AdminApp.tsx';
import './index.css';

function Root() {
  const checkIsAdmin = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return (
      p === '/admin' ||
      p.startsWith('/admin/') ||
      h === '#admin' ||
      h.startsWith('#/admin') ||
      h.startsWith('#admin')
    );
  };

  const [isAdmin, setIsAdmin] = useState(checkIsAdmin);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdmin(checkIsAdmin());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return isAdmin ? <AdminApp /> : <App />;
}

createRoot(document.getElementById('root')!).render(<Root />);
