import { get } from "lodash";
import { useMemo, useState } from "react";
import type { Agent } from "@/types/AgentList";
import useAgentPermissions from "../../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../../config/agentPermissionLabels";

export type HostnameAccordionDetailsProps = {
  agent: Agent & Record<string, any>;
};

type DetailRow = { label: string; value: unknown };

type Section = {
  title: string;
  rows: DetailRow[];
  allRows: DetailRow[];
  remaining: number;
};

const MAX_STRING_LEN = 240;
const MAX_ARRAY_PREVIEW = 5;
const MAX_DEPTH = 2;
const MAX_ROWS_PER_SECTION = 30;

const truncate = (text: string): string => {
  const t = text.trim();
  if (t.length <= MAX_STRING_LEN) return t;
  return `${t.slice(0, MAX_STRING_LEN)}…`;
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string") return value.trim() === "" ? "N/A" : truncate(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const allPrimitive = value.every(v => v === null || ["string", "number", "boolean"].includes(typeof v));
    if (!allPrimitive) return `${value.length} items`;

    const preview = value.slice(0, MAX_ARRAY_PREVIEW).map(v => formatValue(v));
    const suffix = value.length > MAX_ARRAY_PREVIEW ? ` (+${value.length - MAX_ARRAY_PREVIEW} more)` : "";
    return truncate(`${preview.join(", ")}${suffix}`);
  }

  try {
    return truncate(JSON.stringify(value));
  } catch {
    return "[object]";
  }
};

type RawDetailRow = { label: string; value: unknown };

const flattenObjectToRows = (obj: unknown, prefix = "", depth = 0): RawDetailRow[] => {
  if (!obj || typeof obj !== "object") return [];
  if (Array.isArray(obj)) return [{ label: prefix || "Value", value: obj }];

  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return [];

  const rows: RawDetailRow[] = [];
  for (const [key, val] of entries) {
    const label = prefix ? `${prefix}.${key}` : key;

    if (val && typeof val === "object" && !Array.isArray(val) && depth < MAX_DEPTH) {
      const child = flattenObjectToRows(val, label, depth + 1);
      if (child.length > 0) rows.push(...child);
      else rows.push({ label, value: null });
      continue;
    }

    rows.push({ label, value: val });
  }

  return rows;
};

const applyPreferredOrder = (rows: RawDetailRow[], preferredPrefixes: string[]): RawDetailRow[] => {
  if (preferredPrefixes.length === 0) return rows;
  const rankForLabel = (label: string): number => {
    const idx = preferredPrefixes.findIndex(p => label === p || label.startsWith(`${p}.`));
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };
  return [...rows].sort((a, b) => {
    const ra = rankForLabel(a.label);
    const rb = rankForLabel(b.label);
    if (ra !== rb) return ra - rb;
    return a.label.localeCompare(b.label);
  });
};

const capRows = (rows: RawDetailRow[]): { preview: RawDetailRow[]; remaining: number } => {
  if (rows.length <= MAX_ROWS_PER_SECTION) return { preview: rows, remaining: 0 };
  const remaining = rows.length - MAX_ROWS_PER_SECTION;
  return { preview: rows.slice(0, MAX_ROWS_PER_SECTION), remaining };
};

const makeSection = (title: string, obj: unknown, preferredPrefixes: string[]): Section => {
  const ordered = applyPreferredOrder(flattenObjectToRows(obj), preferredPrefixes);
  const { preview, remaining } = capRows(ordered);
  return {
    title,
    rows: preview,
    allRows: ordered,
    remaining,
  };
};

const buildSections = (agent: Agent & Record<string, any>): Section[] => {
  const agentObj = get(agent, "agent_details") ?? {};

  const supervisorObj = get(agent, "supervisor_details") ?? get(agent, "supervisor") ?? {};
  const cybersphereObj = get(agent, "cybersphere") ?? {};
  const insightsObj = get(agent, "insights") ?? {};
  const workflowObj = get(agent, "workflow") ?? {};

  return [
    makeSection("Agent", agentObj, [
      "version",
      "up_time",
      "pid",
      "server_port",
      "agent_env",
      "agent_type",
      "os_name",
      "os_type",
      "os_version",
      "vm_hostname",
      "vm_ip",
      "install_dir",
      "cpu_usage",
      "memory",
      "disk_usage",
      "agent_last_start_time",
      "build_date",
    ]),
    makeSection("Supervisor", supervisorObj, ["version", "up_time", "pid", "server_port", "agent_env", "vm_hostname"]),
    makeSection("Cybersphere", cybersphereObj, ["cybersphere_version", "env", "binary_valid", "profile_script_valid"]),
    makeSection("Insights", insightsObj, ["env", "insights_job_running", "internal_job_running", "insights_job_list", "internal_job_list", "discovery_job_output"]),
    makeSection("Workflow", workflowObj, ["env", "status", "version"]),
  ];
};

