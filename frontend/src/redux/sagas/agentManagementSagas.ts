/* eslint-disable */
import { get, isEmpty } from "lodash";
import { takeLatest, put, call, all } from "redux-saga/effects";
import { toast } from "react-toastify";
import { AGENT_MANAGEMENT } from "../../config/actions";
import agentManagementAction from "../actions/agentManagement.action";
import agentManagementService, { BinaryVersionPayload } from "../../services/agent/agentManagement.service";
import { errortoast, successtoast } from "../../layouts/agent-management/helpers/CustomToast";

interface ActionProps {
  props: any;
  [key: string]: any;
}


export function* startAgentManagerService({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestStartAgentService());
    const output = yield call(agentManagementService.agentStartService, props);
    yield put(agentManagementAction.successStartAgentService(output));
    if (get(output, "data.flag") === "success") successtoast("Jobs started successfully");
    else errortoast(get(output, "data.error", "Failed while triggering RISEAGENT"));
  } catch (error: any) {
    yield put(agentManagementAction.failureStartAgentService(error));
  }
}


export function* agentHealthCheckup({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchHealthCheckup());
    const output = yield call(agentManagementService.agentHealthCheck, props);
    yield put(agentManagementAction.successFetchHealthCheckup(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT is Active");
    else errortoast(`Failed while checking RISEAGENT status: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchHealthCheckup(error));
    errortoast(`Failed while checking RISAGENT status: ${error.message}`);
  }
}


export function* agentHealthCheckupByPort(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchHealthCheckupByPort());
    const healthCheckupByPort = yield call(agentManagementService.healthCheckupByPort);
    yield put(agentManagementAction.successFetchHealthCheckupByPort(healthCheckupByPort));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchHealthCheckupByPort(error));
  }
}


export function* stopAgentManagerServices({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestStopAgentServices());
    const output = yield call(agentManagementService.agentStopService, props);
    yield put(agentManagementAction.successStopAgentServices(output));
    if (get(output, "data.flag") === "success") successtoast("Jobs stopped successfully");
    else errortoast(`Failed while stopping Jobs: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureStopAgentServices(error));
    errortoast(`Failed while stopping Jobs: ${error.message}`);
  }
}


export function* restartJobManagerService({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestRestartJobService());
    const output = yield call(agentManagementService.jobReStartService, props);
    yield put(agentManagementAction.successRestartJobService(output));
    if (get(output, "data.flag") === "success") successtoast("Jobs restarted successfully");
    else errortoast(`Failed while restarting Jobs: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureRestartJobService(error));
    errortoast(`Failed while restarting Jobs: ${error.message}`);
  }
}


export function* restartAgentManagerService({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestRestartAgentService());
    const output = yield call(agentManagementService.agentReStartService, props);
    yield put(agentManagementAction.successRestartAgentService(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT restarted successfully");
    else errortoast(`Failed while restarting RISEAGENT: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureRestartAgentService(error));
    errortoast(`Failed while restarting RISEAGENT: ${error.message}`);
  }
}


export function* shutDownAgentManagerService({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestShutDownAgentService());
    const output = yield call(agentManagementService.agentShutDownService, props);
    yield put(agentManagementAction.successShutDownAgentService(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT Shut Down successfully");
    else errortoast(`Failed while Shut Down RISEAGENT: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureRestartAgentService(error));
    errortoast(`Failed while Shut Down RISEAGENT: ${error.message}`);
  }
}


export function* startSSHAgentManagerService({ props }: ActionProps): Generator<any, void, any> {
  console.log("entered into ");
  try {
    yield put(agentManagementAction.requestStartSSHAgentService());
    const output = yield call(agentManagementService.agentStartSSHService, props);
    yield put(agentManagementAction.successStartSSHAgentService(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT Started successfully");
    else errortoast(`Failed while Start RISEAGENT: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureStartSSHAgentService(error));
    errortoast(`Failed while Start RISEAGENT: ${error.message}`);
  }
}


export function* saveAgentManagerProperty(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSaveAgentProperty());
    const agentProperty = yield call(agentManagementService.saveAgentManagerProperty);
    yield put(agentManagementAction.successSaveAgentProperty(agentProperty));
  } catch (error: any) {
    yield put(agentManagementAction.failureSaveAgentProperty(error));
  }
}


