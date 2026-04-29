import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BulkActionDetails from "../../../layouts/bulk-action-logs/components/BulkActionDetails";

const makeJobDetailsWithStatuses = () => ({
  jobId: "JOB-2",
  type: "agent_config_sync",
  status: "Partial",
  user: "carol",
  createdAt: "2024-01-03T14:30:00Z",
  servers: [
    { serverId: "s1", serverName: "one", status: "Failed", message: "err" },
    { serverId: "s2", serverName: "two", status: "In Progress", message: "doing" },
    { serverId: "s3", serverName: "three", status: "Success", message: "ok" },
  ],
});

describe("BulkActionDetails extra status branches", () => {
  it("renders Failed and In Progress server statuses and filters InProgress", () => {
    const details = makeJobDetailsWithStatuses();
    render(<BulkActionDetails jobDetails={details as any} loading={false} />);

    // All servers initially present
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();

    // Click 'Failure' card to filter failed servers
    const failureCard = screen.getAllByText("Failure")[0];
    fireEvent.click(failureCard);

    // Only 'one' remains (Failed)
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.queryByText("two")).toBeNull();
    expect(screen.queryByText("three")).toBeNull();
  });
});
