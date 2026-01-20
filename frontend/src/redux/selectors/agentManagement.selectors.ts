/**
 * Agent Management Selector Module
 */
import { get } from "lodash";
import { createSelector } from "reselect";

interface AgentManagementState {
  error: string;
  loading: boolean;
  schedulerLoading: boolean;
  reload: boolean;
  jobReload: boolean;
  serviceLoading: boolean;
  localConfigReload: boolean;
  agentLogLoading: boolean;
  agentDetailsLoading: boolean;
  filterLoading: boolean;
  successMessage: boolean;
  agentServers: Record<string, any>;
  agentGlobalConfiguration: {
    data: {
      risebot?: {
        label: string;
        propertyName: string;
        propertyValue: string;
        propertyType: string;
        encrypted?: boolean;
        error?: boolean;
      };
    };
  };
  filterAgents: any[];
  filterRepo: any[];
  repositories: any[];
  localConfigs: any[];
  scheduleConfig: any[];
  agentLogs: Record<string, any>;
  fetchScheduler: {
    data: {
      data: Record<string, any>;
    };
  };
  agentMetrics: any[];
  agentRegions: any[];
  agentEnvironments: any[];
  agentPlatforms: any[];
  agentSids: any[];
  agentOsTypes: any[];
  agentServiceNames: any[];
  agentVersions: any[];
  agentHealthCheckUP: {
    data: {
      data: any[];
    };
  };
  startedAgent: any[];
  stoppedAgent: any[];
  restartJob: any[];
  restartAgent: any[];
  shutDownAgent: any[];
  upgradeAgents: Record<string, any>;
  agentData: Record<string, any>;
  agentLoading: boolean;
  agentInfo: Record<string, any>;
}

interface RootState {
  agentMangement: AgentManagementState;
}

const agentSelector = (state: RootState) => state.agentMangement;

/**
 * Agent Error and Loading selectors
 */
export const getError = createSelector(agentSelector, props => get(props, "error", ""));
export const isLoading = createSelector(agentSelector, props => get(props, "loading", false));
export const isSchedulerLoading = createSelector(agentSelector, props => get(props, "schedulerLoading", false));
export const isGlobalConfigLoading = createSelector(agentSelector, props => get(props, "globalConfigLoading", false));
export const isReload = createSelector(agentSelector, props => get(props, "reload", false));
export const isJobReload = createSelector(agentSelector, props => get(props, "jobReload", false));
export const isServiceLoading = createSelector(agentSelector, props => get(props, "serviceLoading", false));
export const isLocalConfigReload = createSelector(agentSelector, props => get(props, "localConfigReload", false));
export const isAgentLogLoading = createSelector(agentSelector, props => get(props, "agentLogLoading", false));
export const isAgentDetailsLoading = createSelector(agentSelector, props => get(props, "agentDetailsLoading", false));
export const isFilterLoading = createSelector(agentSelector, props => get(props, "filterLoading", false));

/**
 * Agent Success Message
 */
export const getSuccessMessage = createSelector(agentSelector, props => get(props, "successMessage", false));

/**
 * Agent Services
 */
export const getAgentsService = createSelector(agentSelector, props => get(props, "agentServers", {}));

/**
 * Agent Management Global Configuration Data
 */
export const getAgentGlobalConfig = createSelector(agentSelector, props => get(props, "agentGlobalConfiguration.data", []));

/**
 * Get Agent Filters
 */
export const getFilterAgents = createSelector(agentSelector, props => get(props, "filterAgents", []));

/**
 * Get Agent Filter Repositories
 */
export const getFilterRepositories = createSelector(agentSelector, props => get(props, "filterRepo", []));

/**
 * Get Repos
 */
export const getRepositories = createSelector(agentSelector, props => get(props, "repositories", []));

/**
 * Get Agent Local Configurations
 */
export const getAgentLocalConfigs = createSelector(agentSelector, props => get(props, "localConfigs", []));

/**
 * List Scheduled Job
 */
export const listScheduledJob = createSelector(agentSelector, props => get(props, "scheduleConfig", []));

/**
 * Get Agent Logs
 */
export const getAgentLogs = createSelector(agentSelector, props => get(props, "agentLogs", {}));

/**
 * Fetch Scheduled Jobs by ID
 */
export const fetchScheduledJobsByCommandId = createSelector(agentSelector, props => get(props, "fetchScheduler.data.data", {}));

/**
 * Get Agent Metrics
 */
export const getAgentMetrics = createSelector(agentSelector, props => get(props, "agentMetrics", []));

