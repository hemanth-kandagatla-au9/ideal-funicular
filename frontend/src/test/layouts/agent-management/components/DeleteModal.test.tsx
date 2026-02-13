import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteModal from "../../../../../src/layouts/agent-management/components/DeleteModal";
jest.mock("@/constants/strings", () => ({
  cancelButtonText: "Cancel",
  deleteButtonText: "Delete",
  deleteConfirmationMessage: "Are you sure you want to delete",
  deleteJobsTitle: "Delete Jobs",
  deleteBinaryTitle: "Delete Binary",
  healthCheckTitle: "Health Check",
}));

describe("DeleteModal", () => {
  const baseProps = {
    open: true,
    onClose: jest.fn(),
    onCancelButtonClick: jest.fn(),
    onDeleteButtonClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders delete jobs title when version not provided", () => {
    render(<DeleteModal {...baseProps} />);

    expect(screen.getByText("Delete Jobs")).toBeInTheDocument();
  });

  it("renders delete binary title when version provided", () => {
    render(<DeleteModal {...baseProps} version="v1.2.3" />);

    expect(screen.getByText("Delete Binary")).toBeInTheDocument();
  });

  it("shows correct confirmation message when version is provided", () => {
    render(<DeleteModal {...baseProps} version="v2.0" />);

    expect(
      screen.getByText("Are you sure you want to delete version v2.0?")
    ).toBeInTheDocument();
  });

  it("shows default confirmation when version is not provided", () => {
    render(<DeleteModal {...baseProps} />);

    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText("Health Check")).toBeInTheDocument();
  });

  it("calls cancel handler when Cancel clicked", () => {
    render(<DeleteModal {...baseProps} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(baseProps.onCancelButtonClick).toHaveBeenCalled();
  });

  it("calls delete handler when Delete clicked", () => {
    render(<DeleteModal {...baseProps} />);

    fireEvent.click(screen.getByText("Delete"));

    expect(baseProps.onDeleteButtonClick).toHaveBeenCalled();
  });

  it("does not render modal when open is false", () => {
    render(<DeleteModal {...baseProps} open={false} />);

    expect(screen.queryByText("Delete Jobs")).not.toBeInTheDocument();
  });
});
