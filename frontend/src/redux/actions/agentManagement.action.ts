/**
 * AGENT MANAGEMENT ACTIONS
 */

import { BinaryVersionPayload } from "@/services/agent/agentManagement.service";
import { AGENT_MANAGEMENT } from "../../config/actions";

/**
 * Start Agent Management Service
 * @param {*} props
 * @returns
 */

interface AgentManagementProps {
  port?: string | number;
  hostname?: string;
  osVersion?: string;
  pageSize?: string;
  pageNo?: number;
  status?: string;
  agentSearch?: string;
  os?: string[];
  region?: string[];
  environment?: string[];
  platform?: string[];
  sid?: string[];
  agentVersion?: string[];
  serviceName?: string[];
  limit?: string;
  search?: string;
}

interface ConfigProperty {
  label: string;
  propertyName: string;
  propertyValue: string;
  propertyType: string;
  encrypted?: boolean;
  error?: boolean;
}

// Add to your existing interfaces
interface VersionManagementProps {
  versionStatus?: string;
  operatingSystem?: string;
  upgradeType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  isDeleted?: boolean;
}

const startAgentService = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.START_AGENT_SERVICE,
  props,
});
const requestStartAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_START_AGENT_SERVICE,
});
const successStartAgentService = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_START_AGENT_SERVICE,
  successMessage: "The Agent started Successfully",
});
const failureStartAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_START_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Fetch Agent Health Check Service
 * @param {*} props
 * @returns
 */
const fetchHealthCheckup = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP,
  props,
});
const requestFetchHealthCheckup = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP,
});
const successFetchHealthCheckup = (successMessage: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP,
  successMessage,
});
const failureFetchHealthCheckup = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP,
  error: error.message || "",
});

/**
 * Fetch Agent Health Check Run Service
 * @param {*} props
 * @returns
 */
const fetchHealthCheckRun = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.FETCH_HEALTH_CHECK_RUN,
  props,
});
const requestFetchHealthCheckRun = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECK_RUN,
});
const successFetchHealthCheckRun = (successMessage: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECK_RUN,
  successMessage,
});
const failureFetchHealthCheckRun = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECK_RUN,
  error: error.message || "",
});

/**
 * Fetch Agent Health Check by Port Service
 * @param {*} props
 * @returns
 */
const fetchHealthCheckupByPort = () => ({
  type: AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP_BY_PORT,
});
const requestFetchHealthCheckupByPort = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_HEALTH_CHECKUP_BY_PORT,
});
const successFetchHealthCheckupByPort = (healthCheckupByPort?: string | number) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_HEALTH_CHECKUP_BY_PORT,
});
const failureFetchHealthCheckupByPort = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_HEALTH_CHECKUP_BY_PORT,
  error: error.message || "",
});

/**
 * Stop Agent Management Service
 * @param {*} props
 * @returns
 */
const stopAgentServices = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.STOP_AGENT_SERVICE,
  props,
});
const requestStopAgentServices = () => ({
  type: AGENT_MANAGEMENT.REQUEST_STOP_AGENT_SERVICE,
});
const successStopAgentServices = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_STOP_AGENT_SERVICE,
  successMessage: "The Agent Stopped Successfully",
});
const failureStopAgentServices = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_STOP_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Restart Agent Management Service
 * @param {*} props
 * @returns
 */
const restartAgentService = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.RESTART_AGENT_SERVICE,
  props,
});
const requestRestartAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_RESTART_AGENT_SERVICE,
});
const successRestartAgentService = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_RESTART_AGENT_SERVICE,
  successMessage: "The Agent restarted Successfully",
});
const failureRestartAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_RESTART_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Restart Job Service
 * @param {*} props
 * @returns
 */
const restartJobService = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.RESTART_JOB_SERVICE,
  props,
});
const requestRestartJobService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_RESTART_JOB_SERVICE,
});
const successRestartJobService = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_RESTART_JOB_SERVICE,
  successMessage: "The Agent restarted Successfully",
});
const failureRestartJobService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_RESTART_JOB_SERVICE,
  error: error.message || "",
});

/**
 * Shut Down Agent Service
 * @param {*} props
 * @returns
 */
const shutDownAgentService = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.SHUTDOWN_AGENT_SERVICE,
  props,
});
const requestShutDownAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SHUTDOWN_AGENT_SERVICE,
});
const successShutDownAgentService = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SHUTDOWN_AGENT_SERVICE,
  successMessage: "The Agent Shut Down Successfully",
});
const failureShutDownAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SHUTDOWN_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Start Agent via ssh Agent Service
 * @param {*} props
 * @returns
 */
const startSSHAgentService = (props: { hostname: string; port: string; osVersion: string }) => ({
  type: AGENT_MANAGEMENT.STARTSSH_AGENT_SERVICE,
  props,
});
const requestStartSSHAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_STARTSSH_AGENT_SERVICE,
});
const successStartSSHAgentService = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_STARTSSH_AGENT_SERVICE,
  successMessage: "The Agent Started Successfully",
});
const failureStartSSHAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_STARTSSH_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Save Agent Property Service
 * @param {*} props
 * @returns
 */
