import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

// Mock toast so we can assert toast calls
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    POSITION: { TOP_RIGHT: "top" },
  },
}));

// Module paths used in imports inside ApprovalFlowList
const JobsServicePath = "../../../services/jobs/JobsService";
const IconsPath = "../../../components/ui/icons/Icons";
const CustomDatagridPath =
  "../../../components/common/CustomDatagrid/CustomDatagrid";
const DeleteConfirmationPath = "../../../layouts/report/DeleteConfirmation";
const ApprovalFlowModalPath =
  "../../../components/configuration/ApprovalFlowModal";
const SearchPath = "../../../components/ui/search/Search.component";

// Mock services response used in tests
const mockFetchResponse = {
  status: 200,
  data: {
    data: [{ _id: "1", approverGroup: "Group A", moduleType: "Module X" }],
    pagination: { totalPages: 1, totalRecords: 1 },
  },
};

// Mock permission util to always allow read+write in tests
// Ensure permission util is mocked by module name so ApprovalFlowList sees the mock
jest.mock("../../../utils/permissionUtil", () => ({
  hasInsightsPermission: jest.fn(() => true),
  PERMISSION_LIST: { APPROVAL_FLOW_READ: "r", APPROVAL_FLOW_WRITE: "w" },
}));

// Mock icons so renderCell returns clickable buttons we can interact with
jest.mock("../../../components/ui/icons/Icons", () => ({
  DateTimeIconHtml: () => <span />,
  EditIcon: ({ onClickHandle, id }) => (
    <button
      data-testid={`edit-groupButtonEdit`}
      onClick={() => onClickHandle && onClickHandle()}
    >
      Edit
    </button>
  ),
  DeleteIcon: ({ onClickHandle, id }) => (
    <button
      data-testid={`delete-groupButtonDelete`}
      onClick={() => onClickHandle && onClickHandle()}
    >
      Delete
    </button>
  ),
}));

