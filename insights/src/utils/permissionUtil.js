export const PERMISSION_LIST = {
  SCHEDULE_VIEW_LOGS: "Schedule : logs",

  LOGS_MAPPING: "Schedule : logs_mapping",

  LOGS_VARIABLE_MAPPING: "Schedule : logs_variable_mapping",

  LOGS_ACTION_DESCRIPTION: "Schedule : logs_action_description",

  LOGS_COMMAND: "Schedule : logs_command",

  LOGS_OUTPUT: "Schedule : logs_output",

  LOGS_STATUS: "Schedule : logs_status",

  LOGS_TAGS: "Schedule : logs_tags",

  LOGS_RUN_AS: "Schedule : logs_run_as",

  SCHEDULE_CLONE: "Schedule : clone",

  SCHEDULE_RESUME_PAUSE: "Schedule : resume_pause",
  SCHEDULE_PUBLISH_AS_SYSTEM: "Schedule : schedule_publish_as_system",

  SCHEDULE_READ: "Schedule : read",
  SCHEDULE_WRITE: "Schedule : write",

  REPORTS_READ: "Reports : read",
  REPORTS_WRITE: "Reports : write",
  REPORTS_EXPORT: "Reports : export",
  REPORTS_PUBLISH_AS_SYSTEM: "Reports : report_publish_as_system",

  // SERVERS_READ: "Servers : read",
  // SERVERS_WRITE: "Servers : write",

  SAP_FACTS_READ: "SAP Facts : read",
  SAP_FACTS_WRITE: "SAP Facts : write",
  SAP_FACTS_ENV: "SAP Facts : environment_config",
  SAP_FACTS_SYNC: "SAP Facts : sync_config",
  SAP_FACTS_BULK_LOGS: "SAP Facts : bulk_action_logs_data",

  CMDB_READ: "CMDB : read",
  CMDB_WRITE: "CMDB : write",

  REQUEST_STATUS_READ: "Request Status : read",
  REQUEST_STATUS_WRITE: "Request Status : write",

  REQUEST_APPROVAL_READ: "Request Approval : read",
  REQUEST_APPROVAL_WRITE: "Request Approval : write",

  AUTH_READ: "Auth : read",
  AUTH_WRITE: "Auth : write",

  SCHEDULE_CATEGORIES_READ: "Schedule Categories : read",
  SCHEDULE_CATEGORIES_WRITE: "Schedule Categories : write",

  OPEN_SEARCH_READ: "Open Search : read",
  OPEN_SEARCH_WRITE: "Open Search : write",

  COMMAND_CATEGORY_READ: "Command Category : read",
  COMMAND_CATEGORY_WRITE: "Command Category : write",

  CONFIG_READ: "Config : read",
  CONFIG_WRITE: "Config : write",

  APPROVAL_FLOW_READ: "Approval Flow : read",
  APPROVAL_FLOW_WRITE: "Approval Flow : write",

  INTERNAL_JOBS_READ: "Internal Jobs : read",
  INTERNAL_JOBS_WRITE: "Internal Jobs : write",

  RUN_AS_CONFIG_READ: "Run As Config : read",
  RUN_AS_CONFIG_WRITE: "Run As Config : write",

  SAP_FACTS_COLUMNS_READ: "SAP Facts Columns : read",
  SAP_FACTS_COLUMNS_WRITE: "SAP Facts Columns : write",

  SCHEDULE_SYSTEM_PUBLISH_CONFIG_READ: "Schedule System Publish Config : read",
  SCHEDULE_SYSTEM_PUBLISH_CONFIG_WRITE:
    "Schedule System Publish Config : write",

  USERS_READ: "Users : read",
  USERS_WRITE: "Users : write",

  AUDIT_LOGS_READ: "Audit Logs : read",
  AUDIT_LOGS_WRITE: "Audit Logs : write",

  CODE_MARKETPLACE_READ: "Code Marketplace : read",
  CODE_MARKETPLACE_WRITE: "Code Marketplace : write",
  CODE_MARKETPLACE_CMDB_READ: "Code Marketplace : cmdb_template_read",
  CODE_MARKETPLACE_CMDB_WRITE: "Code Marketplace : cmdb_template_write",
  CODE_MARKETPLACE_CMDB_DELETE: "Code Marketplace : cmdb_template_delete",
};

export const MODULE_LIST = {
  SCHEDULE: "Schedule",
  REPORTS: "Reports",
  SERVERS: "Servers",
  SAP_FACTS: "SAP Facts",
  REQUEST_STATUS: "Request Status",
  REQUEST_APPROVAL: "Request Approval",
  AUTH: "Auth",
  SCHEDULE_CATEGORIES: "Schedule Categories",
  OPEN_SEARCH: "Open Search",
  COMMAND_CATEGORY: "Command Category",
  CONFIG: "Config",
  APPROVAL_FLOW: "Approval Flow",
  INTERNAL_JOBS: "Internal Jobs",
  RUN_AS_CONFIG: "Run As Config",
  SAP_FACTS_COLUMNS: "SAP Facts Columns",
  USERS: "Users",
  AUDIT_LOGS: "Audit Logs",
  CODE_MARKETPLACE: "Code Marketplace",
  CMDB_SCHEDULES: "CMDB",
  SETTINGS: [
    "Schedule Categories",
    "Open Search",
    "Command Category",
    "Run As Config",
    "Approval Flow",
    "Internal Jobs",
    "Config",
    "Schedule System Publish Config",
    "SAP Facts Columns"
  ],
  SCHEDULE_SYSTEM_PUBLISH_CONFIG: "Schedule System Publish Config",
};

export const hasInsightsPermission = (
  permissionState,
  moduleName,
  permissionLabel
) => {
  if (!permissionState) return false;

  const insightsProject = permissionState.find((p) => p.project === "insights");
  if (!insightsProject) return false;

  // If "All" module has access, allow all permissions
  const allModule = insightsProject.modules.find((m) => m.module === "All");
  if (allModule?.hasAccess) return true;
  const module = insightsProject.modules.find(
    (m) => m?.module?.toLowerCase() === moduleName?.toLowerCase()
  );
  if (!module) return false;

  return module.permissions?.some(
    (p) => p.label === permissionLabel && p.hasAccess
  );
};
