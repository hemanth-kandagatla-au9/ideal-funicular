import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, FormControlLabel, Radio, RadioGroup, Chip } from "@mui/material";
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

const BulkActionFilterDialog: React.FC<BulkActionFilterProps> = ({ open, onClose, onApply, availableTypes, availableUsers, currentFilters }) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(currentFilters.user || []);

  useEffect(() => {
    setFilters(currentFilters);
    setSelectedUsers(currentFilters.user || []);
  }, [currentFilters, open]);

  const handleTypeChange = (event: any) => {
    const selectedType = event.target.value;
    setFilters(prev => ({
      ...prev,
      type: Array.isArray(selectedType) ? selectedType : [selectedType],
    }));
  };

  const handleStatusChange = (event: any) => {
    const status = event.target.value;
    setFilters(prev => ({
      ...prev,
      status,
    }));
  };

  const handleAddUser = (user: string) => {
    if (!selectedUsers.includes(user)) {
      const updatedUsers = [...selectedUsers, user];
      setSelectedUsers(updatedUsers);
      setFilters(prev => ({
        ...prev,
        user: updatedUsers,
      }));
    }
  };

  const handleRemoveUser = (user: string) => {
    const updatedUsers = selectedUsers.filter(u => u !== user);
    setSelectedUsers(updatedUsers);
    setFilters(prev => ({
      ...prev,
      user: updatedUsers,
    }));
  };

  const handleClearAll = () => {
    setFilters({ type: [], user: [], status: "" });
    setSelectedUsers([]);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const statusOptions = ["Completed", "Partial", "Failed"];

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "48px",
        right: "0px",
        zIndex: 1000,
        backgroundColor: "#ffffff",
        width: "320px",
        borderRadius: "6px",
        boxShadow: "0px 8px 24px rgba(74, 144, 226, 0.15), 0px 4px 12px rgba(0, 0, 0, 0.1)",
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
          padding: "9px 12px",
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
            justifyContent: "center",
            color: "#999",
            transition: "color 0.2s ease",
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
          gap: "10px",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "12px",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#e0e0e0",
            borderRadius: "3px",
            "&:hover": {
              background: "#d0d0d0",
            },
          },
        }}
      >
        {/* Type Section */}
        <Box>
          <Box sx={{ marginBottom: "5px", fontSize: "11px", fontWeight: 700, color: "#0e121b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</Box>
          <Select
            multiple
            value={filters.type}
            onChange={handleTypeChange}
            renderValue={selected => (selected.length > 0 ? selected.join(", ") : "Select")}
            size="small"
            sx={{
              width: "100%",
              fontSize: "11px",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                padding: "6px 8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
                borderWidth: "2px",
              },
            }}
          >
            {availableTypes.map(type => (
              <MenuItem key={type} value={type} sx={{ fontSize: "11px", padding: "6px 12px" }}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* User Section */}
        <Box>
          <Box sx={{ marginBottom: "5px", fontSize: "11px", fontWeight: 700, color: "#0e121b", textTransform: "uppercase", letterSpacing: "0.5px" }}>User</Box>
          <Select
            displayEmpty
            value=""
            onChange={e => {
              const user = e.target.value as string;
              if (user) handleAddUser(user);
            }}
            size="small"
            sx={{
              width: "100%",
              fontSize: "11px",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                padding: "6px 8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
                borderWidth: "2px",
              },
            }}
          >
            {availableUsers
              .filter(user => !selectedUsers.includes(user))
              .map(user => (
                <MenuItem key={user} value={user} sx={{ fontSize: "11px", padding: "6px 12px" }}>
                  {user}
                </MenuItem>
              ))}
          </Select>

          {/* Selected User Chips */}
          {selectedUsers.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "6px" }}>
              {selectedUsers.map(user => (
                <Chip
                  key={user}
                  label={user}
                  onDelete={() => handleRemoveUser(user)}
                  size="small"
                  sx={{
                    height: "22px",
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    "& .MuiChip-deleteIcon": {
                      color: "#999",
                      marginLeft: "1px",
                      fontSize: "14px",
                      transition: "color 0.2s ease",
                      "&:hover": { color: "#4A90E2" },
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Status Section */}
        <Box>
          <Box sx={{ marginBottom: "5px", fontSize: "11px", fontWeight: 700, color: "#0e121b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</Box>
          <RadioGroup
            value={filters.status}
            onChange={handleStatusChange}
            sx={{
              "& .MuiFormControlLabel-root": {
                marginBottom: "4px",
                marginLeft: "0px",
                paddingLeft: "0px",
              },
            }}
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
                      marginRight: "6px",
                      "&.Mui-checked": {
                        color: "#4A90E2",
                      },
                    }}
                  />
                }
                label={status}
                sx={{
                  fontSize: "11px",
                  color: "#374151",
                  fontWeight: 500,
                  margin: "0",
                  "& .MuiTypography-root": {
                    fontSize: "11px",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </Box>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "9px 12px",
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
            transition: "color 0.2s ease",
            "&:hover": {
              color: "#374151",
            },
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
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#4A90E2",
                backgroundColor: "#e6f2ff",
                color: "#2E5DB8",
                boxShadow: "0px 2px 8px rgba(74, 144, 226, 0.15)",
              },
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
              transition: "all 0.2s ease",
              boxShadow: "0px 2px 8px rgba(74, 144, 226, 0.3)",
              "&:hover": {
                backgroundColor: "#357ABD",
                boxShadow: "0px 4px 14px rgba(74, 144, 226, 0.4)",
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
