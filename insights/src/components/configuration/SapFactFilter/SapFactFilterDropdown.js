import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Checkbox,
  ListItemText,
  Popover,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function MultiSelectDropdown({
  parentComponent,
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = label,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");

  const open = Boolean(anchorEl);

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    const lower = searchText.toLowerCase();
    return options.filter((opt) => {
      const v = (opt.value ?? "").toString();
      return v.toLowerCase().includes(lower);
    });
  }, [searchText, options]);

  const allFilteredSelected = useMemo(() => {
    if (filteredOptions.length === 0) return false;
    return filteredOptions.every((opt) => selectedValues.includes(opt.value));
  }, [filteredOptions, selectedValues]);

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      const newSel = selectedValues.filter(
        (v) => !filteredOptions.some((opt) => opt.value === v)
      );
      onChange(newSel);
    } else {
      const filteredVals = filteredOptions.map((opt) => opt.value);
      const newSet = new Set([...selectedValues, ...filteredVals]);
      onChange(Array.from(newSet));
    }
  };

  const handleItemClick = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const toggleDropdown = (e) => {
    if (open) setAnchorEl(null);
    else setAnchorEl(e.currentTarget);
  };

  return (
    <div>
      <Box
        onClick={toggleDropdown}
        sx={{
          minHeight: 40,
          border: "1px solid #CCD4DE",
          backgroundColor:
            parentComponent === "addJobComponent" ? "#ffffff" : "none",
          borderRadius: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 0.5,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography
          color={selectedValues.length === 0 ? "textSecondary" : "textPrimary"}
          style={{
            fontFamily: "Manrope",
            opacity: "0.5",
          }}
        >
          {placeholder}
        </Typography>

        <IconButton size="small" onClick={toggleDropdown} sx={{ ml: 1 }}>
          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          overflow: "auto",
          border: "1px solid red",
        }}
        style={{ border: "1px solid green" }}
        PaperProps={{
          sx: {
            width: 250, // fixed width
            maxHeight: 300, // or whatever height you want
            overflow: "auto", // scroll if too many items
          },
        }}
        disablePortal={true} // optional: ensures popover is positioned relative to parent
      >
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />

          {/*  */}

          {filteredOptions.length > 0 && (
            <MenuItem onClick={handleSelectAllToggle}>
              <Checkbox
                checked={allFilteredSelected}
                indeterminate={
                  selectedValues.length > 0 &&
                  !allFilteredSelected &&
                  filteredOptions.some((opt) =>
                    selectedValues.includes(opt.value)
                  )
                }
              />
              <ListItemText
                primary={allFilteredSelected ? "Deselect All" : "Select All"}
              />
            </MenuItem>
          )}

          {filteredOptions.length === 0 && searchText.trim() !== "" ? (
            <MenuItem disabled>
              <ListItemText primary={"No data found"} />
            </MenuItem>
          ) : (
            filteredOptions.map((item, idx) => (
              <MenuItem key={idx} onClick={() => handleItemClick(item.value)}>
                <Checkbox checked={selectedValues.includes(item.value)} />
                <ListItemText primary={item.value ?? "N/A"} />
              </MenuItem>
            ))
          )}
        </Box>
      </Popover>
    </div>
  );
}
