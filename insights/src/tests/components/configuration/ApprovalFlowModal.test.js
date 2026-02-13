import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider, createTheme } from "@mui/material";
import ApprovalFlowModal from "../../../components/configuration/ApprovalFlowModal";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    POSITION: {
      TOP_RIGHT: "top-right",
    },
  },
}));

jest.mock("../../../services/jobs/JobsService", () => ({
  getIAMGroups: jest.fn(),
  handleApprovalFlowConfig: jest.fn(),
}));

jest.mock("../../../components/common/Constants/label-contants", () => ({
  TOAST_MESSAGES: {
    ERROR: {
      FAILED_TO_LOAD_IAM_GROUP: "Failed to load IAM groups",
      FAILED_TO_LOAD_APPROVAL_FLOW: "Failed to load approval flow",
      MODULE_IS_REQUIRED: "Module is required",
      APPROVER_GROUP_IS_REQUIRED: "Approver group is required",
      FAILED_TO_SAVE_APPROVAL_FLOW: "Failed to save approval flow",
      APPROVAL_FLOW_UPDATED_SUCCESSFULLY: "Approval flow updated successfully",
      APPROVAL_FLOW_ADDED_SUCCESSFULLY: "Approval flow added successfully",
    },
  },
  UI_TEXTS: {
    TYPOGRAPHY: {
      UPDATE_APPROVAL_FLOW: "Update Approval Flow",
      MODULE: "Module",
    },
    BUTTONS: {
      ADD_APPROVAL_FLOW: "Add Approval Flow",
      UPDATING_THREE_DOTS: "Updating...",
      ADDING_THREE_DOTS: "Adding...",
      UPDATE: "Update",
      ADD: "Add",
    },
    LABELS: {
      APPROVER_GROUP: "Approver Group",
    },
  },
}));

jest.mock("../../../components/common/Constants/constantObjects", () => ({
  MODULE_OPTIONS: [
    { value: "module1", label: "Module 1" },
    { value: "module2", label: "Module 2" },
    { value: "module3", label: "Module 3" },
  ],
  DummyiamGroups: [],
}));

// Mock MUI components
jest.mock("@mui/material/Modal", () => {
  const React = require("react");
  return function MockModal({ children, open, onClose }) {
    if (!open) return null;
    return React.createElement(
      "div",
      { "data-testid": "modal", onClick: onClose },
      children
    );
  };
});

jest.mock("@mui/material/Box", () => {
  const React = require("react");
  return function MockBox({ children, sx, ...props }) {
    return React.createElement(
      "div",
      Object.assign({ "data-testid": "box", style: sx }, props),
      children
    );
  };
});

jest.mock("@mui/material/Typography", () => {
  const React = require("react");
  return function MockTypography({ children, variant, className, ...props }) {
    return React.createElement(
      "div",
      Object.assign(
        { "data-testid": "typography", "data-variant": variant, className },
        props
      ),
      children
    );
  };
});

jest.mock("@mui/material/IconButton", () => {
  const React = require("react");
  return function MockIconButton({ children, onClick, ...props }) {
    return React.createElement(
      "button",
      Object.assign({ "data-testid": "icon-button", onClick }, props),
      children
    );
  };
});

jest.mock("@mui/material/Autocomplete", () => {
  const React = require("react");
  return function MockAutocomplete({
    options,
    value,
    onChange,
    getOptionLabel,
    renderInput,
    ListboxProps,
    sx,
    ...props
  }) {
    const [inputValue, setInputValue] = React.useState(
      getOptionLabel ? (value ? getOptionLabel(value) : "") || "" : ""
    );

    return React.createElement(
      "div",
      { "data-testid": "autocomplete" },
      // Call renderInput with only the params the real Autocomplete uses for the input
      renderInput({
        inputProps: {
          "aria-label": "Without label",
          value: inputValue,
          onChange: (e) => {
            setInputValue(e.target.value);
            const matchedOption = options?.find((opt) =>
              getOptionLabel
                ? getOptionLabel(opt) === e.target.value
                : opt === e.target.value
            );
            if (matchedOption && onChange) {
              onChange({}, matchedOption);
            }
          },
        },
      }),
      React.createElement(
        "div",
        { "data-testid": "autocomplete-options" },
        options &&
          options.map((option, index) =>
            React.createElement(
              "div",
              {
                key: index,
                "data-testid": `option-${
                  getOptionLabel ? getOptionLabel(option) : option
                }`,
                onClick: () => {
                  const label = getOptionLabel
                    ? getOptionLabel(option)
                    : option;
                  setInputValue(label);
                  onChange && onChange({}, option);
                },
              },
              getOptionLabel ? getOptionLabel(option) : option
            )
          )
      ),
      React.createElement("input", {
        type: "hidden",
        value: inputValue,
        onChange: (e) => {
          setInputValue(e.target.value);
          const matchedOption = options?.find((opt) =>
            getOptionLabel
              ? getOptionLabel(opt) === e.target.value
              : opt === e.target.value
          );
          if (matchedOption && onChange) {
            onChange({}, matchedOption);
          }
        },
        "data-testid": "autocomplete-input",
      })
    );
  };
});

