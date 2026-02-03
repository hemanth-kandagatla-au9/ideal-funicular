import Cookies from "universal-cookie";
import axios from "axios";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";

const token = getLocalAccessToken();

interface EndpointGroup {
  [key: string]: string;
}

interface RustAgentConfig {
  baseURL: string;
  get: EndpointGroup;
  post: EndpointGroup;
  put: EndpointGroup;
  delete: EndpointGroup;
}
const rustAgent = Config.apiEndpoints.rustagentManagement as RustAgentConfig;
const rustAgentbaseURL = Config.apiEndpoints.rustagentManagement.baseURL;
const cookies = new Cookies();
const accessToken = cookies.get("iasphere_access_token");
export const AxiosInstace = new AxiosInstanceClass(rustAgentbaseURL).init(accessToken);
interface AgentActionData {
  hostname: string;
  agentId: string;
}

interface PaginationData {
  pageSize: number | string;
  pageNo: number;
  status?: string;
  agentSearch?: string;
  os?: string | string[];
  region?: string | string[];
  environment?: string | string[];
  platform?: string | string[];
  sid?: string | string[];
  agentVersion?: string | string[];
  serviceName?: string | string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface AgentLogsData {
  jobname?: string;
  limit?: number;
  skip?: number;
}

interface SchedulerCommandData {
  hostname: string;
  agentId: string;
  cronExpression: string;
  command: string;
  opensearchEnabled: boolean;
  opensearchIndex: string;
  scheduledJobId?: string;
}

interface DownloadRepositoriesData {
  version: string;
  agentId: string;
  hostname: string;
}

interface BulkAgentsData {
  risebotAgentVersion: string;
  data: any;
  agentpath?: string; // Made optional since we're not sending it in upgrade calls
}

interface VersionManagementParams {
  versionStatus?: string;
  operatingSystem?: string;
  upgradeType?: string;
  agentVersion?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  isDeleted?: boolean;
}

export interface BinaryVersionPayload {
  agentVersion: string;
  compatibleOS: Array<{
    agentType: string;
    osVersion: string;
  }>;
  versionStatus: string;
  upgradeType: string;
  releaseDate: string;
  isDeleted?: boolean;
}

function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response;
  }
  return { status: 500, data: { message: "Unexpected error occurred" } };
}
const agentStartService = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.start}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const agentStopService = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.post(`${rustAgent.delete.stopByPort}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentHealthCheck = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.post(`${rustAgent.get.health}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const jobReStartService = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.restartJobs}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentReStartService = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.restartByPort}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentShutDownService = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.shutdown}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentStartSSHService = async (data: AgentActionData) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.startAgentviaSSH}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const healthCheckupByPort = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.healthByPort}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveAgentManagerProperty = async () => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.propertySetup}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const updateAgentManagerProperty = async () => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.updateProperty}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchBuildInfo = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.buildInfo}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveGlobalConfig = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.globalConfiguration}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchGlobalConfig = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.globalConfiguration}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchAgentService = async (data: PaginationData) => {
  const { pageSize, pageNo, status, agentSearch, os, region, environment, platform, sid, agentVersion, serviceName, sortBy, sortOrder } = data;
  try {
    const baseUrl = `${rustAgent.get.getAgents}?pageSize=${pageSize}&pageNo=${pageNo}&status=${status}&search=${agentSearch}&osTypes=${os}&regions=${region}&environments=${environment}&platforms=${platform}&sids=${sid}&agentVersions=${agentVersion}&serviceNames=${serviceName}`;
    const sortParams = sortBy && sortOrder ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : "";

    console.log("🔍 [API Call] Sorting Parameters:", { sortBy, sortOrder, sortParams });
    console.log("🌐 [API Call] Full URL:", `${baseUrl}${sortParams}`);

    return await AxiosInstace.get(`${baseUrl}${sortParams}`, { timeout: 30000 });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const filterAgentService = async (data: any) => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.filterAgents}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const filterAgentRepoService = async (data: any) => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.getRepos}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const addAgentService = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.addAgent}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchAgentLogs = async (data: AgentLogsData) => {
  const { jobname } = data;
  if (!data.limit) {
    data.limit = 100;
  }
  if (!data.skip) {
    data.skip = 0;
  }
  const url = jobname ? `${rustAgent.post.getJobLog}` : `${rustAgent.post.getAgentLogs}`;
  try {
    return await AxiosInstace.post(url, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveLocalConfigs = async (data: any) => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.localConfigurations}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchLocalConfigs = async (data: { hostname: string }) => {
  const { hostname } = data;
  try {
    return await AxiosInstace.get(`${rustAgent.get.localConfigurations}?hostname=${hostname}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentRepoService = async (data: { type?: string }) => {
  const type = "rustlinux";
  try {
    return await AxiosInstace.get(`${rustAgent.get.repositories}?agentType=${type}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const downloadRepositories = async (data: DownloadRepositoriesData) => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.download}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveSchedulerCommand = async (data: SchedulerCommandData) => {
  const { hostname, agentId, cronExpression, command, opensearchEnabled, opensearchIndex } = data;
  const requestBody = {
    hostname,
    port: agentId,
    script_name: `jobconfig_${agentId}${Math.floor(Math.random() * 900)}${100}`,
    content: command,
    arguments: "",
    cron_expression: cronExpression,
    script_type: 1,
    opensearch_enabled: opensearchEnabled,
    opensearch_index: opensearchIndex,
    async_exec: true,
  };
  try {
    return await AxiosInstace.post(`${rustAgent.post.postjob}?hostname=${hostname}&agentId=${agentId}`, requestBody);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const updateSchedulerCommand = async (data: SchedulerCommandData) => {
  const { agentId, hostname, scheduledJobId, cronExpression, command, opensearchEnabled, opensearchIndex } = data;
  const requestBody = {
    hostname,
    agentId,
    script_name: scheduledJobId,
    content: command,
    arguments: "",
    cron_expression: cronExpression,
    script_type: 1,
    opensearch_enabled: opensearchEnabled,
    opensearch_index: opensearchIndex,
    async_exec: true,
  };

  try {
    return await AxiosInstace.put(`${rustAgent.put.scheduler}?hostname=${hostname}&port=${agentId}&scheduledJobId=${scheduledJobId}`, requestBody);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const deleteSchedulerCommand = async (data: { port: string; hostname: string; scheduledJobId: string }) => {
  const { port, hostname, scheduledJobId } = data;
  try {
    return await AxiosInstace.delete(`${rustAgent.delete.job}?hostname=${hostname}&port=${port}&scheduledJobId=${scheduledJobId}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const listSchedulerCommand = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.scheduler}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getSchdulerById = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.jobDetails}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const adSyncup = async () => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.adSyncUp}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentMetrics = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.metrics}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentSyncScripts = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.syncScripts}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentInfo = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.info}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const startSelectedAgents = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.bulkStartAgents}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const stopSelectedAgents = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.bulkStopAgents}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const restartSelectedAgents = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.bulkReStartAgents}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const healthCheckSelectedAgents = async (data: any) => {
  try {
    return await AxiosInstace.post(`${rustAgent.post.bulkHealthCheckup}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const upgradeAgents = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.repositories}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const upgradeBulkAgents = async (jsonData: BulkAgentsData) => {
  try {
    const { risebotAgentVersion, data } = jsonData;
    return await AxiosInstace.put(`${rustAgent.put.upgrade}?risebotAgentVersion=${risebotAgentVersion}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentRegions = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.regions}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentPlatforms = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.platforms}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentEnvironments = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.environments}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentSids = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.sids}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentOsTypes = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.osTypes}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentServiceNames = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.serviceNames}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentVersions = async () => {
  try {
    return await AxiosInstace.get(`${rustAgent.get.versions}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getSyncAgentHealthConfigs = async () => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.syncHealthConfigs}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const getAgentMasterdata = async (jsonData: { limit: number; pageNo: number; search?: string }) => {
  try {
    const { limit, pageNo, search } = jsonData;
    return await AxiosInstace.get(`${rustAgent.get.getMasterdata}?limit=${limit}&pageNo=${pageNo}&search=${search}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const addAgentMasterdata = async (hostname: string) => {
  const data = {
    hostnames: hostname,
  };
  try {
    return await AxiosInstace.post(`${rustAgent.post.addMasterdata}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const deleteAgentHostname = async (hostname: string) => {
  try {
    return await AxiosInstace.delete(`${rustAgent.delete.deleteMasterdata}?hostname=${hostname}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const fetchVersions = async (params: VersionManagementParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.versionStatus) queryParams.append("versionStatus", params.versionStatus);
    if (params.operatingSystem) queryParams.append("operatingSystem", params.operatingSystem);
    if (params.upgradeType) queryParams.append("upgradeType", params.upgradeType);
    if (params.agentVersion) queryParams.append("agentVersion", params.agentVersion);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    const url = `${rustAgent.get.getVersionManagementdata}?${queryParams.toString()}`;
    return await AxiosInstace.get(url);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const createVersion = async (payload: BinaryVersionPayload) => {
  try {
    return await AxiosInstace.post("https://predev.risebot.iasp.apps.jnj.com/api/versionManagement", payload);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const updateVersion = async (payload: BinaryVersionPayload, id: string) => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.updateVersion}/${id}`, payload);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const deleteVersion = async (id: string) => {
  try {
    return await AxiosInstace.patch(`https://predev.risebot.iasp.apps.jnj.com/api/versionManagement/${id}/delete`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const manualSyncVersions = async () => {
  try {
    return await AxiosInstace.put(`${rustAgent.put.syncVersions}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const agentManagementService = {
  agentStartService,
  agentHealthCheck,
  healthCheckupByPort,
  agentStopService,
  jobReStartService,
  agentReStartService,
  agentShutDownService,
  agentStartSSHService,
  saveAgentManagerProperty,
  updateAgentManagerProperty,
  fetchBuildInfo,
  saveGlobalConfig,
  fetchGlobalConfig,
  fetchAgentService,
  filterAgentService,
  filterAgentRepoService,
  addAgentService,
  fetchAgentLogs,
  saveLocalConfigs,
  fetchLocalConfigs,
  getAgentRepoService,
  downloadRepositories,
  saveSchedulerCommand,
  updateSchedulerCommand,
  deleteSchedulerCommand,
  listSchedulerCommand,
  getSchdulerById,
  adSyncup,
  getAgentMetrics,
  agentSyncScripts,
  startSelectedAgents,
  stopSelectedAgents,
  restartSelectedAgents,
  healthCheckSelectedAgents,
  upgradeAgents,
  upgradeBulkAgents,
  getAgentRegions,
  getAgentPlatforms,
  getAgentEnvironments,
  getAgentSids,
  getAgentOsTypes,
  getAgentServiceNames,
  getAgentVersions,
  getSyncAgentHealthConfigs,
  getAgentMasterdata,
  addAgentMasterdata,
  deleteAgentHostname,
  getAgentInfo,

  fetchVersions,
  createVersion,
  updateVersion,
  deleteVersion,
  manualSyncVersions,
};

export default agentManagementService;
