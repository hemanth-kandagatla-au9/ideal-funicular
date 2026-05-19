import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface BulkActionFilterProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  availableTypes: string[];
  availableUsers: string[];
  currentFilters: FilterState;
}

export interface FilterState {
  type: string[];
  user: string[];
  status: string;
  dateRange: { from: string; to: string };
}

const BulkActionFilterDialog: React.FC<BulkActionFilterProps> = ({ open, onClose, onApply, availableTypes, availableUsers, currentFilters }) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [typeExpanded, setTypeExpanded] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);

  const handleDateChange = (field: "from" | "to", value: string) => {
    setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, [field]: value } }));
  };

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, open]);

  useEffect(() => {
    if (!open) {
      setTypeExpanded(false);
      setUserExpanded(false);
    }
  }, [open]);

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type) ? prev.type.filter(t => t !== type) : [...prev.type, type],
    }));
  };

  const handleUserToggle = (user: string) => {
    setFilters(prev => ({
      ...prev,
      user: prev.user.includes(user) ? prev.user.filter(u => u !== user) : [...prev.user, user],
    }));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, status: event.target.value }));
  };

  const handleClearAll = () => {
    setFilters({ type: [], user: [], status: "", dateRange: { from: "", to: "" } });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const statusOptions = ["Completed", "Partial", "Failed"];
  if (!open) return null;

  const sectionLabelSx = {
    mb: "4px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#0e121b",
  };

  const renderAccordionSection = (label: string, items: string[], selected: string[], onToggle: (val: string) => void, expanded: boolean, setExpanded: (v: boolean) => void) => {
    const hasSelection = selected.length > 0;
    return (
      <Box>
        <Box sx={sectionLabelSx}>{label}</Box>
        <Box
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${expanded ? "#2961F4" : "#d1d5db"}`,
            borderRadius: expanded ? "10px 10px 0 0" : "10px",
            height: "36px",
            padding: "0 10px",
            cursor: "pointer",
            backgroundColor: "#fff",
            transition: "border-color 0.15s",
            "&:hover": { borderColor: "#2961F4" },
          }}
        >
          <Box
            sx={{
              fontSize: "13px",
              color: hasSelection ? "#0e121b" : "#9CA3AF",
              fontWeight: hasSelection ? 600 : 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              mr: 1,
            }}
          >
            {hasSelection ? `${selected.length} selected` : label}
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              fontSize: "16px",
              color: "#9CA3AF",
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          />
        </Box>

        {expanded && (
          <Box
            sx={{
              border: "1px solid #2961F4",
              borderTop: "none",
              borderRadius: "0 0 10px 10px",
              backgroundColor: "#fff",
              maxHeight: "96px",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "3px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "#e0e0e0", borderRadius: "2px" },
            }}
          >
            {items.map((item, idx) => {
              const isChecked = selected.includes(item);
              return (
                <Box
                  key={item}
                  onClick={() => onToggle(item)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "28px",
                    padding: "0 10px",
                    cursor: "pointer",
                    borderTop: idx === 0 ? "1px solid #f0f4ff" : "none",
                    borderBottom: idx < items.length - 1 ? "1px solid #f0f4ff" : "none",
                    backgroundColor: isChecked ? "#F5F8FF" : "transparent",
                    "&:hover": { backgroundColor: "#EEF4FF" },
                    "&:last-child": { borderRadius: "0 0 9px 9px" },
                    userSelect: "none",
                  }}
                >
                  <Box sx={{ width: 12, height: 12, flexShrink: 0, mr: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isChecked ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="16" height="16" rx="3" fill="#2961F4" />
                        <path d="M3.5 8L6.5 11L12.5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" fill="white" stroke="#d1d5db" />
                      </svg>
                    )}
                  </Box>
                  <Box sx={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>{item}</Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  const dateInputSx = (hasValue: boolean) => ({
    height: "32px",
    padding: "0 8px",
    border: `1px solid ${hasValue ? "#2961F4" : "#d1d5db"}`,
    borderRadius: "8px",
    fontSize: "12px",
    color: hasValue ? "#0e121b" : "#9CA3AF",
    backgroundColor: "#fff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
    fontFamily: "inherit",
    "&:focus": { borderColor: "#2961F4", boxShadow: "0 0 0 2px rgba(41,97,244,0.08)" },
    "&::-webkit-calendar-picker-indicator": { cursor: "pointer", opacity: 0.5, width: "12px", height: "12px" },
  });

  return (
    <Box
      sx={{
        position: "absolute",
        top: "44px",
        right: "0px",
        zIndex: 1000,
        backgroundColor: "#ffffff",
        width: "300px",
        borderRadius: "14px",
        boxShadow: "0px 12px 30px rgba(41,97,244,0.12), 0px 6px 18px rgba(0,0,0,0.08)",
        border: "1px solid #e8f0ff",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderBottom: "1px solid #f0f0f0",
          fontSize: "16px",
          fontWeight: 700,
          color: "#0e121b",
          borderRadius: "14px 14px 0 0",
        }}
      >
        <span>Filter</span>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
            color: "#999",
            "&:hover": { color: "#4A90E2" },
          }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px 14px",
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "#e0e0e0", borderRadius: "2px" },
        }}
      >
        {/* TYPE */}
        {renderAccordionSection("Type", availableTypes, filters.type, handleTypeToggle, typeExpanded, setTypeExpanded)}

        {/* USER */}
        {renderAccordionSection("User", availableUsers, filters.user, handleUserToggle, userExpanded, setUserExpanded)}

        {/* DATE RANGE */}
        <Box>
          <Box sx={sectionLabelSx}>Date Range</Box>
          <Box sx={{ display: "flex", gap: "8px" }}>
            {(["from", "to"] as const).map(field => (
              <Box key={field} sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                <Box sx={{ fontSize: "11px", color: "#6B7280", fontWeight: 500 }}>{field === "from" ? "From" : "To"}</Box>
                <Box
                  component="input"
                  type="date"
                  value={filters.dateRange?.[field] || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(field, e.target.value)}
                  sx={dateInputSx(!!filters.dateRange?.[field])}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* STATUS */}
        <Box>
          <Box sx={sectionLabelSx}>Status</Box>
          <RadioGroup row value={filters.status} onChange={handleStatusChange} sx={{ gap: "0px", flexWrap: "wrap" }}>
            {statusOptions.map(status => (
              <FormControlLabel
                key={status}
                value={status}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#d1d5db",
                      padding: "2px",
                      "& .MuiSvgIcon-root": { fontSize: "16px" },
                      "&.Mui-checked": { color: "#2961F4" },
                    }}
                  />
                }
                label={status}
                sx={{
                  margin: "0",
                  marginRight: "10px",
                  "& .MuiTypography-root": { fontSize: "12px", color: "#374151", fontWeight: 500 },
                }}
              />
            ))}
          </RadioGroup>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          padding: "8px 14px",
          borderTop: "1px solid #f0f0f0",
          borderRadius: "0 0 14px 14px",
        }}
      >
        <Box
          component="button"
          onClick={handleClearAll}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 4px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#2961F4",
            "&:hover": { color: "#174FD1" },
          }}
        >
          Clear All
        </Box>
        <Box
          component="button"
          onClick={handleApply}
          sx={{
            background: "#2961F4",
            color: "white",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "20px",
            padding: "6px 20px",
            cursor: "pointer",
            boxShadow: "0px 2px 8px rgba(41,97,244,0.25)",
            "&:hover": {
              backgroundColor: "#174FD1",
              boxShadow: "0px 4px 14px rgba(41,97,244,0.35)",
            },
          }}
        >
          Apply
        </Box>
      </Box>
    </Box>
  );
};

export default BulkActionFilterDialog;
