/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import startIcon from "../../../images/agent-management/assets/startIcon.svg";
import stopIcon from "../../../images/agent-management/assets/Stop.svg";
import restartIcon from "../../../images/agent-management/assets/Restart.svg";
import HistoryIcon from "../../../images/agent-management/assets/History.svg";
import downloadIcon from "../../../images/agent-management/assets/download.svg";
import crossBlack from "../../../images/agent-management/assets/crossBlack.svg";
import syncIcon from "../../../images/agent-management/assets/Sync.svg";
import envUpgradeIcon from "../../../images/agent-management/assets/EnvUpgrade.svg";
import {
  restartAgentButtonText,
  startAgentButtonText,
  stopAgentButtonText,
  checkStatusAgentButtonText,
  upgradeAgentText,
  envUpgradeButtonText,
  downloadToExcelButtonText,
  clearAllButtonText,
  syncAgentConfigButtonText,
} from "../../../constants/strings";
import useAgentPermissions from "../../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../../config/agentPermissionLabels";
import { DropdownOption, FilteredData } from "@/types/AgentManagementState";

interface FilterOption {
  name: string;
  [key: string]: any; 
}

interface SelectedOption {
  label: string;
  value: string;
  name: string;
}

interface FilterOptions {
  [key: string]: FilterOption[];
}

