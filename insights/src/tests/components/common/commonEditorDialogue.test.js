import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommandEditorDialog from "../../../components/common/commonEditorDialogue";

// Mock dependencies
jest.mock("../../../components/planning/WebIDE", () => {
  return function MockWebIde({ value, onChange, readOnly, dataVariable }) {
    return (
      <div data-testid="web-ide">
        <textarea
          data-testid="web-ide-textarea"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={dataVariable ? `Template: ${dataVariable}` : ""}
        />
      </div>
    );
  };
});

jest.mock("../../../components/common/Constants/label-contants", () => ({
  UI_TEXTS: {
    LABELS: {
      INSIGHTS: "Command Scripts Editor",
    },
    SECTIONS: {
      VIEW_COMMAND_SCRIPTS: "View command scripts section",
      COMMAND_SCRIPTS_EDITOR: "Command scripts editor section",
    },
    BUTTONS: {
      SAVE_CHANGES: "Save Changes",
      SAVE: "Save",
    },
  },
}));

describe("CommandEditorDialog", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    command: 'console.log("test");',
    setCommand: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    test("should render dialog when open is true", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    test("should not render dialog when open is false", () => {
      render(<CommandEditorDialog {...defaultProps} open={false} />);

      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).not.toBeInTheDocument();
    });

    test("should render dialog title with correct text", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      expect(screen.getByText("Command Scripts Editor")).toBeInTheDocument();
      expect(
        screen.getByText("Command scripts editor section")
      ).toBeInTheDocument();
    });

    test("should render WebIDE component", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      expect(screen.getByTestId("web-ide")).toBeInTheDocument();
    });

    test("should render close button", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      const closeButton = screen.getByLabelText("close");
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("View mode", () => {
    test('should display "View Command Scripts" title in viewOnly mode', () => {
      render(<CommandEditorDialog {...defaultProps} viewOnly={true} />);

      expect(screen.getByText("View Command Scripts")).toBeInTheDocument();
      expect(
        screen.getByText("View command scripts section")
      ).toBeInTheDocument();
    });

    test("should pass readOnly prop to WebIDE in viewOnly mode", () => {
      render(<CommandEditorDialog {...defaultProps} viewOnly={true} />);

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea).toHaveAttribute("readOnly");
    });

    test("should not render save buttons in viewOnly mode", () => {
      render(<CommandEditorDialog {...defaultProps} viewOnly={true} />);

      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
      expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });
  });

  describe("Data variable display", () => {
    // test('should display dataVariable when provided', () => {
    //   const dataVariable = 'test-template';
    //   render(<CommandEditorDialog {...defaultProps} dataVariable={dataVariable} />);

    //   expect(screen.getByText(`Template: ${dataVariable}`)).toBeInTheDocument();
    // });

    test("should not display dataVariable section when not provided", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      const templateText = screen.queryByText(/Template:/);
      expect(templateText).not.toBeInTheDocument();
    });

    test("should pass dataVariable to WebIDE component", () => {
      const dataVariable = "test-template";
      render(
        <CommandEditorDialog {...defaultProps} dataVariable={dataVariable} />
      );

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea).toHaveAttribute(
        "placeholder",
        `Template: ${dataVariable}`
      );
    });
  });

  describe("Command editing", () => {
    test("should initialize editedCommand with prop value", () => {
      const testCommand = "const x = 10;";
      render(<CommandEditorDialog {...defaultProps} command={testCommand} />);

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea.value).toBe(testCommand);
    });

    test("should update editedCommand when WebIDE onChange is called", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      const textarea = screen.getByTestId("web-ide-textarea");
      const newCommand = "const updated = true;";

      fireEvent.change(textarea, { target: { value: newCommand } });

      expect(textarea.value).toBe(newCommand);
    });

    test("should update editedCommand when command prop changes", () => {
      const { rerender } = render(<CommandEditorDialog {...defaultProps} />);

      const newCommand = "updated command";
      rerender(<CommandEditorDialog {...defaultProps} command={newCommand} />);

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea.value).toBe(newCommand);
    });
  });

  describe("Button rendering and actions", () => {
    test("should render Save Changes button when handleSaveChanges is true", () => {
      render(
        <CommandEditorDialog {...defaultProps} handleSaveChanges={true} />
      );

      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });

    test("should render Save button when showSaveButton is true", () => {
      render(<CommandEditorDialog {...defaultProps} showSaveButton={true} />);

      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    test("should not render any buttons when both handleSaveChanges and showSaveButton are false", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
      expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });

    test("should call setCommand and onClose when Save Changes button is clicked", () => {
      const setCommand = jest.fn();
      const onClose = jest.fn();

      render(
        <CommandEditorDialog
          {...defaultProps}
          setCommand={setCommand}
          onClose={onClose}
          handleSaveChanges={true}
        />
      );

      // Change the command first
      const textarea = screen.getByTestId("web-ide-textarea");
      const newCommand = "updated command";
      fireEvent.change(textarea, { target: { value: newCommand } });

      // Click save button
      const saveButton = screen.getByText("Save Changes");
      fireEvent.click(saveButton);

      expect(setCommand).toHaveBeenCalledWith(newCommand);
      expect(onClose).toHaveBeenCalled();
    });

    test("should call setCommand and onClose when Save button is clicked", () => {
      const setCommand = jest.fn();
      const onClose = jest.fn();

      render(
        <CommandEditorDialog
          {...defaultProps}
          setCommand={setCommand}
          onClose={onClose}
          showSaveButton={true}
        />
      );

      // Change the command first
      const textarea = screen.getByTestId("web-ide-textarea");
      const newCommand = "updated command";
      fireEvent.change(textarea, { target: { value: newCommand } });

      // Click save button
      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      expect(setCommand).toHaveBeenCalledWith(newCommand);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Dialog close functionality", () => {
    test("should call onClose when close icon is clicked", () => {
      const onClose = jest.fn();
      render(<CommandEditorDialog {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByLabelText("close");
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    // test('should handle dialog close when onClose is called', () => {
    //   const onClose = jest.fn();
    //   render(<CommandEditorDialog {...defaultProps} onClose={onClose} />);

    //   // Simulate dialog close
    //   const dialog = document.querySelector('[role="dialog"]');
    //   fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    //   // Note: The dialog doesn't have onClose attached to the Dialog component
    //   // but we can test the close button functionality
    //   expect(onClose).not.toHaveBeenCalled(); // onClose is not attached to Dialog's onClose prop
    // });
  });

  describe("Prop validation and edge cases", () => {
    test("should handle undefined command prop", () => {
      render(<CommandEditorDialog {...defaultProps} command={undefined} />);

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea.value).toBe("");
    });

    test("should handle empty string command", () => {
      render(<CommandEditorDialog {...defaultProps} command="" />);

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea.value).toBe("");
    });

    test("should handle null command prop", () => {
      render(<CommandEditorDialog {...defaultProps} command={null} />);

      const textarea = screen.getByTestId("web-ide-textarea");
      expect(textarea.value).toBe("");
    });

    test("should not call setCommand on close if not provided", () => {
      const onClose = jest.fn();
      const propsWithoutSetCommand = { ...defaultProps };
      delete propsWithoutSetCommand.setCommand;

      render(
        <CommandEditorDialog {...propsWithoutSetCommand} onClose={onClose} />
      );

      const closeButton = screen.getByLabelText("close");
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
      // Should not throw error when setCommand is undefined
    });
  });

  describe("Accessibility", () => {
    test("should have proper aria-labelledby attribute", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute(
        "aria-labelledby",
        "command-editor-dialog-title"
      );
    });

    test("should have proper aria-label for close button", () => {
      render(<CommandEditorDialog {...defaultProps} />);

      const closeButton = screen.getByLabelText("close");
      expect(closeButton).toBeInTheDocument();
    });
  });
});
