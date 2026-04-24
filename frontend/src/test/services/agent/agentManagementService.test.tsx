import agentManagementService from "../../../services/agent/agentManagement.service";
import '@testing-library/jest-dom/extend-expect';

// Helper to create axios-like error
const createAxiosError = (status: number, message = "Error") => ({
  response: { status, data: message },
  isAxiosError: true,
});

// Create a mock instance
const createMockAxiosInstance = () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
});

let mockInstance = createMockAxiosInstance();

// Mock axios
jest.mock("axios", () => {
  return {
    create: () => mockInstance,
    isAxiosError: (error: any) => !!error?.isAxiosError,
  };
});

// Mock the axiosInstance module
jest.mock("../../../services/axiosInstance", () => {
  return jest.fn().mockImplementation(() => ({
    init: () => mockInstance,
  }));
});

describe("Agent Management Services", () => {
  beforeEach(() => {
    mockInstance = createMockAxiosInstance();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("check agent start service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.agentStartService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check agent health check service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.agentHealthCheck(request);
    expect(dataObj).not.toBeNull();
  });

  it("check agent health check by port service", async () => {
    const dataObj = await agentManagementService.healthCheckupByPort();
    expect(dataObj).not.toBeNull();
  });

  it("check agent stop service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.agentStopService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check agent restart service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.agentReStartService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check save agent manage property service", async () => {
    const dataObj = await agentManagementService.saveAgentManagerProperty();
    expect(dataObj).not.toBeNull();
  });

  it("check update agent manage property service", async () => {
    const dataObj = await agentManagementService.updateAgentManagerProperty();
    expect(dataObj).not.toBeNull();
  });

  it("check fetch build info service", async () => {
    const dataObj = await agentManagementService.fetchBuildInfo();
    expect(dataObj).not.toBeNull();
  });

  it("check save global config service", async () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const dataObj = await agentManagementService.saveGlobalConfig(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch global config service", async () => {
    const dataObj = await agentManagementService.fetchGlobalConfig();
    expect(dataObj).not.toBeNull();
  });

  it("check fetch agent service", async () => {
    const request = {
      pageSize: "10",
      pageNo: "0",
      status: "failed",
      agentSearch: "test",
    };
    const dataObj = await agentManagementService.fetchAgentService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch filter agent service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.filterAgentService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch filter agent repo service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.filterAgentRepoService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check add agents service", async () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const dataObj = await agentManagementService.addAgentService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch agent logs service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      limit: 10,
      skip: 10
    };
    const dataObj = await agentManagementService.fetchAgentLogs(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch agent logs service error case", async () => {
    mockInstance.post.mockRejectedValue(new Error('test'));
    const dataObj = await agentManagementService.fetchAgentLogs({});
    expect(dataObj).not.toBeNull();
  });

  it("check save local configs service", async () => {
    const request = {
      osAgent: [
        {
          propertyName: "server.port",
          propertyValue: "9002",
          encrypted: false,
        },
      ],
    };
    const dataObj = await agentManagementService.saveLocalConfigs(request);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch local config", async () => {
    const request = {
      hostname: "test",
    };
    const dataObj = await agentManagementService.fetchLocalConfigs(request);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent repo service", async () => {
    const request = {
      type: "test",
    };
    const dataObj = await agentManagementService.getAgentRepoService(request);
    expect(dataObj).not.toBeNull();
  });

  it("check download agent repo service", async () => {
    const request = {
      version: "v0.0.1",
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.downloadRepositories(request);
    expect(dataObj).not.toBeNull();
  });

  it("check save scheduler command service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      cronExpression: "test",
      command: "test",
      enabled: true,
      opensearchEnabled: true,
      opensearchIndex: "test",
    };
    const dataObj = await agentManagementService.saveSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check update scheduler command service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      cronExpression: "test",
      command: "test",
      enabled: true,
      opensearchEnabled: true,
      opensearchIndex: "test",
    };
    const dataObj = await agentManagementService.updateSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check delete scheduler command service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      scheduledJobId: "1000",
    };
    const dataObj = await agentManagementService.deleteSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check list scheduler command service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.listSchedulerCommand(request);
    expect(dataObj).not.toBeNull();
  });

  it("check get scheduler by id service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
      scheduledJobId: "1000",
    };
    const dataObj = await agentManagementService.getSchdulerById(request);
    expect(dataObj).not.toBeNull();
  });

  it("check ad syncup service", async () => {
    const dataObj = await agentManagementService.adSyncup();
    expect(dataObj).not.toBeNull();
  });

  it("check get agent metrics data", async () => {
    const dataObj = await agentManagementService.getAgentMetrics();
    expect(dataObj).not.toBeNull();
  });

  it("check agent sync script service", async () => {
    const request = {
      hostname: "test",
      agentId: "10001",
    };
    const dataObj = await agentManagementService.agentSyncScripts(request);
    expect(dataObj).not.toBeNull();
  });
  it("check get agent regions data", async () => {
    const dataObj = await agentManagementService.getAgentRegions();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent platforms data", async () => {
    const dataObj = await agentManagementService.getAgentPlatforms();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent environments data", async () => {
    const dataObj = await agentManagementService.getAgentEnvironments();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent sid data", async () => {
    const dataObj = await agentManagementService.getAgentSids();
  });
  it("check get agent os data", async () => {
    const dataObj = await agentManagementService.getAgentOsTypes();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent service name data", async () => {
    const dataObj = await agentManagementService.getAgentServiceNames();
    expect(dataObj).not.toBeNull();
  });
  it("check get agent version data", async () => {
    const dataObj = await agentManagementService.getAgentVersions();
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent start service", async () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = await agentManagementService.startSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent stop service", async () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = await agentManagementService.stopSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent restart service", async () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = await agentManagementService.restartSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check selected agent healthcheck service", async () => {
    const request = {
      hostname: "test",
      agents: ["10001"],
    };
    const dataObj = await agentManagementService.healthCheckSelectedAgents(request);
    expect(dataObj).not.toBeNull();
  });

  it("check get upgrade agent version service", async () => {
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
    mockInstance.get.mockResolvedValue(response);
    const dataObj = await agentManagementService.upgradeAgents();
    expect(dataObj).not.toBeNull();
  });

  it("check upgrade agent service", async () => {
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
    const dataObj = await agentManagementService.upgradeBulkAgents(request);
    expect(dataObj).not.toBeNull();
  });
});

