/**
 * AgentListPermissions.test.tsx
 *
 * Tests for permission-gated elements in AgentList:
 *  - Eye/view icon hidden when isViewAgentEnabled = false
 *  - Eye/view icon visible when isViewAgentEnabled = true
 *  - Health check button hidden when isCheckStatusAgentEnabled = false
 *  - Health check button visible when isCheckStatusAgentEnabled = true
 *  - Both hidden independently
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentList from "../../../../layouts/agent-management/home/AgentList";
import useAgentPermissions from "../../../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../../../config/agentPermissionLabels";

// ─── mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../../redux/actions/agentManagement.action", () => ({
  fetchHealthCheckup: jest.fn(() => ({ type: "HEALTH_CHECK" })),
}));
jest.mock("../../../../components/ui/pagination/Pagination.component", () => () => <div />);
jest.mock("react-redux", () => ({
  useSelector: (selector) => selector({
    userAuthorization: {
      myPermissions: [
        {
          project: 'agent',
          modules: [
            {
              module: 'Rise Agent',
              hasAccess: true,
              permissions: [
                { label: 'Rise Agent : bulk_start', hasAccess: true },
                { label: 'Rise Agent : bulk_stop', hasAccess: true },
                { label: 'Rise Agent : view_agent', hasAccess: true },
                { label: 'Rise Agent : check_status', hasAccess: true }
              ]
            }
          ]
        }
      ],
      myPermissionsLoading: false
    }
  }),
  useDispatch: () => jest.fn(),
}));
jest.mock("../../../../utils/hooks/useAgentPermissions", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    hasPermission: jest.fn(() => true),
    loading: false,
    permissions: []
  })),
}));

// ─── fixture data ─────────────────────────────────────────────────────────────

const mockAgent = {
  hostname: "test-host-01",
  os: "linux",
  status: "running",
  agent_details: { up_time: "5d", server_port: "9000" },
  risebotProperties: {
    server: { port: "9000" },
    agent: { version: "1.2.0" },
  },
};

const defaultProps = {
  loading: false,
  agents: [mockAgent] as any[],
  pagination: { pageNo: 1, totalPage: 1, totalRows: 1, limit: 10 },
  setSelectedHostnameAgentsData: jest.fn(),
  selectedHostnameAgentsData: [],
  handlePagination: jest.fn(),
  handleSelectHostAgent: jest.fn(),
  toggleSideBar: jest.fn(),
  dispatch: jest.fn() as any,
};

// ─── tests ───────────────────────────────────────────────────────────────────

describe("AgentList — permission-gated buttons", () => {

  // ── Eye / view icon ────────────────────────────────────────────────────────

  it("shows view icon when isViewAgentEnabled is true (default)", () => {
    render(<AgentList {...defaultProps} isViewAgentEnabled={true} />);
    expect(screen.getByTestId("viewSidebar")).toBeInTheDocument();
  });

  it("hides view icon when isViewAgentEnabled is false", () => {
    render(<AgentList {...defaultProps} isViewAgentEnabled={false} />);
    expect(screen.queryByTestId("viewSidebar")).not.toBeInTheDocument();
  });

  it("shows view icon by default when prop is omitted", () => {
    render(<AgentList {...defaultProps} />);
    expect(screen.getByTestId("viewSidebar")).toBeInTheDocument();
  });

  // ── Health check button ────────────────────────────────────────────────────

  it("shows health check button when isCheckStatusAgentEnabled is true (default)", () => {
    render(<AgentList {...defaultProps} isCheckStatusAgentEnabled={true} />);
    expect(screen.getByTestId("agentHealthChecktBtn")).toBeInTheDocument();
  });

  it("hides health check button when isCheckStatusAgentEnabled is false", () => {
    render(<AgentList {...defaultProps} isCheckStatusAgentEnabled={false} />);
    expect(screen.queryByTestId("agentHealthChecktBtn")).not.toBeInTheDocument();
  });

  it("shows health check button by default when prop is omitted", () => {
    render(<AgentList {...defaultProps} />);
    expect(screen.getByTestId("agentHealthChecktBtn")).toBeInTheDocument();
  });

  // ── Both hidden ────────────────────────────────────────────────────────────

  it("hides both buttons when both permissions are false", () => {
    render(
      <AgentList
        {...defaultProps}
        isViewAgentEnabled={false}
        isCheckStatusAgentEnabled={false}
      />
    );
    expect(screen.queryByTestId("viewSidebar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentHealthChecktBtn")).not.toBeInTheDocument();
  });

  it("shows both buttons when both permissions are true", () => {
    render(
      <AgentList
        {...defaultProps}
        isViewAgentEnabled={true}
        isCheckStatusAgentEnabled={true}
      />
    );
    expect(screen.getByTestId("viewSidebar")).toBeInTheDocument();
    expect(screen.getByTestId("agentHealthChecktBtn")).toBeInTheDocument();
  });

  // ── Accordion toggle gated by RISE_AGENT_ACCORDION permission ────────

  it("shows accordion toggle chevron when RISE_AGENT_ACCORDION permission is granted", () => {
    (useAgentPermissions as jest.Mock).mockReturnValue({
      hasPermission: jest.fn((label) => label === AGENT_PERMISSIONS.RISE_AGENT_ACCORDION),
      loading: false,
      permissions: null,
    });
    render(
      <AgentList
        {...defaultProps}
        isViewAgentEnabled={false}
        isCheckStatusAgentEnabled={false}
      />
    );
    expect(screen.getByTestId("hostnameAccordionToggle")).toBeInTheDocument();
  });

  it("hides accordion toggle chevron when RISE_AGENT_ACCORDION permission is not granted", () => {
    (useAgentPermissions as jest.Mock).mockReturnValue({
      hasPermission: jest.fn(() => false),
      loading: false,
      permissions: null,
    });
    render(
      <AgentList
        {...defaultProps}
        isViewAgentEnabled={false}
        isCheckStatusAgentEnabled={false}
      />
    );
    expect(screen.queryByTestId("hostnameAccordionToggle")).not.toBeInTheDocument();
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it("renders skeleton rows when loading is true", () => {
    render(<AgentList {...defaultProps} loading={true} />);
    // No action buttons — only skeleton structure
    expect(screen.queryByTestId("viewSidebar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentHealthChecktBtn")).not.toBeInTheDocument();
  });
});