export function* updateAgentManagerProperty(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestUpdateAgentProperty());
    const updateAgentProperty = yield call(agentManagementService.updateAgentManagerProperty);
    yield put(agentManagementAction.successUpdateAgentProperty(updateAgentProperty));
  } catch (error: any) {
    yield put(agentManagementAction.failureUpdateAgentProperty(error));
  }
}


export function* fetchAgentBuildInfo(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentBuildInfo());
    const agentBuildInfo = yield call(agentManagementService.fetchBuildInfo);
    yield put(agentManagementAction.successFetchAgentBuildInfo(agentBuildInfo));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentBuildInfo(error));
  }
}


export function* saveAgentGlobalConfig({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSaveGlobalConfig());
    const saveGlobalConfig = yield call(agentManagementService.saveGlobalConfig, props);
    yield put(agentManagementAction.successSaveGlobalConfig(saveGlobalConfig));
    if (get(saveGlobalConfig, "data.flag") === "success") successtoast("Configuration saved successfully");
    else errortoast(`Failed while saving Configuration: ${saveGlobalConfig.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureSaveGlobalConfig(error));
  }
}


export function* fetchAgentGlobalConfig(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchGlobalConfig());
    const { data } = yield call(agentManagementService.fetchGlobalConfig);
    yield put(agentManagementAction.successFetchGlobalConfig(data));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchGlobalConfig(error));
  }
}


export function* fetchAgentServices({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentManagementServices());
    const getAgentServices = yield call(agentManagementService.fetchAgentService, props);
    yield put(agentManagementAction.successFetchAgentManagementServices(get(getAgentServices, "data.data", {})));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentManagementServices(error));
  }
}


export function* fetchAgentFilterService({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentFilters());
    const filterAgents = yield call(agentManagementService.filterAgentService, props);
    yield put(agentManagementAction.successFetchAgentFilters(filterAgents));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentFilters(error));
  }
}


export function* fetchFilterAgentRepos({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentRepositories());
    const filterRepo = yield call(agentManagementService.filterAgentRepoService, props);
    yield put(agentManagementAction.successFetchAgentRepositories(filterRepo));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentRepositories(error));
  }
}


export function* addAgents({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestAddAgent());
    const agentAdd = yield call(agentManagementService.addAgentService, props);
    yield put(agentManagementAction.successAddAgent(agentAdd));
    if (get(agentAdd, "data.flag") === "success") successtoast("RISEAGENT added successfully");
    else errortoast(`Failed while adding RISEAGENT: ${agentAdd.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureAddAgent(error));
  }
}


export function* fetchAgentLogs({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentLogs());
    const agentLog = yield call(agentManagementService.fetchAgentLogs, props);
    yield put(agentManagementAction.successFetchAgentLogs({ [props.hostname]: { [props.agentId]: get(agentLog, "data.data", []) } }));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentLogs(error));
  }
}


export function* saveAgentLocalConfigs({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSaveLocalConfigs());
    const output = yield call(agentManagementService.saveLocalConfigs, props);
    yield put(agentManagementAction.successSaveLocalConfigs(output));
    if (get(output, "data.flag") === "success") successtoast("Configuration saved successfully");
    else errortoast(`Failed to save Configuration: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureSaveLocalConfigs(error));
  }
}


export function* fetchAgentLocalConfigs({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchLocalConfigs());
    const output = yield call(agentManagementService.fetchLocalConfigs, props);
    yield put(agentManagementAction.successFetchLocalConfigs(output));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchLocalConfigs(error));
  }
}


export function* fetchAgentRepo({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchRepositories());
    const output = yield call(agentManagementService.getAgentRepoService, props);
    yield put(agentManagementAction.successFetchRepositories(output));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchRepositories(error));
  }
}


export function* downloadRepo({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestDownloadRepositories());
    const output = yield call(agentManagementService.downloadRepositories, props);
    yield put(agentManagementAction.successDownloadRepositories(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT downloaded successfully");
    else errortoast(`Failed to download RISEAGENT: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureDownloadRepositories(error));
  }
}


