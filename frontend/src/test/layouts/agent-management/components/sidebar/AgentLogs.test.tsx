/* eslint-disable testing-library/no-node-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Accordion } from "react-bootstrap";
import AgentLogs from "../../../../../layouts/agent-management/components/sidebar/AgentLogs";
import '@testing-library/jest-dom/extend-expect';
jest.mock("../../../../../layouts/agent-management/helpers/agentHelpers", () => ({
  convertDateTime: jest.fn(() => "Formatted Time"),
}));

describe("AgentLogs Component", () => {
  const baseProps = {
    hostname: "host1",
    agentId: "agent1",
    agentLog: [
      { timestamp: "123", level: "INFO", message: "Test log message" },
    ],
    isLogsLoading: false,
    loadAgentLogs: jest.fn(),
    refreshAgentLogs: jest.fn(),
    copyToClipboard: jest.fn(),
    logsBodyRef: React.createRef<HTMLUListElement>(),
  };

  const renderWithAccordion = (activeKey = "3", props = {}) => {
    return render(
      <Accordion defaultActiveKey={activeKey}>
        <AgentLogs {...baseProps} {...props} />
      </Accordion>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header title", () => {
    renderWithAccordion();

    expect(screen.getAllByText(/logs/i).length).toBeGreaterThan(0);
  });

  it("calls loadAgentLogs when header clicked", () => {
    renderWithAccordion();

    const headerButton = document.querySelector(".accordion-button")!;
    fireEvent.click(headerButton);

    expect(baseProps.loadAgentLogs).toHaveBeenCalledWith("host1", "agent1", "");
  });

  it("applies expanded class when open", () => {
    renderWithAccordion("3");

    const title = screen.getAllByText(/logs/i)[0];
    expect(title.className).toContain("titleCollapsed");
  });

  it("applies collapsed class when closed", () => {
    renderWithAccordion("1");

    const title = screen.getAllByText(/logs/i)[0];
    expect(title.className).toContain("nottitleCollapsed");
  });

  it("renders logs when not loading", () => {
    renderWithAccordion();

    expect(screen.getByText("Formatted Time")).toBeInTheDocument();
    expect(screen.getByText("| INFO | Test log message")).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    renderWithAccordion("3", { isLogsLoading: true });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("calls refreshAgentLogs when refresh button clicked", () => {
    renderWithAccordion();

    const refreshBtn = screen.getByTitle(/refresh/i);
    fireEvent.click(refreshBtn);

    expect(baseProps.refreshAgentLogs).toHaveBeenCalledWith("host1", "agent1", "");
  });

  it("calls copyToClipboard when copy button clicked", () => {
    renderWithAccordion();

    const copyBtn = screen.getByTitle(/copy/i);
    fireEvent.click(copyBtn);

    expect(baseProps.copyToClipboard).toHaveBeenCalledWith(baseProps.agentLog);
  });
});
