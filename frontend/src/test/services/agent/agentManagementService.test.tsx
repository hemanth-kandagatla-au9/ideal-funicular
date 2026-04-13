import agentManagementService, { AxiosInstace } from "../../../services/agent/agentManagement.service";
import '@testing-library/jest-dom/extend-expect';

jest.mock("axios", () => {
  return {
    create: () => ({
      patch: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { eject: jest.fn(), use: jest.fn() },
        response: { eject: jest.fn(), use: jest.fn() },
      },
    }),
    isAxiosError: (error: any) => !!error.isAxiosError,
  };
});


describe("Agent Management Services", () => {
  let mockGet = null;
  let mockPost = null;
  let mockPut = null;
  beforeEach(() => {
    mockGet = jest.spyOn(AxiosInstace, "get");
    mockPost = jest.spyOn(AxiosInstace, "post");
    mockPut = jest.spyOn(AxiosInstace, "put");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("check agent start service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.agentStartService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check agent health check service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.agentHealthCheck(request);
    expect(dataObj).not.toBeNull();
  });

  it("check agent health check by port service", () => {
    const dataObj = agentManagementService.healthCheckupByPort();
    expect(dataObj).not.toBeNull();
  });

  it("check agent stop service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.agentStopService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check agent restart service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.agentReStartService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check save agent manage property service", () => {
    const dataObj = agentManagementService.saveAgentManagerProperty();
    expect(dataObj).not.toBeNull();
  });

  it("check update agent manage property service", () => {
    const dataObj = agentManagementService.updateAgentManagerProperty();
    expect(dataObj).not.toBeNull();
  });

  it("check fetch build info service", () => {
    const dataObj = agentManagementService.fetchBuildInfo();
    expect(dataObj).not.toBeNull();
  });

  it("check save global config service", () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const dataObj = agentManagementService.saveGlobalConfig(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch global config service", () => {
    const dataObj = agentManagementService.fetchGlobalConfig();
    expect(dataObj).not.toBeNull();
  });

  it("check fetch agent service", () => {
    const request = {
      pageSize: "10",
      pageNo: "0",
      status: "failed",
      agentSearch: "test",
    };
    const dataObj = agentManagementService.fetchAgentService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch filter agent service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.filterAgentService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch filter agent repo service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.filterAgentRepoService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check add agents service", () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const dataObj = agentManagementService.addAgentService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch agent logs service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      limit: 10,
      skip: 10
    };
    const dataObj = agentManagementService.fetchAgentLogs(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch agent logs service error case", () => {

    mockPost.mockImplementation(() => Promise.reject('test'));
    const dataObj = agentManagementService.fetchAgentLogs({});
    expect(dataObj).not.toBeNull();
  });


  it("check save local configs service", () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const dataObj = agentManagementService.saveLocalConfigs(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch local config", () => {
    const request = {
      hostname: "test",
    };
    const dataObj = agentManagementService.fetchLocalConfigs(request);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent repo service", () => {
    const request = {
      type: "test",
    };
    const dataObj = agentManagementService.getAgentRepoService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check download agent repo service", () => {
    const request = {
      version: "v0.0.1",
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.downloadRepositories(request);
    expect(dataObj).not.toBeNull();
  });

  it("check save scheduler command service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      cronExpression: "test",
      command: "test",
      enabled: true,
      opensearchEnabled: true,
      opensearchIndex: "test",
    };
    const dataObj = agentManagementService.saveSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check update scheduler command service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      cronExpression: "test",
      command: "test",
      enabled: true,
      opensearchEnabled: true,
      opensearchIndex: "test",
    };
    const dataObj = agentManagementService.updateSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check delete scheduler command service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      scheduledJobId: "1000",
    };
    const dataObj = agentManagementService.deleteSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check list scheduler command service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.listSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check get scheduler by id service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      scheduledJobId: "1000",
    };
    const dataObj = agentManagementService.getSchdulerById(request);
    expect(dataObj).not.toBeNull();
  });

  it("check ad syncup service", () => {
    const dataObj = agentManagementService.adSyncup();
    expect(dataObj).not.toBeNull();
  });

  it("check get agent metrics data", () => {
    const dataObj = agentManagementService.getAgentMetrics();
    expect(dataObj).not.toBeNull();
  });

  it("check agent sync script service", () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = agentManagementService.agentSyncScripts(request);
    expect(dataObj).not.toBeNull();
  });
  it("check get agent regions data", () => {
    const dataObj = agentManagementService.getAgentRegions();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent platforms data", () => {
    const dataObj = agentManagementService.getAgentPlatforms();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent environments data", () => {
    const dataObj = agentManagementService.getAgentEnvironments();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent sid data", () => {
    const dataObj = agentManagementService.getAgentSids();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent os data", () => {
    const dataObj = agentManagementService.getAgentOsTypes();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent service name data", () => {
    const dataObj = agentManagementService.getAgentServiceNames();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent version data", () => {
    const dataObj = agentManagementService.getAgentVersions();
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent start service", () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = agentManagementService.startSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent stop service", () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = agentManagementService.stopSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent restart service", () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = agentManagementService.restartSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent healthcheck service", () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = agentManagementService.healthCheckSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check get upgrade agent version service", () => {
    const response = {
      data: {
        flag: "success",
        data: {
          agentManagerVersions: ["0.0.1"],
          osAgentVersions: ["0.0.1"],
          schedulerAgentVersions: ["0.0.1"],
        },
      },
    };
    mockGet.mockImplementation(() => Promise.resolve(response));
    const dataObj = agentManagementService.upgradeAgents();
    expect(dataObj).not.toBeNull();
  });

  it("check upgrade agent service", () => {
    const request = {
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
    const dataObj = agentManagementService.upgradeBulkAgents(request);
    expect(dataObj).not.toBeNull();
  });
});

