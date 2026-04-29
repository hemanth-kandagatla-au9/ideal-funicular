import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BulkActionDetails from "../../../layouts/bulk-action-logs/components/BulkActionDetails";

const makeJobDetailsNoSummary = () => ({
  jobId: "JOB-3",
  type: "agent_config_sync",
  status: "Completed",
  user: "dave",
  // no T in createdAt -> should not include time portion
  createdAt: "Jan 03, 2024",
  servers: [
    { serverId: "s1", serverName: "a", status: "Success", message: "ok" },
    { serverId: "s2", serverName: "b", status: "Pending", message: "wait" },
  ],
});

describe("BulkActionDetails additional branches", () => {
  it("formats createdAt without time and uses server list when serverSummary missing", () => {
    const details = makeJobDetailsNoSummary();
    render(<BulkActionDetails jobDetails={details as any} loading={false} />);

    // Created At should render the provided string (formatDateTime fallback)
    expect(screen.getByText(/Jan 03, 2024/)).toBeInTheDocument();

    // Total servers should be derived from servers length -> shows '02'
    expect(screen.getByText("02")).toBeInTheDocument();

    // Click Success card should filter to server 'a'
    const successCard = screen.getAllByText("Success")[0];
    fireEvent.click(successCard);

    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.queryByText("b")).toBeNull();
  });
});
