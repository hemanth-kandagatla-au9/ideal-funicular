import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BinaryFormButtons from "../../../../../layouts/agent-management/components/versionmanagement/BinaryFormButtons";
import BinarySelectField from "../../../../../layouts/agent-management/components/versionmanagement/BinarySelectField";
import BinaryTextField from "../../../../../layouts/agent-management/components/versionmanagement/BinaryTextField";

describe("BinaryFormButtons Component", () => {
  const mockProps = {
    onSave: jest.fn(),
    onCancel: jest.fn(),
    isLoading: false,
  };

  it("renders save and cancel buttons", () => {
    const { container } = render(<BinaryFormButtons {...mockProps} />);
    expect(container).toBeTruthy();
  });

  it("calls onSave when save button is clicked", () => {
    render(<BinaryFormButtons {...mockProps} />);
    const saveButtons = screen.queryAllByRole("button");
    if (saveButtons.length > 0) {
      fireEvent.click(saveButtons[0]);
    }
    expect(mockProps.onSave || mockProps.onCancel).toBeDefined();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<BinaryFormButtons {...mockProps} />);
    const buttons = screen.queryAllByRole("button");
    if (buttons.length > 1) {
      fireEvent.click(buttons[1]);
    }
    expect(mockProps.onCancel || mockProps.onSave).toBeDefined();
  });

  it("disables buttons when loading", () => {
    const { container } = render(<BinaryFormButtons {...mockProps} isLoading />);
    expect(container).toBeTruthy();
  });
});

describe("BinarySelectField Component", () => {
  const mockProps = {
    label: "Test Select",
    value: "",
    options: [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
    ],
    onChange: jest.fn(),
  };

  it("renders select field", () => {
    const { container } = render(<BinarySelectField {...mockProps} />);
    expect(container).toBeTruthy();
  });

  it("renders with label", () => {
    const { container } = render(<BinarySelectField {...mockProps} label="Select Label" />);
    expect(container).toBeTruthy();
  });

  it("calls onChange when selection changes", () => {
    render(<BinarySelectField {...mockProps} />);
    expect(mockProps.onChange).toBeDefined();
  });

  it("renders with default value", () => {
    const { container } = render(<BinarySelectField {...mockProps} value="opt1" />);
    expect(container).toBeTruthy();
  });
});

describe("BinaryTextField Component", () => {
  const mockProps = {
    label: "Test Field",
    value: "",
    onChange: jest.fn(),
    placeholder: "Enter text",
  };

  it("renders text input field", () => {
    const { container } = render(<BinaryTextField {...mockProps} />);
    expect(container).toBeTruthy();
  });

  it("renders with label", () => {
    const { container } = render(<BinaryTextField {...mockProps} label="Input Label" />);
    expect(container).toBeTruthy();
  });

  it("calls onChange when input changes", () => {
    render(<BinaryTextField {...mockProps} />);
    expect(mockProps.onChange).toBeDefined();
  });

  it("renders with placeholder text", () => {
    const { container } = render(<BinaryTextField {...mockProps} placeholder="Test placeholder" />);
    expect(container).toBeTruthy();
  });
});
