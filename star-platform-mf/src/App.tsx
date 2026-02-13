import React, { useEffect } from 'react';
import AppRoute from './pages/routes/appRoutes';
import './App.css';

function App({ instance }: any) {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'WORKFLOW_PERMISSIONS_READY') {
        console.log('[Platform] Workflow permissions received:', event.data.payload);

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