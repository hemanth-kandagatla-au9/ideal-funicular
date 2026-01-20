/**
 * Mock data for Global Configuration
 * This data simulates the backend response for global configuration
 */

export interface ConfigItem {
  propertyName: string;
  propertyValue: string;
  canModify: boolean;
  isVisible: boolean;
}

export interface GlobalConfigResponse {
  flag: string;
  data: {
    configs: ConfigItem[];
  };
}

export const mockGlobalConfigData: GlobalConfigResponse = {
  flag: "success",
  data: {
    configs: [
      {
        propertyName: "ip",
        propertyValue: "0.0.0.0",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "primary_port",
        propertyValue: "20101",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "server_port",
        propertyValue: "0",
        canModify: true,
        isVisible: true,
      },
      {
        propertyName: "min_port",
        propertyValue: "20101",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "max_port",
        propertyValue: "20150",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "auto_upgrade",
        propertyValue: "true",
        canModify: true,
        isVisible: true,
      },
      {
        propertyName: "opensearch_domain_endpoint",
        propertyValue: "https://vpc-itx-bvx-rise-opensearch-dev-udqq75qpplmy2bzjaecvzaw2u4.us-east-1.es.amazonaws.com",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "opensearch_username",
        propertyValue: "opensearchdb-dev",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "opensearch_password",
        propertyValue: "QAZplm-925",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "opensearch_application_log_index",
        propertyValue: "risebot_application_logs_predev",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "opensearch_health_discovery_log_index",
        propertyValue: "risebot_health_discovery_predev",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "opensearch_agent_discovery_log_index",
        propertyValue: "risebot_discovery_predev",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "cpu_utils_limit",
        propertyValue: "",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "memory_limit",
        propertyValue: "104857600",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "username",
        propertyValue: "rise-agent-user",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "password",
        propertyValue: "N@p!13EH8t2b",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "os_command_timeout",
        propertyValue: "50000000",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "script_execution_allowed_path",
        propertyValue: "scripts,tmp,/erpsoftware",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "whitelisted_commands",
        propertyValue: "",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "blacklisted_commands",
        propertyValue: "",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "binary_download_api_url",
        propertyValue: "https://predev.agent.rise.apps.jnj.com/download/file",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "binary_download_api_username",
        propertyValue: "admin",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "binary_download_api_password",
        propertyValue: "tBgu0U@93Px3",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "version_list_api_url",
        propertyValue: "https://predev.agent.rise.apps.jnj.com/rust-agent/version-list?agentType=rustlinux",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "health_check_process_interval",
        propertyValue: "300000",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "job_scheduler_interval",
        propertyValue: "500",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "persistent_script_interval",
        propertyValue: "3600000",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "persistent_script_pause_after_download",
        propertyValue: "60000",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "checksum_value_url",
        propertyValue: "https://predev.agent.rise.apps.jnj.com/script-checksum/config-checksum/",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "script_upload_path",
        propertyValue: "tmp",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "persistent_script_download_batch_slot_minute",
        propertyValue: "1",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "persistent_script_download_batch_slot_max_download",
        propertyValue: "10",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "usage_limit_check_interval",
        propertyValue: "300000",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "script_indentification_extensions",
        propertyValue: "sh, py",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "cpu_stat_tick_interval",
        propertyValue: "5000",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "logged_user_check_interval",
        propertyValue: "5000",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "rise_node_api_endpoint",
        propertyValue: "https://predev.agentlogic.rise.apps.jnj.com",
        canModify: false,
        isVisible: true,
      },
      {
        propertyName: "rise_node_api_username",
        propertyValue: "rise-agent-user",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "rise_node_api_password",
        propertyValue: "N@p!13EH8t2b",
        canModify: false,
        isVisible: false,
      },
      {
        propertyName: "cron_job_timeout",
        propertyValue: "60000",
        canModify: false,
        isVisible: true,
      },
    ],
  },
};

// Store for simulating persistence
let currentConfigData = { ...mockGlobalConfigData };

export const getMockGlobalConfig = (): Promise<GlobalConfigResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(currentConfigData);
    }, 500); // Simulate network delay
  });
};

export const saveMockGlobalConfig = (data: { riseBot?: ConfigItem[] }): Promise<{ flag: string; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Update the current config data
      if (data.riseBot) {
        currentConfigData.data.configs = data.riseBot;
      }
      resolve({
        flag: "success",
        message: "Configuration saved successfully",
      });
    }, 700); // Simulate network delay
  });
};

export const resetMockGlobalConfig = () => {
  currentConfigData = { ...mockGlobalConfigData };
};
