/* eslint-disable jest/no-identical-title */
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import agentManagementActions from "../../../redux/actions/agentManagement.action";
import { AGENT_MANAGEMENT } from "../../../config/actions";

configure({ adapter: new Adapter() });

const upgradeAgents = {
  agentManagerVersions: ["0.0.1"],
  osAgentVersions: ["0.0.1"],
  schedulerAgentVersions: ["0.0.1"],
};

describe("Agent Actions Test", () => {
  it("check start agent has correct type", () => {
    const action = agentManagementActions.startAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.START_AGENT_SERVICE);
  });
  it("check start agent has correct request type", () => {
    const action = agentManagementActions.requestStartAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_START_AGENT_SERVICE);
  });
  it("check start agent has correct success type", () => {
    const action = agentManagementActions.successStartAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_START_AGENT_SERVICE);
  });
  it("check start agent has correct failure type", () => {
    const action = agentManagementActions.failureStartAgentService({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_START_AGENT_SERVICE);
  });

  it("check agent health check has correct type", () => {
    const action = agentManagementActions.fetchHealthCheckup();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP);
  });
  it("check agent health check has correct request type", () => {
    const action = agentManagementActions.requestFetchHealthCheckup();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP);
  });
  it("check agent health check has correct success type", () => {
    const action = agentManagementActions.successFetchHealthCheckup();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP);
  });
  it("check agent health check has correct failure type", () => {
    const action = agentManagementActions.failureFetchHealthCheckup({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP);
  });

  it("check agent health check by port has correct type", () => {
    const action = agentManagementActions.fetchHealthCheckupByPort();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP_BY_PORT);
  });
  it("check agent health check by port has correct request type", () => {
    const action = agentManagementActions.requestFetchHealthCheckupByPort();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP_BY_PORT);
  });
  it("check agent health check by port has correct success type", () => {
    const action = agentManagementActions.successFetchHealthCheckupByPort();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP_BY_PORT);
  });
  it("check agent health check has by port correct failure type", () => {
    const action = agentManagementActions.failureFetchHealthCheckupByPort({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP_BY_PORT);
  });

  it("check stop agent has correct type", () => {
    const action = agentManagementActions.stopAgentServices();
    expect(action.type).toEqual(AGENT_MANAGEMENT.STOP_AGENT_SERVICE);
  });
  it("check stop agent has correct request type", () => {
    const action = agentManagementActions.requestStopAgentServices();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_STOP_AGENT_SERVICE);
  });
  it("check stop agent has correct success type", () => {
    const action = agentManagementActions.successStopAgentServices();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_STOP_AGENT_SERVICE);
  });
  it("check stop agent has correct failure type", () => {
    const action = agentManagementActions.failureStopAgentServices({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_STOP_AGENT_SERVICE);
  });
  it("check restart agent has correct type", () => {
    const action = agentManagementActions.restartJobService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.RESTART_JOB_SERVICE);
  });
  it("check restart agent has correct type", () => {
    const action = agentManagementActions.restartAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.RESTART_AGENT_SERVICE);
  });
  it("check restart agent has correct request type", () => {
    const action = agentManagementActions.requestRestartAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_RESTART_AGENT_SERVICE);
  });
  it("check restart agent has correct success type", () => {
    const action = agentManagementActions.successRestartAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_RESTART_AGENT_SERVICE);
  });
  it("check restart agent has correct failure type", () => {
    const action = agentManagementActions.failureRestartAgentService({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_RESTART_AGENT_SERVICE);
  });

  it("check save agent property has correct type", () => {
    const action = agentManagementActions.saveAgentProperty();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SAVE_AGENT_PROPERTY);
  });
  it("check save agent property has correct request type", () => {
    const action = agentManagementActions.requestSaveAgentProperty();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SAVE_AGENT_PROPERTY);
  });
  it("check save agent property has correct success type", () => {
    const action = agentManagementActions.successSaveAgentProperty();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SAVE_AGENT_PROPERTY);
  });
  it("check save agent property has correct failure type", () => {
    const action = agentManagementActions.failureSaveAgentProperty({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SAVE_AGENT_PROPERTY);
  });

  it("check update agent property has correct type", () => {
    const action = agentManagementActions.updateAgentProperty();
    expect(action.type).toEqual(AGENT_MANAGEMENT.UPDATE_AGENT_PROPERTY);
  });
  it("check update agent property has correct request type", () => {
    const action = agentManagementActions.requestUpdateAgentProperty();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_UPDATE_AGENT_PROPERTY);
  });
  it("check update agent property has correct success type", () => {
    const action = agentManagementActions.successUpdateAgentProperty();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_UPDATE_AGENT_PROPERTY);
  });
  it("check update agent property has correct failure type", () => {
    const action = agentManagementActions.failureUpdateAgentProperty({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_UPDATE_AGENT_PROPERTY);
  });

  it("check fetch agent buld info has correct type", () => {
    const action = agentManagementActions.fetchAgentBuildInfo();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_BUILD_INFO);
  });
  it("check fetch agent buld info has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentBuildInfo();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_BUILD_INFO);
  });
  it("check fetch agent buld info has correct success type", () => {
    const action = agentManagementActions.successFetchAgentBuildInfo();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_BUILD_INFO);
  });
  it("check fetch agent buld info has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentBuildInfo({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_BUILD_INFO);
  });

  it("check save global config has correct type", () => {
    const action = agentManagementActions.saveGlobalConfig();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SAVE_GLOBAL_CONFIG);
  });
  it("check save global config has correct request type", () => {
    const action = agentManagementActions.requestSaveGlobalConfig();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SAVE_GLOBAL_CONFIG);
  });
  it("check save global config has correct success type", () => {
    const action = agentManagementActions.successSaveGlobalConfig();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SAVE_GLOBAL_CONFIG);
  });
  it("check save global config has correct failure type", () => {
    const action = agentManagementActions.failureSaveGlobalConfig({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SAVE_GLOBAL_CONFIG);
  });

  it("check fetch global config has correct type", () => {
    const action = agentManagementActions.fetchGlobalConfig();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_GLOBAL_CONFIG);
  });
  it("check fetch global config has correct request type", () => {
    const action = agentManagementActions.requestFetchGlobalConfig();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_GLOBAL_CONFIG);
  });
  it("check fetch global config has correct success type", () => {
    const action = agentManagementActions.successFetchGlobalConfig();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_GLOBAL_CONFIG);
  });
  it("check fetch global config has correct failure type", () => {
    const action = agentManagementActions.failureFetchGlobalConfig({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_GLOBAL_CONFIG);
  });

  it("check fetch agent manager has correct type", () => {
    const action = agentManagementActions.fetchAgentManagementServices();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE);
  });
  it("check fetch agent manager has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentManagementServices();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MANAGEMENT_SERVICE);
  });
  it("check fetch agent manager has correct success type", () => {
    const action = agentManagementActions.successFetchAgentManagementServices();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE);
  });
  it("check fetch agent manager has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentManagementServices({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MANAGEMENT_SERVICE);
  });

  it("check fetch agent filters has correct type", () => {
    const action = agentManagementActions.fetchAgentFilters();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_FILTER);
  });
  it("check fetch agent filters has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentFilters();
    expect(action.type).toBeUndefined();
  });
  it("check fetch agent filters has correct success type", () => {
    const action = agentManagementActions.successFetchAgentFilters();
    expect(action.type).toBeUndefined();
  });
  it("check fetch agent filters has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentFilters({ message: "Error occurred" });
    expect(action.type).toBeUndefined();
  });

  it("check fetch agent repositories has correct type", () => {
    const action = agentManagementActions.fetchAgentRepositories();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_REPOSITORIES);
  });
  it("check fetch agent repositories has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentRepositories();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REPOSITORIES);
  });
  it("check fetch agent repositories has correct success type", () => {
    const action = agentManagementActions.successFetchAgentRepositories();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REPOSITORIES);
  });
  it("check fetch agent repositories has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentRepositories({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REPOSITORIES);
  });

  it("check add agent has correct type", () => {
    const action = agentManagementActions.addAgent();
    expect(action.type).toEqual(AGENT_MANAGEMENT.ADD_AGENT);
  });
  it("check add agent has correct request type", () => {
    const action = agentManagementActions.requestAddAgent();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_ADD_AGENT);
  });
  it("check add agent has correct success type", () => {
    const action = agentManagementActions.successAddAgent();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_ADD_AGENT);
  });
  it("check add agent has correct failure type", () => {
    const action = agentManagementActions.failureAddAgent({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_ADD_AGENT);
  });

  it("check fetch agent logs has correct type", () => {
    const action = agentManagementActions.fetchAgentLogs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_LOGS);
  });
  it("check fetch agent logs has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentLogs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_LOGS);
  });
  it("check fetch agent logs has correct success type", () => {
    const action = agentManagementActions.successFetchAgentLogs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_LOGS);
  });
  it("check fetch agent logs has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentLogs({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_LOGS);
  });

  it("check save local config has correct type", () => {
    const action = agentManagementActions.saveLocalConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SAVE_LOCAL_CONFIGS);
  });
  it("check save local config has correct request type", () => {
    const action = agentManagementActions.requestSaveLocalConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SAVE_LOCAL_CONFIGS);
  });
  it("check save local config has correct success type", () => {
    const action = agentManagementActions.successSaveLocalConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SAVE_LOCAL_CONFIGS);
  });
  it("check save local config has correct failure type", () => {
    const action = agentManagementActions.failureSaveLocalConfigs({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SAVE_LOCAL_CONFIGS);
  });

  it("check fetch local config has correct type", () => {
    const action = agentManagementActions.fetchLocalConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_LOCAL_CONFIGS);
  });
  it("check fetch local config has correct request type", () => {
    const action = agentManagementActions.requestFetchLocalConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_LOCAL_CONFIGS);
  });
  it("check fetch local config has correct success type", () => {
    const action = agentManagementActions.successFetchLocalConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_LOCAL_CONFIGS);
  });
  it("check fetch local config has correct failure type", () => {
    const action = agentManagementActions.failureFetchLocalConfigs({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_LOCAL_CONFIGS);
  });

  it("check fetch agent repository has correct type", () => {
    const action = agentManagementActions.fetchRepositories();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_REPOSITORIES);
  });
  it("check fetch agent repository has correct request type", () => {
    const action = agentManagementActions.requestFetchRepositories();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_REPOSITORIES);
  });
  it("check fetch agent repository has correct success type", () => {
    const action = agentManagementActions.successFetchRepositories();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_REPOSITORIES);
  });
  it("check fetch agent repository has correct failure type", () => {
    const action = agentManagementActions.failureFetchRepositories({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_REPOSITORIES);
  });

  it("check save scheduler command has correct type", () => {
    const action = agentManagementActions.saveSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SAVE_SCHEDULER_COMMAND);
  });
  it("check save scheduler command has correct request type", () => {
    const action = agentManagementActions.requestSaveSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SAVE_SCHEDULER_COMMAND);
  });
  it("check save scheduler command has correct success type", () => {
    const action = agentManagementActions.successSaveSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SAVE_SCHEDULER_COMMAND);
  });
  it("check save scheduler command has correct failure type", () => {
    const action = agentManagementActions.failureSaveSchedulerCommand({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SAVE_SCHEDULER_COMMAND);
  });

  it("check update scheduler command has correct type", () => {
    const action = agentManagementActions.updateSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.UPDATE_SCHEDULER_COMMAND);
  });
  it("check update scheduler command has correct request type", () => {
    const action = agentManagementActions.requestUpdateSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_UPDATE_SCHEDULER_COMMAND);
  });
  it("check update scheduler command has correct success type", () => {
    const action = agentManagementActions.successUpdateSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_UPDATE_SCHEDULER_COMMAND);
  });
  it("check update scheduler command has correct failure type", () => {
    const action = agentManagementActions.failureUpdateSchedulerCommand({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_UPDATE_SCHEDULER_COMMAND);
  });

  it("check delete scheduler command has correct type", () => {
    const action = agentManagementActions.deleteSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.DELETE_SCHEDULER_COMMAND);
  });
  it("check delete scheduler command has correct request type", () => {
    const action = agentManagementActions.requestDeleteSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_DELETE_SCHEDULER_COMMAND);
  });
  it("check delete scheduler command has correct success type", () => {
    const action = agentManagementActions.successDeleteSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_DELETE_SCHEDULER_COMMAND);
  });
  it("check delete scheduler command has correct failure type", () => {
    const action = agentManagementActions.failureDeleteSchedulerCommand({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_DELETE_SCHEDULER_COMMAND);
  });

  it("check list scheduler command has correct type", () => {
    const action = agentManagementActions.listSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.LIST_SCHEDULER_COMMAND);
  });
  it("check list scheduler command has correct request type", () => {
    const action = agentManagementActions.requestListSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_LIST_SCHEDULER_COMMAND);
  });
  it("check list scheduler command has correct success type", () => {
    const action = agentManagementActions.successListSchedulerCommand();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_LIST_SCHEDULER_COMMAND);
  });
  it("check list scheduler command has correct failure type", () => {
    const action = agentManagementActions.failureListSchedulerCommand({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_LIST_SCHEDULER_COMMAND);
  });

  it("check fetch scheduler command by id has correct type", () => {
    const action = agentManagementActions.fetchScheduledJobsByCommandId();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_SCHEDULED_JOBS_BY_COMMAND_ID);
  });
  it("check fetch scheduler command by id has correct request type", () => {
    const action = agentManagementActions.RequestFetchScheduledJobsByCommandId();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID);
  });
  it("check fetch scheduler command by id has correct success type", () => {
    const action = agentManagementActions.successFetchScheduledJobsByCommandId();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID);
  });
  it("check fetch scheduler command by id has correct failure type", () => {
    const action = agentManagementActions.failureFetchScheduledJobsByCommandId({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID);
  });

  it("check sync ad has correct type", () => {
    const action = agentManagementActions.syncUpAgentDiscovery();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SYNCUP_AGENT_DISCOVERY);
  });
  it("check sync ad has correct request type", () => {
    const action = agentManagementActions.requestSyncUpAgentDiscovery();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SYNCUP_AGENT_DISCOVERY);
  });
  it("check sync ad has correct success type", () => {
    const action = agentManagementActions.successSyncUpAgentDiscovery();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SYNCUP_AGENT_DISCOVERY);
  });
  it("check sync ad has correct failure type", () => {
    const action = agentManagementActions.failureSyncUpAgentDiscovery({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SYNCUP_AGENT_DISCOVERY);
  });

  it("check get agent metrics has correct type", () => {
    const action = agentManagementActions.fetchAgentMetrics();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_METRICS);
  });
  it("check get agent metrics has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentMetrics();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_METRICS);
  });
  it("check get agent metrics has correct success type", () => {
    const action = agentManagementActions.successFetchAgentMetrics();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_METRICS);
  });
  it("check get agent metrics has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentMetrics({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_METRICS);
  });

  it("check get sync script type", () => {
    const action = agentManagementActions.syncScripts();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SYNC_SCRIPTS);
  });
  it("check get sync script request type", () => {
    const action = agentManagementActions.requestSyncScripts();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SYNC_SCRIPTS);
  });
  it("check get sync script success type", () => {
    const action = agentManagementActions.successSyncScripts();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SYNC_SCRIPTS);
  });
  it("check get sync script failure type", () => {
    const action = agentManagementActions.failureSyncScripts({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SYNC_SCRIPTS);
  });

  it("check get agent region has correct type", () => {
    const action = agentManagementActions.fetchAgentRegions();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_REGIONS);
  });
  it("check get agent region has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentRegions();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REGIONS);
  });
  it("check get agent region has correct success type", () => {
    const action = agentManagementActions.successFetchAgentRegions();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REGIONS);
  });
  it("check get agent region has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentRegions({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REGIONS);
  });

  it("check get agent platform has correct type", () => {
    const action = agentManagementActions.fetchAgentPlatforms();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_PLATFORMS);
  });
  it("check get agent platform has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentPlatforms();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_PLATFORMS);
  });
  it("check get agent platform has correct success type", () => {
    const action = agentManagementActions.successFetchAgentPlatforms();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_PLATFORMS);
  });
  it("check get agent platform has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentPlatforms({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_PLATFORMS);
  });

  it("check get agent environment has correct type", () => {
    const action = agentManagementActions.fetchAgentEnvironments();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_ENVIRONMENTS);
  });
  it("check get agent environment has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentEnvironments();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_ENVIRONMENTS);
  });
  it("check get agent environment has correct success type", () => {
    const action = agentManagementActions.successFetchAgentEnvironments();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_ENVIRONMENTS);
  });
  it("check get agent environment has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentEnvironments({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_ENVIRONMENTS);
  });

  it("check get agent sid has correct type", () => {
    const action = agentManagementActions.fetchAgentSids();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_SIDS);
  });
  it("check get agent sid has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentSids();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SIDS);
  });
  it("check get agent sid has correct success type", () => {
    const action = agentManagementActions.successFetchAgentSids();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SIDS);
  });
  it("check get agent sid has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentSids({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SIDS);
  });

  it("check get agent os has correct type", () => {
    const action = agentManagementActions.fetchAgentOsTypes();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_OS_TYPES);
  });
  it("check get agent os has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentOsTypes();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_OS_TYPES);
  });
  it("check get agent os has correct success type", () => {
    const action = agentManagementActions.successFetchAgentOsTypes();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_OS_TYPES);
  });
  it("check get agent os has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentOsTypes({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_OS_TYPES);
  });

  it("check get agent service name has correct type", () => {
    const action = agentManagementActions.fetchAgentServiceNames();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_SERVICE_NAMES);
  });
  it("check get agent service name has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentServiceNames();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SERVICE_NAMES);
  });
  it("check get agent service name has correct success type", () => {
    const action = agentManagementActions.successFetchAgentServiceNames();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SERVICE_NAMES);
  });
  it("check get agent service name has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentServiceNames({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SERVICE_NAMES);
  });

  it("check get agent version has correct type", () => {
    const action = agentManagementActions.fetchAgentVersions();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_VERSIONS);
  });
  it("check get agent version has correct request type", () => {
    const action = agentManagementActions.requestFetchAgentVersions();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_VERSIONS);
  });
  it("check get agent version has correct success type", () => {
    const action = agentManagementActions.successFetchAgentVersions();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_VERSIONS);
  });
  it("check get agent version has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentVersions({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_VERSIONS);
  });

  it("check force update data agent has correct type", () => {
    const action = agentManagementActions.syncAgentHealthConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SYNC_AGENT_HEALTH_CONFIGS);
  });
  it("check force update data agent has correct request type", () => {
    const action = agentManagementActions.requestSyncAgentHealthConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SYNC_AGENT_HEALTH_CONFIGS);
  });
  it("check force update data agent has correct success type", () => {
    const action = agentManagementActions.successSyncAgentHealthConfigs();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SYNC_AGENT_HEALTH_CONFIGS);
  });
  it("check force update data agent has correct failure type", () => {
    const action = agentManagementActions.failureSyncAgentHealthConfigs({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SYNC_AGENT_HEALTH_CONFIGS);
  });

  it("check start selected agent has correct type", () => {
    const action = agentManagementActions.startSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.START_SELECTED_AGENT_SERVICE);
  });
  it("check start selected agent has correct request type", () => {
    const action = agentManagementActions.requestStartSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SELECTED_START_AGENT_SERVICE);
  });
  it("check start selected agent has correct success type", () => {
    const action = agentManagementActions.successStartSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SELECTED_START_AGENT_SERVICE);
  });
  it("check start selected agent has correct failure type", () => {
    const action = agentManagementActions.failureStartSelectedAgentService({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SELECTED_START_AGENT_SERVICE);
  });

  it("check stop selected agent has correct type", () => {
    const action = agentManagementActions.stoptSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.STOP_SELECTED_AGENT_SERVICE);
  });
  it("check stop selected agent has correct request type", () => {
    const action = agentManagementActions.requestStopSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SELECTED_STOP_AGENT_SERVICE);
  });
  it("check stop selected agent has correct success type", () => {
    const action = agentManagementActions.successStopSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SELECTED_STOP_AGENT_SERVICE);
  });
  it("check stop selected agent has correct failure type", () => {
    const action = agentManagementActions.failureStopSelectedAgentService({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SELECTED_STOP_AGENT_SERVICE);
  });

  it("check restart selected agent has correct type", () => {
    const action = agentManagementActions.restartSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.RESTART_SELECTED_AGENT_SERVICE);
  });
  it("check restart selected agent has correct request type", () => {
    const action = agentManagementActions.requestRestartSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SELECTED_RESTART_AGENT_SERVICE);
  });
  it("check restart selected agent has correct success type", () => {
    const action = agentManagementActions.successRestartSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SELECTED_RESTART_AGENT_SERVICE);
  });
  it("check restart selected agent has correct failure type", () => {
    const action = agentManagementActions.failureRestartSelectedAgentService({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SELECTED_RESTART_AGENT_SERVICE);
  });

  it("check agent selected health check has correct type", () => {
    const action = agentManagementActions.healthCheckupSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.HEALTHCHECKUP_SELECTED_AGENT_SERVICE);
  });
  it("check agent selected health check has correct request type", () => {
    const action = agentManagementActions.requestHealthCheckupSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_SELECTED_HEALTHCHECKUP_AGENT_SERVICE);
  });
  it("check agent selected health check has correct success type", () => {
    const action = agentManagementActions.successHealthCheckupSelectedAgentService();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_SELECTED_HEALTHCHECKUP_AGENT_SERVICE);
  });
  it("check agent selected health check has correct failure type", () => {
    const action = agentManagementActions.failureHealthCheckupSelectedAgentService({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_SELECTED_HEALTHCHECKUP_AGENT_SERVICE);
  });

  it("check upgrade version has correct type", () => {
    const action = agentManagementActions.fetchUpgradeAgents();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_UPGRADE_AGENTS);
  });
  it("check upgrade version has correct request type", () => {
    const action = agentManagementActions.requestFetchUpgradeAgents();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_UPGRADE_AGENTS);
  });
  it("check upgrade version has correct success type", () => {
    const action = agentManagementActions.successFetchUpgradeAgents(upgradeAgents);
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_UPGRADE_AGENTS);
  });
  it("check upgrade version has correct failure type", () => {
    const action = agentManagementActions.failureFetchUpgradeAgents({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_UPGRADE_AGENTS);
  });

  it("check upgrade agent has correct type", () => {
    const action = agentManagementActions.upgradeSelectedAgents();
    expect(action.type).toEqual(AGENT_MANAGEMENT.UPGRADE_SELECTED_AGENTS);
  });
  it("check upgrade agent has correct request type", () => {
    const action = agentManagementActions.requestUpgradeSelectedAgents();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_UPGRADE_SELECTED_AGENTS);
  });
  it("check upgrade agent has correct success type", () => {
    const action = agentManagementActions.successUpgradeSelectedAgents();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_UPGRADE_SELECTED_AGENTS);
  });
  it("check upgrade agent has correct failure type", () => {
    const action = agentManagementActions.failureUpgradeSelectedAgents({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_UPGRADE_SELECTED_AGENTS);
  });

  it("Add Masterdata", () => {
    const action = agentManagementActions.addAgentMasterdata();
    expect(action.type).toEqual(AGENT_MANAGEMENT.ADD_AGENT_MASTERDATA);
  });
  it("Add Masterdata request type", () => {
    const action = agentManagementActions.requestAddAgentMasterdata();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_ADD_AGENT_MASTERDATA);
  });
  it("Add Masterdata success type", () => {
    const action = agentManagementActions.successAddAgentMasterdata();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_ADD_AGENT_MASTERDATA);
  });
  it("check upgrade agent has correct failure type", () => {
    const action = agentManagementActions.failureAddAgentMasterdata({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_ADD_AGENT_MASTERDATA);
  });

  it("get Masterdata", () => {
    const action = agentManagementActions.fetchAgentMasterdata();
    expect(action.type).toEqual(AGENT_MANAGEMENT.FETCH_AGENT_MASTERDATA);
  });
  it("get Masterdata request type", () => {
    const action = agentManagementActions.requestFetchAgentMasterdata();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MASTERDATA);
  });
  it("get Masterdata success type", () => {
    const action = agentManagementActions.successFetchAgentMasterdata();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MASTERDATA);
  });
  it("check upgrade agent has correct failure type", () => {
    const action = agentManagementActions.failureFetchAgentMasterdata({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MASTERDATA);
  });

  it("delete Masterdata", () => {
    const action = agentManagementActions.deleteHostname();
    expect(action.type).toEqual(AGENT_MANAGEMENT.DELETE_HOSTNAME);
  });
  it("delete Masterdata request type", () => {
    const action = agentManagementActions.requestDeleteHostname();
    expect(action.type).toEqual(AGENT_MANAGEMENT.REQUEST_DELETE_HOSTNAME);
  });
  it("delete Masterdata success type", () => {
    const action = agentManagementActions.successDeleteHostname();
    expect(action.type).toEqual(AGENT_MANAGEMENT.SUCCESS_DELETE_HOSTNAME);
  });
  it("check upgrade agent has correct failure type", () => {
    const action = agentManagementActions.failureDeleteHostname({ message: "Error occurred" });
    expect(action.type).toEqual(AGENT_MANAGEMENT.FAILURE_DELETE_HOSTNAME);
  });
});
