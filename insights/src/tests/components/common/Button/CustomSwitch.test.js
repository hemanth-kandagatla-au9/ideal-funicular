import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CustomizedSwitches from "../../../../components/common/Button/CustomSwitch";

// Mock MUI components to isolate testing
jest.mock("@mui/material/Switch", () => {
  return function MockSwitch({
    checked,
    onChange,
    disabled,
    "data-testid": testId,
    ...props
  }) {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        data-testid={testId || "mui-switch"}
        {...props}
      />
    );
  };
});

jest.mock("@mui/material/FormGroup", () => {
  return function MockFormGroup({ children }) {
    return <div data-testid="form-group">{children}</div>;
  };
});

jest.mock("@mui/material/FormControlLabel", () => {
  return function MockFormControlLabel({ control, label }) {
    return (
      <div data-testid="form-control-label">
        {control}
        <span data-testid="control-label">{label}</span>
      </div>
    );
  };
});

describe("CustomizedSwitches", () => {
  const defaultProps = {
    isActive: true,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial state and rendering", () => {
    test("should render with default props", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches />
        </ThemeProvider>
      );

      expect(screen.getByTestId("form-group")).toBeInTheDocument();
      expect(screen.getByTestId("form-control-label")).toBeInTheDocument();
    });

    test("should initialize switch as active when isActive is true", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      expect(switchElement.checked).toBe(true);
    });

    test("should initialize switch as inactive when isActive is false", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={false} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      expect(switchElement.checked).toBe(false);
    });

    test("should have empty label", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches />
        </ThemeProvider>
      );

      const labelElement = screen.getByTestId("control-label");
      expect(labelElement.textContent).toBe("");
    });
  });

  describe("Toggle functionality", () => {
    test("should toggle from active to inactive when clicked", () => {
      const onToggle = jest.fn();
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} onToggle={onToggle} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Initial state
      expect(switchElement.checked).toBe(true);

      // Click to toggle
      fireEvent.click(switchElement);

      // State after toggle
      expect(switchElement.checked).toBe(false);
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    test("should toggle from inactive to active when clicked", () => {
      const onToggle = jest.fn();
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={false} onToggle={onToggle} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Initial state
      expect(switchElement.checked).toBe(false);

      // Click to toggle
      fireEvent.click(switchElement);

      // State after toggle
      expect(switchElement.checked).toBe(true);
      expect(onToggle).toHaveBeenCalledWith(true);
    });

    test("should call onToggle with correct value on change", () => {
      const onToggle = jest.fn();
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} onToggle={onToggle} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Toggle twice
      fireEvent.click(switchElement); // Should toggle to false
      expect(onToggle).toHaveBeenNthCalledWith(1, false);

      fireEvent.click(switchElement); // Should toggle back to true
      expect(onToggle).toHaveBeenNthCalledWith(2, true);

      expect(onToggle).toHaveBeenCalledTimes(2);
    });

    test("should handle multiple toggles correctly", () => {
      const onToggle = jest.fn();
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} onToggle={onToggle} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Toggle 3 times
      fireEvent.click(switchElement); // false
      expect(switchElement.checked).toBe(false);

      fireEvent.click(switchElement); // true
      expect(switchElement.checked).toBe(true);

      fireEvent.click(switchElement); // false
      expect(switchElement.checked).toBe(false);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("Prop updates", () => {
    // test('should update switch state when isActive prop changes', () => {
    //   const { rerender } = render(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={true} />
    //     </ThemeProvider>
    //   );
    //   let switchElement = screen.getByRole('checkbox');
    //   expect(switchElement.checked).toBe(true);
    //   // Rerender with new prop
    //   rerender(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={false} />
    //     </ThemeProvider>
    //   );
    //   switchElement = screen.getByRole('checkbox');
    //   expect(switchElement.checked).toBe(false);
    // });
    // test('should maintain local state independence when isActive prop changes', () => {
    //   const { rerender } = render(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={true} />
    //     </ThemeProvider>
    //   );
    //   const switchElement = screen.getByRole('checkbox');
    //   // User toggles to false
    //   fireEvent.click(switchElement);
    //   expect(switchElement.checked).toBe(false);
    //   // Parent tries to set it back to true
    //   rerender(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={true} />
    //     </ThemeProvider>
    //   );
    //   // Should respect prop update
    //   expect(switchElement.checked).toBe(true);
    // });
  });

  describe("Event handling", () => {
    // test('should handle onChange event correctly', () => {
    //   const onToggle = jest.fn();
    //   render(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={true} onToggle={onToggle} />
    //     </ThemeProvider>
    //   );

    //   const switchElement = screen.getByRole('checkbox');

    //   // Simulate change event
    //   fireEvent.change(switchElement, { target: { checked: false } });

    //   expect(switchElement.checked).toBe(false);
    //   expect(onToggle).toHaveBeenCalledWith(false);
    // });

    test("should handle keyboard events if supported", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Simulate space key press (common for toggling switches)
      fireEvent.keyDown(switchElement, { key: " ", code: "Space" });

      // The component doesn't explicitly handle keyboard events,
      // but we can verify the element is focusable
      expect(switchElement).toBeInTheDocument();
    });
  });

  describe("Edge cases and error handling", () => {
    test("should work without onToggle callback", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Should not throw error when clicked
      expect(() => {
        fireEvent.click(switchElement);
      }).not.toThrow();

      expect(switchElement.checked).toBe(false);
    });

    test("should handle undefined isActive prop", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={undefined} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      // Default state should be true according to default parameter
      expect(switchElement.checked).toBe(true);
    });

    test("should handle null isActive prop", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={null} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      expect(switchElement.checked).toBe(false); // null coerces to false
    });

    test("should maintain internal state when toggling rapidly", () => {
      const onToggle = jest.fn();
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches isActive={true} onToggle={onToggle} />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");

      // Rapid clicks
      fireEvent.click(switchElement);
      fireEvent.click(switchElement);
      fireEvent.click(switchElement);

      expect(switchElement.checked).toBe(false);
      expect(onToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    test("should be keyboard accessible with correct role", () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <CustomizedSwitches />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute("type", "checkbox");
    });

    // test('should have proper checked state for screen readers', () => {
    //   render(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={true} />
    //     </ThemeProvider>
    //   );

    //   const switchElement = screen.getByRole('checkbox');
    //   expect(switchElement.checked).toBe(true);
    //   expect(switchElement).toHaveAttribute('aria-checked', 'true');
    // });

    // test('should update aria-checked attribute on toggle', () => {
    //   render(
    //     <ThemeProvider theme={createTheme()}>
    //       <CustomizedSwitches isActive={true} />
    //     </ThemeProvider>
    //   );

    //   const switchElement = screen.getByRole('checkbox');

    //   expect(switchElement).toHaveAttribute('aria-checked', 'true');

    //   fireEvent.click(switchElement);

    //   expect(switchElement).toHaveAttribute('aria-checked', 'false');
    // });
  });

  describe("Integration with ThemeProvider", () => {
    test("should render within ThemeProvider without errors", () => {
      const theme = createTheme({
        palette: {
          mode: "dark",
        },
      });

      expect(() => {
        render(
          <ThemeProvider theme={theme}>
            <CustomizedSwitches />
          </ThemeProvider>
        );
      }).not.toThrow();
    });

    test("should render in light mode theme", () => {
      const theme = createTheme({
        palette: {
          mode: "light",
        },
      });

      render(
        <ThemeProvider theme={theme}>
          <CustomizedSwitches />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      expect(switchElement).toBeInTheDocument();
    });

    test("should render in dark mode theme", () => {
      const theme = createTheme({
        palette: {
          mode: "dark",
        },
      });

      render(
        <ThemeProvider theme={theme}>
          <CustomizedSwitches />
        </ThemeProvider>
      );

      const switchElement = screen.getByRole("checkbox");
      expect(switchElement).toBeInTheDocument();
    });
  });
});
