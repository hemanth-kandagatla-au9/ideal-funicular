import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideBar from "../../../../src/layouts/agent-management/components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";


jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((selector) => selector({
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
  })),
}));

jest.mock("../../../../src/utils/hooks/useAgentPermissions", () => ({
  __esModule: true,
  default: () => ({
    hasPermission: () => true,
    loading: false,
    permissions: []
  })
}));

jest.mock("../../../../src/utils/PermissionUtils", () => ({
  canAccess: jest.fn(() => true),
}));

jest.mock("../../../../src/layouts/agent-management/components/DeleteModal", () => (props: any) =>
  props.open ? <div>DeleteModal Open</div> : null
);

jest.mock("../../../../src/layouts/agent-management/components/JobLogsModal", () => (props: any) =>
  props.open ? <div>JobLogsModal Open</div> : null
);

jest.mock("../../../../src/layouts/agent-management/components/LocalConfigModal", () => () => (
  <div>LocalConfigModal</div>
));

jest.mock("../../../../src/layouts/agent-management/components/SchedulerDialog", () => () => (
  <div>SchedulerDialog</div>
));

jest.mock("../../../../src/layouts/agent-management/components/sidebar/AgentTasks", () => () => (
  <div>AgentTasks</div>
));
jest.mock("../../../../src/layouts/agent-management/components/sidebar/AgentDetails", () => () => (
  <div>AgentDetails</div>
));
jest.mock("../../../../src/layouts/agent-management/components/sidebar/AgentConfiguration", () => () => (
  <div>AgentConfiguration</div>
));
jest.mock("../../../../src/layouts/agent-management/components/sidebar/AgentLogs", () => () => (
  <div>AgentLogs</div>
));

jest.mock("../../../../src/services/agent/agentManagement.service", () => ({
  fetchAgentLogs: jest.fn(() =>
    Promise.resolve({
      data: { data: [] },
    })
  ),
}));

jest.mock("../../../layouts/agent-management/helpers/agentHelpers", () => ({
  errortoast: jest.fn(),
  successtoast: jest.fn(),
}));

jest.mock("../../../../src/constants/strings", () => ({
  viewDetailsTitle: "View Details",
}));

jest.mock("../../../../src/layouts/agent-management/helpers/agentHelpers", () => ({
  prepareAgentDetails: jest.fn(() => ({})),
  prepareAgentConfigDetails: jest.fn(() => ({})),
}));


const mockDispatch = jest.fn();

const defaultSelectors = {
  getAgentGlobalConfig: {},
  isJobReload: false,
  isServiceLoading: false,
  isAgentDetailsLoading: false,
  isSchedulerLoading: false,
  isLocalConfigReload: false,
  getRepositories: {},
  listScheduledJob: [],
  fetchScheduledJobsByCommandId: {},
  getAgentInfo: {},
};

(useSelector as jest.Mock).mockImplementation((selector) => {
  return selector(defaultSelectors);
});

(useDispatch as jest.Mock).mockReturnValue(mockDispatch);


describe("SideBar", () => {
  const baseProps = {
    open: true,
    setOpenSidebar: jest.fn(),
    openBar: false,
    configureModal: false,
    agentSelected: {
      hostname: "test-host",
      risebotProperties: {},
      agent_details: {},
    },
    port: "8080",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sidebar with title", () => {
    render(<SideBar {...baseProps} />);

    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    expect(screen.getByText(/TEST-HOST/i)).toBeInTheDocument();
  });

  it("renders child accordion components", () => {
    render(<SideBar {...baseProps} />);

    expect(screen.getByText("AgentTasks")).toBeInTheDocument();
    expect(screen.getByText("AgentDetails")).toBeInTheDocument();
    expect(screen.getByText("AgentConfiguration")).toBeInTheDocument();
    expect(screen.getByText("AgentLogs")).toBeInTheDocument();
  });

  it("calls setOpenSidebar when closed", () => {
    const setOpenSidebar = jest.fn();

    render(<SideBar {...baseProps} setOpenSidebar={setOpenSidebar} />);

    fireEvent.click(document.querySelector("button.btn-close")!);

    expect(setOpenSidebar).toHaveBeenCalledWith(false);
  });

  it("renders LocalConfigModal and SchedulerDialog safely", () => {
    render(<SideBar {...baseProps} />);

    expect(screen.getByText("LocalConfigModal")).toBeInTheDocument();
    expect(screen.getByText("SchedulerDialog")).toBeInTheDocument();
  });
});
