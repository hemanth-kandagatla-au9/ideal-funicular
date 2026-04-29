import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import BulkActionDetails from "../../../layouts/bulk-action-logs/components/BulkActionDetails";

describe("BulkActionDetails additional branches", () => {
  it("uses serverSummary fallback when not provided and filters Failure (no matches)", () => {
    const jobDetails = {
      jobId: "J3",
      status: "Partial",
      type: "agent_config_sync",
      user: "carol",
      createdAt: "2024-01-03T09:00:00Z",
      // no serverSummary provided
      servers: [
        { serverId: "s1", serverName: "one", status: "In Progress", message: "working" },
        { serverId: "s2", serverName: "two", status: "InProgress", message: "also" },
        { serverId: "s3", serverName: "three", status: "Success", message: "ok" },
      ],
    } as any;

    render((<BulkActionDetails jobDetails={jobDetails} loading={false} />) as any);

    // All servers visible initially
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();

    // Click Failure card (no servers have failure) -> should show no servers
    const failureNode = screen.getByText("Failure");
    fireEvent.click(failureNode);

    expect(screen.getByText("No servers available")).toBeInTheDocument();
  });
});