const saveAgentProperty = () => ({
  type: AGENT_MANAGEMENT.SAVE_AGENT_PROPERTY,
});
const requestSaveAgentProperty = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SAVE_AGENT_PROPERTY,
});
const successSaveAgentProperty = (successMessage: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SAVE_AGENT_PROPERTY,
  successMessage,
});
const failureSaveAgentProperty = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SAVE_AGENT_PROPERTY,
  error: error.message || "",
});

/**
 * Update Agent Property Service
 * @param {*} props
 * @returns
 */
const updateAgentProperty = () => ({
  type: AGENT_MANAGEMENT.UPDATE_AGENT_PROPERTY,
});
const requestUpdateAgentProperty = () => ({
  type: AGENT_MANAGEMENT.REQUEST_UPDATE_AGENT_PROPERTY,
});
const successUpdateAgentProperty = (updateAgentPropertyProp?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_UPDATE_AGENT_PROPERTY,
});
const failureUpdateAgentProperty = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_UPDATE_AGENT_PROPERTY,
  error: error.message || "",
});

/**
 * Fetch Agent Build info Service
 * @param {*} props
 * @returns
 */
const fetchAgentBuildInfo = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_BUILD_INFO,
});
const requestFetchAgentBuildInfo = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_BUILD_INFO,
});
const successFetchAgentBuildInfo = (agentBuildInfo?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_BUILD_INFO,
});
const failureFetchAgentBuildInfo = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_BUILD_INFO,
  error: error.message || "",
});

/**
 * Fetch Agent Build info Service
 * @param {*} props
 * @returns
 */
const fetchAgentInfo = (props: { hostname: string }) => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_INFO,
  props,
});
const requestFetchAgentInfo = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_INFO,
});
const successFetchAgentInfo = (agentInfo: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_INFO,
  agentInfo,
});
const failureFetchAgentInfo = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_INFO,
  error: error.message || "",
});

/**
 * Save Global config Service
 * @param {*} props
 * @returns
 */
const saveGlobalConfig = (props: { riseBot: Omit<ConfigProperty, "label" | "error" | "propertyType">[] }) => ({
  type: AGENT_MANAGEMENT.SAVE_GLOBAL_CONFIG,
  props,
});
const requestSaveGlobalConfig = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SAVE_GLOBAL_CONFIG,
});
const successSaveGlobalConfig = (saveGlobalConfigs: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SAVE_GLOBAL_CONFIG,
  saveGlobalConfigs,
});
const failureSaveGlobalConfig = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SAVE_GLOBAL_CONFIG,
  error: error.message || "",
});

/**
 * Fetch Global config Service
 * @param {*} props
 * @returns
 */
const fetchGlobalConfig = () => ({
  type: AGENT_MANAGEMENT.FETCH_GLOBAL_CONFIG,
});
const requestFetchGlobalConfig = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_GLOBAL_CONFIG,
});
const successFetchGlobalConfig = (agentGlobalConfiguration: {
  flag: string;
  data: {
    osAgent: {
      propertyName: string;
      propertyValue: string;
    }[];
    schedulerAgent: {
      propertyName: string;
      propertyValue: string;
    }[];
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_GLOBAL_CONFIG,
  agentGlobalConfiguration,
});
const failureFetchGlobalConfig = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_GLOBAL_CONFIG,
  error: error.message || "",
});

const fetchAgentManagementServices = (props: {
  pageSize: string;
  pageNo: number;
  status?: string;
  agentSearch: string;
  os: string[];
  region: string[];
  environment: string[];
  platform: string[];
  sid: string[];
  agentVersion: string[];
  serviceName: string[];
}) => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE,
  props,
});
const requestFetchAgentManagementServices = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MANAGEMENT_SERVICE,
});
const successFetchAgentManagementServices = (agentServers: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MANAGEMENT_SERVICE,
  agentServers,
});
const failureFetchAgentManagementServices = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MANAGEMENT_SERVICE,
  error: error.message || "",
});

/**
 * Fetch Agent filter Service
 * @param {*} props
 * @returns
 */
const fetchAgentFilters = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_FILTER,
  props,
});
const requestFetchAgentFilters = () => ({
  types: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_FILTER,
});
const successFetchAgentFilters = (filterAgents: string) => ({
  types: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_FILTER,
  filterAgents,
});
const failureFetchAgentFilters = (error: { message: string }) => ({
  types: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_FILTER,
  error: error.message || "",
});

/**
 * Fetch Agent Repositories Service
 * @param {*} props
 * @returns
 */
const fetchAgentRepositories = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_REPOSITORIES,
  props,
});
const requestFetchAgentRepositories = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REPOSITORIES,
});
const successFetchAgentRepositories = (filterRepo: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REPOSITORIES,
  filterRepo,
});
const failureFetchAgentRepositories = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REPOSITORIES,
  error: error.message || "",
});

