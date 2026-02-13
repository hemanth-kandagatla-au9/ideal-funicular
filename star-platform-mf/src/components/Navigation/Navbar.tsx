import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Navbar.module.scss';

import GridDropdown from '../Gridpopup/GridPopup';

import gridpopup from '../../assets/gridpopup.svg';
import capability from '../../assets/capability.svg';
import executions from '../../assets/executions.svg';
import myspace from '../../assets/myspace.svg';
import metrics from '../../assets/metrics.svg';
import approval from '../../assets/approval.svg';
import auditlogs from '../../assets/auditlogs.svg';
import cmdb from '../../assets/cmdb.svg';
import codemarketplace from '../../assets/codemarketplace.svg';
import lucide from '../../assets/lucide.svg';
import reportstatus from '../../assets/reportstatus.svg';
import sapfacts from '../../assets/sapfacts.svg';
import user from '../../assets/user.svg';
import reports from '../../assets/reports.svg';
import users from '../../assets/users.svg';
import settings from '../../assets/settings.svg';

import nodemanagement from '../../assets/node-management.svg';

function Navbar() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const browserPath = window.location.pathname;

  const apps = [
    //WORKFLOW
    {
      project: 'workflow',
      module: 'Workflow',
      id: 'workflow',
      name: 'My Space',
      route: '/app/workflow',
      icon: <img src={myspace} alt="myspace" />,
    },
    {
      project: 'workflow',
      module: 'Execution',
      id: 'execution',
      name: 'Executions',
      route: '/app/workflow/execution',
      icon: <img src={executions} alt="executions" />,
    },
    {
      project: 'workflow',
      module: 'Workflow Settings',
      id: 'settings',
      name: 'WF-Settings',
      route: '/app/workflow/settings',
      icon: <img src={settings} alt="settings" />,
    },
    {
      project: 'workflow',
      module: 'Capabilities',
      id: 'capability',
      name: 'Capability',
      route: '/app/workflow/capability',
      icon: <img src={capability} alt="capability" />,
    },
    {
      project: 'workflow',
      module: 'Approval Requests',
      id: 'Approvalrequest',
      name: 'Approval Request',
      route: '/app/workflow/approvalrequest',
      icon: <img src={nodemanagement} alt="node" />,
    },
    {
      project: 'workflow',
      module: 'Audit',
      id: 'auditlogs',
      name: 'WF-Audit Logs',
      route: '/app/workflow/auditlogs',
      icon: <img src={nodemanagement} alt="node" />,
    },

    {
      project: 'workflow',
      module: 'Analytics',
      id: 'metrics',
      name: 'Metrics',
      route: '/app/workflow/metrics',
      icon: <img src={metrics} alt="metrics" />,
    },
    {
      project: 'workflow',
      module: 'Manage Nodes',
      id: 'nodemanagement',
      name: 'Node',
      route: '/app/workflow/node-management',
      icon: <img src={nodemanagement} alt="node" />,
    },

    //INSIGHTS
    {
      project: 'insights',
      module: 'Code Marketplace',
      id: 'codemarketplace',
      name: 'Code Marketplace',
      route: '/app/Codemarketplace',
      icon: <img src={codemarketplace} alt="codemarketplace" />,
    },
    {
      project: 'insights',
      module: 'Request Status',
      id: 'approvalstatus',
      name: 'Approval Status',
      route: '/app/approval_status',
      icon: <img src={reportstatus} alt="reportstatus" />,
    },
    {
      project: 'insights',
      module: 'SAP Facts',
      id: 'sapfacts',
      name: 'Sap facts',
      route: '/app/sapfacts',
      icon: <img src={sapfacts} alt="sapfacts" />,
    },
    {
      project: 'insights',
      module: 'CMDB',
      id: 'cmdb',
      name: 'CMDB',
      route: '/app/Cmdb',
      icon: <img src={cmdb} alt="cmdb" />,
    },
    {
      project: 'insights',
      module: 'Request Approval',
      id: 'requestapproval',
      name: 'Request Approval',
      route: '/app/approvals',
      icon: <img src={approval} alt="approval" />,
    },
    {
      project: 'insights',
      module: 'Users',
      id: 'users',
      name: 'Users',
      route: '/app/users',
      icon: <img src={users} alt="users" />,
    },
    {
      project: 'insights',
      module: 'Insights Settings',
      id: 'ins-settings',
      name: 'Ins-settings',
      route: '/app/Settings',
      icon: <img src={settings} alt="auditlogs" />,
    },
    {
      project: 'insights',
      module: 'Reports',
      id: 'reports',
      name: 'Reports',
      route: '/app/report',
      icon: <img src={reports} alt="reports" />,
    },
    {
      project: 'insights',
      module: 'Audit Logs',
      id: 'auditlogs',
      name: 'Audit Logs',
      route: '/app/AuditLogs',
      icon: <img src={auditlogs} alt="AuditLogs" />,
    },
    {
      project: 'insights',
      module: 'Schedule',
      id: 'schedule',
      name: 'Schedule',
      route: '/app/schedule',
      icon: <img src={auditlogs} alt="schedule" />,
    },

    //Insights Auth
    {
      project: 'insights',
      module: 'Auth',
      id: 'insAuth',
      name: 'Ins_Auth',
      route: '/app/ins_auth',
      icon: <img src={nodemanagement} alt="insAuth" />,
    },

    // Agent
    {
      project: 'agent',
      module: 'Rise Agent',
      id: 'risebot',
      name: 'Rise Bot',
      route: '/app/riseagent',
      icon: <img src={nodemanagement} alt="auth" />,
    },
  ];

  // longest-match router
  const currentAppId = useMemo(() => {
    const match = [...apps]
      .sort((a, b) => b.route.length - a.route.length) // longest route wins
      .find((a) => browserPath.startsWith(a.route));

    return match ? match.id : null;
  }, [browserPath]);

  // Load pinned apps
  useEffect(() => {
    const saved = localStorage.getItem('pinnedApps');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        setSelectedIds(parsed);
        return;
      }
    }
    const defaults = ['workflow', 'execution', 'reports'];
    setSelectedIds(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  useEffect(() => {
    // Persist to localStorage whenever selectedIds changes (except initial mount)
    if (selectedIds.length > 0) {
      localStorage.setItem('pinnedApps', JSON.stringify(selectedIds));
    }
  }, [selectedIds]);

  const pinnedIds = selectedIds.slice(0, 3);

  const dynamicApp = useMemo(() => {
    if (!currentAppId) return null;
    if (pinnedIds.includes(currentAppId)) return null;
    return apps.find((a) => a.id === currentAppId) || null;
  }, [currentAppId, pinnedIds, apps]);

  const pinnedTabs = useMemo(
    () =>
      pinnedIds.map((id) => {
        const app = apps.find((a) => a.id === id);
        if (!app) return null;
        return (
          <NavLink
            key={app.id}
            to={app.route}
            className={styles.tab}
            activeClassName={styles.activeTab}
            {...(app.id === 'workflow' ? { exact: true } : {})}
          >
            <div className={styles.tabContent}>{app.name}</div>
          </NavLink>
        );
      }),
    [pinnedIds, apps]
  );

  const dynamicTab = dynamicApp ? (
    <NavLink
      key={dynamicApp.id}
      to={dynamicApp.route}
      className={styles.tab}
      activeClassName={styles.activeTab}
    >
      <div className={styles.tabContent}>{dynamicApp.name}</div>
    </NavLink>
  ) : null;

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.navParent}>
      <div className={styles.navWrap}>
        {pinnedTabs}
        {dynamicTab}
      </div>

      <div
        ref={popupRef}
        style={{ position: 'relative', display: 'inline-block' }}
        className={styles.header_right}
      >
        <img
          src={gridpopup}
          alt="menu"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen((v) => !v)}
        />
        {open && (
          <GridDropdown
            apps={apps}
            selectedIds={selectedIds}
            setOpenon={() => setOpen(false)}
            onToggleSelect={(id) => {
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : prev.length >= 3
                    ? prev
                    : [...prev, id]
              );
            }}
            maxSelected={3}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Navbar;