export function* saveSchedulerCommands({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSaveSchedulerCommand());
    const output = yield call(agentManagementService.saveSchedulerCommand, props);
    if (output?.data?.flag !== "error") {
      yield put(agentManagementAction.successSaveSchedulerCommand(output));
      successtoast("Schedule saved successfully");
    } else {
      errortoast(`Failed to save scheduler: ${output.data.error}`);
      yield put(agentManagementAction.failureSaveSchedulerCommand(output));
    }
  } catch (error: any) {
    yield put(agentManagementAction.failureSaveSchedulerCommand(error));
  }
}


export function* updateSchedulerCommands({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestUpdateSchedulerCommand());
    const output = yield call(agentManagementService.updateSchedulerCommand, props);
    if (output?.data?.flag !== "error") {
      successtoast("Schedule updated successfully");
      yield put(agentManagementAction.successUpdateSchedulerCommand(output));
      yield put(agentManagementAction.successDeleteSchedulerCommand(output));
    } else {
      errortoast(`Failed to update schedule: ${output.data.error}`);
    }
  } catch (error: any) {
    yield put(agentManagementAction.failureUpdateSchedulerCommand(error));
  }
}


export function* deleteSchedulerCommands({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestDeleteSchedulerCommand());
    const output = yield call(agentManagementService.deleteSchedulerCommand, props);
    yield put(agentManagementAction.successDeleteSchedulerCommand(output));
    if (get(output, "data.flag") === "success") successtoast("Schedule deleted successfully");
    else errortoast(`Failed to delete scheduler: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureDeleteSchedulerCommand(error));
  }
}


export function* listSchedulerCommands({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestListSchedulerCommand());
    const output = yield call(agentManagementService.listSchedulerCommand, props);
    yield put(agentManagementAction.successListSchedulerCommand(get(output, "data.data", [])));
    if (output === undefined || isEmpty(output)) errortoast("Failed to list scheduled jobs");
  } catch (error: any) {
    yield put(agentManagementAction.failureListSchedulerCommand(error));
  }
}


export function* fetchScheduledJobsByCommandId({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.RequestFetchScheduledJobsByCommandId());
    const output = yield call(agentManagementService.getSchdulerById, props);
    yield put(agentManagementAction.successFetchScheduledJobsByCommandId(output));
    if (get(output, "data.flag") === "error") errortoast(`Failed to get schedule: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchScheduledJobsByCommandId(error));
  }
}


export function* fetchAgentInfo({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentInfo());
    const output = yield call(agentManagementService.getAgentInfo, props);
    yield put(agentManagementAction.successFetchAgentInfo(get(output, "data.data", {})));
    if (get(output, "data.flag") === "error") errortoast(`Failed to get schedule: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentInfo(error));
  }
}


export function* syncScript({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSyncScripts());
    const output = yield call(agentManagementService.agentSyncScripts, props);
    yield put(agentManagementAction.successSyncScripts(output));
    if (get(output, "data.flag") === "success") successtoast("Script synced successfully");
    else errortoast(`Sync script getting failed: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureSyncScripts(error));
    errortoast(`Sync script getting failed: ${error}`);
  }
}


