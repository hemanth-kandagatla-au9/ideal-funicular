import { render, screen, fireEvent } from "@testing-library/react";
import BinaryFormButtons from "../../../../../../src/layouts/agent-management/components/versionmanagement/BinaryFormButtons";
import "@testing-library/jest-dom";

describe("BinaryFormButtons", () => {
  const onCancel = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Cancel and Add buttons by default", () => {
    render(<BinaryFormButtons onCancel={onCancel} isEditing={false} />);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("renders Update when isEditing is true", () => {
    render(<BinaryFormButtons onCancel={onCancel} isEditing={true} />);

    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("renders Close button in view mode and hides submit button", () => {
    render(
      <BinaryFormButtons 
        onCancel={onCancel} 
        isEditing={false} 
        isViewMode={true} 
      />
    );

    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.queryByText("Add")).not.toBeInTheDocument();
    expect(screen.queryByText("Update")).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel button clicked", () => {
    render(<BinaryFormButtons onCancel={onCancel} isEditing={false} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows Adding... when submitting and not editing", () => {
    render(
      <BinaryFormButtons 
        onCancel={onCancel} 
        isEditing={false} 
        isSubmitting={true} 
      />
    );

    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("shows Updating... when submitting and editing", () => {
    render(
      <BinaryFormButtons 
        onCancel={onCancel} 
        isEditing={true} 
        isSubmitting={true} 
      />
    );

    expect(screen.getByText("Updating...")).toBeInTheDocument();
  });

  it("disables both buttons when submitting", () => {
    render(
      <BinaryFormButtons 
        onCancel={onCancel} 
        isEditing={false} 
        isSubmitting={true} 
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  it("disables submit when editing and hasChanges is false", () => {
    render(
      <BinaryFormButtons 
        onCancel={onCancel} 
        isEditing={true} 
        hasChanges={false} 
      />
    );

    const submitBtn = screen.getByText("Update").closest("button");
    expect(submitBtn).toBeDisabled();
  });

  it("shows loader when submitting", () => {
    render(
      <BinaryFormButtons 
        onCancel={onCancel} 
        isEditing={false} 
        isSubmitting={true} 
      />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
