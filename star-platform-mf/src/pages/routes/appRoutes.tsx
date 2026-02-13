import { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';

import { AppLayout } from '../../Layout';
import NotFound from '../NotFound/NotFound';
import PageLayout from '../pageLayout/pageLayout';

import {
  Approvalrequest,
  AuditLogsPage,
  Capability,
  DashboardJNJ,
  Execution,
  Metrics,
  NodeManagement,
  Settings,
} from '../remotes/WorflowRemote';

import {
  Approvalstatus,
  AuditLogs,
  Cmdb,
  Codemarketplace,
  Ins_Settings,
  Report,
  RequestApproval,
  SapFacts,
  Schedule,
  Users,
} from '../remotes/InsightsApp';

import Header from '../../components/Header/Header';
import { InsightsAuth } from '../remotes/InsAuth';
import { RisebotModule } from '../remotes/RisebotModule';

type NavInput = string | { pathname: string; search?: string; state?: any };

const AppRoute: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  /* ===== Workflow navigation bridge ===== */
  useEffect(() => {
    (window as any).__WF_NAVIGATE__ = (input: NavInput) => {
      history.push(input as any);
    };
    return () => {
      delete (window as any).__WF_NAVIGATE__;
    };
  }, [history]);

  // Header must be visible even for create/workflow
  const isWorkflowCanvas =
    location.pathname === '/app/workflow/create/workflow' ||
    location.pathname.startsWith('/app/workflow/flow/');

  function getMarginTop() {
    if (location.pathname === '/app/workflow/myspace-add') return '80px';
    if (
      location.pathname.startsWith('/app/workflow/flow') ||
      location.pathname.startsWith('/app/workflow/execution')
    )
      return '0';
    return '205px';
  }

  return (
    <PageLayout>
      {!isWorkflowCanvas && <Header />}

      <div style={{ marginTop: getMarginTop() }}>
        <Switch>
          {/* ===== PUBLIC ===== */}
          {/* <Route exact path="/" component={LandingPage} /> */}
          <Route exact path="/">
            <Redirect to="/app/workflow" />
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

          {/* ===== APP ===== */}
          <Route path="/app">
            <AppLayout>
              <Switch>
                {/* ===== WORKFLOW ===== */}

                {/* Workflow modules */}
                <Route path="/app/workflow/execution" component={Execution} />
                <Route path="/app/workflow/settings" component={Settings} />
                <Route path="/app/workflow/approvalrequest" component={Approvalrequest} />
                <Route path="/app/workflow/auditlogs" component={AuditLogsPage} />

                <Route path="/app/workflow/capability">
                  <div id="scroll-container">
                    <Capability />
                  </div>
                </Route>

                <Route path="/app/workflow/node-management">
                  <div
                    // style={{
                    //   height: 'calc(100vh - 120px)',
                    //   overflowY: 'auto',
                    // }}
                    style={{
                      padding: '3px 0px',
                    }}
                  >
                    <NodeManagement scrollContainerId="nm-scroll" />
                  </div>
                </Route>

                <Route path="/app/workflow/metrics" component={Metrics} />
                <Route path="/app/workflow" component={DashboardJNJ} />

                {/* ===== INSIGHTS ===== */}
                <Route path="/app/users" component={Users} />
                <Route path="/app/AuditLogs" component={AuditLogs} />
                <Route path="/app/approval_status" component={Approvalstatus} />
                <Route path="/app/approvals" component={RequestApproval} />
                <Route path="/app/sapfacts" component={SapFacts} />
                <Route path="/app/Cmdb" component={Cmdb} />
                <Route path="/app/Codemarketplace" component={Codemarketplace} />
                <Route path="/app/report" component={Report} />
                <Route path="/app/Settings" component={Ins_Settings} />

                <Route
                  exact
                  path="/app/schedule/dashboard"
                  render={() => <Redirect to="/app/schedule" />}
                />
                <Route path="/app/schedule">
                  <Schedule basePath="/app/schedule" />
                </Route>
                {/* ===== AUTH ===== */}
                <Route path="/app/ins_auth" component={InsightsAuth} />

                {/* ===== RISEBOT ===== */}
                <Route path="/app/riseagent" component={RisebotModule} />

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
