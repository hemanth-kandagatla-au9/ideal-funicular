interface AgentDetails {
  up_time?: string;
}

interface Risebot {
  pid?: string;
}

interface RisebotProperties {
  agent?: {
    version?: string;
  };
  server?: {
    port?: string | number;
  };
}

interface Agent {
  hostname: string;
  os: string;
  agent_details: AgentDetails;
  risebot: Risebot;
  status: string;
  risebotProperties: RisebotProperties;
  createdAt?: string;
}

export type { Agent, AgentDetails };
