interface PropertySchema {
  propertyName: string;
  label: string;
  propertyType: string;
  encrypted: boolean;
}

interface VersionedPropertySchemas {
  [version: string]: PropertySchema[];
}

interface AgentPropertySchema {
  [agentName: string]: VersionedPropertySchemas;
}

const agentPropertySchema: AgentPropertySchema = {
  riseBot: {
    "0.0.1": [
      {
        propertyName: "opensearch.nonprod-domain-endpoint",
        label: "opensearch nonprod domain endpoint",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "opensearch.nonprod-username",
        label: "opensearch nonprod username",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "opensearch.nonprod-password",
        label: "opensearch nonprod password",
        propertyType: "String",
        encrypted: true,
      },
      {
        propertyName: "opensearch.prod-domain-endpoint",
        label: "opensearch prod domain endpoint",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "opensearch.prod-username",
        label: "opensearch prod username",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "opensearch.prod-password",
        label: "opensearch prod password",
        propertyType: "String",
        encrypted: true,
      },
      {
        propertyName: "cron.agent-config-discovery",
        label: "cron agent config discovery",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "cron.agent-health-discovery",
        label: "cron agent health discovery",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "cron.agent-self-upgrade",
        label: "cron agent self upgrade",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "cron.agent-checksum-monitoring",
        label: "cron agent checksum monitoring",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "spring.profiles.active",
        label: "spring profiles active",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "webservice.username",
        label: "webservice username",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "webservice.password",
        label: "webservice password",
        propertyType: "String",
        encrypted: true,
      },
      {
        propertyName: "checksum.downloadbatch.slot-minute",
        label: "checksum downloadbatch slot minute",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "checksum.downloadbatch.slot-max-download",
        label: "checksum downloadbatch slot max download",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "script.execution-allowed-path",
        label: "script execution allowed path(comma seperated value)",
        propertyType: "String",
        encrypted: true,
      },
      {
        propertyName: "cron.agent-config-monitoring",
        label: "cron agent config monitoring",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "webservice.whitelistedcommand",
        label: "webservice whitelistedcommand",
        propertyType: "String",
        encrypted: true,
      },
    ],
  },
  localRiseBotSchema: {
    "0.0.1": [
      {
        propertyName: "server.port",
        label: "Server port",
        propertyType: "String",
        encrypted: false,
      },
      {
        propertyName: "agent.autoupgrade-check",
        label: "Agent autoupgrade check",
        propertyType: "String",
        encrypted: false,
      },
    ],
  },
};

export default agentPropertySchema;