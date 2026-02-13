import React, { forwardRef, useState, useRef, useEffect } from "react";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  IconButton,
  Typography,
  Tooltip,
  Chip,
  TextField,
} from "@mui/material";
import { ArrowDown2, SearchNormal1, CloseCircle } from "iconsax-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "./LabelledInput.css";
import { Checkbox } from "@mui/material";
import Box from "@mui/material/Box";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import { InputAdornment } from "@mui/material";
// import {
//   SearchIcon,
//   MonitorIcon,
//   CommandIcon,
//   UserIcon,
//   AdGroupIcon,
// } from "../../../assets/svgs/SVGIcons";
import CustomPill from "../CustomPill/CustomPill";
import { CircularProgress } from "@mui/material";
import { UI_TEXTS } from "../Constants/label-contants";

const LabelledInput = forwardRef(
  (
    {
      id,
      name = id,
      label,
      placeholder,
      type = "text",
      options = [],
      value = [],
      onChange,
      onKeyDown,
      seconds,
      optionalHeader,
      optionalDescription,
      error,
      rows = 3,
      labelFontSize = "16px",
      inputFontSize = "16px",
      showSelectedCount = false,
      maxLength = 500,
      min,
      max,
      hideLabel = false,
      disabled = false,
      customStyle = {},
      loading = false,
      onFocus,
      disablePastDates = true,
      disableFromDate,
      disableToDate,
      showTime = false,
      size,
      tooltipType = "",
      isRequired = false,
      hideEyeIcon = false,
      iscreateItem = false,
      createItemAPI = () => {},
      isItemLoading = false,
      handleScroll,
      lazyLoading = false,
      setSearchText = () => {},
      searchText = "",
      handleSearchBlur = () => {},
      handleSearchInputChange = () => {},
      enableServerFilter = false,
      onKeyPress = () => {},
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [openDropdown, setOpenDropdown] = useState(false);
    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const handleChange = (event, child) => {
      onChange(event, child);
    };
    const handleKeyDown = (event, child) => {
      if (onKeyDown) {
        onKeyDown(event, child);
      }
    };

    const handleDateChange = (date) => {
      const event = {
        target: {
          id,
          name,
          value: dayjs(date),
        },
      };
      onChange(event);
    };

    const handleOptionSelect = (e, selectedId) => {
      e.stopPropagation();
      const newValue = value.includes(selectedId)
        ? value.filter((v) => v !== selectedId)
        : [...value, selectedId];

      if (JSON.stringify(newValue) !== JSON.stringify(value)) {
        onChange({ target: { name, value: newValue } });
      }
    };

    const [sortedOptions, setSortedOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
      let updatedFilteredOptions;

      if (searchTerm !== "") {
        const LabelOptions = options?.filter((option) =>
          option.label
            ?.toString()
            .toLowerCase()
            .includes(searchTerm?.toLowerCase())
        );

        const commandOptions = options?.filter((option) =>
          option.extra?.commands?.some((cmd) =>
            cmd.command
              ?.toString()
              .toLowerCase()
              .includes(searchTerm?.toLowerCase())
          )
        );

        updatedFilteredOptions = [...LabelOptions, ...commandOptions].filter(
          (option, index, self) =>
            index === self.findIndex((o) => o.label === option.label)
        );
      } else {
        updatedFilteredOptions = options || [];
      }
      setFilteredOptions((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(updatedFilteredOptions)) {
          return updatedFilteredOptions;
        }
        return prev;
      });
      setSortedOptions((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(updatedFilteredOptions)) {
          return updatedFilteredOptions;
        }
        return prev;
      });
    }, [searchTerm, options, value]);

    useEffect(() => {
      setFilteredOptions(options);
      setSortedOptions([
        ...filteredOptions.filter((option) => value.includes(option.id)),
        ...filteredOptions.filter((option) => !value.includes(option.id)),
      ]);
    }, [openDropdown, loading]);

    const createItem = async () => {
      await createItemAPI({
        item: searchTerm,
      });

      setSearchTerm(searchTerm.toUpperCase());
      setSearchTerm(searchTerm.toLowerCase());
    };

    const CustomTooltipContent = ({ data, tooltipType }) => {
      return (
        <Box sx={{ padding: "10px", borderRadius: "4px" }}>
          {data?.extra?.server && (
            <div style={{ paddingBottom: "12px" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "10px" }}
                className="custom-tooltip-title"
              >
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* <MonitorIcon
                    width={20}
                    height={20}
                    pathClassName="custom-tooltip-icon"
                  /> */}
                  {UI_TEXTS.LABELS.SERVER}
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                {data?.extra?.server?.map((server) => (
                  <CustomPill
                    showCloseIcon={false}
                    closeFun={() => {}}
                    key={server}
                    type=""
                    value={server}
                  />
                ))}
              </Box>
            </div>
          )}
          {data?.extra?.commands && (
            <div style={{ paddingBottom: "12px" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "10px" }}
                className="custom-tooltip-title"
              >
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* <CommandIcon
                    width={20}
                    height={20}
                    pathClassName="custom-tooltip-icon"
                  /> */}
                  {UI_TEXTS.LABELS.COMMANDS}
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                {data?.extra?.commands?.map((cmd) =>
                  cmd?.runAsRoot ? (
                    <TextField
                      key={cmd?.command}
                      label="Root"
                      size="small"
                      disabled
                      value={cmd?.command}
                      sx={{
                        width: "100px",
                        textOverflow: "hidden",
                        fontFamily: "Manrope-Medium",
                      }}
                    />
                  ) : (
                    <CustomPill
                      key={cmd?.command}
                      showCloseIcon={false}
                      closeFun={() => {}}
                      type=""
                      value={cmd?.command}
                    />
                  )
                )}
              </Box>
            </div>
          )}

          {data?.extra?.approverAdGroup && (
            <div style={{ paddingBottom: "12px" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "10px" }}
                className="custom-tooltip-title"
              >
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* <AdGroupIcon
                    width={24}
                    height={24}
                    pathClassName="custom-tooltip-icon"
                  /> */}
                  {UI_TEXTS.LABELS.ADGROUP}
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                {data?.extra?.approverAdGroup?.map((adgroup) => (
                  <CustomPill
                    showCloseIcon={false}
                    closeFun={() => {}}
                    key={adgroup}
                    type=""
                    value={adgroup}
                  />
                ))}
              </Box>
            </div>
          )}
          {data?.extra?.allowedSubUsers && (
            <div style={{ paddingBottom: "12px" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "10px" }}
                className="custom-tooltip-title"
              >
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* <UserIcon
                    width={20}
                    height={20}
                    pathClassName="custom-tooltip-icon"
                  /> */}
                  {UI_TEXTS.LABELS.ALLOWED_SUB_USERS}
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                {data?.extra?.allowedSubUsers?.map((user) => (
                  <CustomPill
                    showCloseIcon={false}
                    closeFun={() => {}}
                    key={user}
                    type=""
                    value={user}
                  />
                ))}
              </Box>
            </div>
          )}
          {data?.extra?.environment && (
            <div style={{ paddingBottom: "12px" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "10px" }}
                className="custom-tooltip-title"
              >
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* <CommandIcon
                    width={20}
                    height={20}
                    pathClassName="custom-tooltip-icon"
                  /> */}
                  {UI_TEXTS.LABELS.ENVIRONMENTS}
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                {data?.extra?.environment?.map((env) => (
                  <CustomPill
                    showCloseIcon={false}
                    closeFun={() => {}}
                    key={env}
                    type=""
                    value={env}
                  />
                ))}
              </Box>
            </div>
          )}

          {data?.extra?.cmdb && (
            <div style={{ paddingBottom: "12px" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "10px" }}
                className="custom-tooltip-title"
              >
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* <CommandIcon
                    width={20}
                    height={20}
                    pathClassName="custom-tooltip-icon"
                  /> */}
                  {UI_TEXTS.LABELS.SERVER_DETAILS}
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <span>
                  <strong>{UI_TEXTS.TABLE_TEXTS.ENVIRONMENT} :</strong>{" "}
                  {data?.extra?.cmdb?.ciSapNameEnv ?? ""}
                </span>
                <span>
                  <strong>{UI_TEXTS.TABLE_TEXTS.REGION} :</strong>{" "}
                  {data?.extra?.cmdb?.slRegion ?? ""}
                </span>

                <span>
                  <strong>{UI_TEXTS.TABLE_TEXTS.PLATFORM} :</strong>{" "}
                  {data?.extra?.cmdb?.slPlatform ?? ""}
                </span>

                <span>
                  <strong>{UI_TEXTS.TABLE_TEXTS.SID} :</strong>{" "}
                  {data?.extra?.cmdb?.ciSapNameSid ?? ""}
                </span>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    width: "100%",
                  }}
                >
                  <span>
                    <strong>{UI_TEXTS.TABLE_TEXTS.CI} :</strong>{" "}
                    {data?.extra?.cmdb?.ciSapName ?? ""}
                  </span>
                  <span>
                    <strong>{UI_TEXTS.TABLE_TEXTS.VIRTUAL_PKG} :</strong>{" "}
                    {data?.extra?.cmdb?.sapVirtualPkg ?? ""}
                  </span>
                </Box>
              </Box>
            </div>
          )}
        </Box>
      );
    };
    return (
      <div className="labelled-input-container" ref={ref}>
        {!hideLabel ? (
          <div>
            <div className="label-header">
              <InputLabel
                className="input-label"
                htmlFor={id}
                style={{
                  fontSize: labelFontSize,
                  color: "#05060f",
                  fontFamily: "'Manrope-Bold'",
                }}
              >
                {label}
                {isRequired && (
                  <span
                    style={{
                      color: "red",
                      marginLeft: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    *
                  </span>
                )}
              </InputLabel>
              {optionalHeader && (
                <span className="optional-header">{optionalHeader}</span>
              )}
            </div>
            {optionalDescription && (
              <div className="optional-description">{optionalDescription}</div>
            )}
          </div>
        ) : (
          <></>
        )}
        <FormControl
          fullWidth
          variant="outlined"
          className="custom-form-control"
          error={!!error}
        >
          {type === "select" ? (
            <Select
              id={id}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={onFocus}
              displayEmpty
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              renderValue={(selected) => {
                if (
                  (Array.isArray(selected) && selected?.length === 0) ||
                  (!Array.isArray(selected) && !selected)
                ) {
                  return (
                    <span
                      className="placeholder"
                      style={{ fontSize: inputFontSize, background: "white" }}
                    >
                      {placeholder}
                    </span>
                  );
                }
                return Array.isArray(selected)
                  ? selected
                      .map((sel) => {
                        const option = options.find((opt) => opt.id === sel);
                        return (
                          <Box key={option?.id} className="dropdown-value">
                            {option?.icon && (
                              <Box component="span" className="icon">
                                {option.icon}
                              </Box>
                            )}
                            {option?.label}
                          </Box>
                        );
                      })
                      .join(", ")
                  : (() => {
                      const option = options.find((opt) => opt.id === selected);
                      return (
                        <Box className="dropdown-value">
                          {option?.icon && (
                            <Box component="span" className="icon">
                              {option.icon}
                            </Box>
                          )}
                          {option?.label}
                        </Box>
                      );
                    })();
              }}
              input={
                <OutlinedInput
                  label={label}
                  className={`custom-input ${
                    hideLabel ? "" : "custom-input-margin"
                  }`}
                />
              }
              IconComponent={ArrowDown2}
            >
              {options?.length === 0 && !loading && (
                <MenuItem value="" disabled className="placeholder">
                  {UI_TEXTS.NOT_FOUND.NO_RECORDS}
                </MenuItem>
              )}

              {loading && (
                <MenuItem value="" disabled className="placeholder">
                  {UI_TEXTS.LOADING.LOADING}
                </MenuItem>
              )}
              <Divider classes={{ root: "dropdown-divider" }} />
              {options.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  style={{
                    fontWeight:
                      Array.isArray(value) && value?.indexOf(option?.id) > -1
                        ? "bold"
                        : "normal",
                  }}
                >
                  {option.icon && (
                    <Box component="span" className="icon">
                      {option.icon}
                    </Box>
                  )}
                  <ListItemText
                    primary={option.label}
                    classes={{ primary: "list-item-primary" }}
                  />
                </MenuItem>
              ))}
            </Select>
          ) : type === "select-with-search" ? (
            <Select
              id={id}
              name={name}
              value={value}
              onChange={() => {}}
              onSelect={() => {}}
              onKeyDown={() => {}}
              onKeyUp={() => {}}
              displayEmpty
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              } custom-select-box`}
              renderValue={(selected) => {
                if (selected?.length === 0) {
                  return (
                    <span
                      className="placeholder"
                      style={{ fontSize: inputFontSize, background: "white" }}
                    >
                      {placeholder}
                    </span>
                  );
                }
                return options.find((opt) => opt.id === selected)?.label || "";
              }}
              input={
                <OutlinedInput
                  label={label}
                  className={`custom-input ${
                    hideLabel ? "" : "custom-input-margin"
                  } custom-select-box`}
                />
              }
              IconComponent={ArrowDown2}
              MenuProps={{
                disableAutoFocusItem: true,
                classes: { paper: "custom-select-box" },
              }}
            >
              <div style={{ padding: 0 }}>
                <div className="label_search-container">
                  <SearchNormal1 size="20" color="#CCD4DE" />
                  <input
                    className="label_custom-search"
                    placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH}
                    value={searchTerm}
                    onChange={(event) => {
                      event.stopPropagation();
                      setSearchTerm(event.target.value);
                    }}
                    onClick={(event) => event.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>

              {loading && (
                <MenuItem value="" disabled>
                  {UI_TEXTS.LOADING.LOADING}
                </MenuItem>
              )}
              {filteredOptions?.length === 0 && !loading ? (
                <MenuItem value="" disabled>
                  {UI_TEXTS.NOT_FOUND.NO_RECORDS}
                </MenuItem>
              ) : (
                <div className="options-wrapper">
                  {filteredOptions.map((option) => (
                    <Tooltip
                      key={option.id}
                      title={
                        option.extra && (
                          <CustomTooltipContent
                            data={option}
                            tooltipType={tooltipType}
                          />
                        )
                      }
                      placement="right"
                      arrow
                      classes={{ popper: "custom-tooltip" }}
                      className="custom-tooltip"
                    >
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        onClick={(e) =>
                          onChange({ target: { name, value: option.id } })
                        }
                        selected={value === option.id}
                      >
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    </Tooltip>
                  ))}
                </div>
              )}
            </Select>
          ) : type === "multi-select" ? (
            <Select
              id={id}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={onFocus}
              displayEmpty
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              multiple
              renderValue={(selected) => {
                if (Array.isArray(selected) && selected?.length === 0) {
                  return (
                    <span
                      className="placeholder"
                      style={{ fontSize: inputFontSize, background: "white" }}
                    >
                      {placeholder}
                    </span>
                  );
                }

                if (Array.isArray(selected) && showSelectedCount) {
                  return `${selected?.length} Selected`;
                }

                return Array.isArray(selected)
                  ? selected
                      .map(
                        (sel) => options.find((opt) => opt.id === sel)?.label
                      )
                      .join(", ")
                  : options.find((opt) => opt.id === selected)?.label || "";
              }}
              input={
                <OutlinedInput
                  label={label}
                  className={`custom-input ${
                    hideLabel ? "" : "custom-input-margin"
                  }`}
                />
              }
              IconComponent={ArrowDown2}
            >
              {options?.length === 0 && !loading && (
                <MenuItem value="" disabled className="placeholder">
                  {UI_TEXTS.NOT_FOUND.NO_RECORDS}
                </MenuItem>
              )}
              {loading && (
                <MenuItem value="" disabled className="placeholder">
                  {UI_TEXTS.LOADING.LOADING}
                </MenuItem>
              )}

              <Divider classes={{ root: "dropdown-divider" }} />

              {options.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  classes={{ root: "menu-item" }}
                >
                  <Checkbox checked={value?.indexOf(option?.id) > -1} />
                  <ListItemText
                    primary={option.label}
                    classes={{ primary: "list-item-primary" }}
                  />
                </MenuItem>
              ))}
            </Select>
          ) : type === "multi-select-with-search" ? (
            <Select
              disabled={disabled}
              size={size}
              id={id}
              name={name}
              value={value}
              onChange={() => {}}
              onSelect={() => {}}
              onKeyDown={() => {}}
              onKeyUp={() => {}}
              // onFocus={() => {
              //   setOpenDropdown(!openDropdown);
              // }}
              onOpen={() => setOpenDropdown(true)}
              onClose={() => {
                setOpenDropdown(false);
                enableServerFilter ? setSearchText("") : setSearchTerm("");
              }}
              displayEmpty
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              } custom-select-box`}
              multiple
              renderValue={(selected) => {
                if (!selected || selected?.length === 0) {
                  return (
                    <span
                      className="placeholder"
                      style={{ fontSize: inputFontSize, background: "white" }}
                    >
                      {placeholder}
                    </span>
                  );
                }

                return selected
                  .map((sel) => options.find((opt) => opt.id === sel)?.label)
                  .join(", ");
              }}
              input={
                <OutlinedInput
                  label={label}
                  className={`custom-input ${
                    hideLabel ? "" : "custom-input-margin"
                  } custom-select-box`}
                />
              }
              IconComponent={ArrowDown2}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 300, overflow: "auto" },
                  onScroll: enableServerFilter ? handleScroll : null,
                },
                disableAutoFocusItem: true,
                classes: { paper: "custom-select-box" },
              }}
            >
              <div style={{ padding: 0 }}>
                <div className="label_search-container">
                  <SearchNormal1 size="20" color="#CCD4DE" />
                  <input
                    className="label_custom-search"
                    placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH}
                    value={enableServerFilter ? searchText : searchTerm}
                    onBlur={enableServerFilter ? handleSearchBlur : null}
                    onChange={(event) => {
                      enableServerFilter
                        ? handleSearchInputChange(event)
                        : setSearchTerm(event.target.value);
                      event.stopPropagation();
                    }}
                    autoFocus
                  />
                  {(enableServerFilter ? searchText : searchTerm) && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        enableServerFilter
                          ? setSearchText("")
                          : setSearchTerm("");
                      }}
                      sx={{ p: "4px", mr: 1 }}
                    >
                      <CloseCircle size="20" color="#888" />
                    </IconButton>
                  )}
                </div>
              </div>

              {(loading || lazyLoading) && (
                <MenuItem value="" disabled>
                  {lazyLoading && searchText.trim() !== ""
                    ? UI_TEXTS.LOADING.SEARCHING
                    : UI_TEXTS.LOADING.LOADING}
                </MenuItem>
              )}

              <MenuItem value="" className="placeholder">
                {Array.isArray(value) && (
                  <span>
                    {`${value.length} `}
                    {value.length === 1
                      ? UI_TEXTS.LABELS.ITEM_SELECTED
                      : UI_TEXTS.LABELS.ITEMS_SELECTED}
                  </span>
                )}
              </MenuItem>

              {sortedOptions?.length === 0 && !loading ? (
                <span>
                  <MenuItem value="" disabled>
                    {UI_TEXTS.NOT_FOUND.NO_RECORDS}
                  </MenuItem>
                  {iscreateItem && searchTerm !== "" && (
                    <MenuItem
                      disabled={isItemLoading}
                      value=""
                      style={{ gap: "8px" }}
                      onClick={(e) => createItem()}
                    >
                      {`${searchTerm} (Create new directory)`}
                    </MenuItem>
                  )}
                </span>
              ) : (
                <div className="options-wrapper">
                  <MenuItem style={{ gap: "8px" }}>
                    <Checkbox
                      checked={sortedOptions.every((option) =>
                        value.includes(option.id)
                      )}
                      indeterminate={
                        sortedOptions.some((option) =>
                          value.includes(option.id)
                        ) &&
                        !sortedOptions.every((option) =>
                          value.includes(option.id)
                        )
                      }
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newValues = checked
                          ? [
                              ...new Set([
                                ...value,
                                ...sortedOptions.map((opt) => opt.id),
                              ]),
                            ]
                          : value.filter(
                              (id) =>
                                !sortedOptions.some((opt) => opt.id === id)
                            );
                        onChange({ target: { name, value: newValues } });
                      }}
                    />
                    {/* <ListItemText primary="Select All" /> */}
                    <ListItemText
                      primary={
                        sortedOptions.every((option) =>
                          value.includes(option.id)
                        )
                          ? "Deselect All"
                          : "Select All"
                      }
                    />
                  </MenuItem>
                  {tooltipType
                    ? sortedOptions.map((option) => (
                        <Tooltip
                          key={option.id}
                          title={
                            option.extra && (
                              <CustomTooltipContent
                                data={option}
                                tooltipType={tooltipType}
                              />
                            )
                          }
                          placement="right"
                          arrow
                          classes={{ popper: "custom-tooltip" }}
                          className="custom-tooltip"
                        >
                          <MenuItem
                            key={option.id}
                            value={option.id}
                            style={{ gap: "8px" }}
                            onClick={(e) => handleOptionSelect(e, option.id)}
                          >
                            <Checkbox checked={value.includes(option.id)} />
                            <ListItemText primary={option.label} />
                          </MenuItem>
                        </Tooltip>
                      ))
                    : sortedOptions.map((option) => (
                        <MenuItem
                          key={option.id}
                          value={option.id}
                          style={{ gap: "8px" }}
                          onClick={(e) => handleOptionSelect(e, option.id)}
                        >
                          <Checkbox checked={value.includes(option.id)} />
                          <ListItemText primary={option.label} />
                        </MenuItem>
                      ))}
                  {lazyLoading && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <CircularProgress size={28} />
                    </div>
                  )}

                  {iscreateItem && searchTerm !== "" && (
                    <MenuItem
                      value=""
                      style={{ gap: "8px" }}
                      onClick={(e) => createItem()}
                    >
                      {`${searchTerm} (Create new directory)`}
                    </MenuItem>
                  )}
                </div>
              )}
            </Select>
          ) : type === "textarea" ? (
            <OutlinedInput
              id={id}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={onFocus}
              className={`custom-input-textarea ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              multiline
              style={customStyle}
              rows={rows}
            />
          ) : type === "radio" ? (
            <RadioGroup
              id={id}
              value={value}
              onFocus={onFocus}
              onChange={(event) => handleChange(event)}
              className={`custom-radio-group ${
                optionalDescription ? "with-description" : ""
              }`}
              row
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  control={
                    <Radio
                      className="custom-radio"
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: inputFontSize,
                        },
                      }}
                    />
                  }
                  label={option.label}
                  className={`${
                    value === option.value
                      ? "radio-label-active"
                      : "radio-label-inactive"
                  } custom-radio-label`}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: labelFontSize,
                    },
                  }}
                />
              ))}
            </RadioGroup>
          ) : type === "date" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {showTime ? (
                <DateTimePicker
                  size={size}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: size ? "44px" : "60px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderStyle: "none",
                    },
                  }}
                  className={`custom-date-input ${
                    hideLabel ? "" : "custom-date-input-margin"
                  }`}
                  value={value ? dayjs(value) : null}
                  // min={disablePastDates ? dayjs() : disableFromDate}
                  minDate={dayjs()}
                  max={disableToDate ? dayjs(disableToDate) : null}
                  onChange={handleDateChange}
                  format="DD-MMM-YYYY hh:mm A"
                  slotProps={{
                    textField: {
                      id,
                      name,
                      placeholder,
                    },
                  }}
                />
              ) : (
                <DatePicker
                  size={size}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: size ? "44px" : "60px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderStyle: "none",
                    },
                  }}
                  className={`custom-date-input ${
                    hideLabel ? "" : "custom-date-input-margin"
                  }`}
                  value={value ? dayjs(value) : null}
                  minDate={disableFromDate ? dayjs(disableFromDate) : null}
                  maxDate={disableToDate ? dayjs(disableToDate) : null}
                  onChange={handleDateChange}
                  format="DD-MMM-YYYY"
                  slotProps={{
                    textField: {
                      id,
                      name,
                      placeholder,
                    },
                  }}
                />
              )}
            </LocalizationProvider>
          ) : type === "number" ? (
            <OutlinedInput
              id={id}
              name={name}
              placeholder={placeholder}
              value={value}
              endAdornment={
                seconds && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        height: "1.7em",
                        width: "1px",
                        backgroundColor: "#ccc",
                      }}
                    />
                    <span>{UI_TEXTS.LABELS.SEC}</span>
                  </div>
                )
              }
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue >= min && newValue <= max) {
                  handleChange(e);
                } else {
                  e.target.value = value;
                }
              }}
              onFocus={onFocus}
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              inputProps={{
                "aria-label": label,
                type: "number",
                min,
                max,
                style: { fontSize: inputFontSize },
              }}
            />
          ) : type === "password" ? (
            <OutlinedInput
              id={id}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={onFocus}
              type={showPassword ? "text" : "password"}
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              inputProps={{
                "aria-label": label,
                style: { fontSize: inputFontSize },
              }}
              endAdornment={
                !hideEyeIcon ? (
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ) : (
                  <></>
                )
              }
            />
          ) : type === "search" ? (
            <OutlinedInput
              id={id}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={onFocus}
              onKeyPress={onKeyPress}
              type="text"
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              inputProps={{
                "aria-label": label,
                style: { fontSize: inputFontSize },
              }}
              size={size}
              startAdornment={
                <InputAdornment className="cursor_pointer" position="start">
                  <SearchNormal1 size="20" color="#CCD4DE" />
                </InputAdornment>
              }
            />
          ) : (
            <OutlinedInput
              id={id}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              className={`custom-input ${
                hideLabel ? "" : "custom-input-margin"
              }`}
              inputProps={{
                "aria-label": label,
                style: { fontSize: inputFontSize },
              }}
              type={type}
              disabled={disabled}
              size={size}
            />
          )}
          {error && (
            <FormHelperText className="error-message">{error}</FormHelperText>
          )}
        </FormControl>
      </div>
    );
  }
);

LabelledInput.displayName = "LabelledInput";

export default LabelledInput;