/**
 * Get Agent regions
 */
export const getAgentRegions = createSelector(agentSelector, props => get(props, "agentRegions", []));

/**
 * Get Agent environments
 */
export const getAgentEnvironments = createSelector(agentSelector, props => get(props, "agentEnvironments", []));

/**
 * Get Agent environments
 */
export const getMetricsTilesData = createSelector(agentSelector, props => get(props, "agentMetrics", []));

/**
 * Get Agent platforms
 */
export const getAgentPlatforms = createSelector(agentSelector, props => get(props, "agentPlatforms", []));

/**
 * Get Agent sids
 */
export const getAgentSids = createSelector(agentSelector, props => get(props, "agentSids", []));

/**
 * Get Agent osTypes
 */
export const getAgentOsTypes = createSelector(agentSelector, props => get(props, "agentOsTypes", []));

/**
 * Get Agent serviceNames
 */
export const getAgentServiceNames = createSelector(agentSelector, props => get(props, "agentServiceNames", []));

/**
 * Get Agent versions
 */
export const getAgentVersions = createSelector(agentSelector, props => get(props, "agentVersions", []));

/**
 * Get Agent HealthCheck Status
 */
export const getAgentHealthCheckUp = createSelector(agentSelector, props => get(props, "agentHealthCheckUP.data.data", []));

/**
 * get Agent started details
 */
export const getStartedAgent = createSelector(agentSelector, props => get(props, "startedAgent", []));

/**
 * get Agent Stopped details
 */
export const getStoppedAgent = createSelector(agentSelector, props => get(props, "stoppedAgent", []));

/**
 * get Agent Restarted details
 */
export const getRestartedJob = createSelector(agentSelector, props => get(props, "restartJob", []));

/**
 * get Agent Restarted details
 */
export const getRestartedAgent = createSelector(agentSelector, props => get(props, "restartAgent", []));

/**
 * get Agent Restarted details
 */
export const getshutDownAgent = createSelector(agentSelector, props => get(props, "shutDownAgent", []));

/**
 * Fetch Upgrade Agent Versions
 */
export const getUpgradeAgentVersion = createSelector(agentSelector, props => get(props, "upgradeAgents", {}));

export const getAgentData = createSelector(agentSelector, props => get(props, "agentData", {}));

export const agentLoading = createSelector(agentSelector, props => get(props, "agentLoading", false));

export const getAgentInfo = createSelector(agentSelector, props => get(props, "agentInfo", {}));

export const getVersions = createSelector(agentSelector, props => get(props, "versions", []));

export const isVersionManagementLoading = createSelector(agentSelector, props => get(props, "versionManagementLoading", false));
export const getVersionError = createSelector(agentSelector, props => get(props, "versionError", ""));

export const isCreateVersionLoading = createSelector(agentSelector, props => get(props, "createVersionLoading", false));
export const getCreateVersionError = createSelector(agentSelector, props => get(props, "createVersionError", ""));

export const isManualSyncVersionsLoading = createSelector(agentSelector, props => get(props, "manualSyncVersionsLoading", false));
export const getManualSyncVersionsError = createSelector(agentSelector, props => get(props, "manualSyncVersionsError", ""));

/**
 * Exporting all Agent Selectors
 */
const agentManagementSelectors = {
  getStartedAgent,
  getRestartedJob,
  getRestartedAgent,
  getshutDownAgent,
  getStoppedAgent,
  getError,
  isLoading,
  isAgentLogLoading,
  isAgentDetailsLoading,
  isSchedulerLoading,
  isServiceLoading,
  isReload,
  isJobReload,
  isFilterLoading,
  getSuccessMessage,
  getAgentsService,
  getAgentGlobalConfig,
  getFilterAgents,
  getFilterRepositories,
  getRepositories,
  isLocalConfigReload,
  getAgentLocalConfigs,
  listScheduledJob,
  getAgentLogs,
  fetchScheduledJobsByCommandId,
  getAgentMetrics,
  getAgentRegions,
  getAgentEnvironments,
  getMetricsTilesData,
  getAgentPlatforms,
  getAgentSids,
  getAgentOsTypes,
  getAgentServiceNames,
  getAgentVersions,
  getAgentHealthCheckUp,
  getUpgradeAgentVersion,
  getAgentData,
  agentLoading,
  getAgentInfo,
  getVersions,
  isVersionManagementLoading,
  getVersionError,
  isCreateVersionLoading,
  getCreateVersionError,
  isManualSyncVersionsLoading,
  getManualSyncVersionsError,
};

export default agentManagementSelectors;