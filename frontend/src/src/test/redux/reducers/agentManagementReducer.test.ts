/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable jest/no-identical-title */
import { cleanup } from "@testing-library/react-hooks";
import agentManagementReducer from "../../../redux/reducers/agentManagementReducer";
import { AGENT_MANAGEMENT } from "../../../config/actions";
import { AxiosInstace } from "../../../services/agent/agentManagement.service";

jest?.useFakeTimers();

beforeEach(() => {
  jest?.spyOn(AxiosInstace, "get");
});

afterEach(() => {
  cleanup();
});

describe("Agent Management Reducers", () => {
  let initialState;
  var action = { type: "" };
  it("renders", () => {
    initialState = undefined;
    action = "";
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Agent Start Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Start Service", () => {
    action = { type: AGENT_MANAGEMENT.START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Start Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Start Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Start Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Agent Health checkup Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Health Checkup Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Health Checkup Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Health Checkup Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Health Checkup Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Agent Health checkup by Port", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Health Checkup by Port Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP_BY_PORT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Health Checkup by Port Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP_BY_PORT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Health Checkup by Port Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP_BY_PORT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Health Checkup by Port Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP_BY_PORT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Agent Stop Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Stop Service", () => {
    action = { type: AGENT_MANAGEMENT.STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Stop Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Stop Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Stop Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Agent Job Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Job Service", () => {
    action = { type: AGENT_MANAGEMENT.RESTART_JOB_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Job Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_RESTART_JOB_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Job Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_RESTART_JOB_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Job Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_RESTART_JOB_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Agent Restart Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Restart Service", () => {
    action = { type: AGENT_MANAGEMENT.RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Restart Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Restart Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Restart Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Save Agent Property Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Save Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.SAVE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Save Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SAVE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Save Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SAVE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Save Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SAVE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Update Agent Property Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Update Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.UPDATE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Update Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_UPDATE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Update Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_UPDATE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Update Agent Property Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_UPDATE_AGENT_PROPERTY };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Fetch Agent Build Info", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Agent Build Info", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_BUILD_INFO };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Fetch Agent Build Info", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_BUILD_INFO };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Fetch Agent Build Info", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_BUILD_INFO };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Fetch Agent Build Info", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_BUILD_INFO };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Fetch Agent Global Config", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.globalConfigLoading).toBe(true);
  });
  it("Request Fetch Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.globalConfigLoading).toBe(true);
  });
  it("Success Fetch Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.globalConfigLoading).toBe(false);
  });
  it("Failure Fetch Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.globalConfigLoading).toBe(false);
  });
});

describe("Check Save Agent Global Config", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Save Global Config", () => {
    action = { type: AGENT_MANAGEMENT.SAVE_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Save Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SAVE_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Save Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SAVE_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Save Agent Global Config", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SAVE_GLOBAL_CONFIG };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Fetch Agent Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Fetch Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MANAGEMENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Fetch Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Fetch Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MANAGEMENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Fetch Agent Filter Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Agent Filter Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_FILTER };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Agent Filter Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_FILTER };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Agent Filter Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_FILTER };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Agent Filter Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_FILTER };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Fetch Agent Repositories Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Agent Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Agent Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Agent Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Agent Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Add Agent Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Add Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.ADD_AGENT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Request Add Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_ADD_AGENT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(true);
  });
  it("Success Add Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_ADD_AGENT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
  it("Failure Add Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_ADD_AGENT };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });
});

describe("Check Agent Logs Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Agent Logs Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_LOGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentLogLoading).toBe(true);
  });
  it("Request Agent Logs Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_LOGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentLogLoading).toBe(true);
  });
  it("Success Agent Logs Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_LOGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentLogLoading).toBe(false);
  });
  it("Failure Agent Logs Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_LOGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentLogLoading).toBe(false);
  });
});

describe("Check Agent Logs Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Reload Agent Logs Service", () => {
    action = { type: AGENT_MANAGEMENT.RELOAD_FETCH_AGENT_LOGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentLogLoading).toBe(true);
  });
});

