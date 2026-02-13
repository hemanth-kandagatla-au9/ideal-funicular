import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
// import searchIcon from "../../../images/vector-9-2x.svg";
import searchIcon from "../../../images/Minimalistic Magnifer@2x.svg";
import { SearchNormal1 } from "iconsax-react";
import "./search.css";
import { UI_TEXTS } from "../../common/Constants/label-contants";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Search(props) {
  const {
    handleSearchText: propsHandleSearchText,
    clearFilterSearch = false,
    searchIconTowardsRight,
    placeholder,
    selection,
    customeCss,
    disable = false,
    onEnterClear,
    setSearchTextProp,
    onClear,
    disableIconClick = false,
  } = props;
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (clearFilterSearch) {
      setSearchText("");
    }
  }, [clearFilterSearch]);

  const handleSearchText = (e) => {
    const keycodetemp = 13;
    if (e.keyCode === keycodetemp && e.target.value) {
      propsHandleSearchText(e.target.value);
    }
  };
  useEffect(() => {
    setSearchText("");
  }, [placeholder]);
  const handleSingleSearch = (e) => {
    const trimmed = e.target.value.trim();
    if (trimmed !== searchText.trim()) {
      propsHandleSearchText(trimmed);
    }
    setSearchText(e.target.value);
  };
  const handleClick = () => {
    const qry = searchText;
    setSearchTextProp(qry);
    if (qry) {
      propsHandleSearchText(qry);
      if (selection !== "single") setSearchText("");
    } else {
      const message = placeholder?.toLowerCase().replace("search", "Enter");
      const TOAST_ID = "empty-search-toast";

      if (!toast.isActive(TOAST_ID)) {
        toast(message, {
          position: "top-right",
          autoClose: 4000,
          toastId: TOAST_ID,
        });
      }
    }
  };
  const handleClear = () => {
    setSearchText("");
    propsHandleSearchText("");
    if (onClear) onClear();
  };

  return (
    <div className="search-outer-div">
      <div className="searchIcon">
        <div
          // role="button"
          // tabIndex={0}
          role={disableIconClick ? "presentation" : "button"}
          tabIndex={disableIconClick ? -1 : 0}
          style={{
            ...customeCss,
          }}
          searchdata={searchText}
          // onClick={handleClick}
          onClick={!disableIconClick ? handleClick : undefined}
          data-testid="search-icon"
          onKeyUp={() => false}
        >
          {/* <img loading="lazy" alt="searchImage" src={searchIcon} /> */}
          <SearchNormal1 size="20" color="#777d74" />
        </div>
      </div>
      <Form.Control
        size="lg"
        type="text"
        disabled={disable}
        className="searchBox"
        data-testid="search-input"
        style={{ paddingLeft: "40px" }}
        placeholder={
          placeholder || UI_TEXTS.PLACEHOLDERS.SEARCH_ENVIRONMENT_SID_COMPONENT
        }
        value={searchText}
        onChange={(e) => {
          selection === "single"
            ? handleSingleSearch(e)
            : setSearchText(e.target.value);
        }}
        onKeyDown={(e) => {
          onEnterClear
            ? e.key === "Enter" && e.preventDefault()
            : handleSearchText(e);
        }}
      />
      {searchText && (
        <IconButton
          size="small"
          onClick={handleClear}
          sx={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#777d74",
            zIndex: 10,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <br />
    </div>
  );
}
export default Search;
