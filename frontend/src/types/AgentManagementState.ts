/* eslint-disable */
import { Agent } from "./AgentList";

interface AgentDetails {
  server_port?: string;
  os_version?: string;
  [key: string]: any;
}

interface DropdownOption {
  label?: string;
  value: string;
  name: string;
}

interface FilteredData {
  os: DropdownOption[];
  region: DropdownOption[];
  serviceName: DropdownOption[];
  agentVersions: DropdownOption[];
  platform: DropdownOption[];
  environment: DropdownOption[];
  sid: DropdownOption[];
}

interface Pagination {
  totalRows: number;
  limit: number;
  pageNo: number;
  totalPage: number;
}

interface AgentManagementState {
  selectedAgent: Agent | object;
  openDrawer: boolean;
  agentSearch: string;
  pageSize: number;
  pageNo: number;
  openAgentModal: boolean;
  showFilters: boolean;
  selectedHostName: string;
  selectedHostPort: string;
  selectedHostnameAgents: Agent[];
  openAgentUpgrade: boolean;
  selectedUpgradeAgents: Agent[];
  selectedOption: string;
  dropdownOptionsobj: {
    os: DropdownOption[];
    region: DropdownOption[];
    serviceName: DropdownOption[];
    agentVersions: DropdownOption[];
    platform: DropdownOption[];
    environment: DropdownOption[];
    sid: DropdownOption[];
  };
  multiselectOfset: string;
  serviceLineOptions: any[];
  isOptionsLoading: boolean;
  globalConfigs: any;
}

export type { Agent, Pagination, AgentDetails, FilteredData, DropdownOption, AgentManagementState };
