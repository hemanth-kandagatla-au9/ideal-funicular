import { get } from "lodash";
import moment, { MomentInput } from "moment";

interface AgentDetail {
  label: string;
  value: string;
}

export interface AgentConfigDetail {
  propertyName: string;
  label: string;
  propertyValue: string;
}

interface RisebotProperties {
  agent_type?: string;
  version?: string;
  vm_hostname?: string;
  vm_ip?: string;
  install_dir?: string;
  rust_version?: string;
  os_version?: string;
  server_port?: number | string;
  pid?: string | number;
  agent_last_start_time?: string | number;
  up_time?: string;
  memory?: string;
  cpu_usage?: string;
  disk_usage?: string;
}

interface AgentLocalConfig {
  server_port?: number;
  auto_upgrade?: boolean;
}

interface CmdbProperties {
  ciOsType?: string;
  slRegion?: string;
  slName?: string;
  slPlatform?: string;
  ciSapNameEnv?: string;
  ciSapNameSid?: string;
}

interface AgentServer {
  agent_details?: RisebotProperties;
  agent_local_config?: AgentLocalConfig;
  cmdb?: CmdbProperties;
}

const convertDate = (date: number | string, falseValue: string): string => {
  return moment(Number(date) * 1000).isValid() ? moment(Number(date) * 1000).format("DD-MMMM-YYYY hh:mm:ss A") : falseValue;
};

const convertDateTime = (date: MomentInput, falseValue: string, isDateOnly: boolean): string => {
  if (moment(new Date(date)).isValid()) {
    if (isDateOnly) {
      return moment(date).format("DD-MMMM-YYYY");
    }
    return moment(date).format("DD-MMMM-YYYY hh:mm:ss A");
  }
  return falseValue;
};

const prepareAgentDetails = (agentServer: AgentServer): AgentDetail[] => {
  console.log("agentServer => ", agentServer);
  const risebotProperties: RisebotProperties = get(agentServer, "agent_details", {});
  const cmdbProperties: CmdbProperties = get(agentServer, "cmdb", {});
console.log("cmdbProperties",cmdbProperties)
console.log("risebotProperties",risebotProperties)
  const agentDetailsArray: AgentDetail[] = [
    { label: "RISEBOT Type", value: get(risebotProperties, "agent_type", "NOT_FOUND") },
    { label: "Version", value: get(risebotProperties, "version", "NOT_FOUND") },
    {
      label: "VM Host Name",
      value: String(get(risebotProperties, "vm_hostname", "NOT_FOUND")).toUpperCase(),
    },
    { label: "VM IP", value: get(risebotProperties, "vm_ip", "NOT_FOUND") },
    { label: "Installation Directory", value: get(risebotProperties, "install_dir", "") },
    { label: "RUST Version", value: get(risebotProperties, "rust_version", "") },
    { label: "OS Version", value: get(risebotProperties, "os_version", "") },
    { label: "Port", value: String(get(risebotProperties, "server_port", "")) },
    { label: "PID", value: String(get(risebotProperties, "pid", "-")) },
    {
      label: "RISEBOT Last Start",
      value: convertDate(parseInt(String(get(risebotProperties, "agent_last_start_time", "")), 10), ""),
    },
    { label: "Uptime", value: get(risebotProperties, "up_time", "-") },
    { label: "Memory Utilization", value: get(risebotProperties, "memory", "") },
    { label: "CPU Utilization", value: get(risebotProperties, "cpu_usage", "") },
    { label: "Disk Utilization", value: get(risebotProperties, "disk_usage", "") },
    { label: "OS Type", value: get(cmdbProperties, "ciOsType", "-") },
    { label: "Region", value: get(cmdbProperties, "slRegion", "-") },
    { label: "Service Name", value: get(cmdbProperties, "slName", "-") },
    { label: "Platform", value: get(cmdbProperties, "slPlatform", "-") },
    { label: "SAP Environment", value: get(cmdbProperties, "ciSapNameEnv", "-") },
    { label: "SAP SID", value: get(cmdbProperties, "ciSapNameSid", "-") },
  ];
  return agentDetailsArray;
};

const prepareAgentConfigDetails = (agentServer: AgentServer): AgentConfigDetail[] => {
  const risebotProperties: AgentLocalConfig = get(agentServer, "agent_local_config", {});

  const agentDetailsArray: AgentConfigDetail[] = [
    {
      propertyName: "server_port",
      label: "Server port",
      propertyValue: String(get(risebotProperties, "server_port", 0)),
    },
    {
      propertyName: "auto_upgrade",
      label: "Agent autoupgrade check",
      propertyValue: String(get(risebotProperties, "auto_upgrade", false)),
    },
  ];
  return agentDetailsArray;
};

export { convertDate, convertDateTime, prepareAgentDetails, prepareAgentConfigDetails };

