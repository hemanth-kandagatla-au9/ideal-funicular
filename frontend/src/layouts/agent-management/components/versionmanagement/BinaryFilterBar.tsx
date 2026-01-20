// BinaryFilterBar.tsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import crossBlack from "../../../../images/agent-management/assets/crossBlack.svg";
import MultiSelectDropdown from "../MultiSelectDropdown";

interface BinaryFilterBarProps {
  osOptions: string[];
  versionOptions: string[];
  typeOptions: string[];
  filters: {
    os: string[];
    versions: string[];
    types: string[];
  };
  setFilters: (newFilters: { os: string[]; versions: string[]; types: string[] }) => void;
}

const BinaryFilterBar: React.FC<BinaryFilterBarProps> = ({ osOptions, versionOptions, typeOptions, filters, setFilters }) => {
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

  const handleSelectChange = (key: string, selectedOptions: any[]) => {
    const isSelectAllClicked = selectedOptions.some(opt => opt.value === "select-all");

    if (isSelectAllClicked) {
      const allOptions = key === "os" ? osOptions : key === "versions" ? versionOptions : typeOptions;
      const allSelected = selectedOptions.length - 1 === allOptions.length;

      setFilters({
        ...filters,
        [key]: allSelected ? [] : allOptions,
      });
    } else {
      const filteredOptions = selectedOptions.filter(opt => opt.value !== "select-all").map(opt => opt.value);

      setFilters({
        ...filters,
        [key]: filteredOptions,
      });
    }
  };

  const clearAll = (key: string) => {
    setFilters({
      ...filters,
      [key]: [],
    });
  };

  const selectAll = (key: string) => {
    const allOptions = key === "os" ? osOptions : key === "versions" ? versionOptions : typeOptions;

    setFilters({
      ...filters,
      [key]: allOptions,
    });
  };

  const toggleDropdown = (key: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filterLabels: Record<string, string> = {
    os: "All OS",
    versions: "All Versions",
    types: "All Types",
  };

  const selectedFilters = Object.entries(filters)
    .filter(([, val]) => val.length > 0)
    .map(([key, values]) => ({
      key,
      values,
      label: filterLabels[key] || key,
    }));

  return (
    <div style={{ margin: "16px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {/* OS Dropdown */}
            <MultiSelectDropdown
              key="os"
              dropDownName="All OS"
              id="dropdown-os"
              dataOptions={[
                { label: "Select All", value: "select-all", name: "select-all" },
                ...osOptions.map(opt => ({
                  label: opt,
                  value: opt,
                  name: opt,
                })),
              ]}
              value={filters.os.map(opt => ({ label: opt, value: opt, name: opt }))}
              onSelectChange={(selected: any) => handleSelectChange("os", selected)}
              clearAll={() => clearAll("os")}
              selectAllOption={() => selectAll("os")}
              open={!!dropdownOpen["os"]}
              toggleOpen={() => toggleDropdown("os")}
            />

            {/* Versions Dropdown */}
            <MultiSelectDropdown
              key="versions"
              dropDownName="All Versions"
              id="dropdown-versions"
              dataOptions={[
                { label: "Select All", value: "select-all", name: "select-all" },
                ...versionOptions.map(opt => ({
                  label: opt,
                  value: opt,
                  name: opt,
                })),
              ]}
              value={filters.versions.map(opt => ({ label: opt, value: opt, name: opt }))}
              onSelectChange={(selected: any) => handleSelectChange("versions", selected)}
              clearAll={() => clearAll("versions")}
              selectAllOption={() => selectAll("versions")}
              open={!!dropdownOpen["versions"]}
              toggleOpen={() => toggleDropdown("versions")}
            />

            {/* Types Dropdown */}
            <MultiSelectDropdown
              key="types"
              dropDownName="All Types"
              id="dropdown-types"
              dataOptions={[
                { label: "Select All", value: "select-all", name: "select-all" },
                ...typeOptions.map(opt => ({
                  label: opt,
                  value: opt,
                  name: opt,
                })),
              ]}
              value={filters.types.map(opt => ({ label: opt, value: opt, name: opt }))}
              onSelectChange={(selected: any) => handleSelectChange("types", selected)}
              clearAll={() => clearAll("types")}
              selectAllOption={() => selectAll("types")}
              open={!!dropdownOpen["types"]}
              toggleOpen={() => toggleDropdown("types")}
            />
          </div>
        </div>
      </div>

      {selectedFilters.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {selectedFilters.map(({ key, values, label }) => (
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
              <span>{label}:</span>
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
                title={values.join(", ")}
              >
                {values.join(", ")}
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

          <Button
            onClick={() => {
              setFilters({
                os: [],
                versions: [],
                types: [],
              });
            }}
            style={{
              background: "none",
              border: "none",
              color: "#2961F4",
              fontFamily: "Johnson Text",
              cursor: "pointer",
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default BinaryFilterBar;