export function* agentDiscoverySyncup(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSyncUpAgentDiscovery());
    const output = yield call(agentManagementService.adSyncup);
    yield put(agentManagementAction.successSyncUpAgentDiscovery(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT Discovery triggered successfully");
    else errortoast(`Failed to trigger RISEAGENT Discovery: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureSyncUpAgentDiscovery(error));
  }
}


export function* getAgentMetrics(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentMetrics());
    const output = yield call(agentManagementService.getAgentMetrics);
    yield put(agentManagementAction.successFetchAgentMetrics(get(output, "data.data", [])));
    if (get(output, "data.flag") !== "success"){
      errortoast(`Failed to fetch RISEAGENT Metrics: ${output.data.message}`);
    } 
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentMetrics(error));
  }
}


export function* startsSelectedAgent({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestStartSelectedAgentService());
    const { data } = yield call(agentManagementService.startSelectedAgents, props);
    yield put(agentManagementAction.successStartSelectedAgentService(data.data));
    if (get(data, "flag") === "error") errortoast(get(data, "message", `Failed to Start selected RISEAGENTs: ${data.error}`));
    else successtoast(get(data, "message", "RISEAGENT Start action triggered successfully"));
  } catch (error: any) {
    yield put(agentManagementAction.failureStartSelectedAgentService(error));
  }
}


export function* stopsSelectedAgent({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestStopSelectedAgentService());
    const { data } = yield call(agentManagementService.stopSelectedAgents, props);
    yield put(agentManagementAction.successStopSelectedAgentService(data.data));
    if (get(data, "flag") === "error") errortoast(get(data, "message", `Failed to Stop selected RISEAGENTs: ${data.error}`));
    else successtoast(get(data, "message", `RISEAGENT Stop action triggered successfully : ${data.data.message}`));
  } catch (error: any) {
    yield put(agentManagementAction.failureStopSelectedAgentService(error));
  }
}


export function* restartsSelectedAgent({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestRestartSelectedAgentService());
    const { data } = yield call(agentManagementService.restartSelectedAgents, props);
    yield put(agentManagementAction.successRestartSelectedAgentService(data.data));
    if (get(data, "flag") === "error") errortoast(get(data, "message", `Failed to Restart selected RISEAGENTs: ${data.error}`));
    else successtoast(get(data, "message", `RISEAGENT Restart action triggered successfully`));
  } catch (error: any) {
    yield put(agentManagementAction.failureRestartSelectedAgentService(error));
  }
}


export function* healthChecksSelectedAgent({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestHealthCheckupSelectedAgentService());
    const output = yield call(agentManagementService.healthCheckSelectedAgents, props);
    yield put(agentManagementAction.successHealthCheckupSelectedAgentService(output));
    if (get(output, "data.flag") === "error") errortoast(get(output, "data.message", `Failed to execute RISEAGENT Healthcheck for selected RISEAGENTs: ${output.data.error}`));
    else successtoast(get(output, "output.data", `RISEAGENT Healthcheck action triggered successfully: ${output.data.data.message}`));
  } catch (error: any) {
    yield put(agentManagementAction.failureHealthCheckupSelectedAgentService(error));
  }
}


export function* upgradeAgents({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestUpgradeSelectedAgents());
    const output = yield call(agentManagementService.upgradeBulkAgents, props);
    yield put(agentManagementAction.successUpgradeSelectedAgents(output));
    if (get(output, "data.flag") === "success") successtoast(get(output, "output.data", `RISEAGENT upgrade triggerred successfully: ${output.data.data.message}`));
    else errortoast(get(output, "data.message", "failed to trigger upgrade RISEAGENTs"));
  } catch (error: any) {
    yield put(agentManagementAction.failureUpgradeSelectedAgents(error));
  }
}


export function* envUpgradeAgents({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestEnvUpgradeSelectedAgents());
    const data = get(props, "data", []);
    const env = get(props, "env", "");
    const mode = get(props, "mode", "");
    const payload = Array.isArray(data) ? data : data ? [data] : [];
    const output = mode === "bulk"
      ? yield call(agentManagementService.envUpgradeBulkAgents, payload, env)
      : mode === "single"
        ? yield call(agentManagementService.envUpgradeSingle, payload[0], env)
        : payload.length === 1
          ? yield call(agentManagementService.envUpgradeSingle, payload[0], env)
          : yield call(agentManagementService.envUpgradeBulkAgents, payload, env);
    yield put(agentManagementAction.successEnvUpgradeSelectedAgents(output));
    if (get(output, "data.flag") === "success") successtoast(get(output, "data.message", `Environment update triggered successfully: ${output.data.data.message}`));
    else errortoast(get(output, "data.message", "Failed to trigger environment update for selected RISEAGENTs"));
  } catch (error: any) {
    yield put(agentManagementAction.failureEnvUpgradeSelectedAgents(error));
    errortoast(get(error, "message", "Failed to trigger environment update for selected RISEAGENTs"));
  }
}


export function* getAgentUpgrade(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchUpgradeAgents());
    const output = yield call(agentManagementService.upgradeAgents);
    yield put(agentManagementAction.successFetchUpgradeAgents(get(output, "data.data", {})));
    if (get(output, "data.flag") === "error") errortoast(`Failed to get RISEAGENT upgrades: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchUpgradeAgents(error));
  }
}
export function* getAgentRegions(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentRegions());
    const output = yield call(agentManagementService.getAgentRegions);
    yield put(agentManagementAction.successFetchAgentRegions(get(output, "data.agentRegions", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentRegions(error));
  }
}
export function* getAgentPlatforms(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentPlatforms());
    const output = yield call(agentManagementService.getAgentPlatforms);
    yield put(agentManagementAction.successFetchAgentPlatforms(get(output, "data.agentPlatforms", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentPlatforms(error));
  }
}
export function* getAgentEnvironments(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentEnvironments());
    const output = yield call(agentManagementService.getAgentEnvironments);
    yield put(agentManagementAction.successFetchAgentEnvironments(get(output, "data.agentEnvironments", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentEnvironments(error));
  }
}
export function* getMetricsTilesData(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchMetricsTilesData());
    const output = yield call(agentManagementService.getMetricsTilesData);
    yield put(agentManagementAction.successFetchMetricsTilesData(get(output, "data.metricsTilesData", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchMetricsTilesData(error));
  }
}
export function* getAgentSids(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentSids());
    const output = yield call(agentManagementService.getAgentSids);
    yield put(agentManagementAction.successFetchAgentSids(get(output, "data.agentSids", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentSids(error));
  }
}
export function* getAgentOsTypes(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentOsTypes());
    const output = yield call(agentManagementService.getAgentOsTypes);
    yield put(agentManagementAction.successFetchAgentOsTypes(get(output, "data.agentOsTypes", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentOsTypes(error));
  }
}


