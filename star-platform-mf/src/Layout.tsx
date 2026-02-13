import React from 'react';
import styles from './styles/layout.module.scss';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const path = window.location.pathname;

  const isWorkflow = path.startsWith('/app/workflow');

  return (
    <div>
      <div className={isWorkflow ? styles.workflowRoot : styles.insightsRoot}>
        {/* <Outlet /> */}
        {children}
      </div>
    </div>
  );
};
