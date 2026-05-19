// src/pages/routes/__tests__/appRoutes.test.tsx

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// ─── Mocks (declare BEFORE importing AppRoute) ─────────────────────────────

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../../utils/permissionUtil', () => ({
  hasPermission: jest.fn(),
}));

jest.mock('../../../Layout', () => ({
  AppLayout: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

jest.mock('../../pageLayout/pageLayout', () => (props: any) => (
  <div data-testid="pagelayout">{props.children}</div>
));

jest.mock('../../../components/Header/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../../NotFound/NotFound', () => () => <div data-testid="notfound">Not Found</div>);
jest.mock('../../Accessdenied/AccessDenied', () => () => (
  <div data-testid="denied">Access Denied</div>
));
jest.mock('../../Accessdenied/Error', () => () => <div data-testid="errorpage">Error Page</div>);

// PrivateRoute → render component directly for coverage
jest.mock('../privateRoute', () => ({ component: Component, ...rest }: any) => (
  <div data-testid="private-route">
    <Component />
  </div>
));

// Remotes: WorflowRemote
jest.mock('../../remotes/WorflowRemote', () => ({
  DashboardJNJ: () => <div>Dashboard</div>,
  Settings: () => <div>WF Settings</div>,
  Capability: () => <div>Capability</div>,
  Execution: () => <div>Execution</div>,
  NodeManagement: () => <div>Node</div>,
  Approvalrequest: () => <div>Approval</div>,
  AuditLogsPage: () => <div>AuditLogsPage</div>,
  HelpContent: () => <div>Help</div>,
}));

// Remotes: InsightsApp
jest.mock('../../remotes/InsightsApp', () => ({
  AuditLogs: () => <div>AuditLogs</div>,
  RequestApproval: () => <div>RequestApproval</div>,
  Approvalstatus: () => <div>Approvalstatus</div>,
  SapFacts: () => <div>SapFacts</div>,
  Cmdb: () => <div>Cmdb</div>,
  Users: () => <div>Users</div>,
  Codemarketplace: () => <div>CodeMarketplace</div>,
  Report: () => <div>Report</div>,
  Ins_Settings: () => <div>Ins Settings</div>,
  Schedule: ({ basePath }: any) => <div>Schedule {basePath}</div>,
}));

// Remotes: InsAuth
jest.mock('../../remotes/InsAuth', () => ({
  InsightsAuthApp: () => <div>Auth</div>,
}));

// Remotes: Risebot
jest.mock('../../remotes/RisebotModule', () => ({
  RisebotModule: () => <div>Risebot</div>,
}));

// Remotes: WorkflowAuth
jest.mock('../../remotes/WorkflowAuth', () => ({
  workflowAuthApp: () => <div>WorkflowAuth</div>,
}));

// Layout utils
jest.mock('../../../utils/hooks/layoutUtils', () => ({
  shouldHideHeader: jest.fn(() => false),
}));

// ─── Import after mocks ───────────────────────────────────────────────────

import AppRoute from '../appRoutes';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../utils/permissionUtil';
import { shouldHideHeader } from '../../../utils/hooks/layoutUtils';

// ─── Helpers ───────────────────────────────────────────────────────────────

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoute />
    </MemoryRouter>
  );

const getMarginTop = () => {
  const page = screen.getByTestId('pagelayout');
  const styled = page.querySelector('div[style]') as HTMLDivElement | null;
  return styled?.style.marginTop || '';
};

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('AppRoute', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockReturnValue({
      permissions: [],
      loaded: true,
    });
    (hasPermission as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('redirects from / to first authorized default route (Dashboard)', () => {
    renderAt('/');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('redirects from /app to default route (Dashboard)', () => {
    renderAt('/app');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('redirects /create/workflow → /app/workflow/create/workflow (renders Dashboard)', () => {
    renderAt('/create/workflow');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('redirects /myspace-add → /app/workflow/myspace-add (renders Dashboard)', () => {
    renderAt('/myspace-add');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('redirects /flow/edit/:id → /app/workflow/flow/edit/:id and hides header (canvas)', () => {
    renderAt('/flow/edit/123');
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('redirects /flow/:id → /app/workflow/flow/:id and hides header (canvas)', () => {
    renderAt('/flow/abc');
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders Report for /app/reports/section/id', () => {
    renderAt('/app/reports/foo/123');
    expect(screen.getByText('Report')).toBeInTheDocument();
  });

  it('renders HelpContent for /app/workflow/helpcontent', () => {
    renderAt('/app/workflow/helpcontent');
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('renders Capability for /app/workflow/capability/:id', () => {
    renderAt('/app/workflow/capability/cap-42');
    expect(screen.getByText('Capability')).toBeInTheDocument();
  });

  // Added: Cover capability route with scriptId param (missed branch)
  it('renders Capability for /app/workflow/capability/:capability/scriptId/:scriptId', () => {
    renderAt('/app/workflow/capability/capX/scriptId/s123');
    expect(screen.getByText('Capability')).toBeInTheDocument();
  });

  it('renders WorkflowAuth (scoped) at /app/workflow/auth', () => {
    renderAt('/app/workflow/auth');
    expect(screen.getByText('WorkflowAuth')).toBeInTheDocument();
    // Scoped wrapper class from withRouteScope is applied
    const page = screen.getByTestId('pagelayout');
    expect(page.querySelector('.mfe-route-scope.mfe-wf-auth')).toBeInTheDocument();
  });

  it('renders InsightsAuth at /app/ins_auth', () => {
    renderAt('/app/ins_auth');
    expect(screen.getByText('Auth')).toBeInTheDocument();
  });

  it('renders Risebot module at /app/riseagent', () => {
    renderAt('/app/riseagent');
    expect(screen.getByText('Risebot')).toBeInTheDocument();
  });

  it('renders several insight routes (users, approval status, approvals)', () => {
    renderAt('/app/users');
    expect(screen.getByText('Users')).toBeInTheDocument();

    cleanup();
    renderAt('/app/approval_status');
    expect(screen.getByText('Approvalstatus')).toBeInTheDocument();

    cleanup();
    renderAt('/app/approvals');
    expect(screen.getByText('RequestApproval')).toBeInTheDocument();
  });

  it('renders sapfacts, Cmdb, CodeMarketplace, and report routes', () => {
    renderAt('/app/sapfacts');
    expect(screen.getByText('SapFacts')).toBeInTheDocument();

    cleanup();
    renderAt('/app/Cmdb');
    expect(screen.getByText('Cmdb')).toBeInTheDocument();

    cleanup();
    renderAt('/app/Codemarketplace');
    expect(screen.getByText('CodeMarketplace')).toBeInTheDocument();

    cleanup();
    renderAt('/app/report');
    expect(screen.getByText('Report')).toBeInTheDocument();
  });

  it('renders Ins Settings and Schedule', () => {
    renderAt('/app/Settings');
    expect(screen.getByText('Ins Settings')).toBeInTheDocument();

    cleanup();
    renderAt('/app/schedule');
    expect(screen.getByText('Schedule /app/schedule')).toBeInTheDocument();
  });

  it('renders AccessDenied page for /app/unauthorized', () => {
    (hasPermission as jest.Mock).mockReturnValue(false);
    renderAt('/app/unauthorized');
    expect(screen.getByTestId('denied')).toBeInTheDocument();
  });

  it('renders Error page for /app/error', () => {
    renderAt('/app/error');
    expect(screen.getByTestId('errorpage')).toBeInTheDocument();
  });

  it('renders top-level NotFound for unknown route', () => {
    renderAt('/random-unknown');
    expect(screen.getByTestId('notfound')).toBeInTheDocument();
  });

  it('defines global __WF_NAVIGATE__ and navigates', () => {
    renderAt('/app/users');
    expect((window as any).__WF_NAVIGATE__).toBeDefined();
    (window as any).__WF_NAVIGATE__('/app/Cmdb');
    expect(screen.getByText('Cmdb')).toBeInTheDocument();
  });

  it('applies marginTop based on path-specific rules and shouldHideHeader', () => {
    (shouldHideHeader as jest.Mock).mockReturnValueOnce(true);
    renderAt('/app/anypath');
    expect(getMarginTop()).toBe('80px');

    cleanup();
    renderAt('/app/AuditLogs/foo');
    expect(getMarginTop()).toBe('155px');

    cleanup();
    renderAt('/app/workflow/execution');
    expect(getMarginTop()).toBe('170px');

    cleanup();
    renderAt('/app/Cmdb');
    expect(getMarginTop()).toBe('160px');

    cleanup();
    renderAt('/app/workflow/helpcontent');
    expect(getMarginTop()).toBe('157px');

    cleanup();
    renderAt('/app/riseagent');
    expect(getMarginTop()).toBe('153px');

    cleanup();
    renderAt('/app/report');
    expect(getMarginTop()).toBe('145px');

    cleanup();
    renderAt('/app/Codemarketplace');
    expect(getMarginTop()).toBe('140px');

    cleanup();
    renderAt('/app/workflow/auth');
    expect(getMarginTop()).toBe('120px');

    cleanup();
    renderAt('/app/approvals');
    expect(getMarginTop()).toBe('130px');

    cleanup();
    renderAt('/app/Settings');
    expect(getMarginTop()).toBe('110px');

    cleanup();
    renderAt('/app/sapfacts');
    expect(getMarginTop()).toBe('160px');

    // Added: margin for workflow flow canvas is 0
    cleanup();
    renderAt('/app/workflow/flow/xyz');
    expect(getMarginTop()).toBe('0px');

    cleanup();
    renderAt('/app/unknown');
    expect(getMarginTop()).toBe('205px');
  });

  it('hides header on workflow canvas paths and shows otherwise', () => {
    renderAt('/app/workflow/flow/xyz');
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();

    cleanup();
    renderAt('/app/workflow');
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