/**
 * Add Agent Service
 * @param {*} props
 * @returns
 */
const addAgent = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.ADD_AGENT,
  props,
});
const requestAddAgent = () => ({
  type: AGENT_MANAGEMENT.REQUEST_ADD_AGENT,
});
const successAddAgent = (agentAdd: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_ADD_AGENT,
  agentAdd,
});
const failureAddAgent = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_ADD_AGENT,
  error: error.message || "",
});

/**
 * Fetch Agent Logs Service
 * @param {*} props
 * @returns
 */
const fetchAgentLogs = (props: { hostname: string; agentId: string | null; limit: number; skip: number; jobname: string }) => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_LOGS,
  props,
});
const requestFetchAgentLogs = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_LOGS,
});
const successFetchAgentLogs = (agentLogs: unknown) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_LOGS,
  agentLogs,
});
const failureFetchAgentLogs = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_LOGS,
  error: error.message || "",
});

/**
 * reload Fetch Agent Logs Service
 * @param {*} props
 * @returns
 */
const reloadFetchAgentLogs = () => ({
  type: AGENT_MANAGEMENT.RELOAD_FETCH_AGENT_LOGS,
});

/**
 * Save Local Configs Service
 * @param {*} props
 * @returns
 */
const saveLocalConfigs = (props: { hostname: string; port: string; propertiesSchemas: any[] }) => ({
  type: AGENT_MANAGEMENT.SAVE_LOCAL_CONFIGS,
  props,
});
const requestSaveLocalConfigs = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SAVE_LOCAL_CONFIGS,
});
const successSaveLocalConfigs = (saveLocalConfig: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SAVE_LOCAL_CONFIGS,
  saveLocalConfig,
});
const failureSaveLocalConfigs = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SAVE_LOCAL_CONFIGS,
  error: error.message || "",
});

/**
 * Fetch Local Configs Service
 * @param {*} props
 * @returns
 */
const fetchLocalConfigs = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.FETCH_LOCAL_CONFIGS,
  props,
});
const requestFetchLocalConfigs = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_LOCAL_CONFIGS,
});
const successFetchLocalConfigs = (localConfig: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_LOCAL_CONFIGS,
  localConfig,
});
const failureFetchLocalConfigs = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_LOCAL_CONFIGS,
  error: error.message || "",
});

/**
 * Fetch Agent Repositories Service
 * @param {*} props
 * @returns
 */
const fetchRepositories = (props: { type: string }) => ({
  type: AGENT_MANAGEMENT.FETCH_REPOSITORIES,
  props,
});
const requestFetchRepositories = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_REPOSITORIES,
});
const successFetchRepositories = (repositories: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_REPOSITORIES,
  repositories,
});
const failureFetchRepositories = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_REPOSITORIES,
  error: error.message || "",
});

/**
 * Download Agent Repositories Service
 * @param {*} props
 * @returns
 */
const downloadRepositories = (props: { agentpath: any; version: string; port: string; hostname: string }) => ({
  type: AGENT_MANAGEMENT.DOWNLOAD_REPOSITORIES,
  props,
});
const requestDownloadRepositories = () => ({
  type: AGENT_MANAGEMENT.REQUEST_DOWNLOAD_REPOSITORIES,
});
const successDownloadRepositories = (downloadRepo: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_DOWNLOAD_REPOSITORIES,
  downloadRepo,
});
const failureDownloadRepositories = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_DOWNLOAD_REPOSITORIES,
  error: error.message || "",
});

/**
 * Save Scheduler Command Data Service
 * @param {*} props
 * @returns
 */
const saveSchedulerCommand = (props: {
  hostname: string;
  agentId: string;
  cronExpression: string;
  command: string;
  enabled: boolean;
  opensearchEnabled: boolean;
  opensearchIndex: string;
  type: string;
  sourceDir: string;
}) => ({
  type: AGENT_MANAGEMENT.SAVE_SCHEDULER_COMMAND,
  props,
});
const requestSaveSchedulerCommand = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SAVE_SCHEDULER_COMMAND,
});
const successSaveSchedulerCommand = (saveCommand: { status: number; message: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SAVE_SCHEDULER_COMMAND,
  saveCommand,
});

const failureSaveSchedulerCommand = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SAVE_SCHEDULER_COMMAND,
  error: error.message || "",
});

/**
 * Update Scheduler Command Data Service
 * @param {*} props
 * @returns
 */
