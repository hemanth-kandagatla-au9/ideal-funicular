import React, { useState } from "react";
import { Tooltip, Typography } from "@mui/material";
import LabelledInput from "../LabelInput/LabelledInput";
import CustomPill from "../CustomPill/CustomPill";
import "./CustomFilters.css";
import "../LabelInput/LabelledInput.css";
import { UI_TEXTS } from "../Constants/label-contants";
import DateRangePicker from "../../ui/dateRangePicker/DateRangePicker";

const CustomFilter = ({
  filtersConfig,
  recentFilter,
  filterLoading,
  appliedFilters,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
  filterTitle,
  selectedPosition = "top",
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  renderDateRangePicker = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const startDate = appliedFilters["startDate"];
  const endDate = appliedFilters["endDate"];

  const renderPills = () => (
    <>
      {Object.entries(appliedFilters)
        .filter(([filterKey, filterValues]) => filterValues?.length > 0)
        .map(([filterKey, filterValues]) => {
          if (filterKey === "startDate" || filterKey === "endDate") {
            return null;
          }
          if (Array.isArray(filterValues)) {
            const truncatedValues =
              filterValues.length > 3
                ? `${filterValues.slice(0, 3).join(", ")}...`
                : filterValues.join(", ");
            return (
              <Tooltip
                key={filterKey}
                title={filterValues.join(", ")}
                arrow
                placement="top"
              >
                <span>
                  <CustomPill
                    showCloseIcon={true}
                    closeFun={() =>
                      filterValues.forEach((value) =>
                        onRemoveFilter(filterKey, value)
                      )
                    }
                    type={`CustomServerFilter`}
                    value={`${filterKey?.toUpperCase()}: ${truncatedValues}`}
                  />
                </span>
              </Tooltip>
            );
          } else if (typeof filterValues === "string") {
            return (
              <CustomPill
                key={filterKey}
                showCloseIcon={true}
                closeFun={() => onRemoveFilter(filterKey)}
                type={filterKey}
                value={`${filterKey}: ${filterValues}`}
              />
            );
          }
          return null;
        })}
      {Object.values(appliedFilters).some((val) => val?.length > 0) && (
        <span className="clear_filters" onClick={onClearAllFilters}>
          {UI_TEXTS.LABELS.CLEAR_ALL}
        </span>
      )}
    </>
  );

  return (
    <div style={{ width: "100%" }}>
      <div className="filter_header">
        {filterTitle && (
          <Typography
            className="custom-label"
            style={{
              // marginLeft: filterTitle ? "1rem" : "0", // simpler
              marginTop: "0.7rem",
              fontWeight: 600,
              fontFamily: "Manrope",
            }}
          >
            {filterTitle}
          </Typography>
        )}

        <div className="pills-container">
          {selectedPosition === "top" && renderPills()}
        </div>
      </div>

      <div className={`filter_area ${isOpen ? "open" : ""}`}>
        <div className="filters_container">
          <div className="server_filter_section">
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
                        onFilterChange(id, e.target.value);
                        if (onChange) {
                          onChange(e);
                        }
                      }}
                      onBlur={onBlur}
                      ref={React.createRef()}
                    />
                  )}
                </div>
              )
            )}
            {renderDateRangePicker && (
              <DateRangePicker
                startDate={fromDate}
                setStartDate={setFromDate}
                endDate={toDate}
                setEndDate={setToDate}
                borderRadius={"25px"}
              />
            )}
          </div>
        </div>
      </div>
      {selectedPosition === "bottom" && (
        <div className="pills-container">{renderPills()}</div>
      )}
    </div>
  );
};

export default CustomFilter;
