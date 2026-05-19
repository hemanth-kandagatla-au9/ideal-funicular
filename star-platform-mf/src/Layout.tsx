import React from 'react';
import styles from './styles/layout.module.scss';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const path = window.location.pathname;

  const isWorkflow = path.startsWith('/app/workflow');
  const changeManagementRoutes = [
    '/app/cm-requeststatus',
    '/app/cm-approvalrequest',
    '/app/pipeline-configuration',
    '/app/cm-settings',
  ];

  const isChangeManagement = changeManagementRoutes.some((route) => path.startsWith(route));

  return (
    <div>
      <div className={isWorkflow || isChangeManagement ? styles.workflowRoot : styles.insightsRoot}>
        {/* <Outlet /> */}
        {children}
      </div>
    </div>
  );
};