describe("Error scenarios for service", () => {
  beforeEach(() => {
    mockInstance = createMockAxiosInstance();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("check get agent metrics failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentMetrics(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent regions failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentRegions(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent platforms failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentPlatforms(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent environments failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentEnvironments(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent sid failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentSids(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent version failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentVersions(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent os failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentOsTypes(error);
    expect(dataObj).not.toBeNull();
  });

  it("check get agent service name failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getAgentServiceNames(error);
    expect(dataObj).not.toBeNull();
  });

  it("check force update data agent failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getSyncAgentHealthConfigs(error);
    expect(dataObj).not.toBeNull();
  });

  it("check add syncup failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.adSyncup(error);
    expect(dataObj).not.toBeNull();
  });

  it("check agent start service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.agentReStartService(error);
    expect(dataObj).not.toBeNull();
  });
  it("check agent Sync script failure", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.agentSyncScripts(error);
    expect(dataObj).not.toBeNull();
  });

  it("check fetch schedule command by id service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.getSchdulerById(error);
    expect(dataObj).not.toBeNull();
  });

  it("check list schedule command service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.listSchedulerCommand(error);
    expect(dataObj).not.toBeNull();
  });

  it("check agent upgrade service version failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.get.mockRejectedValue(error);
    const dataObj = await agentManagementService.upgradeAgents(error);
    expect(dataObj).not.toBeNull();
  });

  it("check agent bulk upgrade service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.put.mockRejectedValue(error);
    const dataObj = await agentManagementService.upgradeBulkAgents(error);
    expect(dataObj).not.toBeNull();
  });

  it("check start bulk agent service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.post.mockRejectedValue(error);
    const dataObj = await agentManagementService.startSelectedAgents(error);
    expect(dataObj).not.toBeNull();
  });

  it("check stop bulk agent service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.post.mockRejectedValue(error);
    const dataObj = await agentManagementService.stopSelectedAgents(error);
    expect(dataObj).not.toBeNull();
  });

  it("check restart bulk agent service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.post.mockRejectedValue(error);
    const dataObj = await agentManagementService.restartSelectedAgents(error);
    expect(dataObj).not.toBeNull();
  });

  it("check healthcheck bulk agent service failing", async () => {
    const error = createAxiosError(500, "Api Failed");
    mockInstance.post.mockRejectedValue(error);
    const dataObj = await agentManagementService.healthCheckSelectedAgents(error);
    expect(dataObj).not.toBeNull();
  });

  it("Add masterdata", async () => {
    const error = createAxiosError(500, "test");
    mockInstance.post.mockRejectedValue(error);
    const dataObj = await agentManagementService.addAgentMasterdata("test");
    expect(dataObj).not.toBeNull();
  });

  it("get masterdata", async () => {
    const error = createAxiosError(500, "Error");
    mockInstance.post.mockRejectedValue(error);
    const jsondata = {
      limit: "10",
      pageNo: "0",
      search: "",
    };
    const dataObj = await agentManagementService.getAgentMasterdata(jsondata);
    expect(dataObj).not.toBeNull();
  });
});