const updateSchedulerCommand = (props: {
  hostname: string;
  agentId: string;
  cronExpression: string;
  command: string;
  enabled: boolean;
  opensearchEnabled: boolean;
  opensearchIndex: string;
  type: string;
  sourceDir: string;
  scheduledJobId: string;
}) => ({
  type: AGENT_MANAGEMENT.UPDATE_SCHEDULER_COMMAND,
  props,
});
const requestUpdateSchedulerCommand = () => ({
  type: AGENT_MANAGEMENT.REQUEST_UPDATE_SCHEDULER_COMMAND,
});
const successUpdateSchedulerCommand = (updateCommand: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_UPDATE_SCHEDULER_COMMAND,
  updateCommand,
});
const failureUpdateSchedulerCommand = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_UPDATE_SCHEDULER_COMMAND,
  error: error.message || "",
});

/**
 * Delete Scheduler Command Data Service
 * @param {*} props
 * @returns
 */
const deleteSchedulerCommand = (props: { hostname: string; port: string; scheduledJobId: string }) => ({
  type: AGENT_MANAGEMENT.DELETE_SCHEDULER_COMMAND,
  props,
});
const requestDeleteSchedulerCommand = () => ({
  type: AGENT_MANAGEMENT.REQUEST_DELETE_SCHEDULER_COMMAND,
});
const successDeleteSchedulerCommand = (deleteCommand: { flag: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_DELETE_SCHEDULER_COMMAND,
  deleteCommand,
});
const failureDeleteSchedulerCommand = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_DELETE_SCHEDULER_COMMAND,
  error: error.message || "",
});

/**
 * List Scheduler Command Data Service
 * @param {*} props
 * @returns
 */
const listSchedulerCommand = (props: { hostname: string; port: string }) => ({
  type: AGENT_MANAGEMENT.LIST_SCHEDULER_COMMAND,
  props,
});
const requestListSchedulerCommand = () => ({
  type: AGENT_MANAGEMENT.REQUEST_LIST_SCHEDULER_COMMAND,
});
const successListSchedulerCommand = (scheduleConfig: {
  data: {
    data: {
      id: string;
      name: string;
    }[];
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_LIST_SCHEDULER_COMMAND,
  scheduleConfig,
});
const failureListSchedulerCommand = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_LIST_SCHEDULER_COMMAND,
  error: error.message || "",
});

/**
 * Fetch Scheduler Command Data by ID Service
 * @param {*} props
 * @returns
 */
const fetchScheduledJobsByCommandId = (props: { hostname: string; port: string; scheduledJobId: string }) => ({
  type: AGENT_MANAGEMENT.FETCH_SCHEDULED_JOBS_BY_COMMAND_ID,
  props,
});
const RequestFetchScheduledJobsByCommandId = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID,
});
const successFetchScheduledJobsByCommandId = (fetchScheduler: {
  data: {
    flag: string;
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID,
  fetchScheduler,
});

const failureFetchScheduledJobsByCommandId = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_SCHEDULED_JOBS_BY_COMMAND_ID,
  error: error.message || "",
});

/**
 * Syncup Agent Discvoery Data Service
 * @param {*} props
 * @returns
 */
const syncUpAgentDiscovery = () => ({
  type: AGENT_MANAGEMENT.SYNCUP_AGENT_DISCOVERY,
});
const requestSyncUpAgentDiscovery = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SYNCUP_AGENT_DISCOVERY,
});
const successSyncUpAgentDiscovery = (action?: { type: string }) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SYNCUP_AGENT_DISCOVERY,
});
const failureSyncUpAgentDiscovery = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SYNCUP_AGENT_DISCOVERY,
  error: error.message || "",
});

/**
 * Fetch Agent Metrics Data Service
 * @param {*} props
 * @returns
 */
const fetchAgentMetrics = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_METRICS,
});
const requestFetchAgentMetrics = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_METRICS,
});
const successFetchAgentMetrics = (agentMetrics: unknown) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_METRICS,
  agentMetrics,
});
const failureFetchAgentMetrics = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_METRICS,
  error: error?.message || "",
});

const syncScripts = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.SYNC_SCRIPTS,
  props,
});
const requestSyncScripts = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SYNC_SCRIPTS,
});
const successSyncScripts = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SYNC_SCRIPTS,
  successMessage: "Script Synced Successfully",
});
const failureSyncScripts = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SYNC_SCRIPTS,
  error: error.message || "",
});

const fetchAgentRegions = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_REGIONS,
});
const requestFetchAgentRegions = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_REGIONS,
});
const successFetchAgentRegions = (agentRegions: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_REGIONS,
  agentRegions,
});
const failureFetchAgentRegions = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_REGIONS,
  error: error?.message || "",
});

const fetchAgentPlatforms = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_PLATFORMS,
});
const requestFetchAgentPlatforms = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_PLATFORMS,
});
const successFetchAgentPlatforms = (agentPlatforms: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_PLATFORMS,
  agentPlatforms,
});
const failureFetchAgentPlatforms = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_PLATFORMS,
  error: error.message || "",
});

const fetchAgentEnvironments = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_ENVIRONMENTS,
});
const requestFetchAgentEnvironments = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_ENVIRONMENTS,
});
const successFetchAgentEnvironments = (agentEnvironments: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_ENVIRONMENTS,
  agentEnvironments,
});
const failureFetchAgentEnvironments = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_ENVIRONMENTS,
  error: error.message || "",
});