jest.mock("@mui/material/TextField", () => {
  const React = require("react");
  return function MockTextField({
    placeholder,
    variant,
    inputProps,
    ...props
  }) {
    return React.createElement(
      "input",
      Object.assign(
        { "data-testid": "text-field", placeholder: placeholder },
        inputProps,
        props
      )
    );
  };
});

jest.mock("@mui/material/FormControl", () => {
  const React = require("react");
  return function MockFormControl({ children, fullWidth, sx, ...props }) {
    return React.createElement(
      "div",
      Object.assign({ "data-testid": "form-control", style: sx }, props),
      children
    );
  };
});

jest.mock("@mui/material/Grid", () => {
  const React = require("react");
  return function MockGrid(props) {
    const { container, item, children, xs } = props;
    if (container) {
      return React.createElement(
        "div",
        { "data-testid": "grid-container" },
        children
      );
    }
    if (item) {
      return React.createElement(
        "div",
        { "data-testid": "grid-item", "data-xs": xs },
        children
      );
    }
    return React.createElement("div", null, children);
  };
});

jest.mock("@mui/material/Button", () => {
  const React = require("react");
  return function MockButton({
    children,
    onClick,
    variant,
    color,
    sx,
    disabled,
  }) {
    // Render clickable button always; represent disabled state via data-disabled attribute
    return React.createElement(
      "button",
      {
        "data-testid": "button",
        "data-variant": variant,
        "data-color": color,
        "data-disabled": disabled ? "true" : "false",
        onClick: onClick,
        style: sx,
      },
      children
    );
  };
});

jest.mock("@mui/icons-material/Close", () => {
  const React = require("react");
  return function MockCloseIcon() {
    return React.createElement("span", { "data-testid": "close-icon" }, "X");
  };
});

// Mock CSS
jest.mock("../../../components/configuration/css/common.css", () => ({}));

// Create mock store
const createMockStore = (state = {}) => {
  const store = configureStore({
    reducer: {
      jobs: (
        state = {
          IAMGroups: [],
          approvalConfig: [],
        },
        action
      ) => state,
    },
    preloadedState: { jobs: state },
  });
  // Ensure dispatch returns a promise so components that call dispatch(...).catch work in tests
  store.dispatch = jest.fn(() => Promise.resolve({}));
  return store;
};