describe("Error scenarios for service", () => {
  let mockGet = null;
  let mockPost = null;
  let mockPut = null;
  beforeEach(() => {
    mockGet = jest.spyOn(AxiosInstace, "get");
    mockPost = jest.spyOn(AxiosInstace, "post");
    mockPut = jest.spyOn(AxiosInstace, "put");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("check get agent metrics failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentMetrics(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent regions failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentRegions(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent platforms failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentPlatforms(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent environments failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentEnvironments(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent sid failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentSids(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent version failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentVersions(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent os failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentOsTypes(response);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent service name failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getAgentServiceNames(response);
    expect(dataObj).not.toBeNull();
  });

  it("check force update data agent failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getSyncAgentHealthConfigs(response);
    expect(dataObj).not.toBeNull();
  });

  it("check add syncup failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.adSyncup(response);
    expect(dataObj).not.toBeNull();
  });

  it("check agent start service failing", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.agentReStartService(response);
    expect(dataObj).not.toBeNull();
  });
  it("check agent Sync script failure", async () => {
    const response = {
      data: {
        flag: "error",
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.agentSyncScripts(response);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch schedule command by id service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.getSchdulerById(response);
    expect(dataObj).not.toBeNull();
  });

  it("check list schedule command service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.listSchedulerCommand(response);
    expect(dataObj).not.toBeNull();
  });

  it("check agent upgrade service version failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.upgradeAgents(response);
    expect(dataObj).not.toBeNull();
  });

  it("check agent bulk upgrade service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockPut.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.upgradeBulkAgents(response);
    expect(dataObj).not.toBeNull();
  });

  it("check start bulk agent service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockPost.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.startSelectedAgents(response);
    expect(dataObj).not.toBeNull();
  });

  it("check stop bulk agent service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockPost.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.stopSelectedAgents(response);
    expect(dataObj).not.toBeNull();
  });

  it("check restart bulk agent service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockPost.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.restartSelectedAgents(response);
    expect(dataObj).not.toBeNull();
  });

  it("check healthcheck bulk agent service failing", async () => {
    const response = {
      data: {
        flag: "error",
        status: 500,
        message: "Api Failed",
        data: [],
      },
    };
    mockPost.mockImplementation(() => Promise.reject(response));
    const dataObj = await agentManagementService.healthCheckSelectedAgents(response);
    expect(dataObj).not.toBeNull();
  });

  it("Add masterdata", async () => {
    mockPost.mockImplementation(() => Promise.reject("test"));
    const dataObj = await agentManagementService.addAgentMasterdata("test");
    expect(dataObj).not.toBeNull();
  });

  it("get masterdata", async () => {
    const jsondata = {
      limit: "10",
      pageNo: "0",
      search: "",
    };
    mockPost.mockImplementation(() => Promise.reject(jsondata));
    const dataObj = await agentManagementService.getAgentMasterdata(jsondata);
    expect(dataObj).not.toBeNull();
  });

  it("delete masterdata", async () => {
    mockPost.mockImplementation(() => Promise.reject("test"));
    const dataObj = await agentManagementService.deleteAgentHostname("test");
    expect(dataObj).not.toBeNull();
  });

  describe("Additional Test Cases for Full Coverage", () => {
    let mockGet, mockPost, mockPut, mockDelete;

    beforeEach(() => {
      mockGet = jest.spyOn(AxiosInstace, "get");
      mockPost = jest.spyOn(AxiosInstace, "post");
      mockPut = jest.spyOn(AxiosInstace, "put");
      mockDelete = jest.spyOn(AxiosInstace, "delete");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should test agentShutDownService", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const response = { data: "success" };
      mockPut.mockResolvedValue(response);

      const result = await agentManagementService.agentShutDownService(request);
      expect(result).toEqual(response);
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPut.mockRejectedValue(errorResponse);
      const errorResult = await agentManagementService.agentShutDownService(request);
      expect(errorResult).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test agentStartSSHService", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const response = { data: "success" };
      mockPost.mockResolvedValue(response);

      const result = await agentManagementService.agentStartSSHService(request);
      expect(result).toEqual(response);
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPost.mockRejectedValue(errorResponse);
      const errorResult = await agentManagementService.agentStartSSHService(request);
      expect(errorResult).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test jobReStartService", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const response = { data: "success" };
      mockPut.mockResolvedValue(response);

      const result = await agentManagementService.jobReStartService(request);
      expect(result).toEqual(response);
      expect(mockPut).toHaveBeenCalledWith(expect.any(String), { hostname: ["test"] });
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPut.mockRejectedValue(errorResponse);
      const errorResult = await agentManagementService.jobReStartService(request);
      expect(errorResult).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
      expect(mockPut).toHaveBeenCalledWith(expect.any(String), { hostname: ["test"] });
    });

    it("should test getSyncAgentHealthConfigs success case", async () => {
      const response = { data: "success" };
      mockPut.mockResolvedValue(response);

      const result = await agentManagementService.getSyncAgentHealthConfigs();
      expect(result).toEqual(response);
    });

    it("should test getAgentInfo", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const response = { data: "success" };
      mockPost.mockResolvedValue(response);

      const result = await agentManagementService.getAgentInfo(request);
      expect(result).toEqual(response);
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPost.mockRejectedValue(errorResponse);
      const errorResult = await agentManagementService.getAgentInfo(request);
      expect(errorResult).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test error case for agentStartService", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPost.mockRejectedValue(errorResponse);

      const result = await agentManagementService.agentStartService(request);
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test error case for agentHealthCheck", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPost.mockRejectedValue(errorResponse);

      const result = await agentManagementService.agentHealthCheck(request);
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
      expect(mockPost).toHaveBeenCalledWith(expect.any(String), { hostname: ["test"] });
    });

    it("should test error case for healthCheckupByPort", async () => {
      const errorResponse = { response: { status: 500, data: "error" } };
      mockGet.mockRejectedValue(errorResponse);

      const result = await agentManagementService.healthCheckupByPort();
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test error case for agentStopService", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPost.mockRejectedValue(errorResponse);

      const result = await agentManagementService.agentStopService(request);
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test error case for agentReStartService", async () => {
      const request = { hostname: "test", agentId: "10001" };
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPut.mockRejectedValue(errorResponse);

      const result = await agentManagementService.agentReStartService(request);
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });

    it("should test error case for saveAgentManagerProperty", async () => {
      const errorResponse = { response: { status: 500, data: "error" } };
      mockPost.mockRejectedValue(errorResponse);

      const result = await agentManagementService.saveAgentManagerProperty();
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });


    describe("Additional Test Cases for Full Coverage", () => {
      it("should test agentShutDownService successfully", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const response = { data: "success" };
        mockPut.mockResolvedValue(response);

        const result = await agentManagementService.agentShutDownService(request);
        expect(result).toEqual(response);
      });

      it("should test agentShutDownService with error", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const errorResponse = { response: { status: 500, data: "error" } };
        mockPut.mockRejectedValue(errorResponse);

        const result = await agentManagementService.agentShutDownService(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test agentStartSSHService successfully", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.agentStartSSHService(request);
        expect(result).toEqual(response);
      });

      it("should test agentStartSSHService with error", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const errorResponse = { response: { status: 500, data: "error" } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.agentStartSSHService(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test jobReStartService successfully", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const response = { data: "success" };
        mockPut.mockResolvedValue(response);

        const result = await agentManagementService.jobReStartService(request);
        expect(result).toEqual(response);
      });

      it("should test jobReStartService with error", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const errorResponse = { response: { status: 500, data: "error" } };
        mockPut.mockRejectedValue(errorResponse);

        const result = await agentManagementService.jobReStartService(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test getAgentInfo successfully", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.getAgentInfo(request);
        expect(result).toEqual(response);
      });

      it("should test getAgentInfo with error", async () => {
        const request = { hostname: "test", agentId: "10001" };
        const errorResponse = { response: { status: 500, data: "error" } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.getAgentInfo(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test getSyncAgentHealthConfigs successfully", async () => {
        const response = { data: "success" };
        mockPut.mockResolvedValue(response);

        const result = await agentManagementService.getSyncAgentHealthConfigs();
        expect(result).toEqual(response);
      });

      it("should test getSyncAgentHealthConfigs with error", async () => {
        const errorResponse = { response: { status: 500, data: "error" } };
        mockPut.mockRejectedValue(errorResponse);

        const result = await agentManagementService.getSyncAgentHealthConfigs();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test updateAgentManagerProperty successfully", async () => {
        const response = { data: "success" };
        mockPut.mockResolvedValue(response);

        const result = await agentManagementService.updateAgentManagerProperty();
        expect(result).toEqual(response);
      });

      it("should test updateAgentManagerProperty with error", async () => {
        const errorResponse = { response: { status: 500, data: "error" } };
        mockPut.mockRejectedValue(errorResponse);

        const result = await agentManagementService.updateAgentManagerProperty();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test fetchAgentLogs with jobname", async () => {
        const request = { jobname: "test-job", limit: 50, skip: 10 };
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.fetchAgentLogs(request);
        expect(result).toEqual(response);
      });

      it("should test fetchAgentLogs without jobname", async () => {
        const request = { limit: 50, skip: 10 };
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.fetchAgentLogs(request);
        expect(result).toEqual(response);
      });

      it("should test fetchAgentLogs with default values", async () => {
        const request = {};
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.fetchAgentLogs(request);
        expect(request.limit).toBe(100);
        expect(request.skip).toBe(0);
        expect(result).toEqual(response);
      });

      it("should test saveSchedulerCommand with minimal data", async () => {
        const request = {
          hostname: "test",
          agentId: "10001",
          cronExpression: "* * * * *",
          command: "echo hello",
          opensearchEnabled: false,
          opensearchIndex: ""
        };
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.saveSchedulerCommand(request);
        expect(result).toEqual(response);
        expect(mockPost).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            hostname: "test",
            port: "10001",
            content: "echo hello",
            cron_expression: "* * * * *",
            script_type: 1
          })
        );
      });

      it("should test deleteAgentHostname successfully", async () => {
        const hostname = "test-host";
        const response = { data: "success" };
        mockDelete.mockResolvedValue(response);

        const result = await agentManagementService.deleteAgentHostname(hostname);
        expect(result).toEqual(response);
      });

      it("should test deleteAgentHostname with error", async () => {
        const hostname = "test-host";
        const errorResponse = { response: { status: 500, data: "error" } };
        mockDelete.mockRejectedValue(errorResponse);

        const result = await agentManagementService.deleteAgentHostname(hostname);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test addAgentMasterdata successfully", async () => {
        const hostname = "test-host";
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.addAgentMasterdata(hostname);
        expect(result).toEqual(response);
        expect(mockPost).toHaveBeenCalledWith(
          expect.any(String),
          { hostnames: "test-host" }
        );
      });

      it("should test getAgentMasterdata with all parameters", async () => {
        const request = { limit: 10, pageNo: 1, search: "test" };
        const response = { data: "success" };
        mockGet.mockResolvedValue(response);

        const result = await agentManagementService.getAgentMasterdata(request);
        expect(result).toEqual(response);
      });
    });


    describe("Remaining Coverage Tests", () => {
      it("should test fetchAgentLogs error case with jobname", async () => {
        const request = { jobname: "test-job" };
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.fetchAgentLogs(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test saveLocalConfigs error case", async () => {
        const request = { config: "test" };
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);

        const result = await agentManagementService.saveLocalConfigs(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test fetchLocalConfigs error case", async () => {
        const request = { hostname: "test" };
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);

        const result = await agentManagementService.fetchLocalConfigs(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test updateSchedulerCommand with full data", async () => {
        const request = {
          agentId: "10001",
          hostname: "test",
          scheduledJobId: "job1",
          cronExpression: "* * * * *",
          command: "echo hello",
          opensearchEnabled: true,
          opensearchIndex: "logs"
        };
        const response = { data: "success" };
        mockPut.mockResolvedValue(response);

        const result = await agentManagementService.updateSchedulerCommand(request);
        expect(result).toEqual(response);
      });

      it("should test listSchedulerCommand error case", async () => {
        const request = { agentId: "10001", hostname: "test" };
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.listSchedulerCommand(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test startSelectedAgents error case", async () => {
        const request = { agents: ["10001"], hostname: "test" };
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.startSelectedAgents(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test stopSelectedAgents error case", async () => {
        const request = { agents: ["10001"], hostname: "test" };
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.stopSelectedAgents(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test getAgentMasterdata with empty search", async () => {
        const request = { limit: 10, pageNo: 1, search: "" };
        const response = { data: "success" };
        mockGet.mockResolvedValue(response);

        const result = await agentManagementService.getAgentMasterdata(request);
        expect(result).toEqual(response);
      });

      it("should test getAgentMasterdata error case", async () => {
        const request = { limit: 10, pageNo: 1 };
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);

        const result = await agentManagementService.getAgentMasterdata(request);
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should test upgradeBulkAgents with all parameters", async () => {
        const request = {
          risebotAgentVersion: "1.0.0",
          agentpath: "/path",
          data: [{ hostname: "test", agentId: "10001" }]
        };
        const response = { data: "success" };
        mockPut.mockResolvedValue(response);

        const result = await agentManagementService.upgradeBulkAgents(request);
        expect(result).toEqual(response);
      });
    });


    describe("Core Agent Operations", () => {
      it("should cover agentStartService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentStartService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover agentStopService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentStopService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover agentHealthCheck error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentHealthCheck({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Job and Restart Operations", () => {
      it("should cover jobReStartService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.jobReStartService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover agentReStartService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentReStartService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover agentShutDownService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentShutDownService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("SSH and Health Checks", () => {
      it("should cover agentStartSSHService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentStartSSHService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover healthCheckupByPort error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);
        const result = await agentManagementService.healthCheckupByPort();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Configuration Management", () => {
      it("should cover saveAgentManagerProperty error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.saveAgentManagerProperty();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover updateAgentManagerProperty error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.updateAgentManagerProperty();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover fetchBuildInfo error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);
        const result = await agentManagementService.fetchBuildInfo();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Global and Local Configs", () => {
      it("should cover saveGlobalConfig error path", async () => {
        const result = await agentManagementService.saveGlobalConfig({});
        expect(result.data).toBeDefined();
      });

      it("should cover fetchGlobalConfig error path", async () => {
        const result = await agentManagementService.fetchGlobalConfig();
        expect(result.data).toBeDefined();
      });

      it("should cover saveLocalConfigs error path", async () => {
        const result = await agentManagementService.saveLocalConfigs({});
        expect(result).toBeDefined();
      });

      it("should cover fetchLocalConfigs error path", async () => {
        const result = await agentManagementService.fetchLocalConfigs({ hostname: "test" });
        expect(result).toBeDefined();
      });
    });
    describe("Agent Repository Operations", () => {
      it("should cover getAgentRepoService error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);
        const result = await agentManagementService.getAgentRepoService({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover downloadRepositories error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.downloadRepositories({});
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Scheduler Operations", () => {
      it("should cover saveSchedulerCommand error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.saveSchedulerCommand({
          hostname: "test",
          agentId: "10001",
          cronExpression: "* * * * *",
          command: "echo hello"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover updateSchedulerCommand error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.updateSchedulerCommand({
          hostname: "test",
          agentId: "10001",
          scheduledJobId: "job1",
          cronExpression: "* * * * *",
          command: "echo hello"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover deleteSchedulerCommand error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockDelete.mockRejectedValue(errorResponse);
        const result = await agentManagementService.deleteSchedulerCommand({
          hostname: "test",
          port: "10001",
          scheduledJobId: "job1"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover listSchedulerCommand error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.listSchedulerCommand({
          hostname: "test",
          agentId: "10001"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover getSchdulerById error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.getSchdulerById({
          hostname: "test",
          agentId: "10001",
          scheduledJobId: "job1"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Bulk Operations", () => {
      it("should cover startSelectedAgents error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.startSelectedAgents({
          hostname: "test",
          agents: ["10001"]
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover stopSelectedAgents error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.stopSelectedAgents({
          hostname: "test",
          agents: ["10001"]
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover restartSelectedAgents error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.restartSelectedAgents({
          hostname: "test",
          agents: ["10001"]
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover healthCheckSelectedAgents error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.healthCheckSelectedAgents({
          hostname: "test",
          agents: ["10001"]
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Upgrade Operations", () => {
      it("should cover upgradeAgents error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);
        const result = await agentManagementService.upgradeAgents();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover upgradeBulkAgents error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.upgradeBulkAgents({
          risebotAgentVersion: "1.0.0",
          data: [{ hostname: "test", agentId: "10001" }]
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Master Data Operations", () => {
      it("should cover getAgentMasterdata error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);
        const result = await agentManagementService.getAgentMasterdata({
          limit: 10,
          pageNo: 1
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover addAgentMasterdata error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.addAgentMasterdata("test-host");
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover deleteAgentHostname error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockDelete.mockRejectedValue(errorResponse);
        const result = await agentManagementService.deleteAgentHostname("test-host");
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe("Miscellaneous Operations", () => {
      it("should cover adSyncup error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPut.mockRejectedValue(errorResponse);
        const result = await agentManagementService.adSyncup();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover getAgentMetrics error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockGet.mockRejectedValue(errorResponse);
        const result = await agentManagementService.getAgentMetrics();
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover agentSyncScripts error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.agentSyncScripts({
          hostname: "test",
          agentId: "10001"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });

      it("should cover getAgentInfo error path", async () => {
        const errorResponse = { response: { status: 500 } };
        mockPost.mockRejectedValue(errorResponse);
        const result = await agentManagementService.getAgentInfo({
          hostname: "test",
          agentId: "10001"
        });
        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });

    describe("Final Coverage Tests", () => {
      it("should test fetchAgentService with all filter parameters", async () => {
        const request = {
          pageSize: 10,
          pageNo: 1,
          status: "running",
          agentSearch: "test",
          os: "linux",
          region: "us-west",
          environment: "prod",
          platform: "aws",
          sid: "123",
          agentVersion: "1.0.0",
          serviceName: "web"
        };
        const response = { data: "success" };
        mockGet.mockResolvedValue(response);

        const result = await agentManagementService.fetchAgentService(request);
        expect(result).toEqual(response);
        const expectedUrl = expect.stringContaining(
          "pageSize=10&pageNo=1&status=running&search=test&osTypes=linux" +
          "&regions=us-west&environments=prod&platforms=aws&sids=123" +
          "&agentVersions=1.0.0&serviceNames=web"
        );
        expect(mockGet).toHaveBeenCalledWith(expectedUrl, { timeout: 30000 });
      });
      it("should test filterAgentService with parameters", async () => {
        const request = { filter: "test" };
        const response = { data: "success" };
        mockGet.mockResolvedValue(response);

        const result = await agentManagementService.filterAgentService(request);
        expect(result).toEqual(response);
      });
      it("should test filterAgentRepoService with parameters", async () => {
        const request = { filter: "test" };
        const response = { data: "success" };
        mockGet.mockResolvedValue(response);

        const result = await agentManagementService.filterAgentRepoService(request);
        expect(result).toEqual(response);
      });
      it("should test addAgentService with complete data", async () => {
        const request = {
          hostname: "test-host",
          agentId: "10001",
          properties: [
            { name: "prop1", value: "value1" },
            { name: "prop2", value: "value2" }
          ]
        };
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        const result = await agentManagementService.addAgentService(request);
        expect(result).toEqual(response);
        expect(mockPost).toHaveBeenCalledWith(expect.any(String), request);
      });
    });
  });
  it('should cover the complete request body construction in updateSchedulerCommand', async () => {
    const request = {
      agentId: '10001',
      hostname: 'test',
      scheduledJobId: 'job1',
      cronExpression: '* * * * *',
      command: 'echo hello',
      opensearchEnabled: true,
      opensearchIndex: 'logs'
    };

    await agentManagementService.updateSchedulerCommand(request);

    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('hostname=test&port=10001&scheduledJobId=job1'),
      {
        hostname: 'test',
        agentId: '10001',
        script_name: 'job1',
        content: 'echo hello',
        arguments: '',
        cron_expression: '* * * * *',
        script_type: 1,
        opensearch_enabled: true,
        opensearch_index: 'logs',
        async_exec: true
      }
    );
  });


  describe('fetchAgentService and filterAgentService Tests', () => {
    let mockGet;

    beforeEach(() => {
      mockGet = jest.spyOn(AxiosInstace, 'get');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should cover fetchAgentService with all parameters', async () => {
      const request = {
        pageSize: 10,
        pageNo: 1,
        status: 'active',
        agentSearch: 'test',
        os: 'linux',
        region: 'us-west',
        environment: 'prod',
        platform: 'aws',
        sid: '123',
        agentVersion: '1.0.0',
        serviceName: 'web-service'
      };

      const mockResponse = { data: [] };
      mockGet.mockResolvedValue(mockResponse);

      const result = await agentManagementService.fetchAgentService(request);

      expect(result).toEqual(mockResponse);
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(
          'pageSize=10&pageNo=1&status=active&search=test&osTypes=linux' +
          '&regions=us-west&environments=prod&platforms=aws&sids=123' +
          '&agentVersions=1.0.0&serviceNames=web-service'
        ),
        { timeout: 30000 }
      );
    });
    it('should cover filterAgentService with parameters', async () => {
      const request = {
        filter: 'status:active',
        sort: 'name'
      };

      const mockResponse = { data: [] };
      mockGet.mockResolvedValue(mockResponse);

      const result = await agentManagementService.filterAgentService(request);

      expect(result).toEqual(mockResponse);
      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        request
      );
    });
    it('should cover fetchAgentService error case', async () => {
      const errorResponse = { response: { status: 500 } };
      mockGet.mockRejectedValue(errorResponse);

      const result = await agentManagementService.fetchAgentService({});
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });
    it('should cover filterAgentService error case', async () => {
      const errorResponse = { response: { status: 500 } };
      mockGet.mockRejectedValue(errorResponse);

      const result = await agentManagementService.filterAgentService({});
      expect(result).toEqual({
        status: 500,
        data: { message: "Unexpected error occurred" }
      });
    });
  });


  describe('Agent Repository and Addition Tests', () => {
    let mockGet, mockPost;

    beforeEach(() => {
      mockGet = jest.spyOn(AxiosInstace, 'get');
      mockPost = jest.spyOn(AxiosInstace, 'post');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('filterAgentRepoService', () => {
      it('should call GET with correct endpoint and data', async () => {
        const mockData = { type: 'rust', status: 'active' };
        const mockResponse = { data: [{ id: 1, name: 'repo1' }] };
        mockGet.mockResolvedValue(mockResponse);

        const result = await agentManagementService.filterAgentRepoService(mockData);

        expect(result).toEqual(mockResponse);
        expect(mockGet).toHaveBeenCalledWith(
          expect.stringContaining('/repositories'), // Adjust based on your actual endpoint
          mockData
        );
      });

      it('should handle errors properly', async () => {
        const errorResponse = { response: { status: 500, data: 'Error' } };
        mockGet.mockRejectedValue(errorResponse);

        const result = await agentManagementService.filterAgentRepoService({});

        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
    describe('addAgentService', () => {
      it('should call POST with correct endpoint and data', async () => {
        const mockAgentData = {
          hostname: 'agent1',
          ip: '192.168.1.1',
          properties: { os: 'linux', version: '1.0' }
        };
        const mockResponse = { data: { success: true } };
        mockPost.mockResolvedValue(mockResponse);

        const result = await agentManagementService.addAgentService(mockAgentData);

        expect(result).toEqual(mockResponse);
        expect(mockPost).toHaveBeenCalledWith(
          expect.stringContaining('/agents'), // Adjust based on your actual endpoint
          mockAgentData
        );
      });

      it('should handle errors properly', async () => {
        const errorResponse = { response: { status: 400, data: 'Validation Error' } };
        mockPost.mockRejectedValue(errorResponse);

        const result = await agentManagementService.addAgentService({ invalid: 'data' });

        expect(result).toEqual({
          status: 500,
          data: { message: "Unexpected error occurred" }
        });
      });
    });
  });

});



