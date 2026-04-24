import React from "react";
import { Button } from "react-bootstrap";
import Select, { defaultTheme, components, DropdownIndicatorProps, OptionProps, Props as SelectProps, StylesConfig } from "react-select";
import "../css/multiSelectDropdwn.css";
import downArrow from "../../../images/agent-management/assets/downArrow.svg";
import { searchPlaceholderText } from "../../../constants/strings";

const { colors } = defaultTheme;

interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  dataOptions: OptionType[];
  dropDownName: string;
  id: string;
  onSelectChange: (selectedOptions: readonly OptionType[] | null) => void;
  value: readonly OptionType[] | null;
  selectAllOption?: () => void;
  open: boolean;
  onApplyClick?: () => void;
  toggleOpen: () => void;
  clearAll?: () => void;
  toggleTestId?: string;
  selectTestId?: string;
  clearTestId?: string;
  applyTestId?: string;
  applyDisabled?: boolean;
}

const selectStyles: StylesConfig<OptionType, true> = {
  container: provided => ({
    ...provided,
    width: 340,
  }),
  control: provided => ({
    ...provided,
    borderColor: "transparent",
    borderStyle: "none",
    borderWidth: 0,
    boxShadow: "none",
  }),
  placeholder: provided => ({
    ...provided,
    color: "#667085",
    fontSize: 16,
    fontFamily: "Manrope",
  }),
  input: provided => ({
    ...provided,
    color: "#344054",
    fontSize: 14,
    fontFamily: "Manrope",
  }),
  option: provided => ({
    ...provided,
    color: "#344054",
    fontSize: 14,
    fontFamily: "Manrope",
    margin: 0,
    padding: 0,
  }),
  menu: () => ({ boxShadow: "inset 0 0 0 rgba(0, 0, 0, 0.1)" }),
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = props => {
  const {
    dataOptions,
    dropDownName,
    id,
    onSelectChange,
    value,
    selectAllOption,
    open,
    onApplyClick,
    toggleOpen,
    clearAll,
    toggleTestId = " ",
    selectTestId,
    clearTestId,
    applyTestId,
    applyDisabled = false,
  } = props;

  return (
    <div data-testid="multiselectDropdown">
      <Dropdown
        data-testid="testToggleBtn"
        isOpen={open}
        onClose={toggleOpen}
        target={
          <Button 
            onClick={toggleOpen} 
            className={`riseagent-btnToggle ${open ? 'active' : ''}`}
            data-testid={toggleTestId}
            style={{
              backgroundColor: open ? '#F8FAFC' : '#FFFFFF',
              borderColor: open ? '#2961F4' : '#E2E8F0',
            }}
          >
            <span className="riseagent-optionsLabel">{dropDownName}</span>
            <div 
              style={{ 
                alignSelf: "center", 
                padding: "0 4px 0 16px",
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <img src={downArrow} alt="down arrow" style={{ maxWidth: 'none', display: 'inline-block' }}/>
            </div>
          </Button>
        }
      >
        <Select<OptionType, true>
          name="dropdown"
          id={id}
          autoFocus
          backspaceRemovesValue={false}
          components={{
            Option: Option as React.ComponentType<OptionProps<OptionType, true>>,
            IndicatorSeparator: null,
            DropdownIndicator,
          }}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          menuIsOpen
          isMulti
          closeMenuOnSelect={false}
          onChange={onSelectChange}
          options={dataOptions}
          placeholder={searchPlaceholderText}
          styles={selectStyles}
          tabSelectsValue={false}
          value={value}
          className="riseagent-dropdownMenus"
        />
        {}
        {}
      </Dropdown>
    </div>
  );
};

interface MenuProps {
  children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = props => {
  const shadow = "hsla(218, 50%, 10%, 0.1)";
  return (
    <div
      className="riseagent-dropdownMenu"
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: "absolute",
        zIndex: 20,
        padding: 16,
      }}
      {...props}
    />
  );
};

interface BlanketProps {
  onClick: () => void;
}

const Blanket: React.FC<BlanketProps> = props => {
  return (
    <div
      style={{
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        position: "fixed",
        zIndex: 1,
      }}
      {...props}
    />
  );
};

interface DropdownProps {
  children: React.ReactNode;
  isOpen: boolean;
  target: React.ReactNode;
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ children, isOpen, target, onClose }) => {
  return (
    <div style={{ position: "relative" }}>
      {target}
      {isOpen ? <Menu>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
  );
};

type SvgProps = React.SVGProps<SVGSVGElement>;

const Svg: React.FC<SvgProps> = p => {
  return <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation" {...p} />;
};

const DropdownIndicator: React.FC<DropdownIndicatorProps> = () => {
  return (
    <div style={{ color: colors.neutral20, height: 44, width: 44, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#clip0_719_35041)">
          <circle cx="9.58317" cy="9.58366" r="7.91667" stroke="#344054" strokeWidth="1.5" />
          <path d="M16.6665 16.667L18.3332 18.3337" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_719_35041">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </Svg>
    </div>
  );
};

const Option: React.FC<OptionProps<OptionType, true>> = props => {
  const { isSelected, label, selectProps } = props;
  const { options, value } = selectProps;

  const isAllSelected = label === "Select All" ? value?.length === options.length - 1 : isSelected;

  return (
    <components.Option {...props} className="riseagent-rowList">
      <div style={{ pointerEvents: "none" }} className="riseagent-listMenu">
        <input
          type="checkbox"
          data-testid={`checkboxTestId-${label}`}
          checked={isAllSelected}
          readOnly
          className="riseagent-inputCheckbox riseagent-checkRow"
          style={{ accentColor: isAllSelected ? "#2961F4" : "" }}
        />{" "}
        <label className="riseagent-inputCheckLabel riseagent-checkRow">{label}</label>
      </div>
    </components.Option>
  );
};

export default MultiSelectDropdown;

