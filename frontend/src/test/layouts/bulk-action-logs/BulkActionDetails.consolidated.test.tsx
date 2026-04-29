import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import RightPanel from "../../../layouts/bulk-action-logs/components/BulkActionDetails";

describe("BulkActionDetails consolidated behavior", () => {
  it("shows loading spinner when loading prop is true", () => {
    render((<RightPanel jobDetails={null} loading={true} />) as any);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows placeholder when no job selected", () => {
    render((<RightPanel jobDetails={null} />) as any);
    expect(screen.getByText("Select a job to view details")).toBeInTheDocument();
  });

  it("formats createdAt with and without time correctly", () => {
    const jobNoTime = { jobId: "J1", status: "Success", type: "T", user: "U", createdAt: "2023-01-02", servers: [] };
    const { rerender } = render((<RightPanel jobDetails={jobNoTime} />) as any);
    // Date string should render (month abbreviation present) and no time separator
    expect(screen.getByText(/Jan/)).toBeInTheDocument();
    expect(screen.queryByText(/\|/)).not.toBeInTheDocument();

    const jobWithTime = { ...jobNoTime, createdAt: "2023-01-02T12:34:00Z" };
    rerender((<RightPanel jobDetails={jobWithTime} />) as any);
    // Now time separator '|' should be present
    expect(screen.getByText(/\|/)).toBeInTheDocument();
  });

  it("renders servers and filters by card click and search", () => {
    const job = {
      jobId: "J2",
      status: "Success",
      type: "bulk",
      user: "me",
      createdAt: "2023-01-02T12:34:00Z",
      servers: [
        { serverId: "s1", serverName: "srv-one", status: "Success", message: "ok" },
        { serverId: "s2", serverName: "srv-two", status: "Failed", message: "bad" },
        { serverId: "s3", serverName: "srv-three", status: "Pending", message: "wait" },
      ],
    } as any;

    render((<RightPanel jobDetails={job} />) as any);

    // All servers present initially
    expect(screen.getByText("srv-one")).toBeInTheDocument();
    expect(screen.getByText("srv-two")).toBeInTheDocument();
    expect(screen.getByText("srv-three")).toBeInTheDocument();

    // Click Failure card to filter failures (should include 'Failed')
    fireEvent.click(screen.getByText("Failure"));
    expect(screen.queryByText("srv-one")).not.toBeInTheDocument();
    expect(screen.getByText("srv-two")).toBeInTheDocument();

    // Clear filter by clicking Total (ALL)
    fireEvent.click(screen.getByText("Total Servers"));
    expect(screen.getByText("srv-one")).toBeInTheDocument();

    // Use search to filter
    const input = screen.getByPlaceholderText("Search servers...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "three" } });
    expect(screen.getByText("srv-three")).toBeInTheDocument();
    expect(screen.queryByText("srv-one")).not.toBeInTheDocument();

    // No match shows 'No servers found'
    fireEvent.change(input, { target: { value: "nomatch" } });
    expect(screen.getByText("No servers found")).toBeInTheDocument();
  });

  it("shows 'No servers available' when job has no servers", () => {
    const jobEmpty = { jobId: "J3", status: "Pending", type: "t", user: "u", createdAt: "2023-01-01T00:00:00Z", servers: [] };
    render((<RightPanel jobDetails={jobEmpty as any} />) as any);
    expect(screen.getByText("No servers available")).toBeInTheDocument();
  });
});
