import React, { useState } from "react";
import { Tooltip, Typography } from "@mui/material";
import LabelledInput from "../LabelInput/LabelledInput";
import CustomPill from "../CustomPill/CustomPill";
import "./CustomFilters.css";
import "../LabelInput/LabelledInput.css";

const CustomFilterField = ({
  filtersConfig,
  recentFilter,
  filterLoading,
  appliedFilters,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
  label = "",
  disabledField = false,
  readOnlyField = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const startDate = appliedFilters["startDate"];
  const endDate = appliedFilters["endDate"];

  return (
    <div style={{ width: "100%" }}>
      {label ? (
        <h4 className="custom-label" style={{ marginLeft: "1rem" }}>
          {label}
        </h4>
      ) : (
        <></>
      )}
      <div className="">
        {filtersConfig?.map(
          ({
            id,
            type,
            name,
            placeholder,
            options,
            value,
            onChange,
            onBlur,
          }) => (
            <div key={id} style={{ width: "100%" }}>
              {type === "date" ? (
                <LabelledInput
                  hideLabel={true}
                  onChange={(e) => onFilterChange(id, e.target.value)}
                  type="date"
                  id={id}
                  placeholder={``}
                  value={endDate}
                  min={startDate}
                  disablePastDates={false}
                  disableFromDate={startDate}
                  onKeyDown={(e) => e.preventDefault()}
                  size="small"
                />
              ) : (
                <LabelledInput
                  size="small"
                  type="multi-select-with-search"
                  id={id}
                  name={name}
                  label={``}
                  hideLabel={true}
                  loading={filterLoading}
                  placeholder={placeholder}
                  options={options}
                  value={value}
                  onChange={(e) => {
                    // onFilterChange(id, e.target.value);
                    if (onChange) {
                      onChange(e);
                    }
                  }}
                  onBlur={onBlur}
                  ref={React.createRef()}
                  disabled={disabledField}
                  readOnly={readOnlyField}
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomFilterField;
