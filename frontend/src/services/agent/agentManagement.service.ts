import Cookies from "universal-cookie";
import axios from "axios";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";
import { getIdToken, getAccessToken } from "../../utils/TokenService";

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
let _instance: ReturnType<AxiosInstanceClass["init"]> | null = null;

export const getAxiosInstance = async () => {
  if (_instance) return _instance;
  _instance = new AxiosInstanceClass(rustAgentbaseURL).init();
  return _instance;
};
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
  sortOrder?: 'asc' | 'desc';
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
  data: { hostname: string; [key: string]: any }[];
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
const agentStartService = async (data: { hostname: string }) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.start}`, { hostname: [data.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const agentStopService = async (data: { hostname: string }) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.delete.stopByPort}`, { hostname: [data.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentHealthCheck = async (data: AgentActionData) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.get.health}`, { hostname: [data.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const jobReStartService = async (data: AgentActionData) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.restartJobs}`, { hostname: [data.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentReStartService = async (data: AgentActionData) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.restartByPort}`, { hostname: [data.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentShutDownService = async (data: { hostname: string }) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.shutdown}`, { hostname: [data.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentStartSSHService = async (data: AgentActionData) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.startAgentviaSSH}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const healthCheckupByPort = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.healthByPort}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveAgentManagerProperty = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.propertySetup}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const updateAgentManagerProperty = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.updateProperty}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchBuildInfo = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.buildInfo}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveGlobalConfig = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.globalConfiguration}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchGlobalConfig = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.globalConfiguration}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchAgentService = async (data: PaginationData) => {
  const { pageSize, pageNo, status, agentSearch, os, region, environment, platform, sid, agentVersion, serviceName, sortBy, sortOrder } = data;
  try {
    const baseUrl = `${rustAgent.get.getAgents}?pageSize=${pageSize}&pageNo=${pageNo}&status=${status}&search=${agentSearch}&osTypes=${os}&regions=${region}&environments=${environment}&platforms=${platform}&sids=${sid}&agentVersions=${agentVersion}&serviceNames=${serviceName}`;
    const sortParams = sortBy && sortOrder ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : '';

    console.log('🔍 [API Call] Sorting Parameters:', { sortBy, sortOrder, sortParams });
    console.log('🌐 [API Call] Full URL:', `${baseUrl}${sortParams}`);

    const instance = await getAxiosInstance();
    return await instance.get(
      `${baseUrl}${sortParams}`,
      { timeout: 30000 },
    );
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const filterAgentService = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.filterAgents}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const filterAgentRepoService = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.getRepos}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const addAgentService = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.addAgent}`, data);
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
    const instance = await getAxiosInstance();
    return await instance.post(url, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const saveLocalConfigs = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.localConfigurations}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const fetchLocalConfigs = async (data: { hostname: string }) => {
  const { hostname } = data;
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.localConfigurations}?hostname=${hostname}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentRepoService = async (data: { type?: string }) => {
  const type = "rustlinux";
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.repositories}?agentType=${type}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const downloadRepositories = async (data: DownloadRepositoriesData) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.download}`, data);
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
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.postjob}?hostname=${hostname}&agentId=${agentId}`, requestBody);
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
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.scheduler}?hostname=${hostname}&port=${agentId}&scheduledJobId=${scheduledJobId}`, requestBody);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const deleteSchedulerCommand = async (data: { port: string; hostname: string; scheduledJobId: string }) => {
  const { port, hostname, scheduledJobId } = data;
  try {
    const instance = await getAxiosInstance();
    return await instance.delete(`${rustAgent.delete.job}?hostname=${hostname}&port=${port}&scheduledJobId=${scheduledJobId}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const listSchedulerCommand = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.scheduler}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getSchdulerById = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.jobDetails}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const adSyncup = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.adSyncUp}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentMetrics = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.metrics}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const agentSyncScripts = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.syncScripts}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentInfo = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.info}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const startSelectedAgents = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.bulkStartAgents}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const stopSelectedAgents = async (data: { hostname: string; [key: string]: any }[]) => {
  try {
    const payload = Array.isArray(data) ? data : [data];
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.bulkStopAgents}`, { hostname: payload.map((x) => x.hostname) });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const restartSelectedAgents = async (data: { hostname: string; [key: string]: any }[]) => {
  try {
    const payload = Array.isArray(data) ? data : [data];
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.bulkReStartAgents}`, { hostname: payload.map((x) => x.hostname) });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const healthCheckSelectedAgents = async (data: any) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.bulkHealthCheckup}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const upgradeAgents = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.repositories}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const upgradeBulkAgents = async (jsonData: BulkAgentsData) => {
  try {
    const { risebotAgentVersion, data } = jsonData;
    const payload = Array.isArray(data) ? data : [data];
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.upgrade}`, { hostname: payload.map((x) => x.hostname), version: risebotAgentVersion });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const envUpgradeBulkAgents = async (jsonData: { hostname: string; port: string }[] = [], env = "") => {
  try {
    const payload = Array.isArray(jsonData) ? jsonData : [jsonData];
    const endpoint = rustAgent.put.envUpgrade ?? rustAgent.post.envUpgrade;
    if (!endpoint) throw new Error("envUpgrade endpoint is not configured");
    const instance = await getAxiosInstance();
    return await instance.put(`${endpoint}`,  { hostname: payload.map((x) => x.hostname), env });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const envUpgradeSingle = async (jsonData: { hostname: string; port: string }, env = "") => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.updateEnv}`, { hostname:[jsonData.hostname], env });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentRegions = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.regions}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentPlatforms = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.platforms}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentEnvironments = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.environments}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentSids = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.sids}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentOsTypes = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.osTypes}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentServiceNames = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.serviceNames}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getAgentVersions = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.versions}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};
const getSyncAgentHealthConfigs = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.syncHealthConfigs}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const syncAgentConfigBulk = async (jsonData: { hostname: string; port: string }[] = []) => {
  try {
    const payload = Array.isArray(jsonData) ? jsonData : [jsonData];
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.bulkSyncAgentConfig}`, { hostname: payload.map((x) => x.hostname) });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const syncAgentConfigSingle = async (jsonData: { hostname: string; port: string }) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.syncAgentCongig ?? rustAgent.post.syncAgentConfig}`, { hostname: [jsonData.hostname] });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const getAgentMasterdata = async (jsonData: { limit: number; pageNo: number; search?: string }) => {
  try {
    const { limit, pageNo, search } = jsonData;
    const instance = await getAxiosInstance();
    return await instance.get(`${rustAgent.get.getMasterdata}?limit=${limit}&pageNo=${pageNo}&search=${search}`);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const addAgentMasterdata = async (hostname: string) => {
  const data = {
    hostnames: hostname,
  };
  try {
    const instance = await getAxiosInstance();
    return await instance.post(`${rustAgent.post.addMasterdata}`, data);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const deleteAgentHostname = async (hostname: string) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.delete(`${rustAgent.delete.deleteMasterdata}?hostname=${hostname}`);
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
    const instance = await getAxiosInstance();
    return await instance.get(url);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const createVersion = async (payload: BinaryVersionPayload) => {
  try {
    const url = `${rustAgent.get.getVersionManagementdata}`
    const instance = await getAxiosInstance();
    return await instance.post(url, payload);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

const updateVersion = async (payload: BinaryVersionPayload, id: string) => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put( `${rustAgent.put.updateVersion}/${id}`, payload);
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};


const manualSyncVersions = async () => {
  try {
    const instance = await getAxiosInstance();
    return await instance.put(`${rustAgent.put.syncVersions}`);
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
  envUpgradeBulkAgents,
  envUpgradeSingle,
  getAgentRegions,
  getAgentPlatforms,
  getAgentEnvironments,
  getAgentSids,
  getAgentOsTypes,
  getAgentServiceNames,
  getAgentVersions,
  getSyncAgentHealthConfigs,
  syncAgentConfigBulk,
  syncAgentConfigSingle,
  getAgentMasterdata,
  addAgentMasterdata,
  deleteAgentHostname,
  getAgentInfo,

  fetchVersions,
  createVersion,
  updateVersion,
  manualSyncVersions,
};

export default agentManagementService;

