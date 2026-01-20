interface Option {
  label: string;
  value: string;
  color?: string;
}

interface ScheduleTypeOption {
  label: string;
  value: string;
}

/**
 * AGENT VERSIONS Option Values
 */
export const AGENT_VERSIONS: Option[] = [
  {
    label: "0.0.1",
    value: "0.0.1",
  },
  {
    label: "0.0.2",
    value: "0.0.2",
  },
  {
    label: "0.0.3",
    value: "0.0.3",
  },
  {
    label: "0.0.4",
    value: "0.0.4",
  },
];

/**
 * PLATFORM Option values
 */
export const PLATFORMS: Option[] = [
  {
    label: "Platform 1",
    value: "Platform 1",
  },
  {
    label: "Platform 2",
    value: "Platform 2",
  },
  {
    label: "Platform 3",
    value: "Platform 3",
  },
  {
    label: "Platform 4",
    value: "Platform 4",
  },
  {
    label: "Platform 5",
    value: "Platform 5",
  },
];

/**
 * ENVIRONMENTS Option Values
 */
export const ENVIRONMENTS: Option[] = [
  {
    label: "Environment 1",
    value: "Environment 1",
  },
  {
    label: "Environment 2",
    value: "Environment 2",
  },
  {
    label: "Environment 3",
    value: "Environment 3",
  },
  {
    label: "Environment 4",
    value: "Environment 4",
  },
];

/**
 * SIDS Option Values
 */
export const SIDS: Option[] = [
  {
    label: "SID 1",
    value: "SID 1",
  },
  {
    label: "SID 2",
    value: "SID 2",
  },
];

/**
 * STATE OPTIONS Values
 */
export const stateOptions: Option[] = [
  { value: "ocean1", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

/**
 * AGENT TYPES Option Values
 */
export const AGENT_TYPES = {
  OS_AGENT_PRIMARY: "os_agent",
  SCHEDULER_AGENT_PRIMARY: "scheduler_agent",
  OS_AGENT_SECONDARY: "OS Agent",
  SCHEDULER_AGENT_SECONDARY: "Scheduler Agent",
  AGENT_MANAGER_PRIMARY: "agent_manager",
  AGENT_MANAGER: "Agent Manager",
  AGENT_MANAGER_KEY: "agentManagerVersions",
  OS_AGENT_KEY: "osAgentVersions",
  SCHEDULER_AGENT_KEY: "schedulerAgentVersions",
} as const;

export const AGENT_ACTIONS = {
  UPDATE: "update",
  START: "start",
  STOP: "stop",
  RESTART: "restart",
} as const;

/**
 * SCHEDULE RADIO TYPES
 */
export const SCHEDULE_TYPES: ScheduleTypeOption[] = [
  { label: "Command", value: "command" },
  { label: "Download files", value: "download_files" },
];

export const NUMERICS = {
  ZERO: 0,
} as const;

export const ERROR_MESSAGE = {
  AGENT_SELECTION_LIMIT: "The status for selected RISEBOTs will not be auto updated. Please click on Health Check to get the status of RISEBOTs.",
} as const;