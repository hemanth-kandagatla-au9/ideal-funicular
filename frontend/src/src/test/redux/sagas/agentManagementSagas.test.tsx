/* eslint-disable @typescript-eslint/no-var-requires */
import { expectSaga } from "redux-saga-test-plan";
import { all, call, put, takeLatest } from "redux-saga/effects";
import * as matchers from "redux-saga-test-plan/matchers";
import agentManagementActions from "../../../redux/actions/agentManagement.action";
import actionWatcher, {
  addAgents,
  agentDiscoverySyncup,
  agentHealthCheckup,
  agentHealthCheckupByPort,
  deleteSchedulerCommands,
  downloadRepo,
  fetchAgentBuildInfo,
  fetchAgentFilterService,
  fetchAgentGlobalConfig,
  fetchAgentLocalConfigs,
  shutDownAgentManagerService,
  startSSHAgentManagerService,
  fetchAgentLogs,
  fetchAgentRepo,
  fetchAgentServices,
  fetchFilterAgentRepos,
  fetchScheduledJobsByCommandId,
  fetchAgentInfo,
  getAgentMetrics,
  listSchedulerCommands,
  restartAgentManagerService,
  restartJobManagerService,
  saveAgentGlobalConfig,
  saveAgentLocalConfigs,
  saveAgentManagerProperty,
  saveSchedulerCommands,
  startAgentManagerService,
  stopAgentManagerServices,
  syncScript,
  updateAgentManagerProperty,
  updateSchedulerCommands,
  getAgentRegions,
  getAgentPlatforms,
  getAgentSids,
  getAgentEnvironments,
  getAgentOsTypes,
  getAgentServiceNames,
  getAgentVersions,
  getSyncAgentHealthConfigs,
  getAgentUpgrade,
  healthChecksSelectedAgent,
  restartsSelectedAgent,
  startsSelectedAgent,
  stopsSelectedAgent,
  upgradeAgents,
  addAgentMasterdata,
  deleteHostname,
  getAgentMasterdata,
} from "../../../redux/sagas/agentManagementSagas";
import agentManagementService from "../../../services/agent/agentManagement.service";
import { errortoast } from "../../../layouts/agent-management/helpers/CustomToast";
import { AGENT_MANAGEMENT } from "../../../config/actions";

jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  errortoast: jest.fn(),
  successtoast: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("restartJobManagerService saga", () => {
  const payload = {
    jobId: "job-123",
    hostname: "test-host",
  };

  const successResponse = {
    data: {
      flag: "success",
      message: "Jobs restarted successfully",
    },
  };

  const errorFlagResponse = {
    data: {
      flag: "error",
      error: "Restart failed: Job not found",
    },
  };
  it("should successfully restart jobs", () => {
    return expectSaga(restartJobManagerService, { props: payload })
      .put(agentManagementActions.requestRestartJobService())
      .provide([[call(agentManagementService.jobReStartService, payload), successResponse]])
      .put(agentManagementActions.successRestartJobService(successResponse))
      .run();
  });
  it("should handle job restart service failure", () => {
    const error = new Error("Network error during restart");
    return expectSaga(restartJobManagerService, { props: payload })
      .put(agentManagementActions.requestRestartJobService())
      .provide([[call(agentManagementService.jobReStartService, payload), Promise.reject(error)]])
      .put(agentManagementActions.failureRestartJobService(error))
      .run();
  });
  it("should handle undefined restart response", () => {
    return expectSaga(restartJobManagerService, { props: payload })
      .put(agentManagementActions.requestRestartJobService())
      .provide([[call(agentManagementService.jobReStartService, payload), undefined]])
      .put(agentManagementActions.successRestartJobService(undefined))
      .run();
  });
  it("should handle malformed restart response", () => {
    const malformedResponse = {
      status: 200,
      message: "OK",
    };
    return expectSaga(restartJobManagerService, { props: payload })
      .put(agentManagementActions.requestRestartJobService())
      .provide([[call(agentManagementService.jobReStartService, payload), malformedResponse]])
      .put(agentManagementActions.successRestartJobService(malformedResponse))
      .run();
  });
});

describe("shutDownAgentManagerService saga", () => {
  const payload = {
    hostname: "test-host",
    agentId: "agent-123",
  };

  const successResponse = {
    data: {
      flag: "success",
      message: "Shutdown completed",
    },
  };

  const errorResponse = {
    data: {
      flag: "error",
      error: "Shutdown failed",
    },
  };
  it("should successfully shutdown agent service", () => {
    return expectSaga(shutDownAgentManagerService, { props: payload })
      .put(agentManagementActions.requestShutDownAgentService())
      .provide([[call(agentManagementService.agentShutDownService, payload), successResponse]])
      .put(agentManagementActions.successShutDownAgentService(successResponse))
      .run();
  });
  it("should handle error flag in shutdown response", () => {
    return expectSaga(shutDownAgentManagerService, { props: payload })
      .put(agentManagementActions.requestShutDownAgentService())
      .provide([[call(agentManagementService.agentShutDownService, payload), errorResponse]])
      .put(agentManagementActions.successShutDownAgentService(errorResponse))
      .run();
  });
  it("should handle shutdown service failure", () => {
    const error = new Error("Network error");
    return expectSaga(shutDownAgentManagerService, { props: payload })
      .put(agentManagementActions.requestShutDownAgentService())
      .provide([[call(agentManagementService.agentShutDownService, payload), Promise.reject(error)]])
      .put(agentManagementActions.failureRestartAgentService(error))
      .run();
  });
  it("should handle undefined shutdown response", () => {
    return expectSaga(shutDownAgentManagerService, { props: payload })
      .put(agentManagementActions.requestShutDownAgentService())
      .provide([[call(agentManagementService.agentShutDownService, payload), undefined]])
      .put(agentManagementActions.successShutDownAgentService(undefined))
      .run();
  });
});

describe("startSSHAgentManagerService saga", () => {
  const payload = {
    hostname: "test-host",
    agentId: "agent-123",
  };

  const successResponse = {
    data: {
      flag: "success",
      message: "Start completed",
    },
  };

  const errorResponse = {
    data: {
      flag: "error",
      error: "Start failed",
    },
  };
  it("should successfully start agent via SSH", () => {
    return expectSaga(startSSHAgentManagerService, { props: payload })
      .put(agentManagementActions.requestStartSSHAgentService())
      .provide([[call(agentManagementService.agentStartSSHService, payload), successResponse]])
      .put(agentManagementActions.successStartSSHAgentService(successResponse))
      .run();
  });
  it("should handle error flag in start response", () => {
    return expectSaga(startSSHAgentManagerService, { props: payload })
      .put(agentManagementActions.requestStartSSHAgentService())
      .provide([[call(agentManagementService.agentStartSSHService, payload), errorResponse]])
      .put(agentManagementActions.successStartSSHAgentService(errorResponse))
      .run();
  });
  it("should handle start service failure", () => {
    const error = new Error("SSH connection failed");
    return expectSaga(startSSHAgentManagerService, { props: payload })
      .put(agentManagementActions.requestStartSSHAgentService())
      .provide([[call(agentManagementService.agentStartSSHService, payload), Promise.reject(error)]])
      .put(agentManagementActions.failureStartSSHAgentService(error))
      .run();
  });
  it("should handle malformed start response", () => {
    const malformedResponse = {
      status: 200,
      message: "OK",
    };
    return expectSaga(startSSHAgentManagerService, { props: payload })
      .put(agentManagementActions.requestStartSSHAgentService())
      .provide([[call(agentManagementService.agentStartSSHService, payload), malformedResponse]])
      .put(agentManagementActions.successStartSSHAgentService(malformedResponse))
      .run();
  });
});

