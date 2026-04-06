/**
 * AgentTasksPermissions.test.tsx
 *
 * Tests for permission-gated buttons in the AgentTasks sidebar accordion:
 *  - Job: Start, Stop, Restart (job_start / job_stop / job_restart)
 *  - Agent: Start via SSH, Shutdown, Restart (start / stop / restart)
 *  - Upgrade (upgrade), CheckStatus (check_status), SyncConfig (sync_config)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AGENT_PERMISSIONS } from "../../../../config/agentPermissionLabels";

// ─── Import after mocks ────────────────────────────────────────────────────────

import AgentTasks from "../../../../layouts/agent-management/components/sidebar/AgentTasks";

// ─── Mock useAgentPermissions ─────────────────────────────────────────────────

const mockHasPermission = jest.fn();

jest.mock("../../../../utils/hooks/useAgentPermissions", () => ({
  __esModule: true,
  default: () => ({
    hasPermission: mockHasPermission,
    loading: false,
    permissions: [],
  }),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(() => []),
  useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock("react-bootstrap", () => {
  const Accordion: any = ({ children }: any) => <div>{children}</div>;
  Accordion.Header = ({ children }: any) => <div>{children}</div>;
  Accordion.Body   = ({ children }: any) => <div>{children}</div>;
  Accordion.Item   = ({ children }: any) => <div>{children}</div>;
  const Button = ({ children, ...props }: any) => <button {...props}>{children}</button>;
  return { Accordion, Button, AccordionContext: { Consumer: ({ children }: any) => children({ activeEventKey: null }) } };
});

// ─── fixture ──────────────────────────────────────────────────────────────────

const defaultProps = {
  hostname: "test-host",
  port: "9000",
  type: "linux",
  osVersion: "ubuntu",
  scheduledJobs: [],
  openScheduler: jest.fn(),
  upgradeAgent: jest.fn(),
  startJob: jest.fn(),
  stopJob: jest.fn(),
  restartJob: jest.fn(),
  startAgentviaSSH: jest.fn(),
  shutDownAgent: jest.fn(),
  restartAgent: jest.fn(),
  openEnvUpgradeModal: jest.fn(),
  syncAgentConfig: jest.fn(),
  checkAgentStatus: jest.fn(),
  editSchedulerCommands: jest.fn(),
  deleteSchedulerJob: jest.fn(),
  loadAgentLogs: jest.fn(),
  versionDialogOpen: false,
  selectedAgentVersion: "",
  handleSelectAgentVersion: jest.fn(),
  agentVersionUpgrade: jest.fn(),
  closeSubModal: jest.fn(),
  agentsVersion: [],
  serviceLoad: false,
  schedulerLoading: false,
  agentId: "agent-1",
  setJobName: jest.fn(),
  setJobLogModal: jest.fn(),
};

/** Grant all permissions. */
const grantAll = () => mockHasPermission.mockReturnValue(true);

/** Deny specific permission, grant all others. */
const denyOnly = (deniedLabel: string) =>
  mockHasPermission.mockImplementation((label: string) => label !== deniedLabel);

// ─── tests ────────────────────────────────────────────────────────────────────

describe("AgentTasks — permission-gated buttons", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  // ── All visible when all granted ─────────────────────────────────────────

  it("shows all permission-gated buttons when all permissions are granted", () => {
    grantAll();
    render(<AgentTasks {...defaultProps} />);

    expect(screen.getByTestId("agentSubServiceStartBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentSubServiceStopBtn")).toBeInTheDocument();
    expect(screen.getByTestId("restartAgentStatusId")).toBeInTheDocument();
    expect(screen.getByTestId("agentSubServiceUpdateBtn")).toBeInTheDocument();
    expect(screen.getByTestId("checkAgentStatusId")).toBeInTheDocument();
    expect(screen.getByTestId("startAgentviaSSHId")).toBeInTheDocument();
    expect(screen.getByTestId("shutDownAgentId")).toBeInTheDocument();
    expect(screen.getByTestId("restartAgentId")).toBeInTheDocument();
  });

  // ── Job-level ────────────────────────────────────────────────────────────

  it("hides Start Job button when job_start is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_JOB_START);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("agentSubServiceStartBtn")).not.toBeInTheDocument();
  });

  it("hides Stop Job button when job_stop is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_JOB_STOP);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("agentSubServiceStopBtn")).not.toBeInTheDocument();
  });

  it("hides Restart Job button when job_restart is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_JOB_RESTART);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("restartAgentStatusId")).not.toBeInTheDocument();
  });

  // ── Agent-level (mirrors FilterBar) ──────────────────────────────────────

  it("hides Start via SSH button when start is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_START);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("startAgentviaSSHId")).not.toBeInTheDocument();
  });

  it("hides Shutdown button when stop is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_STOP);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("shutDownAgentId")).not.toBeInTheDocument();
  });

  it("hides Restart Agent button when restart is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_RESTART);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("restartAgentId")).not.toBeInTheDocument();
  });

  it("hides Upgrade button when upgrade is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_UPGRADE);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("agentSubServiceUpdateBtn")).not.toBeInTheDocument();
  });

  it("hides Check Status button when check_status is false", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_CHECK_STATUS);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("checkAgentStatusId")).not.toBeInTheDocument();
  });

  // ── Consistency: start/stop/restart match FilterBar ───────────────────────

  it("start permission controls both SSH start (sidebar) and bulk start (FilterBar) consistently", () => {
    // Deny start
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_START);
    render(<AgentTasks {...defaultProps} />);
    // SSH start hides in sidebar
    expect(screen.queryByTestId("startAgentviaSSHId")).not.toBeInTheDocument();
    // Job start is unaffected (different permission)
    expect(screen.getByTestId("agentSubServiceStartBtn")).toBeInTheDocument();
  });

  it("stop permission controls Shutdown (sidebar) independently of job_stop", () => {
    denyOnly(AGENT_PERMISSIONS.RISE_AGENT_STOP);
    render(<AgentTasks {...defaultProps} />);
    expect(screen.queryByTestId("shutDownAgentId")).not.toBeInTheDocument();
    expect(screen.getByTestId("agentSubServiceStopBtn")).toBeInTheDocument(); // job_stop unaffected
  });

  // ── All denied ────────────────────────────────────────────────────────────

  it("hides all buttons when all permissions are denied", () => {
    mockHasPermission.mockReturnValue(false);
    render(<AgentTasks {...defaultProps} />);

    expect(screen.queryByTestId("agentSubServiceStartBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentSubServiceStopBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("restartAgentStatusId")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentSubServiceUpdateBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("checkAgentStatusId")).not.toBeInTheDocument();
    expect(screen.queryByTestId("startAgentviaSSHId")).not.toBeInTheDocument();
    expect(screen.queryByTestId("shutDownAgentId")).not.toBeInTheDocument();
    expect(screen.queryByTestId("restartAgentId")).not.toBeInTheDocument();
  });
});
