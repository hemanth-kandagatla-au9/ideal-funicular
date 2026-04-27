import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Radio, RadioGroup, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
}

const BulkActionFilterDialog: React.FC<BulkActionFilterProps> = ({
  open,
  onClose,
  onApply,
  availableTypes,
  availableUsers,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, open]);

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type],
    }));
  };

  const handleUserToggle = (user: string) => {
    setFilters(prev => ({
      ...prev,
      user: prev.user.includes(user)
        ? prev.user.filter(u => u !== user)
        : [...prev.user, user],
    }));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, status: event.target.value }));
  };

  const handleRemoveType = (type: string) =>
    setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }));

  const handleRemoveUser = (user: string) =>
    setFilters(prev => ({ ...prev, user: prev.user.filter(u => u !== user) }));

  const handleClearAll = () => setFilters({ type: [], user: [], status: "" });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const statusOptions = ["Completed", "Partial", "Failed"];

  // Native styled checkbox — avoids MUI ButtonBase ripple entirely
  const StyledCheckbox: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{
        width: "15px",
        height: "15px",
        minWidth: "15px",
        cursor: "pointer",
        accentColor: "#4A90E2",
        margin: "0 8px 0 0",
        flexShrink: 0,
      }}
    />
  );

  const chipSx = {
    height: "22px",
    fontSize: "10px",
    fontWeight: 600,
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    borderRadius: "4px",
    border: "1px solid #BFDBFE",
    "& .MuiChip-deleteIcon": {
      color: "#93C5FD",
      fontSize: "13px",
      transition: "color 0.15s",
      "&:hover": { color: "#1D4ED8" },
    },
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "48px",
        right: "0px",
        zIndex: 1000,
        backgroundColor: "#ffffff",
        width: "340px",
        borderRadius: "8px",
        boxShadow: "0px 8px 24px rgba(74,144,226,0.15), 0px 4px 12px rgba(0,0,0,0.1)",
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
          fontSize: "13px",
          fontWeight: 700,
          color: "#0e121b",
          background: "linear-gradient(to bottom, #fafafa, #ffffff)",
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
          <CloseIcon sx={{ fontSize: "18px" }} />
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          maxHeight: "380px",
          overflowY: "auto",
          padding: "14px",
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#e0e0e0",
            borderRadius: "3px",
            "&:hover": { background: "#d0d0d0" },
          },
        }}
      >
        {/* TYPE - Checkboxes */}
        <Box>
          <Box
            sx={{
              mb: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#0e121b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Type
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {availableTypes.map(type => (
              <Box
                key={type}
                component="label"
                sx={{
                  display: "flex", alignItems: "center", gap: "0",
                  cursor: "pointer", padding: "2px 0",
                  fontSize: "12px", color: "#374151", fontWeight: 500,
                  userSelect: "none",
                  "&:hover": { color: "#111827" },
                }}
              >
                <StyledCheckbox
                  checked={filters.type.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                />
                {type}
              </Box>
            ))}
          </Box>

          {/* Selected type chips */}
          {filters.type.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px", mt: "8px" }}>
              {filters.type.map(t => (
                <Chip key={t} label={t} onDelete={() => handleRemoveType(t)} size="small" sx={chipSx} />
              ))}
            </Box>
          )}
        </Box>

        {/* USER - Checkboxes */}
        <Box>
          <Box
            sx={{
              mb: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#0e121b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            User
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {availableUsers.map(user => (
              <Box
                key={user}
                component="label"
                sx={{
                  display: "flex", alignItems: "center", gap: "0",
                  cursor: "pointer", padding: "2px 0",
                  fontSize: "12px", color: "#374151", fontWeight: 500,
                  userSelect: "none",
                  "&:hover": { color: "#111827" },
                }}
              >
                <StyledCheckbox
                  checked={filters.user.includes(user)}
                  onChange={() => handleUserToggle(user)}
                />
                {user}
              </Box>
            ))}
          </Box>

          {/* Selected user chips */}
          {filters.user.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px", mt: "8px" }}>
              {filters.user.map(u => (
                <Chip key={u} label={u} onDelete={() => handleRemoveUser(u)} size="small" sx={chipSx} />
              ))}
            </Box>
          )}
        </Box>

        {/* STATUS - Horizontal radio */}
        <Box>
          <Box
            sx={{
              mb: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#0e121b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Status
          </Box>

          <RadioGroup
            row
            value={filters.status}
            onChange={handleStatusChange}
            sx={{ gap: "0px", flexWrap: "wrap" }}
          >
            {statusOptions.map(status => (
              <FormControlLabel
                key={status}
                value={status}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#d1d5db",
                      padding: "3px",
                      "&.Mui-checked": { color: "#4A90E2" },
                    }}
                  />
                }
                label={status}
                sx={{
                  margin: "0",
                  marginRight: "12px",
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
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderTop: "1px solid #f0f0f0",
          background: "linear-gradient(to top, #fafafa, #ffffff)",
        }}
      >
        <Box
          component="button"
          onClick={handleClearAll}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            fontSize: "11px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            "&:hover": { color: "#374151" },
          }}
        >
          Clear All
        </Box>
        <Box sx={{ display: "flex", gap: "7px" }}>
          <Box
            component="button"
            onClick={onClose}
            sx={{
              background: "#f0f7ff",
              border: "1px solid #d0e8ff",
              color: "#4A90E2",
              fontSize: "11px",
              borderRadius: "4px",
              padding: "5px 11px",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#e6f2ff", borderColor: "#4A90E2", color: "#2E5DB8" },
            }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            onClick={handleApply}
            sx={{
              background: "#4A90E2",
              color: "white",
              border: "none",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "4px",
              padding: "5px 11px",
              cursor: "pointer",
              boxShadow: "0px 2px 8px rgba(74,144,226,0.3)",
              "&:hover": {
                backgroundColor: "#357ABD",
                boxShadow: "0px 4px 14px rgba(74,144,226,0.4)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Apply
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BulkActionFilterDialog;
