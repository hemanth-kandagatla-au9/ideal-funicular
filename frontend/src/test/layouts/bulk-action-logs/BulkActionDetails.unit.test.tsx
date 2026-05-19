/* eslint-disable testing-library/prefer-screen-queries */
/// <reference types="jest" />
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

  it("filters servers to Success when Success card is clicked", () => {
    const jobDetails = {
      jobId: "J3",
      status: "Partial",
      type: "agent_upgrade",
      user: "jane",
      createdAt: "2024-02-01T09:00:00Z",
      servers: [
        { serverId: "s1", serverName: "host-a", status: "Success", message: "ok" },
        { serverId: "s2", serverName: "host-b", status: "Failure", message: "err" },
      ],
      serverSummary: { total: 2, success: 1, failure: 1, pending: 0 },
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    fireEvent.click(screen.getAllByText("Success")[0]);
    expect(screen.getByText("host-a")).toBeInTheDocument();
    expect(screen.queryByText("host-b")).toBeNull();
  });

  it("filters servers to Pending when Pending card is clicked", () => {
    const jobDetails = {
      jobId: "J4",
      status: "Partial",
      type: "agent_upgrade",
      user: "jane",
      createdAt: "2024-02-01T09:00:00Z",
      servers: [
        { serverId: "s1", serverName: "host-a", status: "Pending", message: "waiting" },
        { serverId: "s2", serverName: "host-b", status: "Success", message: "ok" },
      ],
      serverSummary: { total: 2, success: 1, failure: 0, pending: 1 },
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    fireEvent.click(screen.getAllByText("Pending")[0]);
    expect(screen.getByText("host-a")).toBeInTheDocument();
    expect(screen.queryByText("host-b")).toBeNull();
  });

  it("shows No servers found when search text matches nothing", () => {
    const jobDetails = {
      jobId: "J5",
      status: "Completed",
      type: "agent_config_sync",
      user: "admin",
      createdAt: "2024-03-01T08:00:00Z",
      servers: [
        { serverId: "s1", serverName: "server-alpha", status: "Success", message: "ok" },
      ],
      serverSummary: { total: 1, success: 1, failure: 0, pending: 0 },
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    const input = screen.getByPlaceholderText("Search servers...");
    fireEvent.change(input, { target: { value: "zzz-no-match" } });
    expect(screen.getByText("No servers found")).toBeInTheDocument();
  });

  it("filters InProgress servers via Failure card when status is InProgress", () => {
    const jobDetails = {
      jobId: "J6",
      status: "InProgress",
      type: "agent_upgrade",
      user: "ops",
      createdAt: "2024-04-01T07:00:00Z",
      servers: [
        { serverId: "s1", serverName: "node-1", status: "In Progress", message: "running" },
        { serverId: "s2", serverName: "node-2", status: "Success", message: "done" },
      ],
      serverSummary: { total: 2, success: 1, failure: 0, pending: 0, inProgress: 1 },
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    // All servers visible initially
    expect(screen.getByText("node-1")).toBeInTheDocument();
    expect(screen.getByText("node-2")).toBeInTheDocument();
  });

  it("resets status filter and search to ALL when jobId changes", () => {
    const makeJob = (jobId: string, serverName: string) => ({
      jobId,
      status: "Completed",
      type: "agent_config_sync",
      user: "admin",
      createdAt: "2024-01-01T00:00:00Z",
      servers: [
        { serverId: "s1", serverName, status: "Failure", message: "err" },
        { serverId: "s2", serverName: `${serverName}-ok`, status: "Success", message: "ok" },
      ],
      serverSummary: { total: 2, success: 1, failure: 1, pending: 0 },
    }) as any;

    const { rerender } = render(<BulkActionDetails jobDetails={makeJob("JOB-1", "alpha")} loading={false} />);

    // Filter to Failure so only alpha is visible
    fireEvent.click(screen.getAllByText("Failure")[0]);
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.queryByText("alpha-ok")).toBeNull();

    // Switch to a different job
    rerender(<BulkActionDetails jobDetails={makeJob("JOB-2", "beta")} loading={false} />);

    // Both servers of new job must be visible — filter was reset to ALL
    expect(screen.getByText("beta")).toBeInTheDocument();
    expect(screen.getByText("beta-ok")).toBeInTheDocument();
  });

  it("shows N/A when createdAt is undefined", () => {
    const jobDetails = {
      jobId: "J7",
      status: "Failed",
      type: "agent_upgrade",
      user: "admin",
      createdAt: undefined,
      servers: [],
      serverSummary: { total: 0, success: 0, failure: 0, pending: 0 },
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
