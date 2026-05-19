import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoute from './pages/routes/appRoutes';
import { usePermissionLoader } from './utils/hooks/usePermissionLoader';

import './App.css';

window.addEventListener('offline', () => {
  console.warn('NETWORK_STATUS: OFFLINE');
});

window.addEventListener('online', () => {
  console.warn('NETWORK_STATUS: ONLINE');
  window.location.reload();
});
window.addEventListener('error', function (e) {
  if (e.message && e.message.includes('Loading script failed')) {
    console.error('[REMOTE ERROR] Remote script failed to load');

    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;">
          <h2>Remote Application Not Running</h2>
          <p>Please start the remote server.</p>
        </div>
      `;
    }
  }
});
type AppProps = {
  instance?: unknown;
};

function App({ instance: _instance }: AppProps) {
  const location = useLocation();
  const shouldLoadPermissions = !['/session-expired', '/logout'].includes(location.pathname);

  usePermissionLoader(shouldLoadPermissions); // Load permissions on app pages only

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'WORKFLOW_PERMISSIONS_READY') {
        // Optional: mark readiness
        (window as any).__WORKFLOW_PERMISSIONS__ = event.data.payload;
        (window as any).__WORKFLOW_PERMISSIONS_READY__ = true;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return <AppRoute />;
}

export default App;
