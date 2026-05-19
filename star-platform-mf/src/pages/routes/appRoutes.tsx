import React from 'react';
import { useEffect } from 'react';
import { Switch, Route, useHistory, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppLayout } from '../../Layout';
import NotFound from '../NotFound/NotFound';
import PageLayout from '../pageLayout/pageLayout';
import Header from '../../components/Header/Header';
import PrivateRoute from './privateRoute';
import AccessDeniedPage from '../Accessdenied/AccessDenied';
import { RootState } from '../../redux/store';
import { hasPermission } from '../../utils/permissionUtil';
import Error from '../Accessdenied/Error';

import {
  DashboardJNJ,
  Settings,
  Capability,
  Execution,
  NodeManagement,
  Approvalrequest,
  AuditLogsPage,
  HelpContent,
} from '../remotes/WorflowRemote';

import {
  AuditLogs,
  RequestApproval,
  Approvalstatus,
  SapFacts,
  Cmdb,
  Users,
  Codemarketplace,
  Report,
  Ins_Settings,
  Schedule,
} from '../remotes/InsightsApp';
import { InsightsAuthApp } from '../remotes/InsAuth';
import { RisebotModule } from '../remotes/RisebotModule';
import { workflowAuthApp } from '../remotes/WorkflowAuth';

import {
  PipelineConfig,
  ChangemanagementSettings,
  CmApprovalrequest,
  CmRequestStatus,
} from '../remotes/changemanagement';
import { shouldHideHeader } from '../../utils/hooks/layoutUtils';
import '../../styles/mfeRouteScope.scss';
import { useCurrentPath } from '../../utils/useCurrentPath';

type NavInput = string | { pathname: string; search?: string; state?: any };
type RoutePermission = {
  path: string;
  project: string;
  module: string;
  permissionLabel?: string;
  permission?: string;
};

const DEFAULT_ROUTE_CANDIDATES: RoutePermission[] = [
  {
    path: '/app/workflow',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : my space',
  },
  {
    path: '/app/workflow/execution',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : execution',
  },
  {
    path: '/app/workflow/settings',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : wf-settings',
  },
  {
    path: '/app/workflow/approvalrequest',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : approval requests',
  },
  {
    path: '/app/workflow/auditlogs',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : wf-audit logs',
  },
  {
    path: '/app/workflow/capability',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : capabilities',
  },
  {
    path: '/app/workflow/node-management',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : node management',
  },

  {
    path: '/app/workflow/auth',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : wf auth',
  },
  {
    path: '/app/users',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : users',
  },
  {
    path: '/app/AuditLogs',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : ins-audit logs',
  },
  {
    path: '/app/approval_status',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : request status',
  },
  {
    path: '/app/approvals',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : request approval',
  },
  {
    path: '/app/sapfacts',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : sap facts',
  },
  {
    path: '/app/Cmdb',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : cmdb',
  },
  {
    path: '/app/Codemarketplace',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : code marketplace',
  },
  {
    path: '/app/report',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : reports',
  },
  {
    path: '/app/Settings',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : ins-settings',
  },
  {
    path: '/app/schedule',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : schedule',
  },
  {
    path: '/app/ins_auth',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : auth',
  },
  { path: '/app/ins_auth', project: 'insights', module: 'Auth' },
  {
    path: '/app/riseagent',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : agent',
  },
  {
    path: '/app/change-management',
    project: 'insights',
    module: 'IASphere',
    permissionLabel: 'IASphere : changemanagement',
  },
];

const withRouteScope = (Component: React.ComponentType<any>, scopeClass: string): React.FC<any> => {
  const ScopedRemoteComponent: React.FC<any> = (props) => (
    <div className={`mfe-route-scope ${scopeClass}`}>
      <Component {...props} />
    </div>
  );

  return ScopedRemoteComponent;
};

const WorkflowAuthScoped = withRouteScope(workflowAuthApp, 'mfe-wf-auth');

