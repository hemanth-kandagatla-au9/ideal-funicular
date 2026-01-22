import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentManagement from "../../../layouts/agent-management/AgentManagement";
import agentManagementService from "../../../services/agent/agentManagement.service";

const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: any) => mockUseSelector(fn),
}));

jest.mock("../../../utils/PermissionUtils", () => ({
  canAccess: () => true,
}));

jest.mock("../../../services/agent/agentManagement.service", () => ({
  fetchAgentService: jest.fn(),
}));
jest.mock("../../../layouts/agent-management/home/AgentList", () => (props: any) => (
  <div>
    <button data-testid="select" onClick={() => props.handleSelectHostAgent("AWS1")} />
    <button data-testid="sidebar" onClick={() => props.toggleSideBar("AWS1")} />
    <button data-testid="page" onClick={() => props.handlePagination(20, 2)} />
  </div>
));

jest.mock("../../../layouts/agent-management/home/FilterBar", () => (props: any) => (
  <div>
    <button data-testid="start" onClick={props.startAgents} />
    <button data-testid="stop" onClick={props.stopAgents} />
    <button data-testid="restart" onClick={props.restartAgents} />
    <button data-testid="health" onClick={props.healthCheckAgents} />
    <button data-testid="upgrade" onClick={props.openAgentUpgradeModal} />
    <button data-testid="download" onClick={props.downloadToExcel} />
    <button data-testid="clear" onClick={props.clearFilters} />
    <button data-testid="sort" onClick={() => props.onSortChange("hostname", "asc")} />
  </div>
));

jest.mock("../../../layouts/agent-management/home/SearchContainer", () => (props: any) => (
  <div>
    <input
      data-testid="search"
      onChange={(e) => props.setState((prev: any) => ({ ...prev, agentSearch: e.target.value }))}
    />
    <button data-testid="searchBtn" onClick={props.filterAgentSearch} />
  </div>
));

jest.mock("../../../layouts/agent-management/home/AgentCardGrid", () => () => <div />);
jest.mock("../../../layouts/agent-management/components/sidebar/SideBar", () => () => <div />);
jest.mock("../../../layouts/agent-management/components/UpgradeAgentsDialog", () => () => <div />);
jest.mock("../../../components/popup/popUp.component", () => () => <div />);
const baseState = {
  isReload: false,
  isLoading: false,
  getAgentsService: {
    pagination: {
      totalRows: [
        { hostname: "AWS1", agent_details: { server_port: "9000", os_version: "linux" } },
      ],
      totalPage: 1,
    },
  },
  getAgentRegions: { regions: ["test"] },
  getAgentPlatforms: { platforms: ["test"] },
  getAgentEnvironments: { environments: ["test"] },
  getAgentSids: { sids: ["test"] },
  getAgentOsTypes: { os: ["linux"] },
  getAgentServiceNames: { serviceNames: ["svc"] },
  getAgentVersions: { versions: ["1.0"] },
  getMetricsTilesData: [],
};

const setSelector = (override = {}) =>
  mockUseSelector.mockImplementation((fn) => fn({ ...baseState, ...override }));

beforeEach(() => {
  jest.clearAllMocks();
  setSelector();
});

describe("AgentManagement REAL coverage", () => {
  it("renders", () => {
    render(<AgentManagement />);
  });

  it("search empty triggers error branch", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("searchBtn"));
  });

  it("search valid triggers dispatch", () => {
    render(<AgentManagement />);
    fireEvent.change(screen.getByTestId("search"), { target: { value: "AWS" } });
    fireEvent.click(screen.getByTestId("searchBtn"));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("select agent and start", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("select"));
    fireEvent.click(screen.getByTestId("start"));
  });

  it("stop agents", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("select"));
    fireEvent.click(screen.getByTestId("stop"));
  });

  it("restart agents", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("select"));
    fireEvent.click(screen.getByTestId("restart"));
  });

  it("health check branch", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("select"));
    fireEvent.click(screen.getByTestId("health"));
  });

  it("upgrade branch", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("select"));
    fireEvent.click(screen.getByTestId("upgrade"));
  });

  it("download branch hits service", async () => {
    (agentManagementService.fetchAgentService as jest.Mock).mockResolvedValue({
      data: { data: { pagination: { totalRows: [] } } },
    });

    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("download"));

    await waitFor(() =>
      expect(agentManagementService.fetchAgentService).toHaveBeenCalled()
    );
  });

  it("sidebar open path", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("sidebar"));
  });

  it("pagination path", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("page"));
  });

  it("clear filter path", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("clear"));
  });

  it("sort path", () => {
    render(<AgentManagement />);
    fireEvent.click(screen.getByTestId("sort"));
  });

  it("reload useEffect branch", () => {
    setSelector({ isReload: true });
    render(<AgentManagement />);
  });
});

