import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchContainer from '../../../../layouts/agent-management/home/SearchContainer';
jest.useFakeTimers();

const mockDispatch = jest.fn();
const mockPush = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({
    userAuthorization: {
      myPermissions: [
        {
          project: 'agent',
          modules: [
            {
              module: 'Rise Agent',
              hasAccess: true,
              permissions: [
                { label: 'Rise Agent : view_agent', hasAccess: true },
                { label: 'Rise Agent : check_status', hasAccess: true }
              ]
            }
          ]
        }
      ],
      myPermissionsLoading: false
    }
  }),
  Provider: ({ children }) => children,
  connect: jest.fn((mapStateToProps, mapDispatchToProps) => (Component) => Component),
}));

jest.mock("@/utils/hooks/useAgentPermissions", () => ({
  __esModule: true,
  default: () => ({
    hasPermission: () => true,
    loading: false,
    permissions: []
  })
}));

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/redux/actions/agentManagement.action", () => ({
  fetchAgentManagementServices: jest.fn((payload) => ({ type: "FETCH", payload })),
  fetchAgentMetrics: jest.fn(() => ({ type: "FETCH_METRICS" })),
  syncAgentHealthConfigs: jest.fn(() => ({ type: "SYNC" })),
}));

jest.mock("../../../../layouts/agent-management/components/GlobalConfigurationModal", () => (props: any) =>
  props.show ? <div data-testid="globalModal">Modal Open</div> : null
);

const defaultState = {
  showFilters: true,
  agentSearch: "",
};

const setup = (overrideState = {}) => {
  const state = { ...defaultState, ...overrideState };

  const props = {
    state,
    setState: jest.fn(),
    setStatus: jest.fn(),
    loadFilterData: jest.fn(),
    filterAgentSearch: jest.fn(),
    getJsonData: jest.fn(() => ({
      pageSize: "10",
      pageNo: 1,
      status: "",
      agentSearch: "",
      os: [],
      region: [],
      environment: [],
      platform: [],
      sid: [],
      agentVersion: [],
      serviceName: [],
    })),
  };

  render(<SearchContainer {...props} />);
  return props;
};

describe("SearchContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.skip("renders title and filters text", () => {
  setup();
  expect(screen.getByText(/RISEAGENT Installed Servers/i)).toBeInTheDocument();
});

it("clicking search button calls filterAgentSearch", () => {
  const props = setup();

  fireEvent.click(screen.getByTestId("searchBtnId"));

  expect(props.filterAgentSearch).toHaveBeenCalled();
});

  it("typing in search triggers debounced fetch", async () => {
    setup();

    const input = screen.getByTestId("agentFilterSearch");

    fireEvent.change(input, { target: { value: "agent1" } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("pressing Enter triggers immediate fetch", () => {
    setup();

    const input = screen.getByTestId("agentFilterSearch");

    fireEvent.change(input, { target: { value: "abc" } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockDispatch).toHaveBeenCalled();
  });

 

  it("clicking Version Management navigates", () => {
    setup();

    fireEvent.click(screen.getByTestId("versionManagementBtn"));

    expect(mockPush).toHaveBeenCalledWith("/versionManagement");
  });

  it("clicking User Authorization navigates", () => {
    setup();

    fireEvent.click(screen.getByTestId("userAuthorizationBtn"));

    expect(mockPush).toHaveBeenCalledWith("/userAuthorization");
  });

  it("clicking sync button dispatches sync", () => {
    setup();

    fireEvent.click(screen.getByTestId("forceUpdateTestId"));

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("clicking refresh triggers dispatches and resets", () => {
    const props = setup();

    fireEvent.click(screen.getByTestId("refreshBtn"));

    expect(props.setStatus).toHaveBeenCalled();
    expect(props.loadFilterData).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  
});
