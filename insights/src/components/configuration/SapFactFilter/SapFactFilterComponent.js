import { useState } from "react";
import SapFactsFilterDropdown from "./SapFactFilterDropdown";
import Filter from "../../../assets/images/Filter.png";
import { Dialog, Tooltip } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import CustomPill from "../../common/CustomPill/CustomPill";
import { UI_TEXTS } from "../../common/Constants/label-contants";

const SapFactFilters = ({
  parentComponent,
  getHostData,
  searchFilter,
  itemsPerPage,
  currentPage,
  sapFactsFilterOptions,
  setSapFactsFilterSelectedOptions,
  sapFactsFilterSelectedOptions,
  handleSapFactsFiltersSelectionChange,
  setRecentFilter = (params) => {},
}) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const toggleAdvancedFilters = () => {
    setFiltersVisible((prev) => !prev);
  };
  const onClearAllFilters = () => {
    setSapFactsFilterSelectedOptions([]);
  };

  const onRemoveFilter = (filterKey, value) => {
    const { [filterKey]: removed, ...rest } = sapFactsFilterSelectedOptions;
    setSapFactsFilterSelectedOptions(rest);
  };

  const truncatedValues = (filterValues) => {
    return filterValues.length > 3
      ? `${filterValues.slice(0, 3).join(", ")}...`
      : filterValues.join(", ");
  };

  const renderPills = () => (
    <>
      {Object.entries(sapFactsFilterSelectedOptions)
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
                    value={`${getFilterLabel(filterKey)}: ${truncatedValues}`}
                  />
                </span>
              </Tooltip>
            );
          } else if (typeof filterValues === "string") {
            return (
              <CustomPill
                key={filterKey}
                showCloseIcon={true}
                // closeFun={() => onRemoveFilter(filterKey)}
                type={filterKey}
                value={`${filterKey}: ${filterValues}`}
              />
            );
          }
          return null;
        })}
      {Object.values(sapFactsFilterSelectedOptions).some(
        (val) => val?.length > 0
      ) && (
        <span className="clear_filters" onClick={onClearAllFilters}>
          {UI_TEXTS.LABELS.CLEAR_ALL}
        </span>
      )}
    </>
  );
  const getFilterLabel = (key) => {
    if (typeof key === "string" && key.includes("-of-")) {
      const arr = key.split("-of-");
      return `${arr[2]} (${arr[1]})`;
    }
    if (key === "hostname") return "Hostname";
    else if (key === "accountToSudo") return "Account To Sudo";
    else if (key === "osInstance") return "Instance";
    else if (key === "osInstanceType") return "Instance Type";
    else if (key === "osSystemId") return "System ID";
    return key;
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sapFactsFilterSelectedOptions?.hostname && (
          // <div>
          <Tooltip
            key={"hostname"}
            title={sapFactsFilterSelectedOptions["hostname"]?.join(", ")}
            arrow
            placement="top"
          >
            {/* <span> */}
            <CustomPill
              showCloseIcon={true}
              closeFun={() =>
                sapFactsFilterSelectedOptions["hostname"]?.forEach((value) =>
                  onRemoveFilter("hostname", value)
                )
              }
              type={`CustomServerFilter`}
              value={`${getFilterLabel("hostname")}: ${truncatedValues(
                sapFactsFilterSelectedOptions["hostname"]
              )}`}
            />
            {/* </span> */}
          </Tooltip>
          // </div>
        )}
        {sapFactsFilterSelectedOptions?.accountToSudo && (
          <div>
            <Tooltip
              key={"accountToSudo"}
              title={sapFactsFilterSelectedOptions["accountToSudo"]?.join(", ")}
              arrow
              placement="top"
            >
              <span>
                <CustomPill
                  showCloseIcon={true}
                  closeFun={() =>
                    sapFactsFilterSelectedOptions["accountToSudo"]?.forEach(
                      (value) => onRemoveFilter("accountToSudo", value)
                    )
                  }
                  type={`CustomServerFilter`}
                  value={`${getFilterLabel("accountToSudo")}: ${truncatedValues(
                    sapFactsFilterSelectedOptions["accountToSudo"]
                  )}`}
                />
              </span>
            </Tooltip>
          </div>
        )}
        {sapFactsFilterSelectedOptions?.osInstance && (
          <div>
            <Tooltip
              key={"osInstance"}
              title={sapFactsFilterSelectedOptions["osInstance"]?.join(", ")}
              arrow
              placement="top"
            >
              <span>
                <CustomPill
                  showCloseIcon={true}
                  closeFun={() =>
                    sapFactsFilterSelectedOptions["osInstance"]?.forEach(
                      (value) => onRemoveFilter("osInstance", value)
                    )
                  }
                  type={`CustomServerFilter`}
                  value={`${getFilterLabel("osInstance")}: ${truncatedValues(
                    sapFactsFilterSelectedOptions["osInstance"]
                  )}`}
                />
              </span>
            </Tooltip>
          </div>
        )}
        {sapFactsFilterSelectedOptions?.osInstanceType && (
          <div>
            <Tooltip
              key={"osInstanceType"}
              title={sapFactsFilterSelectedOptions["osInstanceType"]?.join(
                ", "
              )}
              arrow
              placement="top"
            >
              <span>
                <CustomPill
                  showCloseIcon={true}
                  closeFun={() =>
                    sapFactsFilterSelectedOptions["osInstanceType"]?.forEach(
                      (value) => onRemoveFilter("osInstanceType", value)
                    )
                  }
                  type={`CustomServerFilter`}
                  value={`${getFilterLabel(
                    "osInstanceType"
                  )}: ${truncatedValues(
                    sapFactsFilterSelectedOptions["osInstanceType"]
                  )}`}
                />
              </span>
            </Tooltip>
          </div>
        )}
        {sapFactsFilterSelectedOptions?.osSystemId && (
          <div>
            <Tooltip
              key={"osSystemId"}
              title={sapFactsFilterSelectedOptions["osSystemId"]?.join(", ")}
              arrow
              placement="top"
            >
              <span>
                <CustomPill
                  showCloseIcon={true}
                  closeFun={() =>
                    sapFactsFilterSelectedOptions["osSystemId"]?.forEach(
                      (value) => onRemoveFilter("osSystemId", value)
                    )
                  }
                  type={`CustomServerFilter`}
                  value={`${getFilterLabel("osSystemId")}: ${truncatedValues(
                    sapFactsFilterSelectedOptions["osSystemId"]
                  )}`}
                />
              </span>
            </Tooltip>
          </div>
        )}
        {(sapFactsFilterSelectedOptions.hostname ||
          sapFactsFilterSelectedOptions.accountToSudo ||
          sapFactsFilterSelectedOptions.osInstance ||
          sapFactsFilterSelectedOptions.osInstanceType ||
          sapFactsFilterSelectedOptions.osSystemId) && (
          <span className="clear_filters" onClick={onClearAllFilters}>
            {UI_TEXTS.LABELS.CLEAR_ALL}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {parentComponent === "sapFacts" && (
          <SapFactsFilterDropdown
            label={"Hostname"} // or nicer label mapping
            options={sapFactsFilterOptions["hostname"]}
            selectedValues={sapFactsFilterSelectedOptions["hostname"] || []}
            onChange={(vals) =>
              handleSapFactsFiltersSelectionChange("hostname", vals)
            }
          />
        )}
        <SapFactsFilterDropdown
          parentComponent={parentComponent}
          label={"Account To Sudo"} // or nicer label mapping
          options={sapFactsFilterOptions["accountToSudo"]}
          selectedValues={sapFactsFilterSelectedOptions["accountToSudo"] || []}
          onChange={(vals) =>
            handleSapFactsFiltersSelectionChange("accountToSudo", vals)
          }
        />
        <SapFactsFilterDropdown
          parentComponent={parentComponent}
          label={"Instance"} // or nicer label mapping
          options={sapFactsFilterOptions["osInstance"]}
          selectedValues={sapFactsFilterSelectedOptions["osInstance"] || []}
          onChange={(vals) =>
            handleSapFactsFiltersSelectionChange("osInstance", vals)
          }
        />
        <SapFactsFilterDropdown
          parentComponent={parentComponent}
          label={"Instance Type"} // or nicer label mapping
          options={sapFactsFilterOptions["osInstanceType"]}
          selectedValues={sapFactsFilterSelectedOptions["osInstanceType"] || []}
          onChange={(vals) =>
            handleSapFactsFiltersSelectionChange("osInstanceType", vals)
          }
        />
        <SapFactsFilterDropdown
          parentComponent={parentComponent}
          label={"System ID"} // or nicer label mapping
          options={sapFactsFilterOptions["osSystemId"]}
          selectedValues={sapFactsFilterSelectedOptions["osSystemId"] || []}
          onChange={(vals) =>
            handleSapFactsFiltersSelectionChange("osSystemId", vals)
          }
        />
        {parentComponent === "sapFacts" && (
          <div>
            <button
              style={{
                height: "45px",
                borderRadius: "25px",
                backgroundColor: "transparent",
                border: "1px solid #CCD4DE",
              }}
              onClick={toggleAdvancedFilters}
            >
              <img src={Filter} style={{ padding: "0 5px" }} />
              <span
                style={{
                  fontFamily: "Manrope",
                  fontSize: "16px",
                  lineHeight: "20px",
                  letterSpacing: "0%",
                  padding: "8px",
                  opacity: "0.5",
                }}
              >
                {/* {UI_TEXTS.FILTERS_TEXT.FILTERS} */}
                Advanced Filters
              </span>
            </button>
          </div>
        )}
        {/* {Object.keys(sapFactsFilterOptions).map((key) => {
          return (
            <div key={key} style={{}}>
              <SapFactsFilterDropdown
                label={getFilterLabel(key)} // or nicer label mapping
                options={sapFactsFilterOptions[key]}
                selectedValues={sapFactsFilterSelectedOptions[key] || []}
                onChange={(vals) =>
                  handleSapFactsFiltersSelectionChange(key, vals)
                }
              />
            </div>
          );
        })} */}
      </div>
      <Dialog
        open={filtersVisible}
        onClose={toggleAdvancedFilters}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            margin: "auto",
            minWidth: "650px",
            minHeight: "350px",
            //   maxHeight: modalData?.field === "variableMapping" ? "750px" : null,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #cdcdcd",
            color: "#2B87E3",
            fontSize: "20px",
            padding: "10px 15px",
          }}
        >
          <p
            className="left-panel-title"
            style={{ margin: 0, fontWeight: 500 }}
          >
            {"SAP Facts Advanced Filters"}
          </p>
          <p
            style={{
              cursor: "pointer",
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
            onClick={toggleAdvancedFilters}
          >
            <RxCross2 size={22} />
          </p>
        </div>
        <div style={{ padding: "20px" }}>
          <div>
            <div>{renderPills()}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {Object.keys(sapFactsFilterOptions).map((key) => {
              return (
                <div key={key} style={{}}>
                  <SapFactsFilterDropdown
                    label={getFilterLabel(key)} // or nicer label mapping
                    options={sapFactsFilterOptions[key]}
                    selectedValues={sapFactsFilterSelectedOptions[key] || []}
                    onChange={(vals) =>
                      handleSapFactsFiltersSelectionChange(key, vals)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SapFactFilters;