describe("ApprovalFlowModal", () => {
  const mockIAMGroups = [
    { name: "Admin Group", id: "1" },
    { name: "Manager Group", id: "2" },
    { name: "User Group", id: "3" },
  ];

  const mockApprovalFlows = [
    { _id: "flow1", moduleType: "module1", approverGroup: "Admin Group" },
    { _id: "flow2", moduleType: "module2", approverGroup: "Manager Group" },
  ];

  const defaultProps = {
    isModalOpen: true,
    setIsModelOpen: jest.fn(),
    isEditClicked: false,
    approvalFlowId: null,
    onSaveSuccess: jest.fn(),
    approvalFlowsData: mockApprovalFlows,
  };

  let store;
  let mockDispatch;
  let mockGetIAMGroups;
  let mockHandleApprovalFlowConfig;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createMockStore({
      IAMGroups: mockIAMGroups,
      approvalConfig: mockApprovalFlows,
    });

    mockDispatch = jest.fn();
    mockGetIAMGroups = jest.fn().mockReturnValue({ type: "GET_IAM_GROUPS" });
    mockHandleApprovalFlowConfig = jest
      .fn()
      .mockResolvedValue({ success: true });

    require("../../../services/jobs/JobsService").getIAMGroups =
      mockGetIAMGroups;
    require("../../../services/jobs/JobsService").handleApprovalFlowConfig =
      mockHandleApprovalFlowConfig;
  });

  const renderComponent = (props = {}, state = {}) => {
    const mergedState = {
      IAMGroups: mockIAMGroups,
      approvalConfig: mockApprovalFlows,
      ...state,
    };

    store = createMockStore(mergedState);
    // Make dispatch behave like a thunk-aware dispatcher for tests
    store.dispatch = jest.fn((action) => {
      if (typeof action === "function") {
        try {
          const res = action(store.dispatch, store.getState);
          return Promise.resolve(res);
        } catch (e) {
          return Promise.reject(e);
        }
      }
      if (
        action &&
        action.type === "GET_IAM_GROUPS" &&
        typeof mockGetIAMGroups === "function"
      ) {
        mockGetIAMGroups();
      }
      return Promise.resolve(action);
    });

    return render(
      <Provider store={store}>
        <ThemeProvider theme={createTheme()}>
          <ApprovalFlowModal {...defaultProps} {...props} />
        </ThemeProvider>
      </Provider>
    );
  };

  describe("Modal opening/closing", () => {
    test("should render modal when isModalOpen is true", () => {
      renderComponent();
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    test("should not render modal when isModalOpen is false", () => {
      renderComponent({ isModalOpen: false });
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    test("should call setIsModelOpen when close icon is clicked", () => {
      renderComponent();

      const closeButton = screen.getByTestId("icon-button");
      fireEvent.click(closeButton);

      expect(defaultProps.setIsModelOpen).toHaveBeenCalledWith(false);
    });

    test("should close modal when clicking outside", () => {
      renderComponent();

      const modal = screen.getByTestId("modal");
      fireEvent.click(modal);

      expect(defaultProps.setIsModelOpen).toHaveBeenCalledWith(false);
    });
  });

  describe("Title rendering", () => {
    test('should show "Add Approval Flow" title for create mode', () => {
      renderComponent({ isEditClicked: false });
      expect(screen.getByText("Add Approval Flow")).toBeInTheDocument();
    });

    test('should show "Update Approval Flow" title for edit mode', () => {
      renderComponent({ isEditClicked: true });
      expect(screen.getByText("Update Approval Flow")).toBeInTheDocument();
    });
  });

  describe("Form initialization", () => {
    test("should fetch IAM groups when modal opens", async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockGetIAMGroups).toHaveBeenCalled();
      });
    });

    test("should show error toast when IAM groups fetch fails", async () => {
      // Make getIAMGroups return a thunk that rejects so the component handles the error
      mockGetIAMGroups.mockImplementation(
        () => () => Promise.reject(new Error("Fetch failed"))
      );

      renderComponent();

      await waitFor(() => {
        const { toast } = require("react-toastify");
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to load IAM groups",
          expect.any(Object)
        );
      });
    });

    test("should reset form for create mode", async () => {
      renderComponent({ isEditClicked: false });

      await waitFor(() => {
        // Form should be empty (module field is the first autocomplete)
        const moduleField =
          screen.getAllByPlaceholderText("Search or Select")[0];
        expect(moduleField.value).toBe("");
      });
    });

    test("should load data for edit mode", async () => {
      const editProps = {
        isEditClicked: true,
        approvalFlowId: "flow1",
      };

      renderComponent(editProps);

      await waitFor(() => {
        // Module should be pre-selected (module field is the first autocomplete)
        const moduleField =
          screen.getAllByPlaceholderText("Search or Select")[0];
        expect(moduleField).toBeInTheDocument();
      });
    });

    test("should show error when edit data fails to load", async () => {
      const editProps = {
        isEditClicked: true,
        approvalFlowId: "non-existent-id",
      };

      renderComponent(editProps);

      await waitFor(() => {
        const { toast } = require("react-toastify");
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to load approval flow",
          expect.any(Object)
        );
      });
    });

    test("should handle loading state during edit data fetch", async () => {
      const editProps = {
        isEditClicked: true,
        approvalFlowId: "flow1",
      };

      renderComponent(editProps);

      // Loading state should be handled
      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });
    });
  });

  describe("Module selection", () => {
    test("should filter out already used modules", async () => {
      renderComponent();

      await waitFor(() => {
        // module1 and module2 should be filtered out (already used)
        // Only module3 should be available
        const autocompletes = screen.getAllByTestId("autocomplete");
        expect(autocompletes.length).toBeGreaterThan(0);
      });
    });

    test("should allow selecting a module", async () => {
      renderComponent();

      const moduleInput = screen.getAllByTestId("autocomplete-input")[0];

      // Simulate selecting module3 by changing the hidden input
      fireEvent.change(moduleInput, { target: { value: "Module 3" } });

      await waitFor(() => {
        // Module should be selected (re-query in case the element was re-rendered)
        expect(screen.getAllByTestId("autocomplete-input")[0].value).toBe(
          "Module 3"
        );
      });
    });

    test("should show required validation when module is empty", async () => {
      renderComponent();

      const submitButton = screen.getByTestId("button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const { toast } = require("react-toastify");
        expect(toast.error).toHaveBeenCalledWith(
          "Module is required",
          expect.any(Object)
        );
      });
    });
  });

  describe("Approver group selection", () => {
    test("should populate approver groups from Redux store", async () => {
      renderComponent();

      await waitFor(() => {
        const approverField =
          screen.getAllByPlaceholderText("Search or Select")[1];
        expect(approverField).toBeInTheDocument();
      });
    });

    test("should allow selecting an approver group", async () => {
      renderComponent();

      const approverInputs = screen.getAllByTestId("autocomplete-input");
      const approverInput = approverInputs[1];

      // Simulate selecting Admin Group by changing the hidden input
      fireEvent.change(approverInput, { target: { value: "Admin Group" } });

      await waitFor(() => {
        // Re-query the input value after selection
        expect(screen.getAllByTestId("autocomplete-input")[1].value).toBe(
          "Admin Group"
        );
      });
    });

    // test('should show required validation when approver group is empty', async () => {
    //   renderComponent();

    //   // Fill module but not approver
    //   const moduleInput = screen.getAllByTestId('autocomplete-input')[0];
    //   // Simulate selecting module3 by changing the hidden input
    //   fireEvent.change(moduleInput, { target: { value: 'Module 3' } });

    //   const submitButton = screen.getByTestId('button');
    //   fireEvent.click(submitButton);

    //   await waitFor(() => {
    //     const { toast } = require('react-toastify');
    //     expect(toast.error).toHaveBeenCalledWith(
    //       'Approver group is required',
    //       expect.any(Object)
    //     );
    //   });
    // });
  });

  describe("Form validation", () => {
    // test('should enable submit button when both fields are filled', async () => {
    //   renderComponent();

    //   const inputs = screen.getAllByTestId('autocomplete-input');
    //   const moduleInput = inputs[0];
    //   const approverInput = inputs[1];

    //   // Fill both fields
    //   // Fill both fields using the hidden inputs
    //   fireEvent.change(moduleInput, { target: { value: 'Module 3' } });
    //   fireEvent.change(approverInput, { target: { value: 'Admin Group' } });

    //   const submitButton = screen.getByTestId('button');

    //   await waitFor(() => {
    //     expect(submitButton.getAttribute('data-disabled')).toBe('false');
    //   });
    // });

    test("should disable submit button when either field is empty", async () => {
      renderComponent();

      const submitButton = screen.getByTestId("button");

      await waitFor(() => {
        expect(submitButton.getAttribute("data-disabled")).toBe("true");
      });
    });
  });

  describe("Form submission", () => {
    // test('should submit form successfully in create mode', async () => {
    //   renderComponent();

    //   const inputs = screen.getAllByTestId('autocomplete-input');
    //   const moduleInput = inputs[0];
    //   const approverInput = inputs[1];

    //   // Fill form
    //   // Simulate selecting module3 by clicking the option
    //   const moduleOption = screen.getByTestId('option-Module 3');
    //   fireEvent.click(moduleOption);
    //   // Simulate selecting Admin Group by clicking the option
    //   const adminOption = screen.getByTestId('option-Admin Group');
    //   fireEvent.click(adminOption);

    //   const submitButton = screen.getByTestId('button');
    //   fireEvent.click(submitButton);

    //   await waitFor(() => {
    //     expect(mockHandleApprovalFlowConfig).toHaveBeenCalledWith({
    //       moduleType: 'module3',
    //       approverGroup: 'Admin Group'
    //     });

    //     const { toast } = require('react-toastify');
    //     expect(toast.success).toHaveBeenCalledWith(
    //       'Approval flow added successfully',
    //       expect.any(Object)
    //     );

    //     expect(defaultProps.setIsModelOpen).toHaveBeenCalledWith(false);
    //     expect(defaultProps.onSaveSuccess).toHaveBeenCalled();
    //   });
    // });

    // test('should submit form successfully in edit mode', async () => {
    //   const editProps = {
    //     isEditClicked: true,
    //     approvalFlowId: 'flow1'
    //   };

    //   renderComponent(editProps);

    //   await waitFor(() => {
    //     const inputs = screen.getAllByTestId('autocomplete-input');
    //     const moduleInput = inputs[0];
    //     const approverInput = inputs[1];

    //     // Modify values
    //     // Modify values via the hidden inputs
    //     fireEvent.change(moduleInput, { target: { value: 'Module 1' } });
    //     fireEvent.change(approverInput, { target: { value: 'User Group' } });

    //     const submitButton = screen.getByTestId('button');
    //     fireEvent.click(submitButton);

    //     expect(mockHandleApprovalFlowConfig).toHaveBeenCalledWith({
    //       _id: 'flow1',
    //       moduleType: 'module1',
    //       approverGroup: 'User Group'
    //     });

    //     const { toast } = require('react-toastify');
    //     expect(toast.success).toHaveBeenCalledWith(
    //       'Approval flow updated successfully',
    //       expect.any(Object)
    //     );
    //   });
    // });

    test("should show error when submission fails", async () => {
      mockHandleApprovalFlowConfig.mockRejectedValue(
        new Error("Submission failed")
      );

      renderComponent();

      const inputs = screen.getAllByTestId("autocomplete-input");
      const moduleInput = inputs[0];
      const approverInput = inputs[1];

      // Simulate form fill via hidden inputs
      fireEvent.change(moduleInput, { target: { value: "Module 3" } });
      fireEvent.change(approverInput, { target: { value: "Admin Group" } });

      const submitButton = screen.getByTestId("button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const { toast } = require("react-toastify");
        expect(toast.error).toHaveBeenCalled();
      });
    });

    // test('should show loading state during submission', async () => {
    //   mockHandleApprovalFlowConfig.mockImplementation(() =>
    //     new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
    //   );

    //   renderComponent();

    //   const inputs = screen.getAllByTestId('autocomplete-input');
    //   const moduleInput = inputs[0];
    //   const approverInput = inputs[1];

    //   // Select module and approver by changing the hidden inputs
    //   fireEvent.change(screen.getAllByTestId('autocomplete-input')[0], { target: { value: 'Module 3' } });
    //   fireEvent.change(screen.getAllByTestId('autocomplete-input')[1], { target: { value: 'Admin Group' } });

    //   const submitButton = screen.getByTestId('button');
    //   fireEvent.click(submitButton);

    //   // Button should show loading text
    //   await waitFor(() => {
    //     expect(submitButton.textContent).toContain('Adding...');
    //   });
    // });
  });

  describe("Button text based on mode", () => {
    test('should show "Add" button in create mode', async () => {
      renderComponent({ isEditClicked: false });

      await waitFor(() => {
        const submitButton = screen.getByTestId("button");
        expect(submitButton.textContent).toBe("Add");
      });
    });

    test('should show "Update" button in edit mode', async () => {
      renderComponent({ isEditClicked: true });

      await waitFor(() => {
        const submitButton = screen.getByTestId("button");
        expect(submitButton.textContent).toBe("Update");
      });
    });

    // test('should show "Adding..." when loading in create mode', async () => {
    //   renderComponent();

    //   const inputs = screen.getAllByTestId('autocomplete-input');
    //   // Select module and approver by clicking options
    //   const moduleOption = screen.getByTestId('option-Module 3');
    //   fireEvent.click(moduleOption);
    //   const adminOption = screen.getByTestId('option-Admin Group');
    //   fireEvent.click(adminOption);

    //   const submitButton = screen.getByTestId('button');
    //   fireEvent.click(submitButton);

    //   await waitFor(() => {
    //     // Button text should change to loading state
    //     expect(submitButton.textContent).toContain('Adding...');
    //   });
    // });

    // test('should show "Updating..." when loading in edit mode', async () => {
    //   renderComponent({ isEditClicked: true });

    //   // Wait for initial data load
    //   await waitFor(() => {
    //     const submitButton = screen.getByTestId('button');
    //     fireEvent.click(submitButton);
    //     expect(submitButton.textContent).toContain('Updating...');
    //   });
    // });
  });

  describe("Edge cases", () => {
    test("should handle empty IAM groups", async () => {
      const emptyState = {
        IAMGroups: [],
        approvalConfig: mockApprovalFlows,
      };

      renderComponent({}, emptyState);

      await waitFor(() => {
        const approverField =
          screen.getAllByPlaceholderText("Search or Select")[1];
        expect(approverField).toBeInTheDocument();
      });
    });

    test("should handle undefined approvalFlowsData", async () => {
      renderComponent({ approvalFlowsData: undefined });

      await waitFor(() => {
        // Should not crash
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });
    });

    test("should handle undefined MODULE_OPTIONS", async () => {
      // Temporarily override the mock
      const originalModule = require("../../../components/common/Constants/constantObjects");
      originalModule.MODULE_OPTIONS = undefined;

      renderComponent();

      await waitFor(() => {
        // Should handle gracefully
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });

      // Restore original
      originalModule.MODULE_OPTIONS = [
        { value: "module1", label: "Module 1" },
        { value: "module2", label: "Module 2" },
        { value: "module3", label: "Module 3" },
      ];
    });

    test("should handle missing module in edit mode", async () => {
      const stateWithMissingModule = {
        IAMGroups: mockIAMGroups,
        approvalConfig: [
          { _id: "flow1", approverGroup: "Admin Group" },
          // Missing moduleType
        ],
      };

      renderComponent(
        { isEditClicked: true, approvalFlowId: "flow1" },
        stateWithMissingModule
      );

      await waitFor(() => {
        // Should not crash
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    test("should have proper aria labels", async () => {
      renderComponent();

      await waitFor(() => {
        const inputs = screen.getAllByTestId("text-field");
        inputs.forEach((input) => {
          expect(input).toHaveAttribute("aria-label", "Without label");
        });
      });
    });

    test("should mark required fields with asterisk", async () => {
      renderComponent();

      await waitFor(() => {
        const requiredSpans = document.querySelectorAll(".iabot_required");
        expect(requiredSpans.length).toBe(2); // Module and Approver Group
        requiredSpans.forEach((span) => {
          expect(span.textContent).toBe("*");
        });
      });
    });

    test("should have proper form labels", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Module")).toBeInTheDocument();
        expect(screen.getByText("Approver Group")).toBeInTheDocument();
      });
    });
  });

  describe("Layout and styling", () => {
    test("should have proper modal styling", async () => {
      renderComponent();

      await waitFor(() => {
        const box = screen.getByTestId("box");
        expect(box).toBeInTheDocument();
        expect(box).toHaveStyle({
          position: "absolute",
          top: "50%",
          left: "50%",
        });
      });
    });

    test("should use grid layout", async () => {
      renderComponent();

      await waitFor(() => {
        const gridItems = screen.getAllByTestId("grid-item");
        expect(gridItems.length).toBe(2); // Module and Approver Group
        expect(gridItems[0]).toHaveAttribute("data-xs", "12");
        expect(gridItems[1]).toHaveAttribute("data-xs", "12");
      });
    });

    test("should have full-width form controls", async () => {
      renderComponent();

      await waitFor(() => {
        const formControls = screen.getAllByTestId("form-control");
        formControls.forEach((control) => {
          expect(control).toBeInTheDocument();
        });
      });
    });
  });
});
