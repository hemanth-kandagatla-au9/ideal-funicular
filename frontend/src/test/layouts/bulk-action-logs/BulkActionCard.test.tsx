import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BulkActionCard from "../../../layouts/bulk-action-logs/components/BulkActionCard";

describe("BulkActionCard component", () => {
  it("renders job info and indicators and responds to click", () => {
    const onClick = jest.fn();

    render(
      <BulkActionCard
        jobId="JOB-123"
        type="agent_config_sync"
        status="Completed"
        totalServers={5}
        serverIndicators={[
          { color: "success", count: 2 },
          { color: "failed", count: 3 },
        ]}
        isActive
        onClick={onClick}
      />,
    );

    expect(screen.getByText("JOB-123")).toBeInTheDocument();
    expect(screen.getByText("agent_config_sync")).toBeInTheDocument();
    expect(screen.getByText("5 Servers")).toBeInTheDocument();
    // indicator counts
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    fireEvent.click(screen.getByText("JOB-123"));
    expect(onClick).toHaveBeenCalled();
  });
});
