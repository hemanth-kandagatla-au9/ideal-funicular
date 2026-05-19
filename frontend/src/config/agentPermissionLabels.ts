/**
 * agentPermissionLabels.ts
 *
 * Defines the permission label strings that the /auth/getUserPermission API
 * returns for the "agent" project.  Use these constants instead of hard-coded
 * strings so that a single rename here keeps everything in sync.
 *
 * Label format follows the backend convention:  "<Module> : <action>"
 * e.g.  "job : read"   or   "Rise Agent : write"
 */

export const AGENT_PROJECT = 'agent';
export const AGENT_MODULE  = 'Rise Agent';


// ACTION_VIEW  → controls VIEW access: agent details, config, log accordions.
// Also used as the fallback check before showing any agent section.
export const RISE_AGENT_ACTION_VIEW = 'Rise Agent : action_view';
export const RISE_AGENT_WRITE = 'Rise Agent : write';

// ── Agent-level operations ────────────────────────────────────────────────────
export const RISE_AGENT_START        = 'Rise Agent : start';
export const RISE_AGENT_STOP         = 'Rise Agent : stop';
export const RISE_AGENT_RESTART      = 'Rise Agent : restart';
export const RISE_AGENT_UPGRADE      = 'Rise Agent : upgrade';
export const RISE_AGENT_SYNC_CONFIG  = 'Rise Agent : sync_config';
export const RISE_AGENT_CHECK_STATUS = 'Rise Agent : check_status';
export const RISE_AGENT_SYNC_STATUS  = 'Rise Agent : sync_status';
export const RISE_AGENT_ENV_UPGRADE  = 'Rise Agent : env_upgrade';
export const RISE_AGENT_VERSION_MANAGEMENT = 'Rise Agent : version_management';

// ── Job-level operations ──────────────────────────────────────────────────────
export const RISE_AGENT_JOB_START   = 'Rise Agent : job_start';
export const RISE_AGENT_JOB_STOP    = 'Rise Agent : job_stop';
export const RISE_AGENT_JOB_RESTART = 'Rise Agent : job_restart';

// ── Bulk action operations (FilterBar top-level buttons) ──────────────────────
export const RISE_AGENT_BULK_START       = 'Rise Agent : bulk_start';
export const RISE_AGENT_BULK_STOP        = 'Rise Agent : bulk_stop';
export const RISE_AGENT_BULK_RESTART     = 'Rise Agent : bulk_restart';
export const RISE_AGENT_BULK_UPGRADE     = 'Rise Agent : bulk_upgrade';
export const RISE_AGENT_BULK_SYNC_CONFIG = 'Rise Agent : bulk_sync_config';
export const RISE_AGENT_BULK_ENV_UPGRADE = 'Rise Agent : bulk_env_upgrade';
export const RISE_AGENT_BULK_LOGS_VIEW   = 'Rise Agent : view_bulk_logs';


