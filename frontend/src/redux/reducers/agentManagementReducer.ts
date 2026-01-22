import { get, merge } from "lodash";
import { AGENT_MANAGEMENT } from "../../config/actions";


const initialState = {
  loading: false,
  agentLogLoading: false,
  agentDetailsLoading: false,
  schedulerLoading: false,
  error: "",
  successMessage: "",
  reload: false,
  jobReload: false,
  localConfigReload: false,
  agentServers: {},
  agentGlobalConfiguration: [],
  filterAgents: [],
  filterRepo: [],
  addAgents: [],
  agentLogs: {},
  localConfigs: [],
  repositories: [],
  downloadRepo: [],
  saveCommand: [],
  updateCommand: [],
  deleteCommand: [],
  scheduleConfig: [],
  fetchScheduler: [],
  adSyncupLoading: false,
  agentMetrics: [],
  serviceLoading: false,
  globalConfigLoading: false,
  metricsLoading: false,
  filterLoading: false,
  agentRegions: [],
  agentEnvironments: [],
  metricsTilesData: [],
  agentPlatforms: [],
  agentSids: [],
  agentOsTypes: [],
  agentServiceNames: [],
  agentVersions: [],
  agentSyncHealthConfigs: [],
  agentHealthCheckUP: [],
  restartJob: [],
  startedAgent: [],
  stoppedAgent: [],
  restartAgent: [],
  upgradeAgents: {},
  agentLoading: false,
  agentData: {},
  agentInfo: {},

  versionManagementLoading: false,
  versions: [],
  versionError: "",

  createVersionLoading: false,
  createVersionError: "",
  updateVersionLoading: false,
  updateVersionError: "",
  deleteVersionLoading: false,
  deleteVersionError: "",
  
  manualSyncVersionsLoading: false,
  manualSyncVersionsError: "",
};

const getPrevAgentLogs = (state: typeof initialState) => get(state, "agentLogs", {});


