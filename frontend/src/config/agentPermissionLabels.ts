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


// READ  → controls VIEW access: agent details, config, log accordions.
//          Also used as the fallback check before showing any agent section.
export const RISE_AGENT_READ  = 'Rise Agent : read';
export const RISE_AGENT_WRITE = 'Rise Agent : write';

// ── Agent-level operations ────────────────────────────────────────────────────
export const RISE_AGENT_START        = 'Rise Agent : start';
export const RISE_AGENT_STOP         = 'Rise Agent : stop';
export const RISE_AGENT_RESTART      = 'Rise Agent : restart';
export const RISE_AGENT_UPGRADE      = 'Rise Agent : upgrade';
export const RISE_AGENT_SYNC_CONFIG  = 'Rise Agent : sync_config';
export const RISE_AGENT_CHECK_STATUS = 'Rise Agent : check_status';
export const RISE_AGENT_ENV_UPGRADE  = 'Rise Agent : env_upgrade';

// ── Job-level operations ──────────────────────────────────────────────────────
export const RISE_AGENT_JOB_START   = 'Rise Agent : job_start';
export const RISE_AGENT_JOB_STOP    = 'Rise Agent : job_stop';
export const RISE_AGENT_JOB_RESTART = 'Rise Agent : job_restart';

// ── ViewDetails sidebar accordion visibility ──────────────────────────────────
export const RISE_AGENT_TASKS_READ  = "Rise Agent : tasks_read";
export const RISE_AGENT_DETAILS_READ = "Rise Agent : details_read";
export const RISE_AGENT_CONFIG_READ  = "Rise Agent : config_read";
export const RISE_AGENT_LOGS_READ    = "Rise Agent : logs_read";

// ── Convenience object ────────────────────────────────────────────────────────
export const AGENT_PERMISSIONS = {
  RISE_AGENT_READ,
  RISE_AGENT_WRITE,
  RISE_AGENT_START,
  RISE_AGENT_STOP,
  RISE_AGENT_RESTART,
  RISE_AGENT_UPGRADE,
  RISE_AGENT_SYNC_CONFIG,
  RISE_AGENT_CHECK_STATUS,
  RISE_AGENT_ENV_UPGRADE,
  RISE_AGENT_JOB_START,
  RISE_AGENT_JOB_STOP,
  RISE_AGENT_JOB_RESTART,
  RISE_AGENT_TASKS_READ,
  RISE_AGENT_DETAILS_READ,
  RISE_AGENT_CONFIG_READ,
  RISE_AGENT_LOGS_READ,
} as const;

export type AgentPermissionLabel =
  (typeof AGENT_PERMISSIONS)[keyof typeof AGENT_PERMISSIONS];

export default AGENT_PERMISSIONS;
