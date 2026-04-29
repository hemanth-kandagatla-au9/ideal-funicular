import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Radio, RadioGroup, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, SelectChangeEvent, Checkbox } from "@mui/material";
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
      type: prev.type.includes(type) ? prev.type.filter(t => t !== type) : [...prev.type, type],
    }));
  };

  const handleUserToggle = (user: string) => {
    setFilters(prev => ({
      ...prev,
      user: prev.user.includes(user) ? prev.user.filter(u => u !== user) : [...prev.user, user],
    }));
  };

  const handleTypeSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as unknown as string[];
    setFilters(prev => ({ ...prev, type: Array.isArray(value) ? value : [value] }));
  };

  const handleUserSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as unknown as string[];
    setFilters(prev => ({ ...prev, user: Array.isArray(value) ? value : [value] }));
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

  // Provide fallback mock data when callers don't pass available types/users
  const types = Array.isArray(availableTypes) && availableTypes.length > 0
    ? availableTypes
    : ["Import", "Export", "Delete"];

  const users = Array.isArray(availableUsers) && availableUsers.length > 0
    ? availableUsers
    : ["Alice", "Bob", "Charlie"];

  // NOTE: Removed native StyledCheckbox — replaced lists with Select dropdowns

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
        borderRadius: "16px",
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

          <FormControl fullWidth size="small">
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              multiple
              value={filters.type}
              onChange={handleTypeSelectChange}
              input={<OutlinedInput label="Type" />}
              sx={{
                borderRadius: '12px',
                height: '44px',
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' },
                '& .MuiSelect-select': { padding: '12px 14px', display: 'flex', alignItems: 'center' },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.length === 0 ? (
                    <Box sx={{ color: '#9CA3AF', fontSize: '12px' }}>Select</Box>
                  ) : (
                    selected.map((value) => (
                      <Chip key={value} label={value} onDelete={() => handleRemoveType(value)} size="small" sx={chipSx} />
                    ))
                  )}
                </Box>
              )}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox
                    size="small"
                    checked={filters.type.includes(type)}
                    sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#2961F4' }, marginRight: '8px' }}
                  />
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

          <FormControl fullWidth size="small">
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
              labelId="user-select-label"
              multiple
              value={filters.user}
              onChange={handleUserSelectChange}
              input={<OutlinedInput label="User" />}
              sx={{
                borderRadius: '12px',
                height: '44px',
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' },
                '& .MuiSelect-select': { padding: '12px 14px', display: 'flex', alignItems: 'center' },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.length === 0 ? (
                    <Box sx={{ color: '#9CA3AF', fontSize: '12px' }}>Tags</Box>
                  ) : (
                    selected.map((value) => (
                      <Chip key={value} label={value} onDelete={() => handleRemoveUser(value)} size="small" sx={chipSx} />
                    ))
                  )}
                </Box>
              )}
            >
              {users.map((user) => (
                <MenuItem key={user} value={user}>
                  <Checkbox
                    size="small"
                    checked={filters.user.includes(user)}
                    sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#2961F4' }, marginRight: '8px' }}
                  />
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                      "&.Mui-checked": { color: "#2961F4" },
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
            fontSize: "13px",
            fontWeight: 600,
            color: "#2961F4",
            textTransform: "none",
            letterSpacing: "0",
            "&:hover": { color: "#174FD1" },
          }}
        >
          Clear All
        </Box>
        <Box sx={{ display: "flex", gap: "7px" }}>
          <Box
            component="button"
            onClick={handleApply}
            sx={{
              background: "#2961F4",
              color: "white",
              border: "none",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "20px",
              padding: "6px 14px",
              cursor: "pointer",
              boxShadow: "0px 2px 8px rgba(41,97,244,0.25)",
              "&:hover": {
                backgroundColor: "#174FD1",
                boxShadow: "0px 4px 14px rgba(41,97,244,0.35)",
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