export function* getAgentServiceNames(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentServiceNames());
    const output = yield call(agentManagementService.getAgentServiceNames);
    yield put(agentManagementAction.successFetchAgentServiceNames(get(output, "data.agentServiceNames", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentServiceNames(error));
  }
}


export function* getAgentVersions(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentVersions());
    const output = yield call(agentManagementService.getAgentVersions);
    yield put(agentManagementAction.successFetchAgentVersions(get(output, "data.agentVersions", [])));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentVersions(error));
  }
}


export function* syncAgentConfiguration({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSyncAgentConfig());
    const payload = Array.isArray(props) ? props : props ? [props] : [];
    const output = payload.length === 1
      ? yield call(agentManagementService.syncAgentConfigSingle, payload[0])
      : yield call(agentManagementService.syncAgentConfigBulk, payload);
    yield put(agentManagementAction.successSyncAgentConfig(output));
    if (get(output, "data.flag") === "success") {
      successtoast(get(output, "data.message", "Agent configuration sync triggered"));
    } else {
      errortoast(get(output, "data.error", "Failed to sync agent configuration"));
    }
  } catch (error: any) {
    yield put(agentManagementAction.failureSyncAgentConfig(error));
    errortoast(get(error, "message", "Failed to sync agent configuration"));
  }
}


