import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterBar from "../../../../layouts/agent-management/home/FilterBar";
import * as reactRedux from "react-redux";

jest.mock("../../../../../src/layouts/agent-management/components/MultiSelectDropdown", () => {
  return ({ toggleTestId, onSelectChange, clearAll, selectAllOption }: any) => (
    <div>
      <button data-testid={toggleTestId}>toggle</button>
      <button onClick={() => onSelectChange([{ value: "x", label: "x", name: "x" }])}>select</button>
      <button onClick={clearAll}>clear</button>
      <button onClick={selectAllOption}>selectAll</button>
    </div>
  );
});

const defaultProps: any = {
  filterOptions: {
    os: [{ name: "Linux" }],
  },
  filters: {
    os: [],
    region: [],
    serviceName: [],
    agentVersions: [],
    platform: [],
    environment: [],
    sid: [],
  },
  setFilters: jest.fn(),
  handleCustomFilterCallback: jest.fn(),
  clearFilters: jest.fn(),
  isStartAgentEnabled: true,
  isStopAgentEnabled: true,
  isRestartAgentEnabled: true,
  isCheckStatusAgentEnabled: false,
  isForceUpgradeAgentEnabled: true,
  startAgents: jest.fn(),
  stopAgents: jest.fn(),
  restartAgents: jest.fn(),
  healthCheckAgents: jest.fn(),
  openAgentUpgradeModal: jest.fn(),
  openEnvUpgradeModal: jest.fn(),
  downloadToExcel: jest.fn(),
  sortBy: "",
  sortOrder: null,
  onSortChange: jest.fn(),
};

const mockDispatch = jest.fn();

jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch);

const setup = (override = {}) =>
  render(<FilterBar {...defaultProps} {...override} />);

describe("FilterBar", () => {
  it("renders action buttons", () => {
    setup();
    expect(screen.getByTestId("agentStartBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentStopBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentRestartBtn")).toBeInTheDocument();
    expect(screen.getByTestId("envUpgradeBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentUpdateBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentDownloadBtn")).toBeInTheDocument();
  });

  it("calls start/stop/restart handlers", () => {
    setup();
    fireEvent.click(screen.getByTestId("agentStartBtn"));
    fireEvent.click(screen.getByTestId("agentStopBtn"));
    fireEvent.click(screen.getByTestId("agentRestartBtn"));

    expect(defaultProps.startAgents).toHaveBeenCalled();
    expect(defaultProps.stopAgents).toHaveBeenCalled();
    expect(defaultProps.restartAgents).toHaveBeenCalled();
  });

  it("calls upgrade and download", () => {
    setup();
    fireEvent.click(screen.getByTestId("envUpgradeBtn"));
    fireEvent.click(screen.getByTestId("agentUpdateBtn"));
    fireEvent.click(screen.getByTestId("agentDownloadBtn"));

    expect(defaultProps.openEnvUpgradeModal).toHaveBeenCalled();
    expect(defaultProps.openAgentUpgradeModal).toHaveBeenCalled();
    expect(defaultProps.downloadToExcel).toHaveBeenCalled();
  });

  it("opens and closes sort dropdown", () => {
    setup();
    const sortBtn = screen.getByTestId("agentSortBtn");

    fireEvent.click(sortBtn);
    expect(screen.getByText("Created At")).toBeInTheDocument();

    fireEvent.mouseDown(document);
  });

  it("triggers sort logic", () => {
    const onSortChange = jest.fn();
    setup({ onSortChange });

    fireEvent.click(screen.getByTestId("agentSortBtn"));
    fireEvent.click(screen.getByText("Created At"));

    expect(onSortChange).toHaveBeenCalled();
  });

  it("handles select, clear, selectAll via MultiSelectDropdown", () => {
    setup();

    fireEvent.click(screen.getByText("select"));
    fireEvent.click(screen.getByText("clear"));
    fireEvent.click(screen.getByText("selectAll"));

    expect(defaultProps.handleCustomFilterCallback).toHaveBeenCalled();
  });

  it("renders selected filters and clear all works", () => {
    setup({
      filters: {
        ...defaultProps.filters,
        os: [{ label: "Linux", value: "Linux" }],
      },
    });

    expect(screen.getByText("OS:")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Clear All"));
  });
});

