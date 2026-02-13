import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./dropdown.css";
import { FormControl } from "react-bootstrap";
import SortIcon from '../../../assets/images/Sort From Top To Bottom.png'
function DropdownComponent(props) {
  const [dropdownData, setDropdownData] = useState([]);
  const [dropdownValue, setDropdownvalue] = useState("");
  const [searchText, setSearchText] = useState("");
  const {
    id: propsId,
    data: propsData,
    value: propsValue,
    handleChange: propsHandleChange,
    handleChangeCustom: propsHandleChangeCustom,
    cnameDropdownMenu,
    cnameToggleTitle,
    cname: propsCname,
    testId,
    testidMain,
    showReset,
    onHandleFilterClick,
    isCompliancePage,
    isSearchable = false,
    disabled = false,
    icon,
    isStatusDropdown = false
  } = props;
  useEffect(() => {
    setDropdownData(propsData);
  }, [propsData]);

  useEffect(() => {
    setDropdownvalue(propsValue);
  }, [propsValue]);
  useEffect(() => {
    if (showReset === false) {
      setDropdownvalue(propsValue);
    }
  }, [showReset]);

  useEffect(() => {
    setSearchText("");
  }, [onHandleFilterClick]);

  const handleSelect = (_eventkey, event) => {
    event.persist();
    propsHandleChange(event.target.innerText);
    setDropdownvalue(event.target.innerText);
  };
  const handleSearch = (event) => {
    const tempSearch = event.target.value;
    setSearchText(tempSearch);
    const filtered = propsData.filter((i) =>
      i.value.toLowerCase().includes(tempSearch.toLowerCase())
    );
    setDropdownData(filtered);
  };

  const handleSelectCustom = (_eventkey, event) => {
    event.persist();
    propsHandleChangeCustom(_eventkey, event);
    setDropdownvalue(event.target.innerText);
  };

  const getDropdownItemClasses = (dropdownVal, item) => {
    if (cnameDropdownMenu) {
      if (dropdownVal === item) {
        return `${cnameDropdownMenu} iabot_dropdown_item iabot_selected-option`;
      }
      return `iabot_dropdown_item ${cnameDropdownMenu}`;
    }
    if (dropdownVal === item) {
      return "iabot_dropdown_item iabot_selected-option";
    }
    return "iabot_dropdown_item";
  };

  const statusColorMap = {
    All: "",
    Active: "#4CAF50",
    Paused: "rgb(238, 33, 33)",
    Adhoc: "#906AFF",
    "Execute One time": "#0243f5",
  };
  return (
    <Dropdown
      data-test="cs-dropdown-component"
      style={{width:"90px"}}
      className={
        propsCname
          ? `${propsCname} iabot_dropdown_outer `
          : "iabot_dropdown_outer"
      }
      onSelect={
        typeof propsHandleChangeCustom === "function"
          ? handleSelectCustom
          : handleSelect
      }
       onToggle={isCompliancePage ? onHandleFilterClick : ""}
    >
      <div className="iabot_outer-div" >
        <Dropdown.Toggle
          style={{
            backgroundColor: "#ffffff",
              // cnameToggleTitle === "iabot_customDropdown_title"
              //   ? "#ffffff"
              //   : "#F0EFED",
            color:
              cnameToggleTitle === "iabot_customDropdown_title"
                ? "#3b90e5"
                : "#404040",
            fontSize:
              cnameToggleTitle === "iabot_customDropdown_title"
                ? "16px"
                : "13px",
          }}
          data-testid={testId || "dropdown-test-id"}
          id="iabot_dropdown-autoclose-inside"
          className={
            cnameToggleTitle
              ? `${cnameToggleTitle} dropdown-title-container`
              : "dropdown-title-container"
          }
          disabled={disabled}
        >
          <div
            data-testid={testidMain}
            className={
              cnameToggleTitle
                ? `${cnameToggleTitle} iabot_dropdown-title`
                : "iabot_dropdown-title"
            }
            
          >
          <img src={icon ? icon : SortIcon}/> 
          
          {dropdownValue}
          </div>
        </Dropdown.Toggle>
      </div>
      <Dropdown.Menu
        id={propsId}
        title="Select"
        className={
          cnameDropdownMenu ? `menuwidth ${cnameDropdownMenu}` : "menuwidth"
        }
        data-test="dropdown-menu"
      >
        {isSearchable && (
          <FormControl
            autoFocus
            placeholder="Search"
            data-test="serachInDrop"
            value={searchText}
            onChange={handleSearch}
          />
        )}
        {dropdownData && dropdownData.length > 0
          ? dropdownData.map((item, index) => {
              const key = `iabot_dropdown_item-${index}`;
              const showColorDot =
                isStatusDropdown && statusColorMap[item.value];

              if (index >= 0) {
                return (
                  <Dropdown.Item
                    key={key}
                    className={getDropdownItemClasses(dropdownValue, item)}
                    value={item.value}
                    eventKey={
                      propsHandleChangeCustom
                        ? item.id || item._id
                        : item.value
                    }
                    data-testid="option-test-id"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {showColorDot && (
                        <span
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            backgroundColor: statusColorMap[item.value],
                            display: "inline-block",
                          }}
                        />
                      )}
                      <span>{item.value}</span>
                    </div>
                  </Dropdown.Item>
                );
              }
              return "";
            })
          : ""}
      </Dropdown.Menu>
    </Dropdown>
  );
}
export default DropdownComponent;
