import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './Navbar.module.scss';

import GridDropdown from '../Gridpopup/GridPopup';
import { hasPermission } from '../../utils/permissionUtil';
import { RootState } from '../../redux/store';

import gridpopup from '../../assets/gridpopup.svg';
import capability from '../../assets/capabilities.svg';
import executions from '../../assets/executions.svg';
import myspace from '../../assets/myspace.svg';
import metrics from '../../assets/metrics.svg';
import approval from '../../assets/approval.svg';
import auditlogs from '../../assets/auditlogs.svg';
import cmdb from '../../assets/cmdb.svg';
import codemarketplace from '../../assets/codemarketplace.svg';
import reportstatus from '../../assets/reportstatus.svg';
import sapfacts from '../../assets/sapfacts.svg';
import reports from '../../assets/reports.svg';
import users from '../../assets/users.svg';
import settings from '../../assets/settings.svg';
import Workflowsettings from '../../assets/Workflowsettings.svg';
import Serviceaccount from '../../assets/Serviceaccount.svg';
import nodemanagement from '../../assets/node-management.svg';
import agent from '../../assets/agent.svg';
import schedules from '../../assets/sch.svg';
import ApprovalStatus from '../../assets/lucide.svg';
import wfauditLogs from '../../assets/wfAuditLogs.svg';
import ApprovalRequest from '../../assets/ApovRequest.svg';
import insauth from '../../assets/Ins-Auth.svg';
import helpcontent from '../../assets/helpcontent.svg';
import insightsSetting from '../../assets/insightSettings.svg';
import pipelineConfiguration from '../../assets/pipelineConfiguration.svg';

