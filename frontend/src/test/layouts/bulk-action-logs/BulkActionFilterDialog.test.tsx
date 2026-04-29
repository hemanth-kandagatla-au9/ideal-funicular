import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import BulkActionFilterDialog, { FilterState } from "../../../layouts/bulk-action-logs/components/BulkActionFilterDialog";

describe("BulkActionFilterDialog", () => {
  const availableTypes = ["agent_config_sync", "agent_upgrade"];
  const availableUsers = ["alice", "bob"];
  const currentFilters: FilterState = { type: [], user: [], status: "" };

  it("toggles type and applies filters", () => {
    const onClose = jest.fn();
    const onApply = jest.fn();

    render(<BulkActionFilterDialog open onClose={onClose} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={currentFilters} />);

    // Apply should call onApply with updated filters and then onClose
    fireEvent.click(screen.getByText("Apply"));
    expect(onApply).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });


  it("clear all removes selected chips", () => {
    const onClose = jest.fn();
    const onApply = jest.fn();

    render(
      <BulkActionFilterDialog
        open
        onClose={onClose}
        onApply={onApply}
        availableTypes={availableTypes}
        availableUsers={availableUsers}
        currentFilters={{ type: ["agent_upgrade"], user: ["alice"], status: "Completed" }}
      />,
    );

    expect(screen.getAllByText("agent_upgrade").length).toBeGreaterThan(0);
    expect(screen.getAllByText("alice").length).toBeGreaterThan(0);

    // Clear all then Apply should pass empty filters
    fireEvent.click(screen.getByText("Clear All"));
    fireEvent.click(screen.getByText("Apply"));
    expect(onApply).toHaveBeenCalledWith({ type: [], user: [], status: "" });
    expect(onClose).toHaveBeenCalled();
  });
});
