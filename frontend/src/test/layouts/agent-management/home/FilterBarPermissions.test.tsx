/**
 * FilterBarPermissions.test.tsx
 *
 * Tests for permission-gated bulk action buttons in FilterBar:
 *  - Start, Stop, Restart, Force Upgrade hidden when false
 *  - Start, Stop, Restart, Force Upgrade visible when true
 *  - Independent — disabling one does not affect others
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterBar from "../../../../layouts/agent-management/home/FilterBar";

// ─── mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../../layouts/agent-management/components/MultiSelectDropdown", () => () => <div />);

// ─── fixture ─────────────────────────────────────────────────────────────────

const defaultProps = {
  filterOptions: {},
  filters: {} as any,
  setFilters: jest.fn(),
  handleCustomFilterCallback: jest.fn(),
  clearFilters: jest.fn(),
  isStartAgentEnabled: true,
  isStopAgentEnabled: true,
  isRestartAgentEnabled: true,
  isCheckStatusAgentEnabled: true,
  isForceUpgradeAgentEnabled: true,
  startAgents: jest.fn(),
  stopAgents: jest.fn(),
  restartAgents: jest.fn(),
  healthCheckAgents: jest.fn(),
  openAgentUpgradeModal: jest.fn(),
  openEnvUpgradeModal: jest.fn(),
  syncAgentConfig: jest.fn(),
  downloadToExcel: jest.fn(),
  sortBy: "",
  sortOrder: null,
  onSortChange: jest.fn(),
};

// ─── tests ───────────────────────────────────────────────────────────────────

describe("FilterBar — permission-gated bulk action buttons", () => {

  // ── Start ──────────────────────────────────────────────────────────────────

  it("shows Start button when isStartAgentEnabled is true", () => {
    render(<FilterBar {...defaultProps} isStartAgentEnabled={true} />);
    expect(screen.getByTestId("agentStartBtn")).toBeInTheDocument();
  });

  it("hides Start button when isStartAgentEnabled is false", () => {
    render(<FilterBar {...defaultProps} isStartAgentEnabled={false} />);
    expect(screen.queryByTestId("agentStartBtn")).not.toBeInTheDocument();
  });

  // ── Stop ───────────────────────────────────────────────────────────────────

  it("shows Stop button when isStopAgentEnabled is true", () => {
    render(<FilterBar {...defaultProps} isStopAgentEnabled={true} />);
    expect(screen.getByTestId("agentStopBtn")).toBeInTheDocument();
  });

  it("hides Stop button when isStopAgentEnabled is false", () => {
    render(<FilterBar {...defaultProps} isStopAgentEnabled={false} />);
    expect(screen.queryByTestId("agentStopBtn")).not.toBeInTheDocument();
  });

  // ── Restart ────────────────────────────────────────────────────────────────

  it("shows Restart button when isRestartAgentEnabled is true", () => {
    render(<FilterBar {...defaultProps} isRestartAgentEnabled={true} />);
    expect(screen.getByTestId("agentRestartBtn")).toBeInTheDocument();
  });

  it("hides Restart button when isRestartAgentEnabled is false", () => {
    render(<FilterBar {...defaultProps} isRestartAgentEnabled={false} />);
    expect(screen.queryByTestId("agentRestartBtn")).not.toBeInTheDocument();
  });

  // ── Force Upgrade ──────────────────────────────────────────────────────────

  it("shows Force Upgrade button when isForceUpgradeAgentEnabled is true", () => {
    render(<FilterBar {...defaultProps} isForceUpgradeAgentEnabled={true} />);
    expect(screen.getByTestId("agentUpdateBtn")).toBeInTheDocument();
  });

  it("hides Force Upgrade button when isForceUpgradeAgentEnabled is false", () => {
    render(<FilterBar {...defaultProps} isForceUpgradeAgentEnabled={false} />);
    expect(screen.queryByTestId("agentUpdateBtn")).not.toBeInTheDocument();
  });

  // ── All disabled ───────────────────────────────────────────────────────────

  it("hides all 4 permission-gated buttons when all flags are false", () => {
    render(
      <FilterBar
        {...defaultProps}
        isStartAgentEnabled={false}
        isStopAgentEnabled={false}
        isRestartAgentEnabled={false}
        isForceUpgradeAgentEnabled={false}
      />
    );
    expect(screen.queryByTestId("agentStartBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentStopBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentRestartBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("agentUpdateBtn")).not.toBeInTheDocument();
  });

  // ── Independence ───────────────────────────────────────────────────────────

  it("hides only start, shows others when only isStartAgentEnabled is false", () => {
    render(<FilterBar {...defaultProps} isStartAgentEnabled={false} />);
    expect(screen.queryByTestId("agentStartBtn")).not.toBeInTheDocument();
    expect(screen.getByTestId("agentStopBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentRestartBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentUpdateBtn")).toBeInTheDocument();
  });

  it("hides only stop, shows others when only isStopAgentEnabled is false", () => {
    render(<FilterBar {...defaultProps} isStopAgentEnabled={false} />);
    expect(screen.getByTestId("agentStartBtn")).toBeInTheDocument();
    expect(screen.queryByTestId("agentStopBtn")).not.toBeInTheDocument();
    expect(screen.getByTestId("agentRestartBtn")).toBeInTheDocument();
    expect(screen.getByTestId("agentUpdateBtn")).toBeInTheDocument();
  });

  // ── Click handlers ─────────────────────────────────────────────────────────

  it("calls startAgents when Start button is clicked", () => {
    const startAgents = jest.fn();
    render(<FilterBar {...defaultProps} startAgents={startAgents} />);
    fireEvent.click(screen.getByTestId("agentStartBtn"));
    expect(startAgents).toHaveBeenCalledTimes(1);
  });

  it("calls stopAgents when Stop button is clicked", () => {
    const stopAgents = jest.fn();
    render(<FilterBar {...defaultProps} stopAgents={stopAgents} />);
    fireEvent.click(screen.getByTestId("agentStopBtn"));
    expect(stopAgents).toHaveBeenCalledTimes(1);
  });

  it("calls restartAgents when Restart button is clicked", () => {
    const restartAgents = jest.fn();
    render(<FilterBar {...defaultProps} restartAgents={restartAgents} />);
    fireEvent.click(screen.getByTestId("agentRestartBtn"));
    expect(restartAgents).toHaveBeenCalledTimes(1);
  });

  it("calls openAgentUpgradeModal when Force Upgrade button is clicked", () => {
    const openAgentUpgradeModal = jest.fn();
    render(<FilterBar {...defaultProps} openAgentUpgradeModal={openAgentUpgradeModal} />);
    fireEvent.click(screen.getByTestId("agentUpdateBtn"));
    expect(openAgentUpgradeModal).toHaveBeenCalledTimes(1);
  });
});
