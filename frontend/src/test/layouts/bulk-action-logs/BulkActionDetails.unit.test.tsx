/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import BulkActionDetails from "../../../layouts/bulk-action-logs/components/BulkActionDetails";

describe("BulkActionDetails component", () => {
  it("renders loading state", () => {
    const { getByRole } = render((<BulkActionDetails jobDetails={null} loading />) as any);
    expect(getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders empty placeholder when no job selected", () => {
    render((<BulkActionDetails jobDetails={null} loading={false} />) as any);
    expect(screen.getByText("Select a job to view details")).toBeInTheDocument();
  });

  it("renders job details, supports search and status filter", () => {
    const jobDetails = {
      jobId: "J1",
      status: "Completed",
      type: "agent_config_sync",
      user: "admin",
      createdAt: "2024-01-01T10:00:00Z",
      servers: [
        { serverId: "s1", serverName: "alpha", status: "Success", message: "ok", completedAt: "2024-01-01T10:10:00Z" },
        { serverId: "s2", serverName: "beta", status: "Failure", message: "err", completedAt: "2024-01-01T10:20:00Z" },
        { serverId: "s3", serverName: "gamma", status: "In Progress", message: "working", completedAt: "" },
      ],
      serverSummary: { success: 1, pending: 0, failure: 1, inProgress: 1, total: 3 },
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    // Header data
    expect(screen.getByText(/JOB ID : J1/)).toBeInTheDocument();
    expect(screen.getByText("agent_config_sync")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();

    // All servers present
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();
    expect(screen.getByText("gamma")).toBeInTheDocument();

    // Search filters servers
    const input = screen.getByPlaceholderText("Search servers...");
    fireEvent.change(input, { target: { value: "alp" } });
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.queryByText("beta")).toBeNull();

    // Clear search
    fireEvent.change(input, { target: { value: "" } });

    // Click Failure card to filter
    const failureNodes = screen.getAllByText("Failure");
    fireEvent.click(failureNodes[0]);

    // Now only beta (Failure) should be present
    expect(screen.getByText("beta")).toBeInTheDocument();
    expect(screen.queryByText("alpha")).toBeNull();
  });

  it("shows no servers available and formats createdAt without time", () => {
    const jobDetails = {
      jobId: "J2",
      status: "Pending",
      type: "agent_upgrade",
      user: "bob",
      createdAt: "2024-01-02",
      servers: [],
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    // Should show no servers available
    expect(screen.getByText("No servers available")).toBeInTheDocument();

    // Created At should not include a time separator when no 'T' in date
    const createdAtNode = screen.getByText((content, node) => content.includes("2024") && !content.includes("|"));
    expect(createdAtNode).toBeInTheDocument();
  });
});