const SECTION_PERMISSIONS: Record<string, string> = {
  Agent: AGENT_PERMISSIONS.RISE_AGENT_ACCORDION_AGENT,
  Supervisor: AGENT_PERMISSIONS.RISE_AGENT_ACCORDION_SUPERVISOR,
  Cybersphere: AGENT_PERMISSIONS.RISE_AGENT_ACCORDION_CYBERSPHERE,
  Insights: AGENT_PERMISSIONS.RISE_AGENT_ACCORDION_INSIGHTS,
  Workflow: AGENT_PERMISSIONS.RISE_AGENT_ACCORDION_WORKFLOW,
};

const HostnameAccordionDetails = ({ agent }: HostnameAccordionDetailsProps) => {
  const { hasPermission } = useAgentPermissions();
  const allSections = useMemo(() => buildSections(agent), [agent]);
  const sections = allSections.filter(s => hasPermission(SECTION_PERMISSIONS[s.title]));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (sectionTitle: string, label: string, rawValue: unknown) => {
    const rowKey = `${sectionTitle}::${label}`;
    const isExpanded = !!expandedRows[rowKey];

    if (rawValue === null || rawValue === undefined) return "N/A";

    if (Array.isArray(rawValue)) {
      if (rawValue.length === 0) return "[]";
      const allPrimitive = rawValue.every(v => v === null || ["string", "number", "boolean"].includes(typeof v));
      if (!allPrimitive) return `${rawValue.length} items`;

      const asText = rawValue.map(v => (v === null ? "N/A" : String(v)));
      if (isExpanded) {
        return (
          <span>
            {asText.join(", ")}
            <span className="riseagent-agentAccordionInlineMore" onClick={() => toggleRow(rowKey)}>
              {"  Show less"}
            </span>
          </span>
        );
      }

      const preview = asText.slice(0, MAX_ARRAY_PREVIEW);
      const remaining = Math.max(0, asText.length - preview.length);
      return (
        <span>
          {truncate(preview.join(", "))}
          {remaining > 0 && (
            <span className="riseagent-agentAccordionInlineMore" onClick={() => toggleRow(rowKey)}>
              {`  +${remaining} more`}
            </span>
          )}
        </span>
      );
    }

    if (typeof rawValue === "string") {
      const text = rawValue.trim();
      if (text === "") return "N/A";

      if (!isExpanded && text.length > MAX_STRING_LEN) {
        return (
          <span>
            {truncate(text)}
            <span className="riseagent-agentAccordionInlineMore" onClick={() => toggleRow(rowKey)}>
              {"  +more"}
            </span>
          </span>
        );
      }

      if (isExpanded && text.length > MAX_STRING_LEN) {
        return (
          <span>
            {text}
            <span className="riseagent-agentAccordionInlineMore" onClick={() => toggleRow(rowKey)}>
              {"  Show less"}
            </span>
          </span>
        );
      }

      return truncate(text);
    }

    if (typeof rawValue === "number" || typeof rawValue === "boolean") {
      return String(rawValue);
    }

    // Objects
    try {
      const json = JSON.stringify(rawValue);
      if (!isExpanded && json.length > MAX_STRING_LEN) {
        return (
          <span>
            {truncate(json)}
            <span className="riseagent-agentAccordionInlineMore" onClick={() => toggleRow(rowKey)}>
              {"  +more"}
            </span>
          </span>
        );
      }

      if (isExpanded && json.length > MAX_STRING_LEN) {
        return (
          <span>
            {json}
            <span className="riseagent-agentAccordionInlineMore" onClick={() => toggleRow(rowKey)}>
              {"  Show less"}
            </span>
          </span>
        );
      }

      return truncate(json);
    } catch {
      return "[object]";
    }
  };

  return (
    <div className="riseagent-agentAccordionPanelInner">
      {sections.map(section => {
        const isExpanded = !!expandedSections[section.title];
        const visibleRows = isExpanded ? section.allRows : section.rows;
        const hasAnyRealValue = visibleRows.some(r => formatValue(r.value) !== "N/A");

        return (
          <div key={section.title} className="riseagent-agentAccordionSection">
            <div className="riseagent-agentAccordionSectionTitle">{section.title}</div>
            {!hasAnyRealValue ? (
              <div className="riseagent-agentAccordionEmpty">No data available</div>
            ) : (
              <div className="riseagent-agentAccordionGrid">
                {visibleRows.map(r => (
                  <div key={`${section.title}-${r.label}`} className="riseagent-agentAccordionRow">
                    <div className="riseagent-agentAccordionLabel">{r.label}</div>
                    <div className="riseagent-agentAccordionValue">{renderValue(section.title, r.label, r.value)}</div>
                  </div>
                ))}

                {section.remaining > 0 && !isExpanded && (
                  <div
                    className="riseagent-agentAccordionMore"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSection(section.title)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") toggleSection(section.title);
                    }}
                  >
                    +{section.remaining} more
                  </div>
                )}

                {section.remaining > 0 && isExpanded && (
                  <div
                    className="riseagent-agentAccordionMore"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSection(section.title)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") toggleSection(section.title);
                    }}
                  >
                    Show less
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HostnameAccordionDetails;