const fetchMetricsTilesData = () => ({
  type: AGENT_MANAGEMENT.FETCH_METRICS_TILES_DATA,
});
const requestFetchMetricsTilesData = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_METRICS_TILES_DATA,
});
const successFetchMetricsTilesData = (metricsTilesData: unknown) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_METRICS_TILES_DATA,
  metricsTilesData,
});
const failureFetchMetricsTilesData = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_METRICS_TILES_DATA,
  error: error.message || "",
});

const fetchAgentSids = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_SIDS,
});
const requestFetchAgentSids = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SIDS,
});
const successFetchAgentSids = (agentSids: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SIDS,
  agentSids,
});
const failureFetchAgentSids = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SIDS,
  error: error.message || "",
});

const fetchAgentOsTypes = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_OS_TYPES,
});
const requestFetchAgentOsTypes = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_OS_TYPES,
});
const successFetchAgentOsTypes = (agentOsTypes: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_OS_TYPES,
  agentOsTypes,
});
const failureFetchAgentOsTypes = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_OS_TYPES,
  error: error.message || "",
});

const fetchAgentServiceNames = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_SERVICE_NAMES,
});
const requestFetchAgentServiceNames = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_SERVICE_NAMES,
});
const successFetchAgentServiceNames = (agentServiceNames: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_SERVICE_NAMES,
  agentServiceNames,
});
const failureFetchAgentServiceNames = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_SERVICE_NAMES,
  error: error.message || "",
});

const fetchAgentVersions = () => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_VERSIONS,
});
const requestFetchAgentVersions = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_VERSIONS,
});
const successFetchAgentVersions = (agentVersions: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_VERSIONS,
  agentVersions,
});
const failureFetchAgentVersions = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_VERSIONS,
  error: error.message || "",
});

const syncAgentHealthConfigs = () => ({
  type: AGENT_MANAGEMENT.SYNC_AGENT_HEALTH_CONFIGS,
});
const requestSyncAgentHealthConfigs = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SYNC_AGENT_HEALTH_CONFIGS,
});
const successSyncAgentHealthConfigs = (agentSyncHealthConfigs: string[]) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SYNC_AGENT_HEALTH_CONFIGS,
  successMessage: "Script Synced Successfully",
  agentSyncHealthConfigs,
});
const failureSyncAgentHealthConfigs = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SYNC_AGENT_HEALTH_CONFIGS,
  error: error.message || "",
});

/**
 * Start Selected Agent Actions
 * @param {*} props
 * @returns
 */
const startSelectedAgentService = (
  props: {
    hostname: string;
    port: string;
    osVersion: string;
  }[],
) => ({
  type: AGENT_MANAGEMENT.START_SELECTED_AGENT_SERVICE,
  props,
});
const requestStartSelectedAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SELECTED_START_AGENT_SERVICE,
});
const successStartSelectedAgentService = (startedAgent: {
  data: {
    flag: string;
    data: object;
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SELECTED_START_AGENT_SERVICE,
  successMessage: "The Selected Agent started Successfully",
  startedAgent,
});
const failureStartSelectedAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SELECTED_START_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Stop Selected Agent Actions
 * @param {*} props
 * @returns
 */
const stoptSelectedAgentService = (
  props: {
    hostname: string;
    port: string;
    osVersion: string;
  }[],
) => ({
  type: AGENT_MANAGEMENT.STOP_SELECTED_AGENT_SERVICE,
  props,
});
const requestStopSelectedAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SELECTED_STOP_AGENT_SERVICE,
});
const successStopSelectedAgentService = (stoppedAgent: {
  data: {
    flag: string;
    data: object;
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SELECTED_STOP_AGENT_SERVICE,
  successMessage: "The Selected Agent Stopped Successfully",
  stoppedAgent,
});
const failureStopSelectedAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SELECTED_STOP_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * Restart Selected Agent Actions
 * @param {*} props
 * @returns
 */
const restartSelectedAgentService = (
  props: {
    hostname: string;
    port: string;
    osVersion: string;
  }[],
) => ({
  type: AGENT_MANAGEMENT.RESTART_SELECTED_AGENT_SERVICE,
  props,
});
const requestRestartSelectedAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SELECTED_RESTART_AGENT_SERVICE,
});
const successRestartSelectedAgentService = (restartAgent: {
  data: {
    flag: string;
    data: object;
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SELECTED_RESTART_AGENT_SERVICE,
  successMessage: "The Selected Agent Restarted Successfully",
  restartAgent,
});
const failureRestartSelectedAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SELECTED_RESTART_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * HealthCheckup Selected Agent Actions
 * @param {*} props
 * @returns
 */
const healthCheckupSelectedAgentService = (props: AgentManagementProps) => ({
  type: AGENT_MANAGEMENT.HEALTHCHECKUP_SELECTED_AGENT_SERVICE,
  props,
});
const requestHealthCheckupSelectedAgentService = () => ({
  type: AGENT_MANAGEMENT.REQUEST_SELECTED_HEALTHCHECKUP_AGENT_SERVICE,
});
const successHealthCheckupSelectedAgentService = (agentHealthCheckUP: {
  data: {
    flag: string;
  };
}) => ({
  type: AGENT_MANAGEMENT.SUCCESS_SELECTED_HEALTHCHECKUP_AGENT_SERVICE,
  agentHealthCheckUP,
});
const failureHealthCheckupSelectedAgentService = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_SELECTED_HEALTHCHECKUP_AGENT_SERVICE,
  error: error.message || "",
});