describe("updateAgentManagerProperty saga", () => {
  const successResponse = {
    flag: "success",
    data: {
      property: "updatedValue",
      status: "updated",
    },
  };
  it("should successfully update agent property", () => {
    return expectSaga(updateAgentManagerProperty)
      .put(agentManagementActions.requestUpdateAgentProperty())
      .provide([[call(agentManagementService.updateAgentManagerProperty), successResponse]])
      .put(agentManagementActions.successUpdateAgentProperty(successResponse))
      .run();
  });
  it("should handle update agent property failure", () => {
    const error = new Error("Update failed");
    return expectSaga(updateAgentManagerProperty)
      .put(agentManagementActions.requestUpdateAgentProperty())
      .provide([[call(agentManagementService.updateAgentManagerProperty), Promise.reject(error)]])
      .put(agentManagementActions.failureUpdateAgentProperty(error))
      .run();
  });
  it("should handle undefined response when updating agent property", () => {
    return expectSaga(updateAgentManagerProperty)
      .put(agentManagementActions.requestUpdateAgentProperty())
      .provide([[call(agentManagementService.updateAgentManagerProperty), undefined]])
      .put(agentManagementActions.successUpdateAgentProperty(undefined))
      .run();
  });
});
describe("agent sagas", () => {
  describe("startAgentManagerService error cases", () => {
    const payload = { hostname: "test", agentId: "10001" };
    it("should handle agent start service failure", () => {
      const error = new Error("Start service unavailable");

      return expectSaga(startAgentManagerService, { props: payload })
        .put(agentManagementActions.requestStartAgentService())
        .provide([[call(agentManagementService.agentStartService, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureStartAgentService(error))
        .run();
    });
    it("should handle error flag in start response", () => {
      const errorResponse = {
        data: {
          flag: "error",
          error: "Port already in use",
        },
      };

      return expectSaga(startAgentManagerService, { props: payload })
        .put(agentManagementActions.requestStartAgentService())
        .provide([[call(agentManagementService.agentStartService, payload), errorResponse]])
        .put(agentManagementActions.successStartAgentService(errorResponse))
        .run();
    });
  });
  it("check agent start service saga", () => {
    const payload = { hostname: "test", agentId: "10001" };
    const response = { flag: "success", data: { pid: "10001" } };
    return expectSaga(startAgentManagerService, payload)
      .put(agentManagementActions.requestStartAgentService())
      .provide([[call(agentManagementService.agentStartService, payload)], [matchers.call.fn(agentManagementService.agentStartService), response]])
      .put(agentManagementActions.successStartAgentService())
      .run();
  });
  it("check agent health check service", () => {
    const payload = { hostname: "test", agentId: "10001" };
    const response = { flag: "success" };
    return expectSaga(agentHealthCheckup, payload)
      .put(agentManagementActions.requestFetchHealthCheckup())
      .provide([[call(agentManagementService.agentHealthCheck, payload)], [matchers.call.fn(agentManagementService.agentHealthCheck), response]])
      .put(agentManagementActions.successFetchHealthCheckup(response))
      .run();
  });
  describe("agentHealthCheckupByPort saga error cases", () => {
    it("should handle health check by port failure", () => {
      const error = new Error("Health check service unavailable");

      return expectSaga(agentHealthCheckupByPort)
        .put(agentManagementActions.requestFetchHealthCheckupByPort())
        .provide([[call(agentManagementService.healthCheckupByPort), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchHealthCheckupByPort(error))
        .run();
    });
    it("should handle network timeout error", () => {
      const timeoutError = new Error("Connection timeout");
      timeoutError.code = "ETIMEDOUT";

      return expectSaga(agentHealthCheckupByPort)
        .put(agentManagementActions.requestFetchHealthCheckupByPort())
        .provide([[call(agentManagementService.healthCheckupByPort), Promise.reject(timeoutError)]])
        .put(agentManagementActions.failureFetchHealthCheckupByPort(timeoutError))
        .run();
    });
  });
  it("check agent health check by port", () => {
    const response = { flag: "success" };
    return expectSaga(agentHealthCheckupByPort)
      .put(agentManagementActions.requestFetchHealthCheckupByPort())
      .provide([[call(agentManagementService.healthCheckupByPort)], [matchers.call.fn(agentManagementService.healthCheckupByPort), response]])
      .put(agentManagementActions.successFetchHealthCheckupByPort())
      .run();
  });
  it("check agent stop service saga", () => {
    const payload = { hostname: "test", agentId: "10001" };
    const response = { flag: "success" };
    return expectSaga(stopAgentManagerServices, payload)
      .put(agentManagementActions.requestStopAgentServices())
      .provide([[call(agentManagementService.agentStopService, payload)], [matchers.call.fn(agentManagementService.agentStopService), response]])
      .put(agentManagementActions.successStopAgentServices())
      .run();
  });
  it("check agent restart service saga", () => {
    const payload = { hostname: "test", agentId: "10001" };
    const response = { flag: "success" };
    return expectSaga(restartAgentManagerService, payload)
      .put(agentManagementActions.requestRestartAgentService())
      .provide([[call(agentManagementService.agentReStartService, payload)], [matchers.call.fn(agentManagementService.agentReStartService), response]])
      .put(agentManagementActions.successRestartAgentService())
      .run();
  });
  describe("saveAgentManagerProperty saga", () => {
    const successResponse = {
      flag: "success",
      data: {
        property: "value",
        status: "saved",
      },
    };
    it("should successfully save agent property", () => {
      return expectSaga(saveAgentManagerProperty)
        .put(agentManagementActions.requestSaveAgentProperty())
        .provide([[call(agentManagementService.saveAgentManagerProperty), successResponse]])
        .put(agentManagementActions.successSaveAgentProperty(successResponse))
        .run();
    });
    it("should handle save agent property failure", () => {
      const error = new Error("Save failed");
      return expectSaga(saveAgentManagerProperty)
        .put(agentManagementActions.requestSaveAgentProperty())
        .provide([[call(agentManagementService.saveAgentManagerProperty), Promise.reject(error)]])
        .put(agentManagementActions.failureSaveAgentProperty(error))
        .run();
    });
    it("should handle empty response when saving agent property", () => {
      return expectSaga(saveAgentManagerProperty)
        .put(agentManagementActions.requestSaveAgentProperty())
        .provide([[call(agentManagementService.saveAgentManagerProperty), {}]])
        .put(agentManagementActions.successSaveAgentProperty({}))
        .run();
    });
  });
  it("check fetch agent build info", () => {
    const response = { flag: "success" };
    return expectSaga(fetchAgentBuildInfo)
      .put(agentManagementActions.requestFetchAgentBuildInfo())
      .provide([[call(agentManagementService.fetchBuildInfo)], [matchers.call.fn(agentManagementService.fetchBuildInfo), response]])
      .put(agentManagementActions.successFetchAgentBuildInfo())
      .run();
  });
  it("should handle fetch agent build info failure", () => {
    const error = new Error("Failed to fetch build info");

    return expectSaga(fetchAgentBuildInfo)
      .put(agentManagementActions.requestFetchAgentBuildInfo())
      .provide([[call(agentManagementService.fetchBuildInfo), Promise.reject(error)]])
      .put(agentManagementActions.failureFetchAgentBuildInfo(error))
      .run();
  });
  it("check save global config", () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const response = { flag: "success" };
    return expectSaga(saveAgentGlobalConfig, request)
      .put(agentManagementActions.requestSaveGlobalConfig())
      .provide([
        [call(agentManagementService.saveGlobalConfig), request],
        [matchers.call.fn(agentManagementService.saveGlobalConfig), response],
      ])
      .put(agentManagementActions.successSaveGlobalConfig(response))
      .run();
  });
  describe("fetchAgentServices saga", () => {
    const payload = {
      pageSize: "10",
      pageNo: "0",
      status: "failed",
      agentSearch: "test",
    };

    const successResponse = {
      data: {
        data: { agentServers: {} },
        flag: "success",
      },
    };

    it("should successfully fetch agent services", () => {
      return expectSaga(fetchAgentServices, { props: payload })
        .put(agentManagementActions.requestFetchAgentManagementServices())
        .provide([[call(agentManagementService.fetchAgentService, payload), successResponse]])
        .put(agentManagementActions.successFetchAgentManagementServices(successResponse.data.data))
        .run();
    });

    it("should handle fetch agent services failure", () => {
      const error = new Error("Service unavailable");
      return expectSaga(fetchAgentServices, { props: payload })
        .put(agentManagementActions.requestFetchAgentManagementServices())
        .provide([[call(agentManagementService.fetchAgentService, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchAgentManagementServices(error))
        .run();
    });
  });
  describe("fetchAgentFilterService saga", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };

    const successResponse = { flag: "success" };

    it("should successfully fetch agent filters", () => {
      return expectSaga(fetchAgentFilterService, { props: payload })
        .put(agentManagementActions.requestFetchAgentFilters())
        .provide([[call(agentManagementService.filterAgentService, payload), successResponse]])
        .put(agentManagementActions.successFetchAgentFilters(successResponse))
        .run();
    });

    it("should handle fetch agent filters failure", () => {
      const error = new Error("Filter error");
      return expectSaga(fetchAgentFilterService, { props: payload })
        .put(agentManagementActions.requestFetchAgentFilters())
        .provide([[call(agentManagementService.filterAgentService, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchAgentFilters(error))
        .run();
    });
  });
  describe("fetchFilterAgentRepos saga", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };

    const successResponse = { flag: "success" };

    it("should successfully fetch agent repositories", () => {
      return expectSaga(fetchFilterAgentRepos, { props: payload })
        .put(agentManagementActions.requestFetchAgentRepositories())
        .provide([[call(agentManagementService.filterAgentRepoService, payload), successResponse]])
        .put(agentManagementActions.successFetchAgentRepositories(successResponse))
        .run();
    });

    it("should handle fetch agent repositories failure", () => {
      const error = new Error("Repository error");
      return expectSaga(fetchFilterAgentRepos, { props: payload })
        .put(agentManagementActions.requestFetchAgentRepositories())
        .provide([[call(agentManagementService.filterAgentRepoService, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchAgentRepositories(error))
        .run();
    });
  });
  it("check add agent service", () => {
    const payload = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const response = { flag: "success" };
    return expectSaga(addAgents, payload)
      .put(agentManagementActions.requestAddAgent())
      .provide([
        [call(agentManagementService.addAgentService), payload],
        [matchers.call.fn(agentManagementService.addAgentService), response],
      ])
      .put(agentManagementActions.successAddAgent(response))
      .run();
  });
  it("check save local config", () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const response = { flag: "success" };
    return expectSaga(saveAgentLocalConfigs, request)
      .put(agentManagementActions.requestSaveLocalConfigs())
      .provide([
        [call(agentManagementService.saveLocalConfigs), request],
        [matchers.call.fn(agentManagementService.saveLocalConfigs), response],
      ])
      .put(agentManagementActions.successSaveLocalConfigs(response))
      .run();
  });
  it("check fetch local config service", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };
    const response = { flag: "success" };
    return expectSaga(fetchAgentLocalConfigs, payload)
      .put(agentManagementActions.requestFetchLocalConfigs())
      .provide([
        [call(agentManagementService.fetchLocalConfigs), payload],
        [matchers.call.fn(agentManagementService.fetchLocalConfigs), response],
      ])
      .put(agentManagementActions.successFetchLocalConfigs(response))
      .run();
  });
  it("check fetch agent repo service", () => {
    const payload = {
      type: "test",
    };
    const response = { flag: "success" };
    return expectSaga(fetchAgentRepo, payload)
      .put(agentManagementActions.requestFetchRepositories())
      .provide([
        [call(agentManagementService.getAgentRepoService), payload],
        [matchers.call.fn(agentManagementService.getAgentRepoService), response],
      ])
      .put(agentManagementActions.successFetchRepositories(response))
      .run();
  });

  it("should handle fetch local config service failure", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };
    const error = new Error("Failed to fetch local configs");

    return expectSaga(fetchAgentLocalConfigs, { props: payload })
      .put(agentManagementActions.requestFetchLocalConfigs())
      .provide([[call(agentManagementService.fetchLocalConfigs, payload), Promise.reject(error)]])
      .put(agentManagementActions.failureFetchLocalConfigs(error))
      .run();
  });

  it("should handle fetch agent repo service failure", () => {
    const payload = {
      type: "test",
    };
    const error = new Error("Failed to fetch repositories");

    return expectSaga(fetchAgentRepo, { props: payload })
      .put(agentManagementActions.requestFetchRepositories())
      .provide([[call(agentManagementService.getAgentRepoService, payload), Promise.reject(error)]])
      .put(agentManagementActions.failureFetchRepositories(error))
      .run();
  });
  it("check download agent repo service", () => {
    const payload = {
      version: "v0.0.1",
      hostname: "test",
      agentId: "10001",
    };
    const response = { flag: "success" };
    return expectSaga(downloadRepo, payload)
      .put(agentManagementActions.requestDownloadRepositories())
      .provide([
        [call(agentManagementService.downloadRepositories), payload],
        [matchers.call.fn(agentManagementService.downloadRepositories), response],
      ])
      .put(agentManagementActions.successDownloadRepositories(response))
      .run();
  });
  describe("saveSchedulerCommands saga", () => {
    const payload = {
      command: "test-command",
      schedule: "* * * * *",
      agentId: "agent123",
    };
    const mockSuccessResponse = {
      data: {
        flag: "success",
        message: "Schedule saved successfully",
      },
    };
    const mockErrorFlagResponse = {
      data: {
        flag: "error",
        error: "Validation failed",
      },
    };
    const mockError = new Error("Network error");
    it("should handle successful schedule save", () => {
      return expectSaga(saveSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestSaveSchedulerCommand())
        .provide([[call(agentManagementService.saveSchedulerCommand, payload), mockSuccessResponse]])
        .put(agentManagementActions.successSaveSchedulerCommand(mockSuccessResponse))
        .run();
    });
    it("should handle error flag in response", () => {
      return expectSaga(saveSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestSaveSchedulerCommand())
        .provide([[call(agentManagementService.saveSchedulerCommand, payload), mockErrorFlagResponse]])
        .put(agentManagementActions.failureSaveSchedulerCommand(new Error("")))
        .run();
    });
    it("should handle service failure with Promise.reject", () => {
      return expectSaga(saveSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestSaveSchedulerCommand())
        .provide([[call(agentManagementService.saveSchedulerCommand, payload), Promise.reject(mockError)]])
        .put(agentManagementActions.failureSaveSchedulerCommand(mockError))
        .run();
    });
    it("should handle undefined response", () => {
      return expectSaga(saveSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestSaveSchedulerCommand())
        .provide([[call(agentManagementService.saveSchedulerCommand, payload), undefined]])
        .put(agentManagementActions.successSaveSchedulerCommand(undefined))
        .run();
    });
    it("should handle malformed response", () => {
      const malformedResponse = {
        status: 200,
        message: "OK",
      };

      return expectSaga(saveSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestSaveSchedulerCommand())
        .provide([[call(agentManagementService.saveSchedulerCommand, payload), malformedResponse]])
        .put(agentManagementActions.successSaveSchedulerCommand(malformedResponse))
        .run();
    });
  });
  it("check update scheduler command service", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
      cronExpression: "test",
      command: "test",
      enabled: true,
      opensearchEnabled: true,
      opensearchIndex: "test",
    };
    const response = { flag: "success" };
    return expectSaga(updateSchedulerCommands, payload)
      .put(agentManagementActions.requestUpdateSchedulerCommand())
      .provide([
        [call(agentManagementService.updateSchedulerCommand), payload],
        [matchers.call.fn(agentManagementService.updateSchedulerCommand), response],
      ])
      .put(agentManagementActions.successUpdateSchedulerCommand(response))
      .run();
  });
  it("check delete scheduler command service", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
      scheduledJobId: "1000",
    };
    const response = { flag: "success" };
    return expectSaga(deleteSchedulerCommands, payload)
      .put(agentManagementActions.requestDeleteSchedulerCommand())
      .provide([
        [call(agentManagementService.deleteSchedulerCommand), payload],
        [matchers.call.fn(agentManagementService.deleteSchedulerCommand), response],
      ])
      .put(agentManagementActions.successDeleteSchedulerCommand(response))
      .run();
  });
  it("should show error toast when response is empty", async () => {
    const { errortoast } = require("../../../layouts/agent-management/helpers/CustomToast");
    const payload = {
      hostname: "test",
      agentId: "10001",
    };
    const emptyResponse = {};

    await expectSaga(listSchedulerCommands, { props: payload })
      .provide([[call(agentManagementService.listSchedulerCommand, payload), emptyResponse]])
      .run();

    expect(errortoast).toHaveBeenCalledWith("Failed to list scheduled jobs");
  });

  describe("listSchedulerCommands saga", () => {
    const payload = {
      agentId: "12345",
      hostname: "test-host",
    };

    const mockSuccessResponse = {
      data: {
        data: [
          { id: "cmd1", name: "Command 1" },
          { id: "cmd2", name: "Command 2" },
        ],
      },
    };

    const mockEmptyResponse = {
      data: {
        data: [],
      },
    };

    it("should successfully list scheduler commands", () => {
      return expectSaga(listSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestListSchedulerCommand())
        .provide([[call(agentManagementService.listSchedulerCommand, payload), mockSuccessResponse]])
        .put(agentManagementActions.successListSchedulerCommand(mockSuccessResponse.data.data))
        .run();
    });

    it("should handle empty response", () => {
      return expectSaga(listSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestListSchedulerCommand())
        .provide([[call(agentManagementService.listSchedulerCommand, payload), mockEmptyResponse]])
        .put(agentManagementActions.successListSchedulerCommand([]))
        .run();
    });

    it("should handle undefined response", () => {
      return expectSaga(listSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestListSchedulerCommand())
        .provide([[call(agentManagementService.listSchedulerCommand, payload), undefined]])
        .put(agentManagementActions.successListSchedulerCommand([]))
        .run();
    });

    it("should handle service failure with Promise.reject", () => {
      const error = new Error("Network error");

      return expectSaga(listSchedulerCommands, { props: payload })
        .put(agentManagementActions.requestListSchedulerCommand())
        .provide([[call(agentManagementService.listSchedulerCommand, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureListSchedulerCommand(error))
        .run();
    });
  });

  describe("fetchScheduledJobsByCommandId saga", () => {
    const payload = {
      commandId: "cmd123",
      agentId: "agent456",
    };

    const mockSuccessResponse = {
      data: {
        jobs: [
          { id: "job1", status: "pending" },
          { id: "job2", status: "completed" },
        ],
        flag: "success",
      },
    };

    const mockErrorResponse = {
      data: {
        error: "Command not found",
        flag: "error",
      },
    };

    it("should successfully fetch scheduled jobs by command ID", () => {
      return expectSaga(fetchScheduledJobsByCommandId, { props: payload })
        .put(agentManagementActions.RequestFetchScheduledJobsByCommandId())
        .provide([[call(agentManagementService.getSchdulerById, payload), mockSuccessResponse]])
        .put(agentManagementActions.successFetchScheduledJobsByCommandId(mockSuccessResponse))
        .run();
    });

    it("should handle error flag in response", () => {
      return expectSaga(fetchScheduledJobsByCommandId, { props: payload })
        .put(agentManagementActions.RequestFetchScheduledJobsByCommandId())
        .provide([[call(agentManagementService.getSchdulerById, payload), mockErrorResponse]])
        .put(agentManagementActions.successFetchScheduledJobsByCommandId(mockErrorResponse))
        .run();
    });

    it("should handle service failure with Promise.reject", () => {
      const error = new Error("Database error");

      return expectSaga(fetchScheduledJobsByCommandId, { props: payload })
        .put(agentManagementActions.RequestFetchScheduledJobsByCommandId())
        .provide([[call(agentManagementService.getSchdulerById, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchScheduledJobsByCommandId(error))
        .run();
    });

    it("should handle undefined response", () => {
      return expectSaga(fetchScheduledJobsByCommandId, { props: payload })
        .put(agentManagementActions.RequestFetchScheduledJobsByCommandId())
        .provide([[call(agentManagementService.getSchdulerById, payload), undefined]])
        .put(agentManagementActions.successFetchScheduledJobsByCommandId(undefined))
        .run();
    });
  });

  it("check fetch scheduler command by id service cover toast", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
      scheduledJobId: "1000",
    };
    const response = { data: { flag: "error" } };
    return expectSaga(fetchScheduledJobsByCommandId, payload)
      .put(agentManagementActions.RequestFetchScheduledJobsByCommandId())
      .provide([
        [call(agentManagementService.getSchdulerById), payload],
        [matchers.call.fn(agentManagementService.getSchdulerById), response],
      ])
      .put(agentManagementActions.successFetchScheduledJobsByCommandId(response))
      .run();
  });
  describe("fetchAgentInfo saga", () => {
    const payload = {
      hostname: "test-host",
      agentId: "12345",
    };

    const mockSuccessResponse = {
      data: {
        data: {
          id: "12345",
          hostname: "test-host",
          status: "active",
          version: "1.0.0",
        },
        flag: "success",
      },
    };

    const mockErrorResponse = {
      data: {
        data: {},
        flag: "error",
        error: "Failed to fetch agent info",
      },
    };

    it("should successfully fetch agent information", () => {
      return expectSaga(fetchAgentInfo, { props: payload })
        .put(agentManagementActions.requestFetchAgentInfo())
        .provide([[call(agentManagementService.getAgentInfo, payload), mockSuccessResponse]])
        .put(agentManagementActions.successFetchAgentInfo(mockSuccessResponse.data.data))
        .run();
    });

    it("should handle error flag in response", () => {
      return expectSaga(fetchAgentInfo, { props: payload })
        .put(agentManagementActions.requestFetchAgentInfo())
        .provide([[call(agentManagementService.getAgentInfo, payload), mockErrorResponse]])
        .put(agentManagementActions.successFetchAgentInfo(mockErrorResponse.data.data))
        .run();
    });

    it("should handle service failure with Promise.reject", () => {
      const error = new Error("Network error");

      return expectSaga(fetchAgentInfo, { props: payload })
        .put(agentManagementActions.requestFetchAgentInfo())
        .provide([[call(agentManagementService.getAgentInfo, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchAgentInfo(error))
        .run();
    });

    it("should handle empty response data", () => {
      const emptyResponse = {
        data: {
          data: {},
          flag: "success",
        },
      };

      return expectSaga(fetchAgentInfo, { props: payload })
        .put(agentManagementActions.requestFetchAgentInfo())
        .provide([[call(agentManagementService.getAgentInfo, payload), emptyResponse]])
        .put(agentManagementActions.successFetchAgentInfo({}))
        .run();
    });
  });
  it("check ad syncup service", () => {
    const response = { flag: "success" };
    return expectSaga(agentDiscoverySyncup)
      .put(agentManagementActions.requestSyncUpAgentDiscovery())
      .provide([[call(agentManagementService.adSyncup)], [matchers.call.fn(agentManagementService.adSyncup), response]])
      .put(agentManagementActions.successSyncUpAgentDiscovery(response))
      .run();
  });
  it("check fetch agent logs service", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };
    const response = { flag: "success" };
    return expectSaga(fetchAgentLogs, payload)
      .put(agentManagementActions.requestFetchAgentLogs())
      .provide([
        [call(agentManagementService.fetchAgentLogs), payload],
        [matchers.call.fn(agentManagementService.fetchAgentLogs), response],
      ])
      .run();
  });
  describe("fetchAgentGlobalConfig saga", () => {
    const successResponse = {
      flag: "success",
      data: {
        osAgent: [{ propertyName: "server.port", propertyValue: "9002" }],
        schedulerAgent: [{ propertyName: "server.port", propertyValue: "9001" }],
      },
    };

    it("should successfully fetch global config", () => {
      return expectSaga(fetchAgentGlobalConfig)
        .put(agentManagementActions.requestFetchGlobalConfig())
        .provide([[call(agentManagementService.fetchGlobalConfig), successResponse]])
        .put(agentManagementActions.successFetchGlobalConfig(successResponse.data))
        .run();
    });

    it("should handle fetch global config failure", () => {
      const error = new Error("Network error");
      return expectSaga(fetchAgentGlobalConfig)
        .put(agentManagementActions.requestFetchGlobalConfig())
        .provide([[call(agentManagementService.fetchGlobalConfig), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchGlobalConfig(error))
        .run();
    });
  });
  it("check fetch agent metrics saga", () => {
    const response = { flag: "success" };
    return expectSaga(getAgentMetrics)
      .put(agentManagementActions.requestFetchAgentMetrics())
      .provide([[call(agentManagementService.getAgentMetrics)], [matchers.call.fn(agentManagementService.getAgentMetrics), response]])
      .run();
  });
  it("check agent sync script saga", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };
    const response = { flag: "success" };
    return expectSaga(syncScript, payload)
      .put(agentManagementActions.requestSyncScripts())
      .provide([[call(agentManagementService.agentSyncScripts)], [matchers.call.fn(agentManagementService.agentSyncScripts), response]])
      .put(agentManagementActions.successSyncScripts(response))
      .run();
  });
  it("check agent sync script saga cover toast", () => {
    const payload = {
      hostname: "test",
      agentId: "10001",
    };
    const response = { data: { flag: "success" } };
    return expectSaga(syncScript, payload)
      .put(agentManagementActions.requestSyncScripts())
      .provide([[call(agentManagementService.agentSyncScripts)], [matchers.call.fn(agentManagementService.agentSyncScripts), response]])
      .put(agentManagementActions.successSyncScripts(response))
      .run();
  });

  describe("startsSelectedAgent saga", () => {
    const payload = {
      data: [{ hostname: "test", agents: ["10001"] }],
    };

    it("should handle successful start", () => {
      const response = {
        data: {
          flag: "success",
          data: {},
        },
      };

      return expectSaga(startsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestStartSelectedAgentService())
        .provide([[call(agentManagementService.startSelectedAgents, payload), response]])
        .put(agentManagementActions.successStartSelectedAgentService(response.data.data))
        .run();
    });

    it("should handle error flag in response", () => {
      const response = {
        data: {
          flag: "error",
          error: "Start failed",
        },
      };

      return expectSaga(startsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestStartSelectedAgentService())
        .provide([[call(agentManagementService.startSelectedAgents, payload), response]])
        .put(agentManagementActions.successStartSelectedAgentService(response.data.data))
        .run();
    });

    it("should handle service failure", () => {
      const error = new Error("Service failed");

      return expectSaga(startsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestStartSelectedAgentService())
        .provide([[call(agentManagementService.startSelectedAgents, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureStartSelectedAgentService(error))
        .run();
    });
  });
  it("check selected agent start service saga cover toast", () => {
    const payload = { hostname: "test", agents: ["10001"] };
    const response = { data: { flag: "error" } };
    return expectSaga(startsSelectedAgent, payload)
      .put(agentManagementActions.requestStartSelectedAgentService())
      .provide([[call(agentManagementService.startSelectedAgents, payload)], [matchers.call.fn(agentManagementService.startSelectedAgents), response]])
      .put(agentManagementActions.successStartSelectedAgentService())
      .run();
  });

  describe("stopsSelectedAgent saga", () => {
    const payload = {
      data: [{ hostname: "test", agents: ["10001"] }],
    };

    it("should handle successful stop", () => {
      const response = {
        data: {
          flag: "success",
          data: {},
        },
      };

      return expectSaga(stopsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestStopSelectedAgentService())
        .provide([[call(agentManagementService.stopSelectedAgents, payload), response]])
        .put(agentManagementActions.successStopSelectedAgentService(response.data.data))
        .run();
    });

    it("should handle service failure", () => {
      const error = new Error("Stop failed");

      return expectSaga(stopsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestStopSelectedAgentService())
        .provide([[call(agentManagementService.stopSelectedAgents, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureStopSelectedAgentService(error))
        .run();
    });
  });

  it("check selected agent stop service saga cover toast", () => {
    const payload = { hostname: "test", agents: ["10001"] };
    const response = { data: { flag: "error" } };
    return expectSaga(stopsSelectedAgent, payload)
      .put(agentManagementActions.requestStopSelectedAgentService())
      .provide([[call(agentManagementService.stopSelectedAgents, payload)], [matchers.call.fn(agentManagementService.stopSelectedAgents), response]])
      .put(agentManagementActions.successStopSelectedAgentService())
      .run();
  });

  describe("restartsSelectedAgent saga", () => {
    const payload = {
      data: [{ hostname: "test", agents: ["10001"] }],
    };

    it("should handle successful restart", () => {
      const response = {
        data: {
          flag: "success",
          data: {},
        },
      };

      return expectSaga(restartsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestRestartSelectedAgentService())
        .provide([[call(agentManagementService.restartSelectedAgents, payload), response]])
        .put(agentManagementActions.successRestartSelectedAgentService(response.data.data))
        .run();
    });

    it("should handle service failure", () => {
      const error = new Error("Restart failed");

      return expectSaga(restartsSelectedAgent, { props: payload })
        .put(agentManagementActions.requestRestartSelectedAgentService())
        .provide([[call(agentManagementService.restartSelectedAgents, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureRestartSelectedAgentService(error))
        .run();
    });
  });
  it("check selected agent restart service saga cover toast", () => {
    const payload = { hostname: "test", agents: ["10001"] };
    const response = { data: { flag: "error" } };
    return expectSaga(restartsSelectedAgent, payload)
      .put(agentManagementActions.requestRestartSelectedAgentService())
      .provide([[call(agentManagementService.restartSelectedAgents, payload)], [matchers.call.fn(agentManagementService.restartSelectedAgents), response]])
      .put(agentManagementActions.successRestartSelectedAgentService())
      .run();
  });

  describe("healthChecksSelectedAgent saga", () => {
    const payload = {
      data: [{ hostname: "test", agents: ["10001"] }],
    };

    it("should handle successful healthcheck", () => {
      const response = {
        data: {
          flag: "success",
          data: {},
        },
      };

      return expectSaga(healthChecksSelectedAgent, { props: payload })
        .put(agentManagementActions.requestHealthCheckupSelectedAgentService())
        .provide([[call(agentManagementService.healthCheckSelectedAgents, payload), response]])
        .put(agentManagementActions.successHealthCheckupSelectedAgentService(response))
        .run();
    });

    it("should handle service failure", () => {
      const error = new Error("Healthcheck failed");

      return expectSaga(healthChecksSelectedAgent, { props: payload })
        .put(agentManagementActions.requestHealthCheckupSelectedAgentService())
        .provide([[call(agentManagementService.healthCheckSelectedAgents, payload), Promise.reject(error)]])
        .put(agentManagementActions.failureHealthCheckupSelectedAgentService(error))
        .run();
    });
  });
  it("check selected agent health check service cover toast", () => {
    const payload = { hostname: "test", agents: ["10001"] };
    const response = { data: { flag: "error" } };
    return expectSaga(healthChecksSelectedAgent, payload)
      .put(agentManagementActions.requestHealthCheckupSelectedAgentService())
      .provide([[call(agentManagementService.healthCheckSelectedAgents, payload)], [matchers.call.fn(agentManagementService.healthCheckSelectedAgents), response]])
      .put(agentManagementActions.successHealthCheckupSelectedAgentService(response))
      .run();
  });

  it("should handle upgrade agent service failure with Promise.reject", () => {
    const payload = {
      agentManagerVersion: "1.0.0",
      osAgentVersion: "1.0.0",
      schedulerAgentVersion: "1.0.0",
      data: [
        {
          hostname: "test",
          agents: ["10001"],
        },
      ],
    };
    const error = new Error("Upgrade failed");

    return expectSaga(upgradeAgents, { props: payload })
      .put(agentManagementActions.requestUpgradeSelectedAgents())
      .provide([[call(agentManagementService.upgradeBulkAgents, payload), Promise.reject(error)]])
      .put(agentManagementActions.failureUpgradeSelectedAgents(error))
      .run();
  });
  it("check upgrade agent service error", () => {
    const payload = {
      agentManagerVersion: "1.0.0",
      osAgentVersion: "1.0.0",
      schedulerAgentVersion: "1.0.0",
      data: [
        {
          hostname: "test",
          agents: ["10001"],
        },
      ],
    };
    const response = {
      data: {
        flag: "error",
      },
    };
    return expectSaga(upgradeAgents, payload)
      .put(agentManagementActions.requestUpgradeSelectedAgents())
      .provide([[call(agentManagementService.upgradeBulkAgents, payload)], [matchers.call.fn(agentManagementService.upgradeBulkAgents), response]])
      .run();
  });

  describe("getAgentUpgrade saga", () => {
    it("should handle successful upgrade", () => {
      const mockResponse = {
        data: {
          data: { version: "1.2.3" },
          flag: "success",
        },
      };

      return expectSaga(getAgentUpgrade)
        .put(agentManagementActions.requestFetchUpgradeAgents())
        .provide([[call(agentManagementService.upgradeAgents), mockResponse]])
        .put(agentManagementActions.successFetchUpgradeAgents(mockResponse.data.data))
        .run();
    });

    it("should handle API error flag", () => {
      const mockResponse = {
        data: {
          data: {},
          flag: "error",
          error: "Upgrade failed",
        },
      };

      return expectSaga(getAgentUpgrade)
        .put(agentManagementActions.requestFetchUpgradeAgents())
        .provide([[call(agentManagementService.upgradeAgents), mockResponse]])
        .put(agentManagementActions.successFetchUpgradeAgents(mockResponse.data.data))
        .run();
    });

    it("should handle failed request", () => {
      const mockError = new Error("Network error");

      return expectSaga(getAgentUpgrade)
        .put(agentManagementActions.requestFetchUpgradeAgents())
        .provide([[call(agentManagementService.upgradeAgents), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchUpgradeAgents(mockError))
        .run();
    });
  });

  describe("getAgentRegions saga", () => {
    it("should handle successful fetch", () => {
      const mockResponse = {
        data: {
          agentRegions: ["US-East", "US-West", "EU"],
        },
      };

      return expectSaga(getAgentRegions)
        .put(agentManagementActions.requestFetchAgentRegions())
        .provide([[call(agentManagementService.getAgentRegions), mockResponse]])
        .put(agentManagementActions.successFetchAgentRegions(mockResponse.data.agentRegions))
        .run();
    });

    it("should handle empty response", () => {
      return expectSaga(getAgentRegions)
        .put(agentManagementActions.requestFetchAgentRegions())
        .provide([[call(agentManagementService.getAgentRegions), { data: {} }]])
        .put(agentManagementActions.successFetchAgentRegions([]))
        .run();
    });

    it("should handle failed request", () => {
      const error = new Error("Failed");
      return expectSaga(getAgentRegions)
        .put(agentManagementActions.requestFetchAgentRegions())
        .provide([[call(agentManagementService.getAgentRegions), Promise.reject(error)]])
        .put(agentManagementActions.failureFetchAgentRegions(error))
        .run();
    });
  });

  describe("getAgentPlatforms saga", () => {
    it("should handle successful fetch", () => {
      const mockResponse = {
        data: {
          agentPlatforms: ["Windows", "Linux", "MacOS"],
        },
      };

      return expectSaga(getAgentPlatforms)
        .put(agentManagementActions.requestFetchAgentPlatforms())
        .provide([[call(agentManagementService.getAgentPlatforms), mockResponse]])
        .put(agentManagementActions.successFetchAgentPlatforms(mockResponse.data.agentPlatforms))
        .run();
    });

    it("should handle failed request", () => {
      const mockError = new Error("Platform error");

      return expectSaga(getAgentPlatforms)
        .put(agentManagementActions.requestFetchAgentPlatforms())
        .provide([[call(agentManagementService.getAgentPlatforms), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentPlatforms(mockError))
        .run();
    });
  });

  describe("getAgentEnvironments saga", () => {
    it("should handle successful fetch", () => {
      const mockResponse = {
        data: {
          agentEnvironments: ["Prod", "Stage", "Dev"],
        },
      };

      return expectSaga(getAgentEnvironments)
        .put(agentManagementActions.requestFetchAgentEnvironments())
        .provide([[call(agentManagementService.getAgentEnvironments), mockResponse]])
        .put(agentManagementActions.successFetchAgentEnvironments(mockResponse.data.agentEnvironments))
        .run();
    });

    it("should handle failed request", () => {
      const mockError = new Error("Environment error");

      return expectSaga(getAgentEnvironments)
        .put(agentManagementActions.requestFetchAgentEnvironments())
        .provide([[call(agentManagementService.getAgentEnvironments), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentEnvironments(mockError))
        .run();
    });
  });

  describe("getAgentSids saga", () => {
    it("should handle successful fetch", () => {
      const mockResponse = {
        data: {
          agentSids: ["SID001", "SID002", "SID003"],
        },
      };

      return expectSaga(getAgentSids)
        .put(agentManagementActions.requestFetchAgentSids())
        .provide([[call(agentManagementService.getAgentSids), mockResponse]])
        .put(agentManagementActions.successFetchAgentSids(mockResponse.data.agentSids))
        .run();
    });

    it("should handle failed request", () => {
      const mockError = new Error("SID error");

      return expectSaga(getAgentSids)
        .put(agentManagementActions.requestFetchAgentSids())
        .provide([[call(agentManagementService.getAgentSids), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentSids(mockError))
        .run();
    });
  });

  it("check fetch agent region saga", () => {
    const response = { flag: "success" };
    return expectSaga(getAgentRegions)
      .put(agentManagementActions.requestFetchAgentRegions())
      .provide([[call(agentManagementService.getAgentRegions)], [matchers.call.fn(agentManagementService.getAgentRegions), response]])
      .run();
  });
  it("check fetch agent platform saga", () => {
    const response = { flag: "success" };
    return expectSaga(getAgentPlatforms)
      .put(agentManagementActions.requestFetchAgentPlatforms())
      .provide([[call(agentManagementService.getAgentPlatforms)], [matchers.call.fn(agentManagementService.getAgentPlatforms), response]])
      .run();
  });
  it("check fetch agent environment saga", () => {
    const response = { flag: "success" };
    return expectSaga(getAgentEnvironments)
      .put(agentManagementActions.requestFetchAgentEnvironments())
      .provide([[call(agentManagementService.getAgentEnvironments)], [matchers.call.fn(agentManagementService.getAgentEnvironments), response]])
      .run();
  });
  it("check fetch agent sid saga", () => {
    const response = { flag: "success" };
    return expectSaga(getAgentSids)
      .put(agentManagementActions.requestFetchAgentSids())
      .provide([[call(agentManagementService.getAgentSids)], [matchers.call.fn(agentManagementService.getAgentSids), response]])
      .run();
  });
  describe("getAgentOsTypes saga", () => {
    it("should handle successful fetch", () => {
      const mockResponse = {
        data: {
          agentOsTypes: ["Windows", "Linux", "MacOS"],
        },
      };

      return expectSaga(getAgentOsTypes)
        .put(agentManagementActions.requestFetchAgentOsTypes())
        .provide([[call(agentManagementService.getAgentOsTypes), mockResponse]])
        .put(agentManagementActions.successFetchAgentOsTypes(mockResponse.data.agentOsTypes))
        .run();
    });

    it("should handle failed fetch", () => {
      const mockError = new Error("Network error");

      return expectSaga(getAgentOsTypes)
        .put(agentManagementActions.requestFetchAgentOsTypes())
        .provide([[call(agentManagementService.getAgentOsTypes), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentOsTypes(mockError))
        .run();
    });

    it("should handle empty response", () => {
      return expectSaga(getAgentOsTypes)
        .put(agentManagementActions.requestFetchAgentOsTypes())
        .provide([[call(agentManagementService.getAgentOsTypes), { data: {} }]])
        .put(agentManagementActions.successFetchAgentOsTypes([]))
        .run();
    });
  });

  describe("getAgentServiceNames saga", () => {
    it("should handle successful fetch", () => {
      const mockResponse = {
        data: {
          agentServiceNames: ["Service1", "Service2", "Service3"],
        },
      };

      return expectSaga(getAgentServiceNames)
        .put(agentManagementActions.requestFetchAgentServiceNames())
        .provide([[call(agentManagementService.getAgentServiceNames), mockResponse]])
        .put(agentManagementActions.successFetchAgentServiceNames(mockResponse.data.agentServiceNames))
        .run();
    });

    it("should handle failed fetch", () => {
      const mockError = new Error("Network error");

      return expectSaga(getAgentServiceNames)
        .put(agentManagementActions.requestFetchAgentServiceNames())
        .provide([[call(agentManagementService.getAgentServiceNames), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentServiceNames(mockError))
        .run();
    });

    it("should handle empty response", () => {
      return expectSaga(getAgentServiceNames)
        .put(agentManagementActions.requestFetchAgentServiceNames())
        .provide([[call(agentManagementService.getAgentServiceNames), { data: {} }]])
        .put(agentManagementActions.successFetchAgentServiceNames([]))
        .run();
    });
  });

  describe("getAgentVersions Saga", () => {
    it("should handle successful version fetch", () => {
      const mockResponse = {
        data: {
          agentVersions: ["v1.0", "v2.0"],
        },
      };

      return expectSaga(getAgentVersions)
        .put(agentManagementActions.requestFetchAgentVersions())
        .provide([[matchers.call.fn(agentManagementService.getAgentVersions), mockResponse]])
        .put(agentManagementActions.successFetchAgentVersions(mockResponse.data.agentVersions))
        .run();
    });

    it("should handle failed version fetch", () => {
      const mockError = new Error("Failed to fetch versions");

      return expectSaga(getAgentVersions)
        .put(agentManagementActions.requestFetchAgentVersions())
        .provide([[matchers.call.fn(agentManagementService.getAgentVersions), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentVersions(mockError))
        .run();
    });
  });

  it("check force update data agent saga", () => {
    const response = { flag: "success" };
    return expectSaga(getSyncAgentHealthConfigs)
      .put(agentManagementActions.requestSyncAgentHealthConfigs())
      .provide([[call(agentManagementService.getSyncAgentHealthConfigs)], [matchers.call.fn(agentManagementService.getSyncAgentHealthConfigs), response]])
      .run();
  });

  describe("getAgentMasterdata saga", () => {
    const mockProps = { page: 1, limit: 10 };
    const mockSuccessResponse = {
      data: {
        data: [
          { id: 1, name: "Agent1" },
          { id: 2, name: "Agent2" },
        ],
        flag: "success",
      },
    };
    const mockErrorResponse = {
      data: {
        data: [],
        flag: "error",
        error: "Failed to fetch data",
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should handle successful fetch with success flag", () => {
      return expectSaga(getAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestFetchAgentMasterdata())
        .provide([[call(agentManagementService.getAgentMasterdata, mockProps), mockSuccessResponse]])
        .put(agentManagementActions.successFetchAgentMasterdata(mockSuccessResponse.data.data))
        .run()
        .then(() => {
          expect(errortoast).not.toHaveBeenCalled();
        });
    });

    it("should handle API error flag with error toast", () => {
      return expectSaga(getAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestFetchAgentMasterdata())
        .provide([[call(agentManagementService.getAgentMasterdata, mockProps), mockErrorResponse]])
        .put(agentManagementActions.successFetchAgentMasterdata(mockErrorResponse.data.data))
        .run()
        .then(() => {
          expect(errortoast).toHaveBeenCalledWith("Failed to fetch RISEAGENT Masterdata: Failed to fetch data");
        });
    });

    it("should handle failed request", () => {
      const mockError = new Error("Network error");

      return expectSaga(getAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestFetchAgentMasterdata())
        .provide([[call(agentManagementService.getAgentMasterdata, mockProps), Promise.reject(mockError)]])
        .put(agentManagementActions.failureFetchAgentMasterdata(mockError))
        .run();
    });

    it("should handle empty response data", () => {
      const emptyResponse = {
        data: {
          data: [],
          flag: "success",
        },
      };

      return expectSaga(getAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestFetchAgentMasterdata())
        .provide([[call(agentManagementService.getAgentMasterdata, mockProps), emptyResponse]])
        .put(agentManagementActions.successFetchAgentMasterdata([]))
        .run()
        .then(() => {
          expect(errortoast).not.toHaveBeenCalled();
        });
    });
  });

  describe("addAgentMasterdata saga", () => {
    const mockProps = "test-hostname";

    it("should handle successful addition with success toast", () => {
      const mockResponse = {
        data: {
          flag: "success",
        },
      };

      return expectSaga(addAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestAddAgentMasterdata())
        .provide([[call(agentManagementService.addAgentMasterdata, mockProps), mockResponse]])
        .put(agentManagementActions.successAddAgentMasterdata())
        .run();
    });

    it("should handle API error flag with error toast", () => {
      const mockResponse = {
        data: {
          flag: "error",
          error: "Hostname already exists",
        },
      };

      return expectSaga(addAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestAddAgentMasterdata())
        .provide([[call(agentManagementService.addAgentMasterdata, mockProps), mockResponse]])
        .put(agentManagementActions.successAddAgentMasterdata())
        .run();
    });
    it("should handle failed request", () => {
      const error = new Error("Network error");
      return expectSaga(addAgentMasterdata, { props: mockProps })
        .put(agentManagementActions.requestAddAgentMasterdata())
        .provide([[call(agentManagementService.addAgentMasterdata, mockProps), Promise.reject(error)]])
        .put(agentManagementActions.failureAddAgentMasterdata(error))
        .run();
    });
  });

  describe("deleteHostname saga", () => {
    const mockProps = "test-hostname";

    it("should handle successful deletion with success toast", () => {
      const mockResponse = {
        data: {
          flag: "success",
        },
      };

      return expectSaga(deleteHostname, { props: mockProps })
        .put(agentManagementActions.requestDeleteHostname())
        .provide([[call(agentManagementService.deleteAgentHostname, mockProps), mockResponse]])
        .put(agentManagementActions.successDeleteHostname())
        .run();
    });

    it("should handle API error flag with error toast", () => {
      const mockResponse = {
        data: {
          flag: "error",
          error: "Hostname not found",
        },
      };

      return expectSaga(deleteHostname, { props: mockProps })
        .put(agentManagementActions.requestDeleteHostname())
        .provide([[call(agentManagementService.deleteAgentHostname, mockProps), mockResponse]])
        .put(agentManagementActions.successDeleteHostname())
        .run();
    });

    it("should handle failed request", () => {
      const error = new Error("Network error");
      return expectSaga(deleteHostname, { props: mockProps })
        .put(agentManagementActions.requestDeleteHostname())
        .provide([[call(agentManagementService.deleteAgentHostname, mockProps), Promise.reject(error)]])
        .put(agentManagementActions.failureDeleteHostname(error))
        .run();
    });
  });

  describe("actionWatcher", () => {
    const getWatcherCount = () => {
      const gen = actionWatcher();
      let count = 0;
      while (!gen.next().done) count++;
      return count;
    };

    const totalWatchers = getWatcherCount(); // Will be 50 in your case

    it(`should fork all ${totalWatchers} watchers`, () => {
      const gen = actionWatcher();
      let count = 0;

      while (!gen.next().done) {
        count++;
      }

      expect(count).toBe(totalWatchers);
    });

    it("should contain critical watchers", () => {
      const gen = actionWatcher();
      const effects = [];
      let result;
      while (!(result = gen.next()).done) {
        effects.push(result.value);
      }
      const hasStartAgent = effects.some(
        effect => effect.type === "FORK" && effect.payload.fn.name === "takeLatest" && effect.payload.args[0] === AGENT_MANAGEMENT.START_AGENT_SERVICE,
      );
      expect(hasStartAgent).toBe(true);

      const hasFetchAgentInfo = effects.some(
        effect => effect.type === "FORK" && effect.payload.fn.name === "takeLatest" && effect.payload.args[0] === AGENT_MANAGEMENT.FETCH_AGENT_INFO,
      );
      expect(hasFetchAgentInfo).toBe(true);
    });
  });
});
