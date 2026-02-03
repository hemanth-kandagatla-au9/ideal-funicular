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
    flag?: string;
    data?: {
      configs?: Array<{
        propertyName: string;
        propertyValue: string;
        canModify: boolean;
        isVisible: boolean;
      }>;
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

export const getSuccessMessage = createSelector(agentSelector, props => get(props, "successMessage", false));

export const getAgentsService = createSelector(agentSelector, props => get(props, "agentServers", {}));

export const getAgentGlobalConfig = createSelector(agentSelector, props => get(props, "agentGlobalConfiguration.data", []));

export const getFilterAgents = createSelector(agentSelector, props => get(props, "filterAgents", []));

export const getFilterRepositories = createSelector(agentSelector, props => get(props, "filterRepo", []));

export const getRepositories = createSelector(agentSelector, props => get(props, "repositories", []));

export const getAgentLocalConfigs = createSelector(agentSelector, props => get(props, "localConfigs", []));

export const listScheduledJob = createSelector(agentSelector, props => get(props, "scheduleConfig", []));

export const getAgentLogs = createSelector(agentSelector, props => get(props, "agentLogs", {}));

export const fetchScheduledJobsByCommandId = createSelector(agentSelector, props => get(props, "fetchScheduler.data.data", {}));

export const getAgentMetrics = createSelector(agentSelector, props => get(props, "agentMetrics", []));

export const getAgentRegions = createSelector(agentSelector, props => get(props, "agentRegions", []));

export const getAgentEnvironments = createSelector(agentSelector, props => get(props, "agentEnvironments", []));

export const getMetricsTilesData = createSelector(agentSelector, props => get(props, "agentMetrics", []));

export const getAgentPlatforms = createSelector(agentSelector, props => get(props, "agentPlatforms", []));

export const getAgentSids = createSelector(agentSelector, props => get(props, "agentSids", []));

export const getAgentOsTypes = createSelector(agentSelector, props => get(props, "agentOsTypes", []));

export const getAgentServiceNames = createSelector(agentSelector, props => get(props, "agentServiceNames", []));

export const getAgentVersions = createSelector(agentSelector, props => get(props, "agentVersions", []));

export const getAgentHealthCheckUp = createSelector(agentSelector, props => get(props, "agentHealthCheckUP.data.data", []));

export const getStartedAgent = createSelector(agentSelector, props => get(props, "startedAgent", []));

export const getStoppedAgent = createSelector(agentSelector, props => get(props, "stoppedAgent", []));

export const getRestartedJob = createSelector(agentSelector, props => get(props, "restartJob", []));

export const getRestartedAgent = createSelector(agentSelector, props => get(props, "restartAgent", []));

export const getshutDownAgent = createSelector(agentSelector, props => get(props, "shutDownAgent", []));

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
