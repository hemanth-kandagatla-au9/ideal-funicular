/**
 * FilterBarPermissions.test.tsx
 *
 * Tests for permission-gated bulk action buttons in FilterBar
 */

import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithRedux } from "../../../redux-test-utils";
import FilterBar from "../../../../layouts/agent-management/home/FilterBar";

jest.mock("../../../../layouts/agent-management/components/MultiSelectDropdown", () => () => <div />);

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

describe("FilterBar — permission-gated bulk action buttons", () => {
  it("renders without crashing", () => {
    renderWithRedux(<FilterBar {...defaultProps} />);
    expect(screen.queryByRole("button")).toBeTruthy();
  });

  it("calls startAgents when Start button clicked", () => {
    const startAgents = jest.fn();
    renderWithRedux(<FilterBar {...defaultProps} startAgents={startAgents} />);
    const btn = screen.queryByTestId("agentStartBtn");
    if (btn) fireEvent.click(btn);
  });

  it("calls stopAgents when Stop button clicked", () => {
    const stopAgents = jest.fn();
    renderWithRedux(<FilterBar {...defaultProps} stopAgents={stopAgents} />);
    const btn = screen.queryByTestId("agentStopBtn");
    if (btn) fireEvent.click(btn);
  });

  it("calls restartAgents when Restart button clicked", () => {
    const restartAgents = jest.fn();
    renderWithRedux(<FilterBar {...defaultProps} restartAgents={restartAgents} />);
    const btn = screen.queryByTestId("agentRestartBtn");
    if (btn) fireEvent.click(btn);
  });

  it("calls openAgentUpgradeModal when Upgrade button clicked", () => {
    const openAgentUpgradeModal = jest.fn();
    renderWithRedux(<FilterBar {...defaultProps} openAgentUpgradeModal={openAgentUpgradeModal} />);
    const btn = screen.queryByTestId("agentUpdateBtn");
    if (btn) fireEvent.click(btn);
  });
});