/**
 * This Action Refers Getting Agent Upgrade Versions
 * @returns
 */
const fetchUpgradeAgents = () => ({
  type: AGENT_MANAGEMENT.FETCH_UPGRADE_AGENTS,
});
const requestFetchUpgradeAgents = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_UPGRADE_AGENTS,
});
const successFetchUpgradeAgents = (upgradeAgents: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_UPGRADE_AGENTS,
  upgradeAgents,
});
const failureFetchUpgradeAgents = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_UPGRADE_AGENTS,
  error: error.message || "",
});

/**
 * Agent upgrade actions
 * @param {*} props
 * @returns
 */
const upgradeSelectedAgents = (props: {
  data: {
    hostname: string;
    port: string;
  }[];
  risebotAgentVersion: string;
  agentpath?: string | null;
}) => ({
  type: AGENT_MANAGEMENT.UPGRADE_SELECTED_AGENTS,
  props,
});
const requestUpgradeSelectedAgents = () => ({
  type: AGENT_MANAGEMENT.REQUEST_UPGRADE_SELECTED_AGENTS,
});
const successUpgradeSelectedAgents = (output?: string) => ({
  type: AGENT_MANAGEMENT.SUCCESS_UPGRADE_SELECTED_AGENTS,
  successMessage: "The Selected Agent version upgrade completed Successfully",
});
const failureUpgradeSelectedAgents = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_UPGRADE_SELECTED_AGENTS,
  error: error.message || "",
});

/**
 * Fetch Agent Masterdata
 * @param {*} props
 * @returns
 */
const fetchAgentMasterdata = (props: { limit: string; pageNo: number; search: string }) => ({
  type: AGENT_MANAGEMENT.FETCH_AGENT_MASTERDATA,
  props,
});
const requestFetchAgentMasterdata = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_AGENT_MASTERDATA,
});
const successFetchAgentMasterdata = (agentData: object) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_AGENT_MASTERDATA,
  agentData,
});
const failureFetchAgentMasterdata = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_AGENT_MASTERDATA,
  error: error?.message || "",
});

/**
 * Add Agent Masterdata
 * @param {*} props
 * @returns
 */
const addAgentMasterdata = (props: string) => ({
  type: AGENT_MANAGEMENT.ADD_AGENT_MASTERDATA,
  props,
});
const requestAddAgentMasterdata = () => ({
  type: AGENT_MANAGEMENT.REQUEST_ADD_AGENT_MASTERDATA,
});
const successAddAgentMasterdata = () => ({
  type: AGENT_MANAGEMENT.SUCCESS_ADD_AGENT_MASTERDATA,
});
const failureAddAgentMasterdata = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_ADD_AGENT_MASTERDATA,
  error: error?.message || "",
});

/**
 * Delete Hostname
 * @param {*} props
 * @returns
 */
const deleteHostname = (props: string) => ({
  type: AGENT_MANAGEMENT.DELETE_HOSTNAME,
  props,
});
const requestDeleteHostname = () => ({
  type: AGENT_MANAGEMENT.REQUEST_DELETE_HOSTNAME,
});
const successDeleteHostname = () => ({
  type: AGENT_MANAGEMENT.SUCCESS_DELETE_HOSTNAME,
});
const failureDeleteHostname = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_DELETE_HOSTNAME,
  error: error?.message || "",
});

// Add to your existing action creators
const fetchVersions = (props: VersionManagementProps) => ({
  type: AGENT_MANAGEMENT.FETCH_VERSIONS,
  props,
});

const requestFetchVersions = () => ({
  type: AGENT_MANAGEMENT.REQUEST_FETCH_VERSIONS,
});

const successFetchVersions = (data: any) => ({
  type: AGENT_MANAGEMENT.SUCCESS_FETCH_VERSIONS,
  data,
});

const failureFetchVersions = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_FETCH_VERSIONS,
  error: error.message || "",
});

// Add to your existing action creators
const createVersion = (versionData: BinaryVersionPayload) => ({
  type: AGENT_MANAGEMENT.CREATE_VERSION,
  versionData,
});

const requestCreateVersion = () => ({
  type: AGENT_MANAGEMENT.REQUEST_CREATE_VERSION,
});

