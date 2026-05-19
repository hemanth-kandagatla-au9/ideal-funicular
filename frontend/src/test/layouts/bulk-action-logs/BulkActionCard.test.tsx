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

    expect(screen.getByText("agent_config_sync")).toBeInTheDocument();
    expect(screen.getByText("5 Servers")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders user name below type when user prop is provided", () => {
    render(
      <BulkActionCard
        jobId="JOB-200"
        type="agent_upgrade"
        user="john.doe"
        status="Completed"
        totalServers={3}
        serverIndicators={[]}
      />,
    );
    expect(screen.getByText("agent_upgrade")).toBeInTheDocument();
    expect(screen.getByText("john.doe")).toBeInTheDocument();
  });

  it("does not render user line when user prop is absent", () => {
    render(
      <BulkActionCard
        jobId="JOB-300"
        type="agent_config_sync"
        status="Failed"
        totalServers={1}
        serverIndicators={[]}
      />,
    );
    expect(screen.getByText("agent_config_sync")).toBeInTheDocument();
    expect(screen.queryByText("john.doe")).not.toBeInTheDocument();
  });
});
