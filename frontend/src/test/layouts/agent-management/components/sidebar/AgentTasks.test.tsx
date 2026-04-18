import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Accordion } from "react-bootstrap";
import AgentTasks from "../../../../../layouts/agent-management/components/sidebar/AgentTasks";
import '@testing-library/jest-dom';
jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
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
}));

jest.mock("../../../../../utils/hooks/useAgentPermissions", () => ({
  __esModule: true,
  default: () => ({
    hasPermission: () => true,
    loading: false,
    permissions: []
  })
}));

jest.mock("../../../../../utils/PermissionUtils", () => ({
  canAccess: jest.fn(() => true), // enable all buttons
}));

jest.mock("../../../../../layouts/agent-management/helpers/agentHelpers", () => ({
  convertDateTime: jest.fn(() => "Formatted Time"),
}));

jest.mock("../../../../../redux/actions/agentManagement.action", () => ({
  __esModule: true,
  default: {
    listSchedulerCommand: jest.fn(() => ({ type: "LIST" })),
  },
}));
const baseProps = {
  hostname: "host1",
  port: "8080",
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
  checkAgentStatus: jest.fn(),
  editSchedulerCommands: jest.fn(),
  deleteSchedulerJob: jest.fn(),
  loadAgentLogs: jest.fn(),
  versionDialogOpen: false,
  selectedAgentVersion: "",
  handleSelectAgentVersion: jest.fn(),
  agentVersionUpgrade: jest.fn(),
  closeSubModal: jest.fn(),
  agentsVersion: null,
  serviceLoad: false,
  schedulerLoading: false,
  agentId: "agent1",
  setJobName: jest.fn(),
  setJobLogModal: jest.fn(),
};

const renderUI = (activeKey = "0", props = {}) =>
  render(
    <Accordion defaultActiveKey={activeKey}>
      <AgentTasks {...baseProps} {...props} />
    </Accordion>
  );
describe("AgentTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header title", () => {
    renderUI();
    expect(screen.getAllByText(/tasks/i).length).toBeGreaterThan(0);
  });

  it("applies expanded class when open", () => {
    renderUI("0");
    const title = screen.getAllByText(/tasks/i)[0];
    expect(title.className).toContain("titleCollapsed");
  });

  it("applies collapsed class when closed", () => {
    renderUI("1");
    const title = screen.getAllByText(/tasks/i)[0];
    expect(title.className).toContain("nottitleCollapsed");
  });

  it("calls listScheduledCommands when header clicked", () => {
    renderUI();
    const header = document.querySelector(".accordion-button")!;
    fireEvent.click(header);
  });

  it("calls startJob when Start button clicked", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("agentSubServiceStartBtn"));
    expect(baseProps.startJob).toHaveBeenCalledWith("host1", "8080");
  });

  it("calls stopJob when Stop clicked", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("agentSubServiceStopBtn"));
    expect(baseProps.stopJob).toHaveBeenCalled();
  });

  it("calls restartJob", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("restartAgentStatusId"));
    expect(baseProps.restartJob).toHaveBeenCalled();
  });

  it("calls upgradeAgent", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("agentSubServiceUpdateBtn"));
    expect(baseProps.upgradeAgent).toHaveBeenCalled();
  });

  it("calls checkAgentStatus", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("checkAgentStatusId"));
    expect(baseProps.checkAgentStatus).toHaveBeenCalled();
  });

  it("calls startAgentviaSSH", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("startAgentviaSSHId"));
    expect(baseProps.startAgentviaSSH).toHaveBeenCalled();
  });

  it("calls shutDownAgent", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("shutDownAgentId"));
    expect(baseProps.shutDownAgent).toHaveBeenCalled();
  });

  it("calls restartAgent", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("restartAgentId"));
    expect(baseProps.restartAgent).toHaveBeenCalled();
  });

 it("renders modal when versionDialogOpen true", async () => {
  renderUI("0", {
    versionDialogOpen: true,
    agentsVersion: {
      risebotVersions: [
        { version: "1.0.0", buildDate: "1700000000000" },
      ],
    },
  });
  const confirmBtn = await screen.findByTestId("agentSubServiceVersionControlBtn");
  expect(confirmBtn).toBeInTheDocument();
  expect(screen.getByText(/v 1.0.0/i)).toBeInTheDocument();
});


  it("calls handleSelectAgentVersion on version click", () => {
    renderUI("0", {
      versionDialogOpen: true,
      agentsVersion: {
        risebotVersions: [
          { version: "1.0.0", buildDate: "1700000000000" },
        ],
      },
    });

    fireEvent.click(screen.getByText(/v 1.0.0/i));
    expect(baseProps.handleSelectAgentVersion).toHaveBeenCalledWith("1.0.0");
  });

  it("calls agentVersionUpgrade on confirm", () => {
    renderUI("0", {
      versionDialogOpen: true,
      agentsVersion: {
        risebotVersions: [{ version: "1.0.0", buildDate: "1700000000000" }],
      },
    });

    fireEvent.click(screen.getByTestId("agentSubServiceVersionControlBtn"));
    expect(baseProps.agentVersionUpgrade).toHaveBeenCalled();
  });
});
