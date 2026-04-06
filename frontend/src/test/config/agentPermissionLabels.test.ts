/**
 * agentPermissionLabels.test.ts
 *
 * Tests that all 12 permission label constants and the AGENT_PERMISSIONS
 * convenience object are correctly defined and match the backend format.
 */

import AGENT_PERMISSIONS, {
  AGENT_PROJECT,
  AGENT_MODULE,
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
} from "../../config/agentPermissionLabels";

describe("agentPermissionLabels", () => {

  // ── Module and project identifiers ────────────────────────────────────────

  it("AGENT_PROJECT is 'agent'", () => {
    expect(AGENT_PROJECT).toBe("agent");
  });

  it("AGENT_MODULE is 'Rise Agent'", () => {
    expect(AGENT_MODULE).toBe("Rise Agent");
  });

  // ── Label format: "<Module> : <action>" ──────────────────────────────────

  it("all labels start with 'Rise Agent : '", () => {
    const allLabels = Object.values(AGENT_PERMISSIONS);
    allLabels.forEach((label) => {
      expect(label).toMatch(/^Rise Agent : /);
    });
  });

  it("no label is undefined or empty", () => {
    const allLabels = Object.values(AGENT_PERMISSIONS);
    allLabels.forEach((label) => {
      expect(label).toBeTruthy();
    });
  });

  // ── Individual constants ──────────────────────────────────────────────────

  it("RISE_AGENT_READ is 'Rise Agent : read'", () =>
    expect(RISE_AGENT_READ).toBe("Rise Agent : read"));

  it("RISE_AGENT_WRITE is 'Rise Agent : write'", () =>
    expect(RISE_AGENT_WRITE).toBe("Rise Agent : write"));

  it("RISE_AGENT_START is 'Rise Agent : start'", () =>
    expect(RISE_AGENT_START).toBe("Rise Agent : start"));

  it("RISE_AGENT_STOP is 'Rise Agent : stop'", () =>
    expect(RISE_AGENT_STOP).toBe("Rise Agent : stop"));

  it("RISE_AGENT_RESTART is 'Rise Agent : restart'", () =>
    expect(RISE_AGENT_RESTART).toBe("Rise Agent : restart"));

  it("RISE_AGENT_UPGRADE is 'Rise Agent : upgrade'", () =>
    expect(RISE_AGENT_UPGRADE).toBe("Rise Agent : upgrade"));

  it("RISE_AGENT_SYNC_CONFIG is 'Rise Agent : sync_config'", () =>
    expect(RISE_AGENT_SYNC_CONFIG).toBe("Rise Agent : sync_config"));

  it("RISE_AGENT_CHECK_STATUS is 'Rise Agent : check_status'", () =>
    expect(RISE_AGENT_CHECK_STATUS).toBe("Rise Agent : check_status"));

  it("RISE_AGENT_ENV_UPGRADE is 'Rise Agent : env_upgrade'", () =>
    expect(RISE_AGENT_ENV_UPGRADE).toBe("Rise Agent : env_upgrade"));

  it("RISE_AGENT_JOB_START is 'Rise Agent : job_start'", () =>
    expect(RISE_AGENT_JOB_START).toBe("Rise Agent : job_start"));

  it("RISE_AGENT_JOB_STOP is 'Rise Agent : job_stop'", () =>
    expect(RISE_AGENT_JOB_STOP).toBe("Rise Agent : job_stop"));

  it("RISE_AGENT_JOB_RESTART is 'Rise Agent : job_restart'", () =>
    expect(RISE_AGENT_JOB_RESTART).toBe("Rise Agent : job_restart"));

  // ── AGENT_PERMISSIONS convenience object ──────────────────────────────────

  it("AGENT_PERMISSIONS has exactly 12 entries", () => {
    expect(Object.keys(AGENT_PERMISSIONS)).toHaveLength(12);
  });

  it("default export (AGENT_PERMISSIONS) contains all 12 label constants", () => {
    expect(AGENT_PERMISSIONS.RISE_AGENT_READ).toBe(RISE_AGENT_READ);
    expect(AGENT_PERMISSIONS.RISE_AGENT_WRITE).toBe(RISE_AGENT_WRITE);
    expect(AGENT_PERMISSIONS.RISE_AGENT_START).toBe(RISE_AGENT_START);
    expect(AGENT_PERMISSIONS.RISE_AGENT_STOP).toBe(RISE_AGENT_STOP);
    expect(AGENT_PERMISSIONS.RISE_AGENT_RESTART).toBe(RISE_AGENT_RESTART);
    expect(AGENT_PERMISSIONS.RISE_AGENT_UPGRADE).toBe(RISE_AGENT_UPGRADE);
    expect(AGENT_PERMISSIONS.RISE_AGENT_SYNC_CONFIG).toBe(RISE_AGENT_SYNC_CONFIG);
    expect(AGENT_PERMISSIONS.RISE_AGENT_CHECK_STATUS).toBe(RISE_AGENT_CHECK_STATUS);
    expect(AGENT_PERMISSIONS.RISE_AGENT_ENV_UPGRADE).toBe(RISE_AGENT_ENV_UPGRADE);
    expect(AGENT_PERMISSIONS.RISE_AGENT_JOB_START).toBe(RISE_AGENT_JOB_START);
    expect(AGENT_PERMISSIONS.RISE_AGENT_JOB_STOP).toBe(RISE_AGENT_JOB_STOP);
    expect(AGENT_PERMISSIONS.RISE_AGENT_JOB_RESTART).toBe(RISE_AGENT_JOB_RESTART);
  });

  // ── No duplicate labels ────────────────────────────────────────────────────

  it("all label values are unique (no duplicates)", () => {
    const values = Object.values(AGENT_PERMISSIONS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});