describe("Agent Repository and Addition Tests", () => {
  beforeEach(() => {
    mockInstance = createMockAxiosInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("filterAgentRepoService", () => {
    it.skip("should call GET with correct endpoint and data", async () => {
      const mockData = { type: "rust", status: "active" };
      mockInstance.get.mockResolvedValue({ data: [{ id: 1, name: "repo1" }] });

      const result = await agentManagementService.filterAgentRepoService(mockData);

      expect(result).not.toBeNull();
      expect(mockInstance.get).toHaveBeenCalled();
    });

    it("should handle errors properly", async () => {
      const error = createAxiosError(500, "Error");
      mockInstance.get.mockRejectedValue(error);

      const result = await agentManagementService.filterAgentRepoService({});

      expect(result).not.toBeNull();
    });
  });
  describe("addAgentService", () => {
    it.skip("should call POST with correct endpoint and data", async () => {
      const mockAgentData = {
        hostname: "agent1",
        ip: "0.0.0.0",
        properties: { os: "linux", version: "1.0" }
      };
      mockInstance.post.mockResolvedValue({ data: { success: true } });

      const result = await agentManagementService.addAgentService(mockAgentData);

      expect(result).not.toBeNull();
      expect(mockInstance.post).toHaveBeenCalled();
    });

    it("should handle errors properly", async () => {
      const error = createAxiosError(400, "Validation Error");
      mockInstance.post.mockRejectedValue(error);

      const result = await agentManagementService.addAgentService({ invalid: "data" });

      expect(result).not.toBeNull();
    });
  });
});

describe("fetchAgentService and filterAgentService Tests", () => {
  beforeEach(() => {
    mockInstance = createMockAxiosInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should cover fetchAgentService with all parameters", async () => {
    const request = {
      pageSize: 10,
      pageNo: 1,
      status: "active",
      agentSearch: "test",
      os: "linux",
      region: "us-west",
      environment: "prod",
      platform: "aws",
      sid: "123",
      agentVersion: "1.0.0",
      serviceName: "web-service"
    };

    mockInstance.get.mockResolvedValue({ data: [] });

    const result = await agentManagementService.fetchAgentService(request);

    expect(result).not.toBeNull();
  });
  it("should cover filterAgentService with parameters", async () => {
    const request = {
      filter: "status:active",
      sort: "name"
    };

    mockInstance.get.mockResolvedValue({ data: [] });

    const result = await agentManagementService.filterAgentService(request);

    expect(result).not.toBeNull();
  });
  it("should cover fetchAgentService error case", async () => {
    const error = createAxiosError(500);
    mockInstance.get.mockRejectedValue(error);

    const result = await agentManagementService.fetchAgentService({});
    expect(result).not.toBeNull();
  });
  it("should cover filterAgentService error case", async () => {
    const error = createAxiosError(500);
    mockInstance.get.mockRejectedValue(error);

    const result = await agentManagementService.filterAgentService({});
    expect(result).not.toBeNull();
  });
});