describe("Check Save Local Configs Service", () => {
  let initialState;
  var action = { type: "" };

  it("Save Local Configs Service", () => {
    action = { type: AGENT_MANAGEMENT.SAVE_LOCAL_CONFIGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(true);
  });

  it("Request Save Local Configs Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SAVE_LOCAL_CONFIGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(true);
  });

  it("Success Save Local Configs Service", () => {
    action = {
      type: AGENT_MANAGEMENT.SUCCESS_SAVE_LOCAL_CONFIGS,
      successMessage: "Saved successfully",
    };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(false);
  });

  it("Failure Save Local Configs Service", () => {
    action = {
      type: AGENT_MANAGEMENT.FAILURE_SAVE_LOCAL_CONFIGS,
      error: "Error message",
    };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(false);
  });
});

describe("Check Fetch Local Configs Service", () => {
  let initialState;
  var action = { type: "" };

  it("Fetch Local Configs Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_LOCAL_CONFIGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(true);
  });

  it("Request Fetch Local Configs Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_LOCAL_CONFIGS };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(true);
  });

  it("Success Fetch Local Configs Service", () => {
    const mockData = { config: "value" };
    action = {
      type: AGENT_MANAGEMENT.SUCCESS_FETCH_LOCAL_CONFIGS,
      localConfigs: mockData,
    };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(false);
  });

  it("Failure Fetch Local Configs Service", () => {
    action = {
      type: AGENT_MANAGEMENT.FAILURE_FETCH_LOCAL_CONFIGS,
      error: "Error message",
    };
    const res = agentManagementReducer(initialState, action);
    expect(res.localConfigReload).toBe(false);
  });
});

describe("Check Fetch Repositories", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Fetch Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Fetch Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Fetch Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Download Repositories", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Download Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.DOWNLOAD_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Download Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_DOWNLOAD_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Download Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_DOWNLOAD_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Download Repositories Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_DOWNLOAD_REPOSITORIES };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check Save Scheduler Command Service", () => {
  let initialState;
  var action = { type: "" };
  it("Save Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.SAVE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Request Save Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SAVE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Success Save Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SAVE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
  it("Failure Save Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SAVE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
});

describe("Check Update Scheduler Command Service", () => {
  let initialState;
  var action = { type: "" };
  it("Update Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.UPDATE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Request Update Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_UPDATE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Success Update Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_UPDATE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
  it("Failure Update Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_UPDATE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
});

describe("Check Delete Scheduler Command Service", () => {
  let initialState;
  var action = { type: "" };
  it("Delete Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.DELETE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Request Delete Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_DELETE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Success Delete Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_DELETE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
  it("Failure Delete Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_DELETE_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
});

describe("check list scheduler command Service", () => {
  let initialState;
  var action = { type: "" };
  it("List Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.LIST_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Request List Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_LIST_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Success List Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_LIST_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
  it("Failure List Scheduler Command Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_LIST_SCHEDULER_COMMAND };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
});

describe("check fetch scheduler command id Service", () => {
  let initialState;
  var action = { type: "" };
  it("fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_SCHEDULED_JOBS_BY_COMMAND_ID };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Request fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(true);
  });
  it("Success fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
  it("Failure fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID };
    const res = agentManagementReducer(initialState, action);
    expect(res.schedulerLoading).toBe(false);
  });
});

describe("check syncup agent discovery Service", () => {
  let initialState;
  var action = { type: "" };
  it("fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.SYNCUP_AGENT_DISCOVERY };
    const res = agentManagementReducer(initialState, action);
    expect(res.adSyncupLoading).toBe(true);
  });
  it("Request fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SYNCUP_AGENT_DISCOVERY };
    const res = agentManagementReducer(initialState, action);
    expect(res.adSyncupLoading).toBe(true);
  });
  it("Success fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SYNCUP_AGENT_DISCOVERY };
    const res = agentManagementReducer(initialState, action);
    expect(res.adSyncupLoading).toBe(false);
  });
  it("Failure fetch Scheduler Command id Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SYNCUP_AGENT_DISCOVERY };
    const res = agentManagementReducer(initialState, action);
    expect(res.adSyncupLoading).toBe(false);
  });
});

describe("check get agent metrics Service", () => {
  let initialState;
  var action = { type: "" };
  it("fetch agent metrics Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_METRICS };
    const res = agentManagementReducer(initialState, action);
    expect(res.metricsLoading).toBe(true);
  });
  it("Request fetch agent metrics Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_METRICS };
    const res = agentManagementReducer(initialState, action);
    expect(res.metricsLoading).toBe(true);
  });
  it("Success fetch agent metrics Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_METRICS };
    const res = agentManagementReducer(initialState, action);
    expect(res.metricsLoading).toBe(false);
  });
  it("Failurefetch agent metrics Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_METRICS };
    const res = agentManagementReducer(initialState, action);
    expect(res.metricsLoading).toBe(false);
  });
});