// ── ViewDetails sidebar accordion visibility ──────────────────────────────────
export const RISE_AGENT_TASKS_READ  = "Rise Agent : host_list";
export const RISE_AGENT_DETAILS_READ = "Rise Agent : host_details";
export const RISE_AGENT_CONFIG_READ  = "Rise Agent : host_config";
export const RISE_AGENT_LOGS_READ    = "Rise Agent : host_logs";
export const RISE_AGENT_ACCORDION    = "Rise Agent : accordion";
export const RISE_AGENT_ACCORDION_AGENT        = "Rise Agent : accordion_agent";
export const RISE_AGENT_ACCORDION_SUPERVISOR   = "Rise Agent : accordion_supervisor";
export const RISE_AGENT_ACCORDION_CYBERSPHERE  = "Rise Agent : accordion_cybersphere";
export const RISE_AGENT_ACCORDION_INSIGHTS     = "Rise Agent : accordion_insights";
export const RISE_AGENT_ACCORDION_WORKFLOW     = "Rise Agent : accordion_workflow";
export const RISE_AGENT_GLOBAL_CONFIG_READ = "Rise Agent : global_config_read";
export const RISE_AGENT_GLOBAL_CONFIG_UPDATE = "Rise Agent : global_config_update";
export const RISE_AGENT_USER_AUTHORIZATION_READ = "Rise Agent : user_authorization_read";
export const RISE_AGENT_USER_AUTHORIZATION_ADDUSER = "Rise Agent : user_authorization_adduser";
export const RISE_AGENT_USER_AUTHORIZATION_DELETEUSER = "Rise Agent : user_authorization_deleteuser";
export const RISE_AGENT_PERMISSION_LIST_READ = "Rise Agent : permission_list_read";
export const RISE_AGENT_PERMISSION_ADD = "Rise Agent : permission_add";
export const RISE_AGENT_ASSIGN_PERMISSION = "Rise Agent : assign_permission";
export const RISE_AGENT_DELETE_PERMISSION = "Rise Agent : delete_permission";
export const RISE_AGENT_VERSIONMANAGEMENT_VIEW = 'Rise Agent : versionmanagement_view';
export const RISE_AGENT_VERSIONMANAGEMENT_EDIT = 'Rise Agent : versionmanagement_edit';
export const RISE_AGENT_DOWNLOAD_TO_EXCEL = 'Rise Agent : downloadtoexcel';
export const RISE_AGENT_UPDATE_ENV = 'Rise Agent : update_env';

// ── Convenience object ────────────────────────────────────────────────────────
export const AGENT_PERMISSIONS = {
  RISE_AGENT_ACTION_VIEW,
  RISE_AGENT_WRITE,
  RISE_AGENT_START,
  RISE_AGENT_STOP,
  RISE_AGENT_RESTART,
  RISE_AGENT_UPGRADE,
  RISE_AGENT_SYNC_CONFIG,
  RISE_AGENT_CHECK_STATUS,
  RISE_AGENT_SYNC_STATUS,
  RISE_AGENT_ENV_UPGRADE,
  RISE_AGENT_VERSION_MANAGEMENT,
  RISE_AGENT_JOB_START,
  RISE_AGENT_JOB_STOP,
  RISE_AGENT_JOB_RESTART,
  RISE_AGENT_BULK_START,
  RISE_AGENT_BULK_STOP,
  RISE_AGENT_BULK_RESTART,
  RISE_AGENT_BULK_UPGRADE,
  RISE_AGENT_BULK_SYNC_CONFIG,
  RISE_AGENT_BULK_ENV_UPGRADE,
  RISE_AGENT_BULK_LOGS_VIEW,
  RISE_AGENT_TASKS_READ,
  RISE_AGENT_DETAILS_READ,
  RISE_AGENT_CONFIG_READ,
  RISE_AGENT_LOGS_READ,
  RISE_AGENT_ACCORDION,
  RISE_AGENT_ACCORDION_AGENT,
  RISE_AGENT_ACCORDION_SUPERVISOR,
  RISE_AGENT_ACCORDION_CYBERSPHERE,
  RISE_AGENT_ACCORDION_INSIGHTS,
  RISE_AGENT_ACCORDION_WORKFLOW,
  RISE_AGENT_VERSIONMANAGEMENT_VIEW,
  RISE_AGENT_VERSIONMANAGEMENT_EDIT,
  RISE_AGENT_DOWNLOAD_TO_EXCEL,
  RISE_AGENT_UPDATE_ENV,
  RISE_AGENT_GLOBAL_CONFIG_READ,
  RISE_AGENT_GLOBAL_CONFIG_UPDATE,
  RISE_AGENT_USER_AUTHORIZATION_READ,
  RISE_AGENT_USER_AUTHORIZATION_ADDUSER,
  RISE_AGENT_USER_AUTHORIZATION_DELETEUSER,
  RISE_AGENT_PERMISSION_LIST_READ,
  RISE_AGENT_PERMISSION_ADD,
  RISE_AGENT_ASSIGN_PERMISSION,
  RISE_AGENT_DELETE_PERMISSION,
} as const;

export type AgentPermissionLabel =
  (typeof AGENT_PERMISSIONS)[keyof typeof AGENT_PERMISSIONS];

export default AGENT_PERMISSIONS;