export function* getSyncAgentHealthConfigs(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestSyncAgentHealthConfigs());
    const output = yield call(agentManagementService.getSyncAgentHealthConfigs);
    yield put(agentManagementAction.successSyncAgentHealthConfigs(output));
    if (get(output, "data.flag") === "success") successtoast("RISEAGENT Sync Status triggered successfully");
    else errortoast(`Failed to Sync RISEAGENT: ${output.data.message}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureSyncAgentHealthConfigs(error));
  }
}


export function* getAgentMasterdata({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchAgentMasterdata());
    const output = yield call(agentManagementService.getAgentMasterdata, props);
    yield put(agentManagementAction.successFetchAgentMasterdata(get(output, "data.data", [])));
    if (get(output, "data.flag") !== "success") errortoast(`Failed to fetch RISEAGENT Masterdata: ${output.data.error}`);
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchAgentMasterdata(error));
  }
}


export function* addAgentMasterdata({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestAddAgentMasterdata());
    const output = yield call(agentManagementService.addAgentMasterdata, props);
    yield put(agentManagementAction.successAddAgentMasterdata());
    if (get(output, "data.flag") === "success") {
      successtoast(`Hostname '${props}' added successfully`);
    } else {
      errortoast(`${output.data.error}`);
    }
  } catch (error: any) {
    yield put(agentManagementAction.failureAddAgentMasterdata(error));
  }
}


export function* deleteHostname({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestDeleteHostname());
    const output = yield call(agentManagementService.deleteAgentHostname, props);
    yield put(agentManagementAction.successDeleteHostname());
    if (get(output, "data.flag") === "success") {
      successtoast(`Hostname '${props}' deleted successfully`);
    } else {
      errortoast(`${output.data.error}`);
    }
  } catch (error: any) {
    yield put(agentManagementAction.failureDeleteHostname(error));
  }
}

export function* fetchVersionsSaga({ props }: ActionProps): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestFetchVersions());
    const response = yield call(agentManagementService.fetchVersions, props);
    yield put(agentManagementAction.successFetchVersions(response));
  } catch (error: any) {
    yield put(agentManagementAction.failureFetchVersions(error));
  }
}

export function* createVersionSaga({ versionData }: { versionData: BinaryVersionPayload }): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestCreateVersion());
    const response = yield call(agentManagementService.createVersion, versionData);
    yield put(agentManagementAction.successCreateVersion(response));

    if (get(response, "data.status") === true) successtoast("Added Binary");
    else errortoast(get(response, "data.error", "Failed to Add Binary"));
    yield put(agentManagementAction.fetchVersions({}));
  } catch (error: any) {
    yield put(agentManagementAction.failureCreateVersion(error));
  }
}

export function* updateVersionSaga({ versionData, id }: { versionData: BinaryVersionPayload; id: string }): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestUpdateVersion());
    const response = yield call(agentManagementService.updateVersion, versionData, id);
    yield put(agentManagementAction.successUpdateVersion(response));

    if (get(response, "data.status") === true) successtoast("Updated Binary data successfully");
    else errortoast(get(response, "data.error", "Failed to Update Binary data"));

  } catch (error: any) {
    yield put(agentManagementAction.failureUpdateVersion(error));
  }
}

export function* deleteteVersionSaga({ id }: { id: string }): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestDeleteVersion());
    const response = yield call(agentManagementService.deleteVersion, id);
    yield put(agentManagementAction.successDeleteVersion(response));

    if (get(response, "data.status") === true) successtoast("Deleted Binary");

  } catch (error: any) {
    yield put(agentManagementAction.failureDeleteVersion(error));
  }
}

export function* manualSyncVersionsSaga(): Generator<any, void, any> {
  try {
    yield put(agentManagementAction.requestManualSyncVersions());
    const response = yield call(agentManagementService.manualSyncVersions);
    yield put(agentManagementAction.successManualSyncVersions(response));

    if (get(response, "data.status") === true) {
      successtoast("Version sync completed successfully");
    yield put(agentManagementAction.fetchVersions({}));
    } else {
      errortoast(get(response, "data.error", "Failed to sync versions"));
    }
  } catch (error: any) {
    yield put(agentManagementAction.failureManualSyncVersions(error));
    errortoast("Version sync failed");
  }
}


export default function* actionWatcher(): Generator<any, void, any> {
  yield all([
    yield takeLatest(AGENT_MANAGEMENT.START_AGENT_SERVICE, startAgentManagerService),
    yield takeLatest(AGENT_MANAGEMENT.STOP_AGENT_SERVICE, stopAgentManagerServices),
    yield takeLatest(AGENT_MANAGEMENT.RESTART_JOB_SERVICE, restartJobManagerService),
    yield takeLatest(AGENT_MANAGEMENT.RESTART_AGENT_SERVICE, restartAgentManagerService),
    yield takeLatest(AGENT_MANAGEMENT.SHUTDOWN_AGENT_SERVICE, shutDownAgentManagerService),
    yield takeLatest(AGENT_MANAGEMENT.STARTSSH_AGENT_SERVICE, startSSHAgentManagerService),

    yield takeLatest(AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP, agentHealthCheckup),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_HEALTH_CHECKUP_BY_PORT, agentHealthCheckupByPort),

    yield takeLatest(AGENT_MANAGEMENT.SAVE_AGENT_PROPERTY, saveAgentManagerProperty),
    yield takeLatest(AGENT_MANAGEMENT.UPDATE_AGENT_PROPERTY, updateAgentManagerProperty),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_BUILD_INFO, fetchAgentBuildInfo),

    yield takeLatest(AGENT_MANAGEMENT.SAVE_GLOBAL_CONFIG, saveAgentGlobalConfig),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_GLOBAL_CONFIG, fetchAgentGlobalConfig),

    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_MANAGEMENT_SERVICE, fetchAgentServices),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_FILTER, fetchAgentFilterService),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_REPOSITORIES, fetchFilterAgentRepos),
    yield takeLatest(AGENT_MANAGEMENT.ADD_AGENT, addAgents),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_LOGS, fetchAgentLogs),
    yield takeLatest(AGENT_MANAGEMENT.SAVE_LOCAL_CONFIGS, saveAgentLocalConfigs),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_LOCAL_CONFIGS, fetchAgentLocalConfigs),

    yield takeLatest(AGENT_MANAGEMENT.FETCH_REPOSITORIES, fetchAgentRepo),
    yield takeLatest(AGENT_MANAGEMENT.DOWNLOAD_REPOSITORIES, downloadRepo),

    yield takeLatest(AGENT_MANAGEMENT.SAVE_SCHEDULER_COMMAND, saveSchedulerCommands),
    yield takeLatest(AGENT_MANAGEMENT.UPDATE_SCHEDULER_COMMAND, updateSchedulerCommands),
    yield takeLatest(AGENT_MANAGEMENT.DELETE_SCHEDULER_COMMAND, deleteSchedulerCommands),
    yield takeLatest(AGENT_MANAGEMENT.LIST_SCHEDULER_COMMAND, listSchedulerCommands),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_SCHEDULED_JOBS_BY_COMMAND_ID, fetchScheduledJobsByCommandId),
    yield takeLatest(AGENT_MANAGEMENT.SYNCUP_AGENT_DISCOVERY, agentDiscoverySyncup),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_METRICS, getAgentMetrics),
    yield takeLatest(AGENT_MANAGEMENT.SYNC_SCRIPTS, syncScript),

    yield takeLatest(AGENT_MANAGEMENT.START_SELECTED_AGENT_SERVICE, startsSelectedAgent),
    yield takeLatest(AGENT_MANAGEMENT.STOP_SELECTED_AGENT_SERVICE, stopsSelectedAgent),
    yield takeLatest(AGENT_MANAGEMENT.RESTART_SELECTED_AGENT_SERVICE, restartsSelectedAgent),
    yield takeLatest(AGENT_MANAGEMENT.HEALTHCHECKUP_SELECTED_AGENT_SERVICE, healthChecksSelectedAgent),
    yield takeLatest(AGENT_MANAGEMENT.UPGRADE_SELECTED_AGENTS, upgradeAgents),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_UPGRADE_AGENTS, getAgentUpgrade),

    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_REGIONS, getAgentRegions),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_PLATFORMS, getAgentPlatforms),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_ENVIRONMENTS, getAgentEnvironments),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_METRICS_TILES_DATA, getMetricsTilesData),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_SIDS, getAgentSids),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_OS_TYPES, getAgentOsTypes),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_SERVICE_NAMES, getAgentServiceNames),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_VERSIONS, getAgentVersions),
    yield takeLatest(AGENT_MANAGEMENT.ENV_UPGRADE_SELECTED_AGENTS, envUpgradeAgents),
    yield takeLatest(AGENT_MANAGEMENT.SYNC_AGENT_CONFIG, syncAgentConfiguration),
    yield takeLatest(AGENT_MANAGEMENT.SYNC_AGENT_HEALTH_CONFIGS, getSyncAgentHealthConfigs),

    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_MASTERDATA, getAgentMasterdata),
    yield takeLatest(AGENT_MANAGEMENT.ADD_AGENT_MASTERDATA, addAgentMasterdata),
    yield takeLatest(AGENT_MANAGEMENT.DELETE_HOSTNAME, deleteHostname),
    yield takeLatest(AGENT_MANAGEMENT.FETCH_AGENT_INFO, fetchAgentInfo),

    yield takeLatest(AGENT_MANAGEMENT.FETCH_VERSIONS, fetchVersionsSaga),
    yield takeLatest(AGENT_MANAGEMENT.CREATE_VERSION, createVersionSaga),
    yield takeLatest(AGENT_MANAGEMENT.UPDATE_VERSION, updateVersionSaga),
    yield takeLatest(AGENT_MANAGEMENT.DELETE_VERSION, deleteteVersionSaga),
    yield takeLatest(AGENT_MANAGEMENT.MANUAL_SYNC_VERSIONS, manualSyncVersionsSaga),
  ]);
}

