interface AgentConfig {
  [key: string]: string;
  auto_upgrade: string;
  binary_hashes: string;
  blacklisted_commands: string;
  cpu_utils_limit: string;
  health_check_process_interval: string;
  ip: string;
  max_port: string;
  memory_limit: string;
  min_port: string;
  opensearch_agent_discovery_log_index: string;
  opensearch_application_log_index: string;
  opensearch_domain_endpoint: string;
  opensearch_health_discovery_log_index: string;
  opensearch_username: string;
  os_command_timeout: string;
  persistent_script_download_batch_slot_max_download: string;
  persistent_script_download_batch_slot_minute: string;
  persistent_script_interval: string;
  primary_port: string;
  rise_node_api_endpoint: string;
  script_execution_allowed_path: string;
  script_indentification_extensions: string;
  script_upload_path: string;
  server_port: string;
  usage_limit_check_interval: string;
  username: string;
  whitelisted_commands: string;
}

interface AgentConfigurationProps {
  applicationProperty: AgentConfig;
  trimAgentPropertyName: (key: string) => string;
}

export default AgentConfigurationProps;