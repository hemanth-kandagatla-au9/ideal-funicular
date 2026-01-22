/* eslint-disable */
interface AgentProperty {
  label?: string;
  propertyName: string;
  propertyValue: string;
  encrypted?: boolean;
  error?: boolean;
}

interface SidebarState {
  editAgentLocalConfiguration: boolean;
  openBar: boolean;
  openSchedulerCommand: boolean;
  openEditSchedule: boolean;
  openScheduleView: boolean;
  filledConfigDetails: boolean;
  deleteSchedulerModal: boolean;
  JobLogModal: boolean;
  isGlobalConfig: boolean;
  resetScheduleCommands: boolean;
  commandJob: string;
  selectedAgentVersion: string;
  selectedSubAgentsID: string;
  hostName: string;
  schedulerJobId: string;
  openLocalConfigModal: boolean;
  riseBotSchema: AgentProperty[];
  localRiseBotSchema: AgentProperty[];
  agentlocalconfig: any[];
  versionDialogOpen: boolean;
  agentLog: any[];
  limit: number;
  skip: number;
  jobName: string;
  isLogsLoading: boolean;
  loadMore: boolean;
  port: string;
}

interface SideBarProps {
  open: boolean;
  setOpenSidebar: (open: boolean) => void;
  openBar: boolean;
  configureModal: boolean;
  agentSelected: any;
  port: string;
}

interface ConfigProperty {
  label: string;
  propertyName: string;
  propertyValue: string;
  propertyType: string;
  encrypted?: boolean;
  error?: boolean;
}

interface GlobalConfigs {
  riseBot?: ConfigProperty[];
}

export type { SidebarState, AgentProperty, SideBarProps, GlobalConfigs };

