import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FormControl } from "react-bootstrap";
import "./dropdown.css";
import { searchPlaceholderText } from "../../../constants/strings";

interface DropdownItem {
  id?: string;
  _id?: string;
  value: string;
}

interface DropdownComponentProps {
  id?: string;
  data: DropdownItem[];
  value: string;
  handleChange: (value: string) => void;
  handleChangeCustom?: (eventKey: string | null, event: React.SyntheticEvent<unknown>) => void;
  cnameDropdownMenu?: string;
  cnameToggleTitle?: string;
  cname?: string;
  testId?: string;
  testidMain?: string;
  showReset?: boolean;
  onHandleFilterClick?: () => void;
  isCompliancePage?: boolean;
  disabled?: boolean;
}

const DropdownComponent: React.FC<DropdownComponentProps> = props => {
  const [dropdownData, setDropdownData] = useState<DropdownItem[]>([]);
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

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
    disabled = false,
  } = props;

  useEffect(() => {
    setDropdownData(propsData);
  }, [propsData]);

  useEffect(() => {
    setDropdownValue(propsValue);
  }, [propsValue]);

  useEffect(() => {
    if (showReset === false) {
      setDropdownValue(propsValue);
    }
  }, [showReset]);

  useEffect(() => {
    setSearchText("");
  }, [onHandleFilterClick]);

  const handleSelect = (_eventKey: string | null, event: any) => {
    event.persist();
    propsHandleChange(event.target.innerText);
    setDropdownValue(event.target.innerText);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempSearch = event.target.value;
    setSearchText(tempSearch);
    const filtered = propsData.filter(i => i.value.toLowerCase().includes(tempSearch.toLowerCase()));
    setDropdownData(filtered);
  };

  const handleSelectCustom = (_eventKey: string | null, event: any) => {
    event.persist();
    propsHandleChangeCustom?.(_eventKey, event);
    setDropdownValue(event.target.innerText);
  };

  const getDropdownItemClasses = (dropdownVal: string, item: DropdownItem): string => {
    if (cnameDropdownMenu) {
      if (dropdownVal === item.value) {
        return `${cnameDropdownMenu} riseagent-risebot_dropdown-item selected-option`;
      }
      return `riseagent-risebot_dropdown-item ${cnameDropdownMenu}`;
    }
    if (dropdownVal === item.value) {
      return "riseagent-risebot_dropdown-item selected-option";
    }
    return "riseagent-risebot_dropdown-item";
  };

  return (
    <Dropdown
      data-test="cs-dropdown-component"
      className={propsCname ? `${propsCname} riseagent-risebot_dropdown-outer ` : "riseagent-risebot_dropdown-outer"}
      onSelect={typeof propsHandleChangeCustom === "function" ? handleSelectCustom : handleSelect}
      onToggle={isCompliancePage ? onHandleFilterClick : undefined}
    >
      <div style={{ height: "30px" }}>
        <Dropdown.Toggle
          data-testid={testId || "dropdown-test-id"}
          id="risebot_dropdown-autoclose-inside"
          className={cnameToggleTitle ? `${cnameToggleTitle} riseagent-risebot_dropdown-title-container` : "riseagent-risebot_dropdown-title-container"}
          disabled={disabled}
        >
          <div data-testid={testidMain} className={cnameToggleTitle ? `${cnameToggleTitle} riseagent-risebot_dropdown-title` : "riseagent-risebot_dropdown-title"}>
            {dropdownValue} per page{" "}
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }}>
              <path d="M0.5 3.5L5.5 8.5L10.5 3.5H8.75L5.5 6.75L2.25 3.5H0.5Z" fill="#000" />
            </svg>
          </div>
        </Dropdown.Toggle>
      </div>
      <Dropdown.Menu id={propsId} title="Select" className={cnameDropdownMenu ? `menuwidth ${cnameDropdownMenu}` : "menuwidth"} data-test="dropdown-menu">
        {isCompliancePage && <FormControl autoFocus placeholder={searchPlaceholderText} data-test="serachInDrop" value={searchText} onChange={handleSearch} />}
        {dropdownData && dropdownData.length > 0
          ? dropdownData.map((item, index) => {
              const key = `risebot_dropdown-item-${index}`;
              return (
                <Dropdown.Item
                  key={key}
                  className={getDropdownItemClasses(dropdownValue, item)}
                  value={item.value}
                  eventKey={propsHandleChangeCustom ? item.id || item._id || "" : item.value}
                  data-testid={`option-${item.value}`}
                >
                  {item.value}
                </Dropdown.Item>
              );
            })
          : null}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownComponent;
