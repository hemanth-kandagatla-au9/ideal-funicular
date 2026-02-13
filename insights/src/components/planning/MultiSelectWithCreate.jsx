import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close"; // Import the close icon
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import classes from "./css/subheader.module.css";
import { tagColors, textColors } from "../common/Constants/constantObjects";
import { UI_TEXTS } from "../common/Constants/label-contants";

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    cursor: "pointer",
  },
  "& .MuiSelect-select": {
    padding: "8px 32px 8px 12px !important",
  },
}));

const getTagStyle = (tag) => {
  const hash = tag
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const colorIndex = Math.abs(hash) % tagColors.length;

  return {
    backgroundColor: tagColors[colorIndex],
    color: textColors[colorIndex],
    border: `1px solid ${textColors[colorIndex]}33`,
    borderRadius: "16px",
    fontSize: "0.75rem",
    height: "24px",
    margin: "2px",
  };
};

const MultiSelectWithCreateOption = ({
  label,
  selectedValues,
  onSelectionChange,
  disabled = false,
  readOnly = false,
  moduleName,
  sx = { width: "100%" },
}) => {
  const [newOption, setNewOption] = useState("");
  const [visibleTags, setVisibleTags] = useState([]);
  const [remainingCount, setRemainingCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const selectRef = useRef(null);
  const MAX_TAGS = 10;
  const MAX_TAG_LENGTH = 30;

  // Calculate visible tags based on available space
  useEffect(() => {
    if (selectRef.current && Array.isArray(selectedValues)) {
      const selectWidth = selectRef.current.offsetWidth;
      let totalWidth = 0;
      const visible = [];
      let remaining = 0;

      for (let i = 0; i < selectedValues.length; i++) {
        const tagWidth = selectedValues[i].length * 6 + 38; // Approximate width of each tag
        if (totalWidth + tagWidth < selectWidth - 50) {
          // Reserve space for the "+X" chip
          totalWidth += tagWidth;
          visible.push(selectedValues[i]);
        } else {
          remaining = selectedValues.length - i;
          break;
        }
      }

      setVisibleTags(visible);
      setRemainingCount(remaining);
    }
  }, [selectedValues]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // const handleCreateOption = () => {
  //   const trimmedOption = newOption.trim();
  //   if (trimmedOption && !selectedValues.includes(trimmedOption)) {
  //     const updatedValues = [...selectedValues, trimmedOption];
  //     onSelectionChange(updatedValues); // Notify parent of the change
  //     setNewOption("");
  //   }
  // };

  const handleCreateOption = () => {
    const trimmedOption = newOption.trim();

    if (!trimmedOption) {
      setErrorMessage("Tag cannot be empty");
      return;
    }
    if (trimmedOption.length > MAX_TAG_LENGTH) {
      setErrorMessage(`Tag cannot exceed ${MAX_TAG_LENGTH} characters`);
      return;
    }
    if (selectedValues.includes(trimmedOption)) {
      setErrorMessage("Tag already exists");
      setNewOption("");
      return;
    }
    if (selectedValues.length >= MAX_TAGS) {
      setErrorMessage(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }

    onSelectionChange([...selectedValues, trimmedOption]);
    setNewOption("");
  };

  const handleChange = (event) => {
    const value = event.target.value;
    // Ensure value is an array of strings
    if (Array.isArray(value)) {
      onSelectionChange(value); // Notify parent of the change
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    const updatedSelectedValues = selectedValues.filter(
      (option) => option !== optionToRemove
    );
    onSelectionChange(updatedSelectedValues); // Notify parent of the change
  };

  return (
    <StyledSelect
      multiple
      displayEmpty
      value={selectedValues || []}
      disabled={disabled || readOnly}
      renderValue={(selected) => {
        if (!selected || !selected.length) {
          return (
            <span style={{ color: "#757575" }}>
              {UI_TEXTS.LOADING.SELECT_TAGS}
            </span>
          );
        }
        return (
          <div
            style={{
              display: "flex",
              flexWrap:
                moduleName === "reports" || "codeMarketPlace"
                  ? "nowrap"
                  : "wrap",
              overflow: "hidden",
              gap: "2px",
              alignItems: "center",
              maxWidth: "97%",
            }}
            ref={selectRef}
          >
            {visibleTags.map((option) => {
              const tagStyle = getTagStyle(option);
              return (
                <Tooltip key={option} title={option}>
                  <Chip
                    key={option}
                    label={option}
                    sx={tagStyle}
                    onDelete={() => handleRemoveOption(option)}
                    deleteIcon={
                      <CloseIcon
                        style={{
                          color: tagStyle.color,
                          fontSize: "16px",
                          marginRight: "4px",
                        }}
                      />
                    }
                  />
                </Tooltip>
              );
            })}
            {remainingCount > 0 && (
              <Tooltip title={selectedValues.slice(remainingCount).join(", ")}>
                <Chip
                  label={`+${remainingCount}`}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    color: "#616161",
                    borderRadius: "16px",
                    fontSize: "0.75rem",
                    height: "24px",
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      }}
      sx={{
        ...sx,
        "& .MuiChip-root": {
          margin: "2px",
        },
      }}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
          },
        },
      }}
    >
      {errorMessage && (
        <div
          style={{
            padding: "10px 16px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            fontSize: "0.8rem",
            textAlign: "center",
            borderBottom: "1px solid #ffcdd2",
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "8px 16px 4px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TextField
            variant="outlined"
            size="small"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={UI_TEXTS.PLACEHOLDERS.ADD_NEW_TAG}
            fullWidth
            inputProps={{ maxLength: MAX_TAG_LENGTH }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter" && newOption.trim()) {
                handleCreateOption();
                e.preventDefault();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateOption();
            }}
            disabled={selectedValues.length >= MAX_TAGS || !newOption.trim()}
            sx={{
              borderRadius: "4px",
              textTransform: "none",
              padding: "6px 12px",
              whiteSpace: "nowrap",
            }}
          >
            {UI_TEXTS.BUTTONS.ADD}
          </Button>
        </div>

        <div
          style={{
            color: newOption.length > MAX_TAG_LENGTH * 0.9 ? "#d32f2f" : "#666",
            textAlign: "left",
            fontSize: "0.7rem",
            margin: "-8px 0 0 2px",
          }}
        >
          {newOption.length}/{MAX_TAG_LENGTH}
        </div>
      </div>
      {(selectedValues || []).map((option) => {
        const tagStyle = getTagStyle(option);
        return (
          <MenuItem
            key={option}
            value={option}
            sx={{
              padding: "6px 16px",
              display: "flex",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Tooltip
              key={option}
              title={option}
              slotProps={{
                tooltip: {
                  sx: {
                    maxWidth: moduleName == "reports" ? "38vw" : null,
                    whiteSpace: "normal",
                    maxHeight: 120,
                    overflowY: "auto",
                  },
                },
              }}
            >
              <span
                style={{
                  color: tagStyle.color,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {option}
              </span>
            </Tooltip>
            <IconButton
              edge="end"
              aria-label="remove"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveOption(option);
              }}
              sx={{
                color: "#616161",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        );
      })}
    </StyledSelect>
  );
};

export default MultiSelectWithCreateOption;