const successCreateVersion = (data: any) => ({
  type: AGENT_MANAGEMENT.SUCCESS_CREATE_VERSION,
  data,
});

const failureCreateVersion = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_CREATE_VERSION,
  error: error.message || "",
});

// Update your existing action creators
const updateVersion = (versionData: BinaryVersionPayload, id: string) => ({
  type: AGENT_MANAGEMENT.UPDATE_VERSION,
  versionData,
  id,
});

const requestUpdateVersion = () => ({
  type: AGENT_MANAGEMENT.REQUEST_UPDATE_VERSION,
});

const successUpdateVersion = (data: any) => ({
  type: AGENT_MANAGEMENT.SUCCESS_UPDATE_VERSION,
  data,
});

const failureUpdateVersion = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_UPDATE_VERSION,
  error: error.message || "",
});

// Delete your existing action creators
const deleteVersion = (id: string) => ({
  type: AGENT_MANAGEMENT.DELETE_VERSION,
  id,
});

const requestDeleteVersion = () => ({
  type: AGENT_MANAGEMENT.REQUEST_DELETE_VERSION,
});

const successDeleteVersion = (data: any) => ({
  type: AGENT_MANAGEMENT.SUCCESS_DELETE_VERSION,
  data,
});

const failureDeleteVersion = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_DELETE_VERSION,
  error: error.message || "",
});

// Manual sync version actions
const manualSyncVersions = () => ({
  type: AGENT_MANAGEMENT.MANUAL_SYNC_VERSIONS,
});

const requestManualSyncVersions = () => ({
  type: AGENT_MANAGEMENT.REQUEST_MANUAL_SYNC_VERSIONS,
});

const successManualSyncVersions = (data: any) => ({
  type: AGENT_MANAGEMENT.SUCCESS_MANUAL_SYNC_VERSIONS,
  data,
});

const failureManualSyncVersions = (error: { message: string }) => ({
  type: AGENT_MANAGEMENT.FAILURE_MANUAL_SYNC_VERSIONS,
  error: error.message || "",
});

/**
 * Exported All Agent Actions Functions
 * @param {*} props
 * @returns
 */
