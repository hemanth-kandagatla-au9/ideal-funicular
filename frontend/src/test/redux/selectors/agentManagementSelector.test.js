import {
  getError,
  isLoading,
  isReload,
  getSuccessMessage,
  getAgentsService,
  getAgentGlobalConfig,
  getFilterAgents,
  getFilterRepositories,
  getRepositories,
  isLocalConfigReload,
  getAgentLocalConfigs,
  listScheduledJob,
  isAgentLogLoading,
  isFilterLoading,
  getAgentLogs,
  fetchScheduledJobsByCommandId,
  getAgentMetrics,
  isServiceLoading,
  getAgentRegions,
  getAgentPlatforms,
  getAgentEnvironments,
  getAgentSids,
  getAgentOsTypes,
  getAgentServiceNames,
  getAgentVersions,
  getAgentHealthCheckUp,
  isSchedulerLoading,
  getUpgradeAgentVersion,
  getStartedAgent,
  getStoppedAgent,
  getRestartedAgent,
  getAgentData,
  agentLoading,
} from "../../../redux/selectors/agentManagement.selectors";

describe("agentManagementSelectors", () => {
  const state = {
    loading: false,
    error: "",
    successMessage: "",
    reload: false,
    localConfigReload: false,
    agentLogLoading: false,
    serviceLoading: false,
    schedulerLoading: false,
    agentServers: {},
    agentGlobalConfiguration: [],
    filterAgents: [],
    filterRepo: [],
    addAgents: [],
    localConfigs: [],
    repositories: [],
    downloadRepo: [],
    saveCommand: [],
    updateCommand: [],
    deleteCommand: [],
    scheduleConfig: [],
    fetchScheduler: [],
    agentLogs: {},
    agentMetrics: [],
    agentRegions: [],
    agentEnvironments: [],
    agentPlatforms: [],
    agentSids: [],
    agentOsTypes: [],
    agentServiceNames: [],
    agentVersions: [],
    filterLoading: false,
    agentSyncHealthConfigs:[],
    agentHealthCheckUP:[],
    upgradeAgents:{},
  };

  it("getError() fn", () => {
    expect(getError(state)).toEqual("");
  });

  it("isLoading() fn", () => {
    expect(isLoading(state)).toEqual(false);
  });

  it("isReload() fn", () => {
    expect(isReload(state)).toEqual(false);
  });

  it("getSuccessMessage() fn", () => {
    expect(getSuccessMessage(state)).toEqual(false);
  });

  it("getAgentsService() fn", () => {
    expect(getAgentsService(state)).toEqual({});
  });

  it("getAgentGlobalConfig() fn", () => {
    expect(getAgentGlobalConfig(state)).toEqual({ configs: [] });
  });

  it("getFilterAgents() fn", () => {
    expect(getFilterAgents(state)).toEqual([]);
  });

  it("getFilterRepositories() fn", () => {
    expect(getFilterRepositories(state)).toEqual([]);
  });

  it("getRepositories() fn", () => {
    expect(getRepositories(state)).toEqual([]);
  });

  it("isLocalConfigReload() fn", () => {
    expect(isLocalConfigReload(state)).toEqual(false);
  });

  it("getAgentLocalConfigs() fn", () => {
    expect(getAgentLocalConfigs(state)).toEqual([]);
  });

  it("listScheduledJob() fn", () => {
    expect(listScheduledJob(state)).toEqual([]);
  });

  it("isAgentLogLoading() fn", () => {
    expect(isAgentLogLoading(state)).toEqual(false);
  });

  it("isFilterLoading() fn", () => {
    expect(isFilterLoading(state)).toEqual(false);
  });

  it("getAgentLogs() fn", () => {
    expect(getAgentLogs(state)).toEqual({});
  });

  it("fetchScheduledJobsByCommandId() fn", () => {
    expect(fetchScheduledJobsByCommandId(state)).toEqual({});
  });

  it("getAgentMetrics() fn", () => {
    expect(getAgentMetrics(state)).toEqual([]);
  });

  it("isServiceLoading() fn", () => {
    expect(isServiceLoading(state)).toEqual(false);
  });

  it("getAgentRegions() fn", () => {
    expect(getAgentRegions(state)).toEqual([]);
  });

  it("getAgentPlatforms() fn", () => {
    expect(getAgentPlatforms(state)).toEqual([]);
  });

  it("getAgentEnvironments() fn", () => {
    expect(getAgentEnvironments(state)).toEqual([]);
  });

  it("getAgentSids() fn", () => {
    expect(getAgentSids(state)).toEqual([]);
  });

  it("getAgentOsTypes() fn", () => {
    expect(getAgentOsTypes(state)).toEqual([]);
  });

  it("getAgentServiceNames() fn", () => {
    expect(getAgentServiceNames(state)).toEqual([]);
  });

  it("getAgentVersions() fn", () => {
    expect(getAgentVersions(state)).toEqual([]);
  });
  it("isSchedulerLoading () fn", () => {
    expect(isSchedulerLoading(state)).toEqual(false);
  });

  it("getAgentHealthCheckUp() fn", () => {
    expect(getAgentHealthCheckUp(state)).toEqual([]);
  });

  it("getStartedAgent() fn",()=>{
    expect(getStartedAgent(state)).toEqual([]);
  })

  it("getStoppedAgent() fn",()=>{
    expect(getStoppedAgent(state)).toEqual([]);
  })

  it("getRestartedAgent() fn",()=>{
    expect(getRestartedAgent(state)).toEqual([]);
  })

  it("getUpgradeAgentVersion() fn", () => {
    expect(getUpgradeAgentVersion(state)).toEqual({});
  });

    it("getAgentData() fn", () => {
    expect(getAgentData(state)).toEqual({});
  });

    it("agentLoading() fn", () => {
    expect(agentLoading(state)).toEqual(false);
  });
});



