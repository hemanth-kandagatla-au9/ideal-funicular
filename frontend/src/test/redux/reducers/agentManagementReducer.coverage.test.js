import agentManagementReducer from "../../../redux/reducers/agentManagementReducer";
import { AGENT_MANAGEMENT } from "../../../config/actions";

describe("Agent Management Reducer - Coverage Tests", () => {
  const initialState = agentManagementReducer(undefined, {});

  it("returns initial state for unknown action", () => {
    const state = agentManagementReducer(initialState, { type: "UNKNOWN_ACTION" });
    expect(state).toBeDefined();
  });

  it("handles START_AGENT_SERVICE", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.START_AGENT_SERVICE,
    });
    expect(state.serviceLoading).toBe(true);
  });

  it("handles REQUEST_START_AGENT_SERVICE", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.REQUEST_START_AGENT_SERVICE,
    });
    expect(state.serviceLoading).toBe(true);
  });

  it("handles SUCCESS_START_AGENT_SERVICE", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.SUCCESS_START_AGENT_SERVICE,
      payload: { message: "Success" },
    });
    expect(state.serviceLoading).toBe(false);
  });

  it("handles FAILURE_START_AGENT_SERVICE", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.FAILURE_START_AGENT_SERVICE,
      payload: { error: "Error" },
    });
    expect(state.serviceLoading).toBe(false);
  });

  it("handles FETCH_AGENT_MANAGEMENT_SERVICES", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE,
    });
    expect(state.loading).toBe(true);
  });

  it("handles SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE", () => {
    const payload = [
      { id: 1, name: "Agent1" },
      { id: 2, name: "Agent2" },
    ];
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE,
      agentServers: payload,
    });
    expect(state.loading).toBe(false);
    expect(state.agentServers).toBeDefined();
  });

  it("handles FAILURE_FETCH_AGENT_MANAGEMENT_SERVICE", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MANAGEMENT_SERVICE,
      error: "Failed to fetch",
    });
    expect(state.loading).toBe(false);
  });

  it("handles SUCCESS_FETCH_AGENT_FILTER", () => {
    const state = agentManagementReducer(initialState, {
      type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_FILTER,
      filterAgents: [{ os: ["Linux"] }],
    });
    expect(state.filterAgents).toBeDefined();
  });

  it("handles multiple consecutive actions", () => {
    let state = initialState;
    
    state = agentManagementReducer(state, {
      type: AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE,
    });
    expect(state.loading).toBe(true);
    
    state = agentManagementReducer(state, {
      type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE,
      agentServers: [],
    });
    expect(state.loading).toBe(false);
  });
});
