import React from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Navbar from '../Navigation/Navbar';
import styles from './css/dashboard.module.scss';

const cookies = new Cookies();

const TAB_META: Record<string, { name: string; description?: string }> = {
  '/app/workflow': {
    name: 'My Space',
    description:
      'View your pinned workflows easily. Run, review, or favorite them, and organize into your preferred Labels.',
  },
  '/app/workflow/capability': {
    name: 'Capability Registry',
    description:
      'Manage, and configure available capabilities. Integrate and organize your automation assets with ease.',
  },
  '/app/workflow/capability/capability-registry/capability': {
    name: 'Create Capability',
  },
  '/app/workflow/execution': {
    name: 'Executions',
    description:
      'Check all execution logs in one spot and filter results by your preferred execution status.',
  },
  '/app/workflow/metrics': {
    name: 'Metrics',
    description:
      'Track efficiency, savings, and adoption to see how automation drives business outcomes.',
  },
  '/app/workflow/node-management': {
    name: 'Node Management',
    description: 'Manage the nodes.',
  },
  '/app/workflow/approvalrequest': {
    name: 'Approval Requests',
    description: 'Approve or Reject the requests and check their status.',
  },
  '/app/workflow/auditlogs': {
    name: 'WF-Audit Logs',
    description: 'View the Logs.',
  },
  '/app/workflow/settings': {
    name: 'WF-Settings',
    description: 'Configure workflow categories, triggers, and system preferences.',
  },
  '/app/workflow/auth': {
    name: 'WF User Authorisation',
    description: '',
  },
  '/app/workflow/helpcontent': {
    name: 'Help Content',
    description: '',
  },

  // INSIGHTS
  '/app/users': {
    name: 'Users',
    description: 'Manage member profiles, assign roles, and enforce secure access control.',
  },
  '/app/AuditLogs': {
    name: 'Audit Logs',
    description: 'Track user actions, system changes, and security-sensitive events with accuracy.',
  },
  '/app/approvals': {
    name: 'Request Approval',
    description: '',
  },
  '/app/approval_status': {
    name: 'Request Status',
    description: 'Monitor current approval progress and workflow state transitions.',
  },
  '/app/sapfacts': {
    name: 'SAP Facts',
    description: 'Review SAP integration intelligence with actionable reporting.',
  },
  '/app/Cmdb': {
    name: 'CMDB',
    description:
      'Manage configuration items, dependencies, and change tracking across environments.',
  },
  '/app/Codemarketplace': {
    name: 'Code Marketplace',
    description: 'Discover reusable workflow scripts and automation building blocks.',
  },
  '/app/report': {
    name: 'Reports',
    description: 'Generate, Customize and Manage reports.',
  },
  '/app/Settings': {
    name: 'Settings',
    description: 'Control Insights configuration, user permissions, and global behavior.',
  },
  '/app/riseagent': {
    name: 'Rise Agent',
    description: '',
  },
  '/app/schedule': {
    name: 'Schedule Jobs',
    description: 'Manage ad hoc and scheduled tasks in one place',
  },
  '/app/ins_auth': {
    name: 'User Authorisation',
    description: '',
  },
  '/app/pipeline-configuration': {
    name: 'Pipeline Configuration',
    description:
      'Define approval stages, assign approvers, and control how changes move across environments.',
  },
  '/app/cm-settings': {
    name: 'CM-Settings',
    description: 'Configure module types,teams and Approval categeories.',
  },
  '/app/cm-approvalrequest': {
    name: 'Approval Request',
    description:
      'View and manage approval requests, track their status, and review past decisions.',
  },
  '/app/cm-requeststatus': {
    name: 'CM-Request Status',
    description: 'Check the status of your approval requests and review past decisions..',
  },
};

const LandingPageHeader: React.FC = () => {
  const location = useLocation<{ deniedPath?: string }>();
  const { pathname } = location;
  const username = cookies.get('user_fullname') ?? 'User';

  // longest route wins
  const matchedRoute = Object.keys(TAB_META)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  const activeTab = matchedRoute ? TAB_META[matchedRoute] : null;

  const isWorkflowHome = pathname === '/app/workflow';

  if (pathname === '/app/unauthorized') {
    const deniedRoute = location.state?.deniedPath || sessionStorage.getItem('deniedRoute') || '';
    const deniedMatch = deniedRoute
      ? Object.keys(TAB_META)
          .sort((a, b) => b.length - a.length)
          .find((route) => deniedRoute.startsWith(route))
      : null;
    const deniedTabName = deniedMatch ? TAB_META[deniedMatch]?.name : 'Access Denied';

    return (
      <header className={styles.header}>
        <div className={styles.lp_header_l1}>
          <h2>{deniedTabName}</h2>
          <p className={styles.subheader_text}>
            {deniedMatch
              ? `Access denied. You do not have permission to access ${deniedTabName}.`
              : 'Access denied. You do not have permission to access this page.'}
          </p>
        </div>
        <Navbar />
      </header>
    );
  }

  if (isWorkflowHome) {
    return (
      <header className={styles.header}>
        <div className={styles.right_header}>
          <h2 className={styles.lp_header_l1_welcome}>Welcome back, {username} – My Space</h2>
          <p className={styles.subheader_text}>{activeTab?.description}</p>
        </div>
        <Navbar />
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.lp_header_l1}>
        <h2>{activeTab?.name || ''}</h2>
        <p className={styles.subheader_text}>{activeTab?.description || ''}</p>
      </div>
      <Navbar />
    </header>
  );
};

export default LandingPageHeader;
