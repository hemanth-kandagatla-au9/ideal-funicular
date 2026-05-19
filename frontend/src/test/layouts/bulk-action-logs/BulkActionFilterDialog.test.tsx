/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import BulkActionFilterDialog, { FilterState } from "../../../layouts/bulk-action-logs/components/BulkActionFilterDialog";

describe("BulkActionFilterDialog", () => {
  const availableTypes = ["agent_config_sync", "agent_upgrade"];
  const availableUsers = ["alice", "bob"];
  const emptyFilters: FilterState = { type: [], user: [], status: "", dateRange: { from: "", to: "" } };

  it("renders filter dialog with header and footer", () => {
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={() => {}} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<BulkActionFilterDialog open={false} onClose={() => {}} onApply={() => {}} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    expect(screen.queryByText("Filter")).not.toBeInTheDocument();
  });

  it("selects status via radio and applies", () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    render(<BulkActionFilterDialog open onClose={onClose} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    fireEvent.click(screen.getByLabelText("Completed"));
    fireEvent.click(screen.getByText("Apply"));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ status: "Completed" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("clear all resets all filters to empty", () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    const prefilled: FilterState = { type: ["agent_upgrade"], user: ["alice"], status: "Completed", dateRange: { from: "", to: "" } };
    render(<BulkActionFilterDialog open onClose={onClose} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={prefilled} />);
    const selectedTriggers = screen.getAllByText("1 selected");
    fireEvent.click(selectedTriggers[0]);
    expect(screen.getByText("agent_upgrade")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Clear All"));
    fireEvent.click(screen.getByText("Apply"));
    expect(onApply).toHaveBeenCalledWith({ type: [], user: [], status: "", dateRange: { from: "", to: "" } });
    expect(onClose).toHaveBeenCalled();
  });

  it("close button calls onClose", () => {
    const onClose = jest.fn();
    render(<BulkActionFilterDialog open onClose={onClose} onApply={() => {}} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    const closeBtn = screen.getAllByRole("button").find(btn => btn.querySelector("svg"));
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders Date Range section with From and To labels", () => {
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={() => {}} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    expect(screen.getByText("Date Range")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
  });

  it("renders two empty date inputs by default", () => {
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={() => {}} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    const inputs = document.querySelectorAll("input[type='date']");
    expect(inputs.length).toBe(2);
    expect(inputs[0]).toHaveValue("");
    expect(inputs[1]).toHaveValue("");
  });

  it("changing From date is reflected in apply payload", () => {
    const onApply = jest.fn();
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[0], { target: { value: "2025-01-01" } });
    fireEvent.click(screen.getByText("Apply"));
    const result: FilterState = onApply.mock.calls[0][0];
    expect(result.dateRange.from).toBe("2025-01-01");
    expect(result.dateRange.to).toBe("");
  });

  it("changing To date is reflected in apply payload", () => {
    const onApply = jest.fn();
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[1], { target: { value: "2025-01-31" } });
    fireEvent.click(screen.getByText("Apply"));
    const result: FilterState = onApply.mock.calls[0][0];
    expect(result.dateRange.from).toBe("");
    expect(result.dateRange.to).toBe("2025-01-31");
  });

  it("setting both dates sends full dateRange in payload", () => {
    const onApply = jest.fn();
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[0], { target: { value: "2025-03-01" } });
    fireEvent.change(inputs[1], { target: { value: "2025-03-31" } });
    fireEvent.click(screen.getByText("Apply"));
    const result: FilterState = onApply.mock.calls[0][0];
    expect(result.dateRange).toEqual({ from: "2025-03-01", to: "2025-03-31" });
  });

  it("clear all resets dateRange to empty strings", () => {
    const onApply = jest.fn();
    const withDates: FilterState = { type: [], user: [], status: "", dateRange: { from: "2025-01-01", to: "2025-01-31" } };
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={withDates} />);
    fireEvent.click(screen.getByText("Clear All"));
    fireEvent.click(screen.getByText("Apply"));
    const result: FilterState = onApply.mock.calls[0][0];
    expect(result.dateRange).toEqual({ from: "", to: "" });
  });

  it("pre-filled dateRange values are shown in inputs", () => {
    const withDates: FilterState = { type: [], user: [], status: "", dateRange: { from: "2025-05-01", to: "2025-05-31" } };
    render(<BulkActionFilterDialog open onClose={() => {}} onApply={() => {}} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={withDates} />);
    expect(screen.getByDisplayValue("2025-05-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-05-31")).toBeInTheDocument();
  });

  it("syncs updated currentFilters when dialog reopens", () => {
    const onApply = jest.fn();
    const updatedFilters: FilterState = { type: [], user: [], status: "Failed", dateRange: { from: "2025-06-01", to: "" } };
    const { rerender } = render(<BulkActionFilterDialog open={false} onClose={() => {}} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={emptyFilters} />);
    rerender(<BulkActionFilterDialog open onClose={() => {}} onApply={onApply} availableTypes={availableTypes} availableUsers={availableUsers} currentFilters={updatedFilters} />);
    fireEvent.click(screen.getByText("Apply"));
    const result: FilterState = onApply.mock.calls[0][0];
    expect(result.status).toBe("Failed");
    expect(result.dateRange.from).toBe("2025-06-01");
  });
});