function Navbar() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const permissions = useSelector((state: RootState) => state?.permissions?.permissions);
  const permissionsLoaded = useSelector((state: RootState) => state?.permissions?.loaded);

  const location = useLocation();
  const browserPath = location.pathname;

  // Wrap apps in useMemo to avoid dependency warning
  const apps = [
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : my space',
      id: 'workflow',
      name: 'My Space',
      route: '/app/workflow',
      icon: <img src={myspace} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : execution',
      id: 'execution',
      name: 'Execution',
      route: '/app/workflow/execution',
      icon: <img src={executions} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : reports',
      id: 'reports',
      name: 'Report',
      route: '/app/report',
      icon: <img src={reports} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : code marketplace',
      id: 'codemarketplace',
      name: 'Code Marketplace',
      route: '/app/Codemarketplace',
      icon: <img src={codemarketplace} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : analytics',
      id: 'analytics',
      name: 'Metrics',
      route: '/app/workflow/metrics',
      icon: <img src={metrics} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : capabilities',
      id: 'capability',
      name: 'Capability',
      route: '/app/workflow/capability',
      icon: <img src={capability} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : request status',
      id: 'approvalstatus',
      name: 'Request Status',
      route: '/app/approval_status',
      icon: <img src={ApprovalStatus} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : wf-settings',
      id: 'wf-settings',
      name: 'WF-Settings',
      route: '/app/workflow/settings',
      icon: <img src={Workflowsettings} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : node management',
      id: 'node management',
      name: 'Node-Management',
      route: '/app/workflow/node-management',
      icon: <img src={nodemanagement} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : approval requests',
      id: 'approvalrequest',
      name: 'Approval Request',
      route: '/app/workflow/approvalrequest',
      icon: <img src={ApprovalRequest} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : wf-audit logs',
      id: 'wfauditlogs',
      name: 'WF-Audit Logs',
      route: '/app/workflow/auditlogs',
      icon: <img src={wfauditLogs} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : sap facts',
      id: 'sapfacts',
      name: 'Sap Facts',
      route: '/app/sapfacts',
      icon: <img src={sapfacts} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : cmdb',
      id: 'cmdb',
      name: 'CMDB',
      route: '/app/Cmdb',
      icon: <img src={cmdb} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : request approval',
      id: 'requestapproval',
      name: 'Request Approval',
      route: '/app/approvals',
      icon: <img src={approval} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : users',
      id: 'users',
      name: 'Users',
      route: '/app/users',
      icon: <img src={Serviceaccount} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : ins-audit logs',
      id: 'auditlogs',
      name: 'INS-Audit Logs',
      route: '/app/AuditLogs',
      icon: <img src={auditlogs} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : ins-settings',
      id: 'ins-settings',
      name: 'INS-settings',
      route: '/app/Settings',
      icon: <img src={insightsSetting} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : schedule',
      id: 'schedule',
      name: 'Schedule',
      route: '/app/schedule',
      icon: <img src={schedules} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : auth',
      id: 'insAuth',
      name: 'INS-Auth',
      route: '/app/ins_auth',
      icon: <img src={insauth} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : wf auth',
      id: 'wfAuth',
      name: 'WF-Auth',
      route: '/app/workflow/auth',
      icon: <img src={users} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : agent',
      id: 'riseagent',
      name: 'Rise Agent',
      route: '/app/riseagent',
      icon: <img src={agent} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : iacrypt',
      id: 'iacrypt',
      name: 'iacrypt',
      route: '/iacrypt',
      icon: <img src={users} alt="" />,
      openInNewWindow: true,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : pipelineconfiguration',
      id: 'changemanagement',
      name: 'Pipeline Configuration',
      route: '/app/pipeline-configuration',
      icon: <img src={pipelineConfiguration} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : cmsettings',
      id: 'Cm-Settings',
      name: 'CM-Settings',
      route: '/app/cm-settings',
      icon: <img src={settings} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : cmapprovalrequest',
      id: 'Cm-Approval Request',
      name: 'CM-Approval Request',
      route: '/app/cm-approvalrequest',
      icon: <img src={settings} alt="" />,
    },
    {
      project: 'insights',
      module: 'IASphere',
      permission: 'IASphere : cmrequeststatus',
      id: 'CM-Request Status',
      name: 'CM-Request Status',
      route: '/app/cm-requeststatus',
      icon: <img src={settings} alt="" />,
    },
  ];

  const accessibleApps = useMemo(
    () => apps.filter((app) => hasPermission(permissions, app.project, app.module, app.permission)),
    [apps, permissions]
  );

  const accessibleIds = useMemo(() => new Set(accessibleApps.map((a) => a.id)), [accessibleApps]);

  const currentAppId = useMemo(() => {
    const exactMatch = accessibleApps.find((app) => browserPath === app.route);
    if (exactMatch) return exactMatch.id;

    const prefixMatch = accessibleApps
      .filter((app) => browserPath.startsWith(app.route + '/'))
      .sort((a, b) => b.route.length - a.route.length)[0];

    return prefixMatch ? prefixMatch.id : null;
  }, [browserPath, accessibleApps]);

  // Load from localStorage safely (no setState in useEffect)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pinnedApps');
      if (saved) return JSON.parse(saved);

      const defaults = ['workflow', 'execution', 'reports'];
      localStorage.setItem('pinnedApps', JSON.stringify(defaults));
      return defaults;
    } catch {
      return ['workflow', 'execution', 'reports'];
    }
  });

  const cleanedSelectedIds = useMemo(() => {
    if (!permissionsLoaded) return selectedIds;

    const accessibleSet = new Set(accessibleApps.map((a) => a.id));
    return selectedIds.filter((id) => accessibleSet.has(id));
  }, [selectedIds, accessibleApps, permissionsLoaded]);

  useEffect(() => {
    localStorage.setItem('pinnedApps', JSON.stringify(cleanedSelectedIds));
  }, [cleanedSelectedIds]);

  const pinnedIds = selectedIds.slice(0, 3);

  const dynamicApp = useMemo(() => {
    if (!currentAppId) return null;
    if (pinnedIds.includes(currentAppId)) return null;
    return accessibleApps.find((a) => a.id === currentAppId) || null;
  }, [currentAppId, pinnedIds, accessibleApps]);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragEnter = (index: number) => setDragOverIndex(index);

  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex === null) return;

    const updated = [...selectedIds];
    const draggedItem = updated[dragIndex];
    updated.splice(dragIndex, 1);
    updated.splice(dragOverIndex, 0, draggedItem);

    setSelectedIds(updated);
    localStorage.setItem('pinnedApps', JSON.stringify(updated));

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const pinnedTabs = useMemo(
    () =>
      pinnedIds.map((id, index) => {
        const app = accessibleApps.find((a) => a.id === id);
        if (!app) return null;

        return (
          <div
            key={app.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            className={`${styles.dragWrapper} ${dragIndex === index ? styles.dragging : ''}`}
          >
            {dragOverIndex === index && dragIndex !== index && (
              <div className={styles.dropIndicator} />
            )}

            <NavLink
              to={app.route}
              draggable={false}
              className={`${styles.tab} ${currentAppId === app.id ? styles.activeTab : ''}`}
            >
              <div className={styles.tabContent}>{app.name}</div>
            </NavLink>
          </div>
        );
      }),
    [pinnedIds, accessibleApps, currentAppId, dragIndex, dragOverIndex, handleDrop]
  );

  const dynamicTab = dynamicApp ? (
    <NavLink
      key={dynamicApp.id}
      to={dynamicApp.route}
      className={`${styles.tab} ${currentAppId === dynamicApp.id ? styles.activeTab : ''}`}
    >
      <div className={styles.tabContent}>{dynamicApp.name}</div>
    </NavLink>
  ) : null;

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

      <div ref={popupRef} className={styles.header_right} style={{ position: 'relative' }}>
        <img
          src={gridpopup}
          alt="menu"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen((v) => !v)}
        />

        {open && (
          <GridDropdown
            apps={accessibleApps}
            selectedIds={selectedIds}
            onToggleSelect={(id) => {
              setSelectedIds((prev) => {
                const cleaned = prev.filter((pid) => accessibleIds.has(pid));

                if (cleaned.includes(id)) {
                  const updated = cleaned.filter((x) => x !== id);
                  localStorage.setItem('pinnedApps', JSON.stringify(updated));
                  return updated;
                }

                if (cleaned.length >= 3) return cleaned;

                const updated = [...cleaned, id];
                localStorage.setItem('pinnedApps', JSON.stringify(updated));
                return updated;
              });
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
