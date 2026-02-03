import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import JobLogsModal from "../../../../layouts/agent-management/components/JobLogsModal";

jest.mock("@/constants/strings", () => ({
  closeButtonText: "Close",
  copyToClipboardButtonText: "Copy",
  jobLogsTitle: "Job Logs",
  loadingText: "Loading...",
  logDetailsTitle: "Log Details",
  refreshLogsButtonText: "Refresh",
}));
jest.mock("@/layouts/agent-management/helpers/agentHelpers", () => ({
  convertDateTime: jest.fn(ts => `formatted-${ts}`),
}));

describe("JobLogsModal", () => {
  const mockRefresh = jest.fn();
  const mockCopy = jest.fn();
  const mockClose = jest.fn();

  const baseProps = {
    open: true,
    onClose: jest.fn(),
    onCancelButtonClick: mockClose,
    refreshAgentLogs: mockRefresh,
    copyToClipboard: mockCopy,
    hostname: "host1",
    agentId: "agent1",
    jobsLogRef: { current: null },
    state: {
      isLogsLoading: false,
      agentLog: [
        {
          timestamp: "123",
          level: "INFO",
          message: "Test log message",
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal title", () => {
    render(<JobLogsModal {...baseProps} />);
    expect(screen.getByText("Job Logs")).toBeInTheDocument();
  });

  it("renders logs when not loading", () => {
    render(<JobLogsModal {...baseProps} />);

    expect(screen.getByText("formatted-123")).toBeInTheDocument();
    expect(screen.getByText("| INFO | Test log message")).toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    render(<JobLogsModal {...baseProps} state={{ isLogsLoading: true, agentLog: [] }} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("calls refreshAgentLogs when refresh clicked", () => {
    render(<JobLogsModal {...baseProps} />);

    const refreshBtn = screen.getByTitle("Refresh");
    fireEvent.click(refreshBtn);

    expect(mockRefresh).toHaveBeenCalledWith("host1", "agent1", "");
  });

  it("calls copyToClipboard when copy clicked", () => {
    render(<JobLogsModal {...baseProps} />);

    const copyBtn = screen.getByTitle("Copy");
    fireEvent.click(copyBtn);

    expect(mockCopy).toHaveBeenCalledWith(baseProps.state.agentLog);
  });

  it("calls onCancelButtonClick when close clicked", () => {
    render(<JobLogsModal {...baseProps} />);

    fireEvent.click(screen.getByText("Close"));

    expect(mockClose).toHaveBeenCalled();
  });
});