const agentManagementActions = {
  startAgentService,
  requestStartAgentService,
  successStartAgentService,
  failureStartAgentService,

  fetchHealthCheckup,
  requestFetchHealthCheckup,
  successFetchHealthCheckup,
  failureFetchHealthCheckup,

  fetchHealthCheckRun,
  requestFetchHealthCheckRun,
  successFetchHealthCheckRun,
  failureFetchHealthCheckRun,

  fetchHealthCheckupByPort,
  requestFetchHealthCheckupByPort,
  successFetchHealthCheckupByPort,
  failureFetchHealthCheckupByPort,

  stopAgentServices,
  requestStopAgentServices,
  successStopAgentServices,
  failureStopAgentServices,

  restartJobService,
  requestRestartJobService,
  successRestartJobService,
  failureRestartJobService,

  restartAgentService,
  requestRestartAgentService,
  successRestartAgentService,
  failureRestartAgentService,

  shutDownAgentService,
  requestShutDownAgentService,
  successShutDownAgentService,
  failureShutDownAgentService,

  startSSHAgentService,
  requestStartSSHAgentService,
  successStartSSHAgentService,
  failureStartSSHAgentService,

  saveAgentProperty,
  requestSaveAgentProperty,
  successSaveAgentProperty,
  failureSaveAgentProperty,

  updateAgentProperty,
  requestUpdateAgentProperty,
  successUpdateAgentProperty,
  failureUpdateAgentProperty,

  fetchAgentBuildInfo,
  requestFetchAgentBuildInfo,
  successFetchAgentBuildInfo,
  failureFetchAgentBuildInfo,

  saveGlobalConfig,
  requestSaveGlobalConfig,
  successSaveGlobalConfig,
  failureSaveGlobalConfig,

  fetchGlobalConfig,
  requestFetchGlobalConfig,
  successFetchGlobalConfig,
  failureFetchGlobalConfig,

  fetchAgentManagementServices,
  requestFetchAgentManagementServices,
  successFetchAgentManagementServices,
  failureFetchAgentManagementServices,

  fetchAgentFilters,
  requestFetchAgentFilters,
  successFetchAgentFilters,
  failureFetchAgentFilters,

  fetchAgentRepositories,
  requestFetchAgentRepositories,
  successFetchAgentRepositories,
  failureFetchAgentRepositories,

  addAgent,
  requestAddAgent,
  successAddAgent,
  failureAddAgent,

  fetchAgentLogs,
  requestFetchAgentLogs,
  successFetchAgentLogs,
  failureFetchAgentLogs,

  saveLocalConfigs,
  requestSaveLocalConfigs,
  successSaveLocalConfigs,
  failureSaveLocalConfigs,

  fetchLocalConfigs,
  requestFetchLocalConfigs,
  successFetchLocalConfigs,
  failureFetchLocalConfigs,

  fetchRepositories,
  requestFetchRepositories,
  successFetchRepositories,
  failureFetchRepositories,

  downloadRepositories,
  requestDownloadRepositories,
  successDownloadRepositories,
  failureDownloadRepositories,

  saveSchedulerCommand,
  requestSaveSchedulerCommand,
  successSaveSchedulerCommand,
  failureSaveSchedulerCommand,

  updateSchedulerCommand,
  requestUpdateSchedulerCommand,
  successUpdateSchedulerCommand,
  failureUpdateSchedulerCommand,

  deleteSchedulerCommand,
  requestDeleteSchedulerCommand,
  successDeleteSchedulerCommand,
  failureDeleteSchedulerCommand,

  listSchedulerCommand,
  requestListSchedulerCommand,
  successListSchedulerCommand,
  failureListSchedulerCommand,

  fetchScheduledJobsByCommandId,
  RequestFetchScheduledJobsByCommandId,
  successFetchScheduledJobsByCommandId,
  failureFetchScheduledJobsByCommandId,

  syncUpAgentDiscovery,
  requestSyncUpAgentDiscovery,
  successSyncUpAgentDiscovery,
  failureSyncUpAgentDiscovery,

  fetchAgentMetrics,
  requestFetchAgentMetrics,
  successFetchAgentMetrics,
  failureFetchAgentMetrics,

  syncScripts,
  requestSyncScripts,
  successSyncScripts,
  failureSyncScripts,

  fetchAgentRegions,
  requestFetchAgentRegions,
  successFetchAgentRegions,
  failureFetchAgentRegions,

  fetchAgentPlatforms,
  requestFetchAgentPlatforms,
  successFetchAgentPlatforms,
  failureFetchAgentPlatforms,

  fetchAgentEnvironments,
  requestFetchAgentEnvironments,
  successFetchAgentEnvironments,
  failureFetchAgentEnvironments,

  fetchMetricsTilesData,
  requestFetchMetricsTilesData,
  successFetchMetricsTilesData,
  failureFetchMetricsTilesData,

  fetchAgentSids,
  requestFetchAgentSids,
  successFetchAgentSids,
  failureFetchAgentSids,

  fetchAgentOsTypes,
  requestFetchAgentOsTypes,
  successFetchAgentOsTypes,
  failureFetchAgentOsTypes,

  fetchAgentServiceNames,
  requestFetchAgentServiceNames,
  successFetchAgentServiceNames,
  failureFetchAgentServiceNames,

  fetchAgentVersions,
  requestFetchAgentVersions,
  successFetchAgentVersions,
  failureFetchAgentVersions,

  syncAgentHealthConfigs,
  requestSyncAgentHealthConfigs,
  successSyncAgentHealthConfigs,
  failureSyncAgentHealthConfigs,

  startSelectedAgentService,
  requestStartSelectedAgentService,
  successStartSelectedAgentService,
  failureStartSelectedAgentService,

  stoptSelectedAgentService,
  requestStopSelectedAgentService,
  successStopSelectedAgentService,
  failureStopSelectedAgentService,

  restartSelectedAgentService,
  requestRestartSelectedAgentService,
  successRestartSelectedAgentService,
  failureRestartSelectedAgentService,

  healthCheckupSelectedAgentService,
  requestHealthCheckupSelectedAgentService,
  successHealthCheckupSelectedAgentService,
  failureHealthCheckupSelectedAgentService,

  fetchUpgradeAgents,
  requestFetchUpgradeAgents,
  successFetchUpgradeAgents,
  failureFetchUpgradeAgents,

  upgradeSelectedAgents,
  requestUpgradeSelectedAgents,
  successUpgradeSelectedAgents,
  failureUpgradeSelectedAgents,

  reloadFetchAgentLogs,

  fetchAgentMasterdata,
  requestFetchAgentMasterdata,
  successFetchAgentMasterdata,
  failureFetchAgentMasterdata,

  addAgentMasterdata,
  requestAddAgentMasterdata,
  successAddAgentMasterdata,
  failureAddAgentMasterdata,

  deleteHostname,
  requestDeleteHostname,
  successDeleteHostname,
  failureDeleteHostname,

  fetchAgentInfo,
  requestFetchAgentInfo,
  successFetchAgentInfo,
  failureFetchAgentInfo,

  fetchVersions,
  requestFetchVersions,
  successFetchVersions,
  failureFetchVersions,

  createVersion,
  requestCreateVersion,
  successCreateVersion,
  failureCreateVersion,

  updateVersion,
  requestUpdateVersion,
  successUpdateVersion,
  failureUpdateVersion,

  deleteVersion,
  requestDeleteVersion,
  successDeleteVersion,
  failureDeleteVersion,

  manualSyncVersions,
  requestManualSyncVersions,
  successManualSyncVersions,
  failureManualSyncVersions,
};

export default agentManagementActions;
