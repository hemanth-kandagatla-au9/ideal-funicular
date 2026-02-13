import React, { useState, useMemo, useRef } from "react";
import {
  OutlinedInput,
  MenuItem,
  Select,
  ListSubheader,
  TextField,
  InputAdornment,
  FilledInput,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import classes from "./css/subheader.module.css";
import { UI_TEXTS } from "../common/Constants/label-contants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomMultiSelect = ({
  label = "Target Hostname",
  value,
  setValue,
  options,
  disabled,
  isRequired = false,
  simpleMode = false,
  readOnly = false,
  infoTooltip = null,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false); 
  const [clearAll, setClearAll] = useState(false);
  const selectRef = useRef(null);

const containsText = (text, searchText) => {
  if (!text || !searchText) return true;

  const normalize = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[-_.]/g, " ")      
      .replace(/\s+/g, " ");       

  return normalize(text).includes(normalize(searchText));
};

  const displayedOptions = useMemo(
    () => options?.filter((option) => containsText(option, searchText)),
    [searchText, options]
  );

  const handleSelectAllClick = (e) => {
    e.stopPropagation();

    const allFilteredSelected =
      displayedOptions?.length > 0 &&
      displayedOptions.every((opt) => value?.includes(opt));

    if (allFilteredSelected) {
      const remaining = value?.filter(
        (val) => !displayedOptions.includes(val)
      );
      setValue(remaining);
      setClearAll(remaining.length > 0);
      setSelectAll(false);
    } else {
      const merged = Array.from(
        new Set([...(value || []), ...(displayedOptions || [])])
      );
      setValue(merged);
      setClearAll(true);
      setSelectAll(true);
    }
  };

  return (
    <div className="custom-input-wrapper">
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span className="custom-label">
          {label}{" "}
          {isRequired && <span className={classes.iabot_required}>*</span>}
        </span>
        {infoTooltip && infoTooltip.message && (
          <Tooltip title={infoTooltip.message} arrow>
            <InfoOutlinedIcon
              sx={{ fontSize: "16px", color: "#2961F4", cursor: "pointer" }}
            />
          </Tooltip>
        )}
      </div>

      <Select
        ref={selectRef}
        name="multi-select-select"
        displayEmpty
        multiple
        value={value ? value : []}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          if (val && val.length) {
            setClearAll(true);
          } else {
            setClearAll(false);
            setSelectAll(false);
          }
        }}
        onClose={() => {
          setSearchText(""); 
        }}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (selected?.length === 0) {
            return <>Select</>;
          }
          return selected?.join(", ");
        }}
        MenuProps={MenuProps}
        inputProps={{
          "aria-label": "Without label",
          "data-testid": "custom-multi-select",
        }}
        sx={{ borderRadius: "7px" }}
        disabled={disabled || readOnly}
      >
        {!simpleMode && (
          <>
            <TextField
              size="small"
              variant="outlined"
              autoFocus
              placeholder={UI_TEXTS.PLACEHOLDERS.TYPE_TO_SEARCH}
              fullWidth
              InputProps={{
                "data-testid": "search-input",
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  e.stopPropagation();
                }
              }}
              sx={{ padding: "5px", bgcolor: "white" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <MenuItem
                onClick={(e) => {
                  handleSelectAllClick(e);
                  e.stopPropagation();
                }}
                style={{ paddingLeft: "0" }}
                data-testid="select-all"
              >
                <Checkbox
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectAllClick(e);
                  }}
                  onMouseUp={(e) => e.preventDefault()}
                  checked={
                    displayedOptions?.length > 0 &&
                    displayedOptions.every((opt) => value?.includes(opt))
                  }
                  data-testid="select-all-checkbox"
                  sx={{ marginLeft: "15px" }}
                />
                <ListItemText
                  primaryTypographyProps={{ style: { color: "#000" } }}
                  primary={UI_TEXTS.LABELS.SELECT_ALL}
                />
                {value?.length > 0 && (
                  <ListItemText
                    primaryTypographyProps={{
                      style: { color: "#000", marginLeft: "0.2rem" },
                    }}
                    primary={` (${value.length})`}
                  />
                )}
              </MenuItem>

              {clearAll && (
                <MenuItem
                  onClick={() => {
                    setValue([]);
                    setSelectAll(false);
                    setClearAll(false);
                  }}
                  data-testid="clear-all"
                >
                  <ListItemText
                    primaryTypographyProps={{
                      style: { color: "#000" },
                    }}
                    primary={UI_TEXTS.LABELS.CLEAR_ALL}
                  />
                </MenuItem>
              )}
            </div>
          </>
        )}

        {displayedOptions?.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="No results found" />
          </MenuItem>
        )}

        {displayedOptions &&
          displayedOptions.map((name) => (
            <MenuItem
              className="iabot-custom-menu-item"
              key={name}
              value={name}
              data-testid={`menu-item-${name}`}
            >
              <Checkbox
                checked={value?.indexOf(name) > -1}
                inputProps={{
                  "data-testid": `checkbox-${name}`,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              />
              <div>{name}</div>
            </MenuItem>
          ))}
      </Select>
    </div>
  );
};

export default CustomMultiSelect;