export default function agentManagementReducer(
  state = initialState,
  action: {
    type: string;
    [key: string]: any;
  },
) {
  switch (action.type) {
    
    case AGENT_MANAGEMENT.START_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_START_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_START_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: action.successMessage,
      };
    case AGENT_MANAGEMENT.FAILURE_START_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP:
      return {
        ...state,
        serviceLoading: false,
        successMessage: "Health checkup fetched successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP_BY_PORT:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP_BY_PORT:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP_BY_PORT:
      return {
        ...state,
        loading: false,
        successMessage: action.successMessage,
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP_BY_PORT:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.STOP_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_STOP_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_STOP_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: "Agent Stopped Successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_STOP_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.RESTART_JOB_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_RESTART_JOB_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_RESTART_JOB_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: "Job Restarted Successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_RESTART_JOB_SERVICE:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.RESTART_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_RESTART_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_RESTART_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: "Agent Restarted Successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_RESTART_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.SAVE_AGENT_PROPERTY:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_SAVE_AGENT_PROPERTY:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_SAVE_AGENT_PROPERTY:
      return {
        ...state,
        loading: false,
        successMessage: "Agent Property Saved Successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_SAVE_AGENT_PROPERTY:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.UPDATE_AGENT_PROPERTY:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_UPDATE_AGENT_PROPERTY:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_UPDATE_AGENT_PROPERTY:
      return {
        ...state,
        loading: false,
        successMessage: "Agent Property Updated Successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_UPDATE_AGENT_PROPERTY:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_BUILD_INFO:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_BUILD_INFO:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_BUILD_INFO:
      return {
        ...state,
        loading: false,
        successMessage: "Agent Build Info fetched Successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_BUILD_INFO:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_GLOBAL_CONFIG:
      return { ...state, globalConfigLoading: true, agentGlobalConfiguration: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_GLOBAL_CONFIG:
      return {
        ...state,
        globalConfigLoading: true,
        agentGlobalConfiguration: "",
        reload: false,
      };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_GLOBAL_CONFIG:
      return {
        ...state,
        globalConfigLoading: false,
        agentGlobalConfiguration: action.agentGlobalConfiguration,
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_GLOBAL_CONFIG:
      return { ...state, globalConfigLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.SAVE_GLOBAL_CONFIG:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_SAVE_GLOBAL_CONFIG:
      return { ...state, loading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_SAVE_GLOBAL_CONFIG:
      return {
        ...state,
        loading: false,
        successMessage: action.successMessage,
        reload: true,
      };
    case AGENT_MANAGEMENT.FAILURE_SAVE_GLOBAL_CONFIG:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE:
      return { ...state, loading: true, agentServers: {} };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MANAGEMENT_SERVICE:
      return { ...state, loading: true, agentServers: {} };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE:
      return {
        ...state,
        loading: false,
        agentServers: action.agentServers,
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MANAGEMENT_SERVICE:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_FILTER:
      return { ...state, loading: true, filterAgents: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_FILTER:
      return { ...state, loading: true, filterAgents: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_FILTER:
      return { ...state, loading: false, filterAgents: action.filterAgents };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_FILTER:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_REPOSITORIES:
      return { ...state, loading: true, filterRepo: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REPOSITORIES:
      return { ...state, loading: true, filterRepo: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REPOSITORIES:
      return { ...state, loading: false, filterRepo: action.filterRepo };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REPOSITORIES:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.ADD_AGENT:
      return { ...state, loading: true, addAgents: "" };
    case AGENT_MANAGEMENT.REQUEST_ADD_AGENT:
      return { ...state, loading: true, addAgents: "" };
    case AGENT_MANAGEMENT.SUCCESS_ADD_AGENT:
      return { ...state, loading: false, addAgents: action.addAgents };
    case AGENT_MANAGEMENT.FAILURE_ADD_AGENT:
      return { ...state, loading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_LOGS:
      return { ...state, agentLogLoading: true };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_LOGS:
      return { ...state, agentLogLoading: true };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_LOGS:
      return { ...state, agentLogLoading: false, agentLogs: merge(getPrevAgentLogs(state), action.agentLogs) };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_LOGS:
      return { ...state, agentLogLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.RELOAD_FETCH_AGENT_LOGS:
      return { ...state, agentLogLoading: true, agentLogs: {} };

    
    case AGENT_MANAGEMENT.SAVE_LOCAL_CONFIGS:
      return {
        ...state,
        successMessage: "",
        localConfigReload: true,
      };
    case AGENT_MANAGEMENT.REQUEST_SAVE_LOCAL_CONFIGS:
      return { ...state, localConfigReload: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_SAVE_LOCAL_CONFIGS:
      return {
        ...state,
        loading: false,
        successMessage: action.successMessage,
        localConfigReload: false,
      };
    case AGENT_MANAGEMENT.FAILURE_SAVE_LOCAL_CONFIGS:
      return { ...state, localConfigReload: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_LOCAL_CONFIGS:
      return { ...state, localConfigReload: true, localConfigs: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_LOCAL_CONFIGS:
      return { ...state, localConfigReload: true, localConfigs: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_LOCAL_CONFIGS:
      return { ...state, localConfigReload: false, localConfigs: action.localConfigs };
    case AGENT_MANAGEMENT.FAILURE_FETCH_LOCAL_CONFIGS:
      return { ...state, localConfigReload: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_REPOSITORIES:
      return { ...state, serviceLoading: true, repositories: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_REPOSITORIES:
      return { ...state, serviceLoading: true, repositories: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_REPOSITORIES:
      return { ...state, serviceLoading: false, repositories: action.repositories };
    case AGENT_MANAGEMENT.FAILURE_FETCH_REPOSITORIES:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.DOWNLOAD_REPOSITORIES:
      return { ...state, serviceLoading: true, downloadRepo: "" };
    case AGENT_MANAGEMENT.REQUEST_DOWNLOAD_REPOSITORIES:
      return { ...state, serviceLoading: true, downloadRepo: "" };
    case AGENT_MANAGEMENT.SUCCESS_DOWNLOAD_REPOSITORIES:
      return { ...state, serviceLoading: false, downloadRepo: action.downloadRepo };
    case AGENT_MANAGEMENT.FAILURE_DOWNLOAD_REPOSITORIES:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.SAVE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, saveCommand: "", jobReload: false };
    case AGENT_MANAGEMENT.REQUEST_SAVE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, saveCommand: "", jobReload: false };
    case AGENT_MANAGEMENT.SUCCESS_SAVE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, saveCommand: action.saveCommand, jobReload: true };
    case AGENT_MANAGEMENT.FAILURE_SAVE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, error: action.error, jobReload: false };

    
    case AGENT_MANAGEMENT.UPDATE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, updateCommand: "", jobReload: false };
    case AGENT_MANAGEMENT.REQUEST_UPDATE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, updateCommand: "", jobReload: false };
    case AGENT_MANAGEMENT.SUCCESS_UPDATE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, updateCommand: action.updateCommand, jobReload: true };
    case AGENT_MANAGEMENT.FAILURE_UPDATE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, error: action.error, jobReload: false };

    
    case AGENT_MANAGEMENT.DELETE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, deleteCommand: "", jobReload: false };
    case AGENT_MANAGEMENT.REQUEST_DELETE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, deleteCommand: "", jobReload: false };
    case AGENT_MANAGEMENT.SUCCESS_DELETE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, deleteCommand: action.deleteCommand, jobReload: true };
    case AGENT_MANAGEMENT.FAILURE_DELETE_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, error: action.error, jobReload: false };

    
    case AGENT_MANAGEMENT.LIST_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, scheduleConfig: [] };
    case AGENT_MANAGEMENT.REQUEST_LIST_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: true, scheduleConfig: [] };
    case AGENT_MANAGEMENT.SUCCESS_LIST_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, scheduleConfig: action.scheduleConfig };
    case AGENT_MANAGEMENT.FAILURE_LIST_SCHEDULER_COMMAND:
      return { ...state, schedulerLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_SCHEDULED_JOBS_BY_COMMAND_ID:
      return { ...state, schedulerLoading: true, fetchScheduler: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID:
      return { ...state, schedulerLoading: true, fetchScheduler: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID:
      return { ...state, schedulerLoading: false, fetchScheduler: action.fetchScheduler };
    case AGENT_MANAGEMENT.FAILURE_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID:
      return { ...state, schedulerLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.SYNCUP_AGENT_DISCOVERY:
      return { ...state, adSyncupLoading: true };
    case AGENT_MANAGEMENT.REQUEST_SYNCUP_AGENT_DISCOVERY:
      return { ...state, adSyncupLoading: true };
    case AGENT_MANAGEMENT.SUCCESS_SYNCUP_AGENT_DISCOVERY:
      return { ...state, adSyncupLoading: false };
    case AGENT_MANAGEMENT.FAILURE_SYNCUP_AGENT_DISCOVERY:
      return { ...state, adSyncupLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_METRICS:
      return { ...state, metricsLoading: true, agentMetrics: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_METRICS:
      return { ...state, metricsLoading: true, agentMetrics: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_METRICS:
      return { ...state, metricsLoading: false, agentMetrics: action.agentMetrics };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_METRICS:
      return { ...state, metricsLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.SYNC_SCRIPTS:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_SYNC_SCRIPTS:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_SYNC_SCRIPTS:
      return {
        ...state,
        serviceLoading: false,
        successMessage: "Script synced successfully",
      };
    case AGENT_MANAGEMENT.FAILURE_SYNC_SCRIPTS:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_REGIONS:
      return { ...state, filterLoading: true, agentRegions: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REGIONS:
      return { ...state, filterLoading: true, agentRegions: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REGIONS:
      return { ...state, filterLoading: false, agentRegions: action.agentRegions };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REGIONS:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_ENVIRONMENTS:
      return { ...state, filterLoading: true, agentEnvironments: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_ENVIRONMENTS:
      return { ...state, filterLoading: true, agentEnvironments: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_ENVIRONMENTS:
      return { ...state, filterLoading: false, agentEnvironments: action.agentEnvironments };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_ENVIRONMENTS:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_METRICS_TILES_DATA:
      return { ...state, filterLoading: true, metricsTilesData: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_METRICS_TILES_DATA:
      return { ...state, filterLoading: true, metricsTilesData: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_METRICS_TILES_DATA:
      return { ...state, filterLoading: false, metricsTilesData: action.metricsTilesData };
    case AGENT_MANAGEMENT.FAILURE_FETCH_METRICS_TILES_DATA:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_PLATFORMS:
      return { ...state, filterLoading: true, agentPlatforms: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_PLATFORMS:
      return { ...state, filterLoading: true, agentPlatforms: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_PLATFORMS:
      return { ...state, filterLoading: false, agentPlatforms: action.agentPlatforms };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_PLATFORMS:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_SIDS:
      return { ...state, filterLoading: true, agentSids: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SIDS:
      return { ...state, filterLoading: true, agentSids: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SIDS:
      return { ...state, filterLoading: false, agentSids: action.agentSids };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SIDS:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_OS_TYPES:
      return { ...state, filterLoading: true, agentOsTypes: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_OS_TYPES:
      return { ...state, filterLoading: true, agentOsTypes: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_OS_TYPES:
      return { ...state, filterLoading: false, agentOsTypes: action.agentOsTypes };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_OS_TYPES:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_SERVICE_NAMES:
      return { ...state, filterLoading: true, agentServiceNames: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SERVICE_NAMES:
      return { ...state, filterLoading: true, agentServiceNames: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SERVICE_NAMES:
      return { ...state, filterLoading: false, agentServiceNames: action.agentServiceNames };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SERVICE_NAMES:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_AGENT_VERSIONS:
      return { ...state, filterLoading: true, agentVersions: [] };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_VERSIONS:
      return { ...state, filterLoading: true, agentVersions: [] };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_VERSIONS:
      return { ...state, filterLoading: false, agentVersions: action.agentVersions };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_VERSIONS:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.SYNC_AGENT_HEALTH_CONFIGS:
      return { ...state, filterLoading: true, agentSyncHealthConfigs: [] };
    case AGENT_MANAGEMENT.REQUEST_SYNC_AGENT_HEALTH_CONFIGS:
      return { ...state, filterLoading: true, agentSyncHealthConfigs: [] };
    case AGENT_MANAGEMENT.SUCCESS_SYNC_AGENT_HEALTH_CONFIGS:
      return { ...state, filterLoading: false, agentSyncHealthConfigs: action.agentSyncHealthConfigs };
    case AGENT_MANAGEMENT.FAILURE_SYNC_AGENT_HEALTH_CONFIGS:
      return { ...state, filterLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.START_SELECTED_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "", startedAgent: [] };
    case AGENT_MANAGEMENT.REQUEST_SELECTED_START_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "", startedAgent: [] };
    case AGENT_MANAGEMENT.SUCCESS_SELECTED_START_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: action.successMessage,
        startedAgent: action.startedAgent,
      };
    case AGENT_MANAGEMENT.FAILURE_SELECTED_START_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error, startedAgent: [] };

    
    case AGENT_MANAGEMENT.STOP_SELECTED_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "", stoppedAgent: [] };
    case AGENT_MANAGEMENT.REQUEST_SELECTED_STOP_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "", stoppedAgent: [] };
    case AGENT_MANAGEMENT.SUCCESS_SELECTED_STOP_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: action.successMessage,
        stoppedAgent: action.stoppedAgent,
      };
    case AGENT_MANAGEMENT.FAILURE_SELECTED_STOP_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error, stoppedAgent: [] };

    
    case AGENT_MANAGEMENT.RESTART_SELECTED_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "", restartAgent: [] };
    case AGENT_MANAGEMENT.REQUEST_SELECTED_RESTART_AGENT_SERVICE:
      return { ...state, serviceLoading: true, successMessage: "", restartAgent: [] };
    case AGENT_MANAGEMENT.SUCCESS_SELECTED_RESTART_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        successMessage: action.successMessage,
        restartAgent: action.restartAgent,
      };
    case AGENT_MANAGEMENT.FAILURE_SELECTED_RESTART_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error, restartAgent: [] };

    
    case AGENT_MANAGEMENT.HEALTHCHECKUP_SELECTED_AGENT_SERVICE:
      return { ...state, serviceLoading: true };
    case AGENT_MANAGEMENT.REQUEST_SELECTED_HEALTHCHECKUP_AGENT_SERVICE:
      return { ...state, serviceLoading: true };
    case AGENT_MANAGEMENT.SUCCESS_SELECTED_HEALTHCHECKUP_AGENT_SERVICE:
      return {
        ...state,
        serviceLoading: false,
        agentHealthCheckUP: action.agentHealthCheckUP,
      };
    case AGENT_MANAGEMENT.FAILURE_SELECTED_HEALTHCHECKUP_AGENT_SERVICE:
      return { ...state, serviceLoading: false, error: action.error };

    
    case AGENT_MANAGEMENT.FETCH_UPGRADE_AGENTS:
      return { ...state, serviceLoading: true, upgradeAgents: {} };
    case AGENT_MANAGEMENT.REQUEST_FETCH_UPGRADE_AGENTS:
      return { ...state, serviceLoading: true, upgradeAgents: {} };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_UPGRADE_AGENTS:
      return {
        ...state,
        serviceLoading: false,
        upgradeAgents: action.upgradeAgents,
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_UPGRADE_AGENTS:
      return { ...state, serviceLoading: false, error: action.error, upgradeAgents: {} };

    
    case AGENT_MANAGEMENT.UPGRADE_SELECTED_AGENTS:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.REQUEST_UPGRADE_SELECTED_AGENTS:
      return { ...state, serviceLoading: true, successMessage: "" };
    case AGENT_MANAGEMENT.SUCCESS_UPGRADE_SELECTED_AGENTS:
      return {
        ...state,
        serviceLoading: false,
        successMessage: action.successMessage,
      };
    case AGENT_MANAGEMENT.FAILURE_UPGRADE_SELECTED_AGENTS:
      return { ...state, serviceLoading: false, error: action.error };

    case AGENT_MANAGEMENT.FETCH_AGENT_MASTERDATA:
      return { ...state, loading: true, agentData: {} };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MASTERDATA:
      return { ...state, loading: true, agentData: {} };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MASTERDATA:
      return {
        ...state,
        loading: false,
        agentData: action.agentData,
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MASTERDATA:
      return { ...state, loading: false, error: action.error, agentData: {} };

    case AGENT_MANAGEMENT.ADD_AGENT_MASTERDATA:
      return { ...state, agentLoading: true, reload: false };
    case AGENT_MANAGEMENT.REQUEST_ADD_AGENT_MASTERDATA:
      return { ...state, agentLoading: true, reload: false };
    case AGENT_MANAGEMENT.SUCCESS_ADD_AGENT_MASTERDATA:
      return {
        ...state,
        reload: true,
        agentLoading: false,
      };
    case AGENT_MANAGEMENT.FAILURE_ADD_AGENT_MASTERDATA:
      return { ...state, agentLoading: false, error: action.error };

    case AGENT_MANAGEMENT.DELETE_HOSTNAME:
      return { ...state, agentLoading: true, reload: false };
    case AGENT_MANAGEMENT.REQUEST_DELETE_HOSTNAME:
      return { ...state, agentLoading: true, reload: false };
    case AGENT_MANAGEMENT.SUCCESS_DELETE_HOSTNAME:
      return {
        ...state,
        reload: true,
        agentLoading: false,
      };
    case AGENT_MANAGEMENT.FAILURE_DELETE_HOSTNAME:
      return { ...state, agentLoading: false, error: action.error };

    case AGENT_MANAGEMENT.FETCH_AGENT_INFO:
      return { ...state, agentDetailsLoading: true, agentInfo: {} };
    case AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_INFO:
      return { ...state, agentDetailsLoading: true, agentInfo: {} };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_INFO:
      return {
        ...state,
        agentDetailsLoading: false,
        agentInfo: action.agentInfo,
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_INFO:
      return { ...state, agentDetailsLoading: false, error: action.error, agentInfo: {} };

    
    case AGENT_MANAGEMENT.FETCH_VERSIONS:
      return { ...state, versionManagementLoading: true, versionError: "" };
    case AGENT_MANAGEMENT.REQUEST_FETCH_VERSIONS:
      return { ...state, versionManagementLoading: true, versionError: "" };
    case AGENT_MANAGEMENT.SUCCESS_FETCH_VERSIONS:
      return {
        ...state,
        versionManagementLoading: false,
        versions: action.data,
        versionError: "",
      };
    case AGENT_MANAGEMENT.FAILURE_FETCH_VERSIONS:
      return {
        ...state,
        versionManagementLoading: false,
        versionError: action.error,
      };
    case AGENT_MANAGEMENT.CREATE_VERSION:
      return { ...state, createVersionLoading: true, createVersionError: "" };
    case AGENT_MANAGEMENT.REQUEST_CREATE_VERSION:
      return { ...state, createVersionLoading: true, createVersionError: "" };
    case AGENT_MANAGEMENT.SUCCESS_CREATE_VERSION:
      return {
        ...state,
        createVersionLoading: false,
        createVersionError: "",
      };
    case AGENT_MANAGEMENT.FAILURE_CREATE_VERSION:
      return {
        ...state,
        createVersionLoading: false,
        createVersionError: action.error,
      };
    case AGENT_MANAGEMENT.UPDATE_VERSION:
      return { ...state, updateVersionLoading: true, updateVersionError: "" };
    case AGENT_MANAGEMENT.REQUEST_UPDATE_VERSION:
      return { ...state, updateVersionLoading: true, updateVersionError: "" };
    case AGENT_MANAGEMENT.SUCCESS_UPDATE_VERSION:
      return {
        ...state,
        updateVersionLoading: false,
        updateVersionError: "",
      };
    case AGENT_MANAGEMENT.FAILURE_UPDATE_VERSION:
      return {
        ...state,
        updateVersionLoading: false,
        updateVersionError: action.error,
      };
    case AGENT_MANAGEMENT.DELETE_VERSION:
      return { ...state, deleteVersionLoading: true, deleteVersionError: "" };
    case AGENT_MANAGEMENT.REQUEST_DELETE_VERSION:
      return { ...state, deleteVersionLoading: true, deleteVersionError: "" };
    case AGENT_MANAGEMENT.SUCCESS_DELETE_VERSION:
      return {
        ...state,
        deleteVersionLoading: false,
        deleteVersionError: "",
      };
    case AGENT_MANAGEMENT.FAILURE_DELETE_VERSION:
      return {
        ...state,
        deleteVersionLoading: false,
        deleteVersionError: action.error,
      };
    case AGENT_MANAGEMENT.MANUAL_SYNC_VERSIONS:
      return { ...state, manualSyncVersionsLoading: true, manualSyncVersionsError: "" };
    case AGENT_MANAGEMENT.REQUEST_MANUAL_SYNC_VERSIONS:
      return { ...state, manualSyncVersionsLoading: true, manualSyncVersionsError: "" };
    case AGENT_MANAGEMENT.SUCCESS_MANUAL_SYNC_VERSIONS:
      return {
        ...state,
        manualSyncVersionsLoading: false,
        manualSyncVersionsError: "",
      };
    case AGENT_MANAGEMENT.FAILURE_MANUAL_SYNC_VERSIONS:
      return {
        ...state,
        manualSyncVersionsLoading: false,
        manualSyncVersionsError: action.error,
      };

    default:
      return state;
  }
}

