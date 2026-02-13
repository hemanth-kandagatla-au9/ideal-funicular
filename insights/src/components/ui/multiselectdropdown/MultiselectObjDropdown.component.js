import React, { useState, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  InputBase,
  MenuItem,
  Paper,
  Popper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Tooltip,
} from "@mui/material";

function MultiselectObjectDropdown({
  title,
  options,
  items,
  setItems,
  ddWidth,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const open = Boolean(anchorEl);
  const selectedCount = items.filter((item) => item.checked).length;

  const toggleDropdown = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleToggleItem = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updated);
  };

  const handleToggleSelectAll = () => {
    const visibleItems = getFilteredItems();
    const allSelected = visibleItems.every((item) => item.checked);
    const updated = items.map((item) =>
      visibleItems.find((v) => v.id === item.id)
        ? { ...item, checked: !allSelected }
        : item
    );
    setItems(updated);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const getFilteredItems = () =>
    items.filter((item) => item.value.toLowerCase().includes(search));

  const handleApply = () => {
    setAnchorEl(null);
    const selectedItems = items
      .filter((option) => option.checked)
      .map((option) => option.value);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={toggleDropdown}
        ref={dropdownRef}
        sx={{
          textTransform: "none",
          justifyContent: "space-between",
          width: ddWidth,
          pl: 1.5,
          pr: 1.5,
          display: "flex",
          alignItems: "center",
          color: "grey.700", // Text & icon color
          borderColor: "grey.400", // Border color
          "&:hover": {
            borderColor: "grey.500", // Optional hover border
            backgroundColor: "grey.100", // Optional hover bg
          },
        }}
      >
        <span>{title}</span>
        <KeyboardArrowDownIcon sx={{ color: "grey.700" }} />
      </Button>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper sx={{ width: "485px", mt: 1, p: 1 }}>
            {/* Search Field */}
            <InputBase
              placeholder={`Search ${title}`}
              fullWidth
              sx={{
                mb: 1,
                px: 1,
                py: 0.5,
                border: "1px solid #ccc",
                borderRadius: 1,
              }}
              value={search}
              onChange={handleSearchChange}
            />

            <Divider sx={{ mt: 0, mb: 0 }} />

            {/* Select All */}
            <MenuItem sx={{ p: 0 }} onClick={handleToggleSelectAll}>
              <Checkbox
                checked={
                  getFilteredItems().every((i) => i.checked) &&
                  getFilteredItems().length > 0
                }
              />
              <ListItemText primary="Select All" />
            </MenuItem>

            <Divider sx={{ mt: 0, mb: 0 }} style={{ margin: "0px" }} />

            {/* Filtered List */}
            <List
              dense
              sx={{
                maxHeight: "150px",
                height: "150px",
                overflowY: "auto",
                p: 0,
              }}
            >
              {getFilteredItems().map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  onClick={() => handleToggleItem(item.id)}
                >
                  <Checkbox checked={item.checked} sx={{ pl: 1 }} />
                  {item.tooltip ? (
                    <Tooltip
                      title={`Job: ${item.tooltip}`}
                      placement="right"
                      arrow
                    >
                      <ListItemText sx={{ ml: 1 }} primary={item.value} />
                    </Tooltip>
                  ) : (
                    <ListItemText sx={{ ml: 1 }} primary={item.value} />
                  )}
                </ListItem>
              ))}
            </List>

            {/* Footer: Selection Count + Apply */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ ml: 1 }}>
                {selectedCount} Selected
              </Typography>
              <Button variant="contained" size="small" onClick={handleApply}>
                Apply
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

export default MultiselectObjectDropdown;
