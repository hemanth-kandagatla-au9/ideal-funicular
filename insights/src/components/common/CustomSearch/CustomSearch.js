import React, { useEffect, useState } from "react";
import { TextField, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { SearchNormal1 } from "iconsax-react";
import "./CustomSearch.css";
import { UI_TEXTS } from "../Constants/label-contants";

const CustomSearch = ({
  data,
  handleChange,
  onInputChange = () => {},
  value = "",
  clearSearch = () => {},
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="autocomplete-search custom-search">
      <TextField
        value={inputValue}
        onChange={(e) => {
          onInputChange(e.target.value);
          setInputValue(e.target.value);
          handleChange(e);
        }}
        placeholder={placeholder ? placeholder : UI_TEXTS.PLACEHOLDERS.SEARCH}
        className="text-input"
        sx={{
          borderRadius: "16px",

          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            height: "40px",
          },
        }}
        InputProps={{
          startAdornment: (
            <SearchNormal1
              size="22"
              color="grey"
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "4px",
              }}
            />
          ),
          endAdornment: (
            <>
              {inputValue && (
                <IconButton
                  // sx={{ marginRight: "8px" }}
                  onClick={() => {
                    setInputValue("");
                    clearSearch();
                  }}
                >
                  <ClearIcon className="close-icon" />
                </IconButton>
              )}
            </>
          ),
        }}
      />
    </div>
  );
};

export default CustomSearch;