const AppRoute: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = useLocation();
  const { permissions, loaded } = useSelector((state: RootState) => state.permissions);
  const currentPath = useCurrentPath();

  const resolveDefaultRoute = () => {
    const firstAuthorized = DEFAULT_ROUTE_CANDIDATES.find((route) =>
      hasPermission(permissions, route.project, route.module, route.permissionLabel)
    );
    return firstAuthorized?.path ?? '/app/error';
  };

  useEffect(() => {
    (window as any).__WF_NAVIGATE__ = (input: NavInput) => {
      history.push(input as any);
    };
    return () => {
      delete (window as any).__WF_NAVIGATE__;
    };
  }, [history]);

  const hideHeader = shouldHideHeader(currentPath);

  const isWorkflowCanvas =
    location.pathname === '/app/workflow/create/workflow' ||
    location.pathname.startsWith('/app/workflow/flow/');

  function getMarginTop() {
    if (hideHeader) return '80px';

    if (currentPath.startsWith('/app/AuditLogs')) return '155px';
    if (currentPath.startsWith('/app/workflow/execution')) return '170px';
    if (currentPath.startsWith('/app/Cmdb')) return '160px';
    if (currentPath.startsWith('/app/workflow/helpcontent')) return '157px';
    if (currentPath.startsWith('/app/cm-requeststatus/')) return '50px';
    if (currentPath.startsWith('/app/cm-approvalrequest/')) return '56px';
    if (currentPath.startsWith('/app/pipeline-configuration')) return '200px';
    if (currentPath.startsWith('/app/pipeline-configuration/create/')) return '56px';
    if (currentPath.startsWith('/app/pipeline-configuration/view/')) return '56px';

    if (
      currentPath.startsWith('/app/riseagent') ||
      currentPath.startsWith('/app/users') ||
      currentPath.startsWith('/app/approval_status') ||
      currentPath.startsWith('/app/schedule')
    ) {
      return '153px';
    }

    if (currentPath.startsWith('/app/report')) return '145px';
    if (currentPath.startsWith('/app/Codemarketplace') || currentPath.startsWith('/app/ins_auth'))
      return '140px';

    if (currentPath.startsWith('/app/workflow/auth')) return '120px';
    if (currentPath.startsWith('/app/approvals')) return '130px';
    if (currentPath.startsWith('/app/Settings')) return '110px';
    if (currentPath.startsWith('/app/workflow/flow')) return '0';
    if (currentPath.startsWith('/app/sapfacts')) return '160px';

    return '205px';
  }
  return (
    <PageLayout>
      {!isWorkflowCanvas && <Header />}

      <div style={{ marginTop: getMarginTop() }}>
        <Switch>
          <Route exact path="/">
            {!loaded ? null : <Redirect to={resolveDefaultRoute()} />}
          </Route>
          {/* ===== LEGACY WORKFLOW ENTRY POINTS ===== */}
          <Route
            exact
            path="/create/workflow"
            render={({ location }) => (
              <Redirect
                to={{
                  pathname: '/app/workflow/create/workflow',
                  search: location.search,
                  state: location.state,
                }}
              />
            )}
          />
          <Route path="/app/reports/:section?/:id?" component={Report} />
          <Route
            exact
            path="/myspace-add"
            render={() => <Redirect to="/app/workflow/myspace-add" />}
          />

          <Route
            exact
            path="/flow/edit/:workflowId"
            render={({ match, location }) => (
              <Redirect
                to={{
                  pathname: `/app/workflow/flow/edit/${match.params.workflowId}`,
                  search: location.search,
                  state: location.state,
                }}
              />
            )}
          />

          <Route
            exact
            path="/flow/view/:workflowId"
            render={({ match, location }) => (
              <Redirect
                to={{
                  pathname: `/app/workflow/flow/view/${match.params.workflowId}`,
                  search: location.search,
                  state: location.state,
                }}
              />
            )}
          />
          <Route
            exact
            path="/flow/:workflowId"
            render={({ match, location }) => (
              <Redirect
                to={{
                  pathname: `/app/workflow/flow/${match.params.workflowId}`,
                  search: location.search,
                  state: location.state,
                }}
              />
            )}
          />

          <Route path="/app">
            <AppLayout>
              <Switch>
                <Route exact path="/app">
                  {!loaded ? null : <Redirect to={resolveDefaultRoute()} />}
                </Route>

                <Route exact path="/app/unauthorized" component={AccessDeniedPage} />

                <Route exact path="/app/error" component={Error} />

                {/* ================= WORKFLOW ================= */}

                <PrivateRoute
                  path="/app/workflow/execution"
                  component={Execution}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : execution"
                />

                <PrivateRoute
                  path="/app/workflow/settings"
                  component={Settings}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : wf-settings"
                />

                <PrivateRoute
                  path="/app/workflow/approvalrequest"
                  component={Approvalrequest}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : approval requests"
                />

                <PrivateRoute
                  path="/app/workflow/auditlogs"
                  component={AuditLogsPage}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : wf-audit logs"
                />

                <PrivateRoute
                  path="/app/workflow/capability"
                  component={Capability}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : capabilities"
                />
                <Route
                  path="/app/workflow/capability/:capability/scriptId/:scriptId"
                  component={Capability}
                />
                <Route path="/app/workflow/capability/:capabilityId" component={Capability} />

                {/* <Route path="/app/workflow/capability">
                  <div id="scroll-container">
                    <Capability />
                  </div>
                </Route> */}
                <PrivateRoute
                  path="/app/workflow/node-management"
                  component={NodeManagement}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : node management"
                />

                <PrivateRoute
                  path="/app/workflow/auth"
                  component={WorkflowAuthScoped}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : wf auth"
                />

                <Route path="/app/workflow/helpcontent" component={HelpContent} />

                <PrivateRoute
                  path="/app/workflow"
                  component={DashboardJNJ}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : my space"
                />

                {/* ================= INSIGHTS ================= */}

                <PrivateRoute
                  path="/app/users"
                  component={Users}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : users"
                />

                <PrivateRoute
                  path="/app/AuditLogs"
                  component={AuditLogs}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : ins-audit logs"
                />

                <PrivateRoute
                  path="/app/approval_status"
                  component={Approvalstatus}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : request status"
                />

                <PrivateRoute
                  path="/app/approvals"
                  component={RequestApproval}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : request approval"
                />

                <PrivateRoute
                  path="/app/sapfacts"
                  component={SapFacts}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : sap facts"
                />

                <PrivateRoute
                  path="/app/Cmdb"
                  component={Cmdb}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : cmdb"
                />

                <PrivateRoute
                  path="/app/Codemarketplace"
                  component={Codemarketplace}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : code marketplace"
                />

                <PrivateRoute
                  path="/app/report"
                  component={Report}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : reports"
                />

                <PrivateRoute
                  path="/app/Settings"
                  component={Ins_Settings}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : ins-settings"
                />

                <PrivateRoute
                  path="/app/schedule"
                  component={() => <Schedule basePath="/app/schedule" />}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : schedule"
                />

                <PrivateRoute
                  path="/app/ins_auth"
                  component={InsightsAuthApp}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : auth"
                />

                {/* ================= AGENT ================= */}

                <PrivateRoute
                  path="/app/riseagent"
                  component={RisebotModule}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : agent"
                />

                {/* =======================change management =========================== */}
                {/* <PrivateRoute
                  exact
                  path="/app/pipeline-configuration/create"
                  component={PipelineConfig}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : pipelineconfiguration"
                /> */}

                <PrivateRoute
                  path="/app/cm-settings"
                  component={ChangemanagementSettings}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : cmsettings"
                />
                <PrivateRoute
                  path="/app/cm-approvalrequest"
                  component={CmApprovalrequest}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : cmapprovalrequest"
                />
                <PrivateRoute
                  exact
                  path="/app/cm-requeststatus"
                  component={CmRequestStatus}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : cmrequeststatus"
                />

                <PrivateRoute
                  path="/app/pipeline-configuration"
                  component={PipelineConfig}
                  project="insights"
                  module="IASphere"
                  permissionLabel="IASphere : pipelineconfiguration"
                />
                <Route component={NotFound} />
              </Switch>
            </AppLayout>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </div>
    </PageLayout>
  );
};

export default AppRoute;