describe("check agent sync scripts", () => {
  let initialState;
  var action = { type: "" };

  it("Sync script Service", () => {
    action = { type: AGENT_MANAGEMENT.SYNC_SCRIPTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Sync script Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SYNC_SCRIPTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Sync script Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SYNC_SCRIPTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Sync script Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SYNC_SCRIPTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.loading).toBe(false);
  });

  describe("check get agent region Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent region Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_REGIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent region Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REGIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent region Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REGIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent region Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REGIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("check get agent platform Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent platform Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_PLATFORMS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent platform Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_PLATFORMS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent platform Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_PLATFORMS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent platform Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_PLATFORMS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("check get agent environment Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent environment Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_ENVIRONMENTS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent environment Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_ENVIRONMENTS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent environment Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_ENVIRONMENTS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent environment Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_ENVIRONMENTS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("Check Fetch Metrics Tiles Data Service", () => {
    let initialState;
    let action;

    beforeEach(() => {
      initialState = {
        filterLoading: false,
        metricsTilesData: [{ id: 1 }], // Existing data
        error: null,
      };
    });

    it("should handle FETCH_METRICS_TILES_DATA", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_METRICS_TILES_DATA };
      const newState = agentManagementReducer(initialState, action);

      expect(newState.filterLoading).toBe(true);
      expect(newState.metricsTilesData).toEqual([]);
      expect(newState.error).toBeNull();
    });

    it("should handle REQUEST_FETCH_METRICS_TILES_DATA", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_METRICS_TILES_DATA };
      const newState = agentManagementReducer(initialState, action);

      expect(newState.filterLoading).toBe(true);
      expect(newState.metricsTilesData).toEqual([]);
      expect(newState.error).toBeNull();
    });

    it("should handle SUCCESS_FETCH_METRICS_TILES_DATA", () => {
      const mockData = [
        { id: 1, name: "Metric 1" },
        { id: 2, name: "Metric 2" },
      ];
      action = {
        type: AGENT_MANAGEMENT.SUCCESS_FETCH_METRICS_TILES_DATA,
        metricsTilesData: mockData,
      };
      const newState = agentManagementReducer(initialState, action);

      expect(newState.filterLoading).toBe(false);
      expect(newState.metricsTilesData).toEqual(mockData);
      expect(newState.error).toBeNull();
    });

    it("should handle FAILURE_FETCH_METRICS_TILES_DATA", () => {
      const errorMessage = "Failed to fetch metrics tiles data";
      action = {
        type: AGENT_MANAGEMENT.FAILURE_FETCH_METRICS_TILES_DATA,
        error: errorMessage,
      };
      const newState = agentManagementReducer(initialState, action);

      expect(newState.filterLoading).toBe(false);
      expect(newState.metricsTilesData).toEqual(initialState.metricsTilesData);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe("check get agent sid Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent sid Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_SIDS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent sid Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SIDS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent sid Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SIDS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent sid Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SIDS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("check get agent os Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent os Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_OS_TYPES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent os Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_OS_TYPES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent os Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_OS_TYPES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent os Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_OS_TYPES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("check get agent service name Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent service name Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_SERVICE_NAMES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent  service name Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SERVICE_NAMES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent  service name Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SERVICE_NAMES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent  service name Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SERVICE_NAMES };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("check get agent version Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch agent version Service", () => {
      action = { type: AGENT_MANAGEMENT.FETCH_AGENT_VERSIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request fetch agent version Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_VERSIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success fetch agent version Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_VERSIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failurefetch agent version Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_VERSIONS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });

  describe("check force update data agent Service", () => {
    let initialState;
    var action = { type: "" };
    it("fetch force update data agent Service", () => {
      action = { type: AGENT_MANAGEMENT.SYNC_AGENT_HEALTH_CONFIGS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Request force update data agent  Service", () => {
      action = { type: AGENT_MANAGEMENT.REQUEST_SYNC_AGENT_HEALTH_CONFIGS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(true);
    });
    it("Success force update data agent Service", () => {
      action = { type: AGENT_MANAGEMENT.SUCCESS_SYNC_AGENT_HEALTH_CONFIGS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
    it("Failure force update data agent Service", () => {
      action = { type: AGENT_MANAGEMENT.FAILURE_SYNC_AGENT_HEALTH_CONFIGS };
      const res = agentManagementReducer(initialState, action);
      expect(res.filterLoading).toBe(false);
    });
  });
});

describe("Check Selected Agent Start Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Start Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.START_SELECTED_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Start Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SELECTED_START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Start Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SELECTED_START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Start Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SELECTED_START_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check selected Agent Stop Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Stop Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.STOP_SELECTED_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Stop Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SELECTED_STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Stop Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SELECTED_STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Stop Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SELECTED_STOP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check selected Agent Restart Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Restart Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.RESTART_SELECTED_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Restart Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SELECTED_RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Restart Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SELECTED_RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Restart Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SELECTED_RESTART_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check selected Agent Health checkup Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch Health Checkup for Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.HEALTHCHECKUP_SELECTED_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request Health Checkup for Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_SELECTED_HEALTHCHECKUP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success Health Checkup for Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_SELECTED_HEALTHCHECKUP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Health Checkup for Selected Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_SELECTED_HEALTHCHECKUP_AGENT_SERVICE };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check get Agent version upgrade Service", () => {
  let initialState;
  var action = { type: "" };
  it("Fetch upgrade Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_UPGRADE_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request fetch upgrade Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_UPGRADE_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success fetch upgrade Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_UPGRADE_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure fetch upgrade Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_UPGRADE_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Check get Agent upgrade Service", () => {
  let initialState;
  var action = { type: "" };
  it("upgrade Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.UPGRADE_SELECTED_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Request upgrade Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_UPGRADE_SELECTED_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(true);
  });
  it("Success upgrade Agent Service", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_UPGRADE_SELECTED_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure upgrade Service", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_UPGRADE_SELECTED_AGENTS };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("Add masterdata", () => {
  let initialState;
  var action = { type: "" };
  it("Add masterdata", () => {
    action = { type: AGENT_MANAGEMENT.ADD_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Request Add masterdata", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_ADD_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Success Add masterdata", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_ADD_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure Add masterdata", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_ADD_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("get masterdata", () => {
  let initialState;
  var action = { type: "" };
  it("get masterdata", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Request get masterdata", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Success get masterdata", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure get masterdata", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MASTERDATA };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("delete masterdata", () => {
  let initialState;
  var action = { type: "" };
  it("delete masterdata", () => {
    action = { type: AGENT_MANAGEMENT.DELETE_HOSTNAME };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Request delete masterdata", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_DELETE_HOSTNAME };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Success delete masterdata", () => {
    action = { type: AGENT_MANAGEMENT.SUCCESS_DELETE_HOSTNAME };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
  it("Failure delete masterdata", () => {
    action = { type: AGENT_MANAGEMENT.FAILURE_DELETE_HOSTNAME };
    const res = agentManagementReducer(initialState, action);
    expect(res.serviceLoading).toBe(false);
  });
});

describe("fetch agent info", () => {
  let initialState;
  var action = { type: "" };

  it("fetch agent info", () => {
    action = { type: AGENT_MANAGEMENT.FETCH_AGENT_INFO };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentDetailsLoading).toBe(true);
    expect(res.agentInfo).toEqual({});
  });

  it("Request fetch agent info", () => {
    action = { type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_INFO };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentDetailsLoading).toBe(true);
    expect(res.agentInfo).toEqual({});
  });

  it("Success fetch agent info", () => {
    const mockAgentInfo = { id: 1, name: "Test Agent", status: "active" };
    action = {
      type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_INFO,
      agentInfo: mockAgentInfo,
    };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentDetailsLoading).toBe(false);
    expect(res.agentInfo).toEqual(mockAgentInfo);
  });

  it("Failure fetch agent info", () => {
    const errorMsg = "Failed to fetch agent info";
    action = {
      type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_INFO,
      error: errorMsg,
    };
    const res = agentManagementReducer(initialState, action);
    expect(res.agentDetailsLoading).toBe(false);
    expect(res.agentInfo).toEqual({});
    expect(res.error).toBe(errorMsg);
  });
});