// Simple mock of CustomDataGrid that executes column.renderCell for each row
jest.mock("../../../components/common/CustomDatagrid/CustomDatagrid", () => ({
  CustomDataGrid: ({ rows = [], columns = [] }) => (
    <div data-testid="custom-datagrid">
      {rows.map((row) => (
        <div key={row.id} data-row-id={row.id}>
          {columns.map((col) => (
            <div key={col.field} data-field={col.field}>
              {col.renderCell ? col.renderCell({ row }) : row[col.field]}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

// Mock DeleteConfirmation to render confirm button only when open
jest.mock("../../../layouts/report/DeleteConfirmation", () => (props) => {
  const { open, onConfirm } = props;
  if (!open) return null;
  return (
    <div>
      <button
        data-testid="confirm-delete"
        onClick={() => onConfirm && onConfirm()}
      >
        Confirm
      </button>
    </div>
  );
});

// Mock ApprovalFlowModal to avoid heavy internals
jest.mock(
  "../../../components/configuration/ApprovalFlowModal",
  () => (props) => {
    if (!props.isModalOpen) return null;
    // render different content for edit vs add so tests can assert
    return (
      <div data-testid="approval-flow-modal">
        {props.isEditClicked ? `edit-${props.approvalFlowId}` : `add`}
      </div>
    );
  }
);

// Mock Search to call handleSearchText on input change
jest.mock(SearchPath, () => (props) => (
  <input
    data-testid="search-input"
    onChange={(e) =>
      props.handleSearchText && props.handleSearchText(e.target.value)
    }
    placeholder={props.placeholder}
  />
));

// Now import the component under test (after mocks configured)
import ApprovalFlowList from "../../../components/configuration/ApprovalFlowList";
import * as JobsService from "../../../services/jobs/JobsService";
const { toast } = require("react-toastify");
const permissionUtil = require("../../../utils/permissionUtil");

describe("ApprovalFlowList component", () => {
  let mockDispatch;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    // Mock JobsService functions so dispatch(fetchApprovalFlowConfigs()) resolves
    const JobsService = require("../../../services/jobs/JobsService");
    jest
      .spyOn(JobsService, "fetchApprovalFlowConfigs")
      .mockImplementation((args) => () => Promise.resolve(mockFetchResponse));
    jest
      .spyOn(JobsService, "deleteApprovalConfig")
      .mockImplementation((id) =>
        Promise.resolve({ success: true, message: "Deleted" })
      );

    // Mock redux useSelector to return a jobs slice with approvalConfig and permissions
    jest
      .spyOn(require("react-redux"), "useSelector")
      .mockImplementation((selector) =>
        selector({
          jobs: {
            approvalConfig: [
              { _id: "1", approverGroup: "Group A", moduleType: "Module X" },
            ],
            permissions: {},
          },
        })
      );

    // dispatch should call thunk function if provided
    mockDispatch = jest.fn((fn) =>
      typeof fn === "function" ? fn() : Promise.resolve()
    );
    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("calls fetchApprovalFlowConfigs on mount with default paging", async () => {
    render(<ApprovalFlowList isSidebarExpanded={true} />);

    // advance debounce timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    // assert dispatch received a thunk (function)
    expect(typeof mockDispatch.mock.calls[0][0]).toBe("function");
  });

  test("renders rows and opens Add modal when Add button clicked", async () => {
    render(<ApprovalFlowList isSidebarExpanded={false} />);

    // Advance debounce and wait for data load
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    // Row text should appear in the document
    expect(screen.getByText("Group A")).toBeInTheDocument();

    // Add button opens the ApprovalFlowModal (mocked)
    const addButton = document.querySelector("#AddApprovalFlowButton");
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(
      await screen.findByTestId("approval-flow-modal")
    ).toBeInTheDocument();
  });

  test("search input triggers load (debounced)", async () => {
    render(<ApprovalFlowList isSidebarExpanded={false} />);

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Module" } });

    // debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
  });

  test("edit action opens modal with approvalFlowId", async () => {
    render(<ApprovalFlowList isSidebarExpanded={false} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    const editBtn = screen.getByTestId("edit-groupButtonEdit");
    fireEvent.click(editBtn);

    // modal should show edit-<id>
    expect(await screen.findByText("edit-1")).toBeInTheDocument();
  });

  test("delete flow calls deleteApprovalConfig and shows success toast", async () => {
    const JobsServiceModule = require("../../../services/jobs/JobsService");
    jest
      .spyOn(JobsServiceModule, "deleteApprovalConfig")
      .mockImplementation((id) =>
        Promise.resolve({ success: true, message: "Deleted" })
      );

    render(<ApprovalFlowList isSidebarExpanded={false} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    const deleteBtn = screen.getByTestId("delete-groupButtonDelete");
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByTestId("confirm-delete");
    fireEvent.click(confirmBtn);

    await waitFor(() =>
      expect(JobsServiceModule.deleteApprovalConfig).toHaveBeenCalledWith("1")
    );
    expect(toast.success).toHaveBeenCalled();
  });

  test("delete flow failure shows error toast", async () => {
    const JobsServiceModule = require("../../../services/jobs/JobsService");
    jest
      .spyOn(JobsServiceModule, "deleteApprovalConfig")
      .mockImplementation((id) =>
        Promise.resolve({ success: false, message: "Fail" })
      );

    render(<ApprovalFlowList isSidebarExpanded={false} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    const deleteBtn = screen.getByTestId("delete-groupButtonDelete");
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByTestId("confirm-delete");
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  test("loadData error path shows toast.error when fetch fails", async () => {
    const JobsServiceModule = require("../../../services/jobs/JobsService");
    jest
      .spyOn(JobsServiceModule, "fetchApprovalFlowConfigs")
      .mockImplementation(() => () => Promise.reject(new Error("fetch fail")));

    render(<ApprovalFlowList isSidebarExpanded={false} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  test("hides Add button and actions when permissions are absent", async () => {
    permissionUtil.hasInsightsPermission.mockReturnValue(false);

    render(<ApprovalFlowList isSidebarExpanded={false} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    expect(document.querySelector("#AddApprovalFlowButton")).toBeNull();
    // edit/delete buttons should not be present
    expect(screen.queryByTestId("edit-groupButtonEdit")).toBeNull();
    expect(screen.queryByTestId("delete-groupButtonDelete")).toBeNull();
  });
});