interface FilterBarProps {
  filterOptions: FilterOptions;
  filters: FilteredData;
  setFilters: (newFilters: Partial<FilteredData>) => void;
  handleCustomFilterCallback: (e: DropdownOption[] | any, catName: keyof FilteredData, displayName: string) => Promise<void>;
  clearFilters: () => void;
  isStartAgentEnabled: boolean;
  isStopAgentEnabled: boolean;
  isRestartAgentEnabled: boolean;
  isCheckStatusAgentEnabled: boolean;
  isForceUpgradeAgentEnabled: boolean;
  startAgents: () => void;
  stopAgents: () => void;
  restartAgents: () => void;
  healthCheckAgents: () => void;
  openAgentUpgradeModal: () => void;
  openEnvUpgradeModal: () => void;
  syncAgentConfig: () => void;
  downloadToExcel: () => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc' | null) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  filters,
  setFilters,
  handleCustomFilterCallback,
  clearFilters,
  isStartAgentEnabled,
  isStopAgentEnabled,
  isRestartAgentEnabled,
  isCheckStatusAgentEnabled,
  isForceUpgradeAgentEnabled,
  startAgents,
  stopAgents,
  restartAgents,
  healthCheckAgents,
  openAgentUpgradeModal,
  openEnvUpgradeModal,
  downloadToExcel,
  syncAgentConfig,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const { hasPermission } = useAgentPermissions();
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    if (sortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

    const handleSortClick = (field: string) => {
    
    if (sortBy === field) {
      if (sortOrder === 'asc') {
        onSortChange(field, 'desc');
      } else if (sortOrder === 'desc') {
        onSortChange('', null);
      } else {
        onSortChange(field, 'asc');
      }
    } else {
      onSortChange(field, 'asc');
    }
    setSortDropdownOpen(false);
  };

  const handleSelectChange = (
  key: string,
  selectedOptions: SelectedOption[],
  event?: any
) => {

  // Ignore Enter / Space when select-all is auto-selected
  if (
    event?.type === "keydown" &&
    (event.key === "Enter" || event.key === " ") &&
    selectedOptions.some(opt => opt.value === "select-all")
  ) {
    return;
  }

  const allRegularOptions = filterOptions[key].map(opt => ({
    label: opt.name,
    value: opt.name,
    name: opt.name,
  }));

  const isSelectAllClicked = selectedOptions.some(opt => opt.value === "select-all");

  if (isSelectAllClicked) {
    const allSelected = selectedOptions.length - 1 === allRegularOptions.length;
    const newValue = allSelected ? [] : allRegularOptions;

    setFilters(prev => ({
      ...prev,
      [key]: newValue,
    }));

    handleCustomFilterCallback(newValue, key, key);
  } else {
    const filteredOptions = selectedOptions.filter(opt => opt.value !== "select-all");

    setFilters(prev => ({
      ...prev,
      [key]: filteredOptions,
    }));

    handleCustomFilterCallback(filteredOptions, key, key);
  }
};

  const clearAll = (key: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: [],
    }));
    handleCustomFilterCallback([], key, key);
  };

  const selectAll = (key: string) => {
    const allOptions = filterOptions[key].map(opt => ({
      label: opt.name,
      value: opt.name,
      name: opt.name,
    }));
    setFilters(prev => ({
      ...prev,
      [key]: allOptions,
    }));
    handleCustomFilterCallback(allOptions, key, key);
  };

  const toggleDropdown = (key: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filterLabels: Record<string, string> = {
    os: "OS",
    region: "Region",
    serviceName: "Service Name",
    agentVersions: "RISEAGENT Versions",
    platform: "Platform",
    environment: "Environment",
    sid: "SID",
  };

  const selectedFilters = Object.entries(filters).filter(([, val]) => val.length > 0);

  return (
    <div style={{ margin: "16px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {Object.entries(filterOptions).map(([key, options]) => (
              <MultiSelectDropdown
                key={key}
                dropDownName={filterLabels[key] || key}
                id={`dropdown-${key}`}
                dataOptions={[
                  {
                    label: "Select All",
                    value: "select-all",
                    name: "select-all",
                  },
                  ...options.map(opt => ({
                    label: opt.name,
                    value: opt.name,
                    name: opt.name,
                  })),
                ]}
                value={filters[key] || []}
               onSelectChange={(selected: SelectedOption[], event: any) =>handleSelectChange(key, selected, event)}
                clearAll={() => clearAll(key)}
                selectAllOption={() => selectAll(key)}
                open={!!dropdownOpen[key]}
                toggleOpen={() => toggleDropdown(key)}
                toggleTestId={`toggle-${key}`}
                selectTestId={`select-${key}`}
                clearTestId={`clear-${key}`}
                applyTestId={`apply-${key}`}
                applyDisabled={false}
              />
            ))}
          </div>
        </div>

        {}
        <div className="riseagent-hostAgentColoumn">
          <div className="riseagent-btnsWrapper d-flex flex-wrap justify-content-end" style={{ gap: "8px" }}>
            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_START) && (
              <div className="riseagent-executionBtnsSection">
                <Button variant="outline" data-testid="agentStartBtn" title={startAgentButtonText} onClick={startAgents} style={{ padding: "5px" }}>
                  <img src={startIcon} alt="Start" />
                </Button>
              </div>
            )}
            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_STOP) && (
              <div className="riseagent-executionBtnsSection">
                <Button variant="outline" data-testid="agentStopBtn" title={stopAgentButtonText} onClick={stopAgents} style={{ padding: "5px" }}>
                  <img src={stopIcon} alt="stop" />
                </Button>
              </div>
            )}
            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_RESTART) && (
              <div className="riseagent-executionBtnsSection">
                <Button variant="outline" className="riseagent-restartAllBtn" data-testid="agentRestartBtn" title={restartAgentButtonText} onClick={restartAgents} style={{ padding: "5px" }}>
                  <img src={restartIcon} alt="restart" />
                </Button>
              </div>
            )}

            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_SYNC_CONFIG) && (
              <div className="riseagent-executionBtnsSection">
                <Button
                  variant="outline"
                  data-testid="syncAgentConfigRowBtn"
                  title={syncAgentConfigButtonText}
                  onClick={syncAgentConfig}
                  style={{ padding: "5px" }}
                >
                  <img src={syncIcon} alt="sync agent config" />
                </Button>
              </div>
            )}
            
            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_ENV_UPGRADE) && (
              <div className="riseagent-executionBtnsSection">
                <Button
                  variant="outline"
                  className="riseagent-envUpgradeBtn"
                  data-testid="envUpgradeBtn"
                  title={envUpgradeButtonText}
                  onClick={openEnvUpgradeModal}
                  style={{ padding: "5px" }}
                >
                  <img src={envUpgradeIcon} alt="env upgrade" />
                </Button>
              </div>
            )}

            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_UPGRADE) && (
              <div className="riseagent-executionBtnsSection">
                <Button variant="outline" className="riseagent-updateAllBtn" data-testid="agentUpdateBtn" title={upgradeAgentText} onClick={openAgentUpgradeModal} style={{ padding: "5px" }}>
                  <img src={HistoryIcon} alt="Upgrade" />
                </Button>
              </div>
            )}
            <div className="riseagent-executionBtnsSection" style={{ position: 'relative' }} ref={sortDropdownRef}>
              <Button
                variant="outline"
                className="riseagent-sortBtn"
                data-testid="agentSortBtn"
                title="Sort agents"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                style={{ padding: "5px", position: 'relative' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7L7 4L10 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7 4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M16 13L13 16L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M13 16V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </Button>
              {sortDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    minWidth: '180px',
                  }}
                >
                  <div className="riseagent-sortDropdownHeader">
                    Sort By
                  </div>
                  <div
                    onClick={() => handleSortClick('createdAt')}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'Johnson Text',
                      fontSize: '14px',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    <span>Created At</span>
                    {sortBy === 'createdAt' && sortOrder && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div
                    onClick={() => handleSortClick('hostname')}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'Johnson Text',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    <span>Hostname</span>
                    {sortBy === 'hostname' && sortOrder && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_DOWNLOAD_TO_EXCEL) && (
              <div className="riseagent-executionBtnsSection">
                <Button
                  variant="outline"
                  className="riseagent-downloadBtn"
                  data-testid="agentDownloadBtn"
                  title={downloadToExcelButtonText}
                  onClick={downloadToExcel}
                  style={{ padding: "5px" }}
                >
                  <img src={downloadIcon} alt="Download" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFilters.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {selectedFilters.map(([key, values]) => (
            <div
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minWidth: 0,
                backgroundColor: "#F8F6FF",
                border: "1px solid #EEEEEE",
                color: "#39465f",
                padding: "4px 12px",
                borderRadius: "8px",
                gap: "8px",
                fontSize: "14px",
                fontFamily: "Johnson Text",
              }}
            >
              <span>{filterLabels[key] || key}:</span>
              <span
                onClick={() => toggleDropdown(key)}
                style={{
                  display: "inline-block",
                  maxWidth: "100px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
                title={values.map(v => v.label || v.value).join(", ")}
              >
                {values.map(v => v.label || v.value).join(", ")}
              </span>
              <Button
                onClick={() => clearAll(key)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "4px",
                  padding: 0,
                  color: "#1890ff",
                }}
              >
                <img src={crossBlack} alt="Remove" />
              </Button>
            </div>
          ))}

          <Button onClick={clearFilters} style={{ background: "none", border: "none", color: "#2961F4", fontFamily: "Johnson Text", cursor: "pointer" }}>
            {clearAllButtonText}
          </Button>
          
        </div>
      )}
    </div>
  );
};

export default FilterBar;

