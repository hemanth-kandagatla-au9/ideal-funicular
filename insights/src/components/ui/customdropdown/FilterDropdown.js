/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./FilterDropdown.css";
import classes from "../../../components/planning/css/tasklist.module.css";
import { getTargets } from "../../../services/jobs/JobsService";
import { useDispatch } from "react-redux";
import { UI_TEXTS } from "../../common/Constants/label-contants";

const FilterDropdown = (props) => {
  const dispatch = useDispatch();
  const {
    isLoading = false,
    id,
    setFilters,
    style: propsStyle,
    placeholder,
    data,
    setCategoriesSelected,
    categoriesSelected,
    categoryTypesSelected,
    setCategoryTypesSelected,
    hostOptionsSelected,
    setHostOptionsSelected,
    tagsOptionsSelected,
    setTagsOptionsSelected,
    setTargetOptionsSelected,
    TargetOptionsSelected,
    frequencyOptionsSelected,
    setFrequencyOptionsSelected,
    scheduleByOptionsSelected,
    setScheduleByOptionsSelected,
    actionTypeOptionsSelected,
    setActionTypeOptionsSelected,
    approvalStatusOptionSelected,
    setApprovalStatusOptionSelected,
    recentFilter = "",
    setRecentFilter = (param) => {},
  } = props;
  const [searchOption, setSearchOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        divRef.current &&
        !divRef.current.contains(event.target) &&
        !event.target.classList.contains(classes.planner_dropbtn)
      ) {
        setFilters({
          FrequencyFilter: false,
          categoryFilter: false,
          hostFilter: false,
          categoryTypeFilter: false,
          TargetFilter: false,
          TagsFilter: false,
          ScheduleByFilter: false,
          actionTypeFilter: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   const handleSearch = async () => {
  //     let updatedData = [];
  //     let filteredSearchData;
  //     if (id === "TargetFilter") {
  //       setFilteredData([]);
  //       if (searchOption) {
  //         filteredSearchData = await dispatch(
  //           getTargets(`?targetName=${searchOption}`)
  //         );
  //       } else {
  //         filteredSearchData = await dispatch(getTargets());
  //       }
  //       updatedData = filteredSearchData?.data?.targets?.map((eachTarget) => ({
  //         optionName: eachTarget.indexName,
  //       }));
  //     } 
  //     else {
  //       setFilteredData([]);
  //       updatedData = searchOption
  //         ? data.filter((option) =>
  //             option?.optionName?.toLowerCase()
  //               .includes(searchOption.toLowerCase())
  //           )
  //         : data;
  //     }
  //     setFilteredData(updatedData);
  //   };

  //   handleSearch();
  // }, [searchOption, data, id]);

const handleSearchChange = (e) => {
  const value = e.target.value;
  const normalizedValue = value.replace(/\s+/g, ' ').trimStart();
  setSearchOption(normalizedValue);
};


  useEffect(() => {
  const handleSearch = async () => {
    let updatedData = [];
    let filteredSearchData;
    
    if (id === "TargetFilter") {
      setFilteredData([]);
      if (searchOption) {
        // For TargetFilter, we need to handle spaces in the API call
        const encodedSearchTerm = encodeURIComponent(searchOption.trim());
        filteredSearchData = await dispatch(
          getTargets(`?targetName=${encodedSearchTerm}`)
        );
      } else {
        filteredSearchData = await dispatch(getTargets());
      }
      updatedData = filteredSearchData?.data?.targets?.map((eachTarget) => ({
        optionName: eachTarget.indexName,
      }));
    } else {
      setFilteredData([]);
        const searchTerm = searchOption.trim().toLowerCase();
      
      if (searchTerm) {
        updatedData = data.filter((option) => {
          const optionName = option?.optionName;
          const searchableName = String(optionName || '').toLowerCase();
          const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
          return searchWords.every(word => searchableName.includes(word));
        });
      } else {
        updatedData = data;
      }
    }  
    setFilteredData(updatedData);
  };

  const timeoutId = setTimeout(handleSearch, 300);
  return () => {
    clearTimeout(timeoutId);
  };
}, [searchOption, data, id]);

  useEffect(() => {
    if (
      hostOptionsSelected &&
      hostOptionsSelected.length > 0 &&
      id === "hostFilter"
    ) {
      setSelectedOptions(hostOptionsSelected);
    } else if (
      TargetOptionsSelected &&
      TargetOptionsSelected.length > 0 &&
      id === "TargetFilter"
    ) {
      setSelectedOptions(TargetOptionsSelected);
    } else if (
      categoriesSelected &&
      categoriesSelected.length > 0 &&
      id === "categoryFilter"
    ) {
      setSelectedOptions(categoriesSelected);
    } else if (
      categoryTypesSelected &&
      categoryTypesSelected.length > 0 &&
      id === "categoryTypeFilter"
    ) {
      setSelectedOptions(categoryTypesSelected);
    } else if (
      frequencyOptionsSelected &&
      frequencyOptionsSelected.length > 0 &&
      id === "FrequencyFilter"
    ) {
      setSelectedOptions(frequencyOptionsSelected);
    } else if (
      scheduleByOptionsSelected &&
      scheduleByOptionsSelected.length > 0 &&
      id === "ScheduleByFilter"
    ) {
      setSelectedOptions(scheduleByOptionsSelected);
    } else if (
      actionTypeOptionsSelected &&
      actionTypeOptionsSelected.length > 0 &&
      id === "actionTypeFilter"
    ) {
      setSelectedOptions(actionTypeOptionsSelected);
    } else if (
      tagsOptionsSelected &&
      tagsOptionsSelected.length > 0 &&
      id === "tagsFilter"
    ) {
      setSelectedOptions(tagsOptionsSelected);
    } else if (
      approvalStatusOptionSelected &&
      approvalStatusOptionSelected.length > 0 &&
      id === "ApprovalStatusFilter"
    ) {
      setSelectedOptions(approvalStatusOptionSelected);
    } else {
      setSelectedOptions([]);
    }
  }, [
    hostOptionsSelected,
    TargetOptionsSelected,
    categoriesSelected,
    categoryTypesSelected,
    frequencyOptionsSelected,
    scheduleByOptionsSelected,
    actionTypeOptionsSelected,
    tagsOptionsSelected,
    approvalStatusOptionSelected,
    id,
    data,
  ]);

  const toggleOption = (option) => {
    const optionName = option.optionName || option;
    const isOptionSelected = selectedOptions.some(
      (item) => item.optionName === optionName
    );

    if (isOptionSelected) {
      setSelectedOptions(
        selectedOptions.filter((item) => item.optionName !== optionName)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSelectAll = () => {
    const allOptions = searchOption ? filteredData : data;
    if (selectedOptions.length === allOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(allOptions);
    }
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
  };
  const handleApply = () => {
    if (id === "categoryFilter") {
      setCategoriesSelected(selectedOptions);
      setRecentFilter("categoryName");
    }
    if (id === "categoryTypeFilter") {
      setCategoryTypesSelected(selectedOptions);
      setRecentFilter("categoryType");
    }
    if (id === "hostFilter") {
      setHostOptionsSelected(selectedOptions);
      setRecentFilter("hostname");
    }
    if (id === "tagsFilter") {
      setTagsOptionsSelected(selectedOptions);
      setRecentFilter("tags");
    }
    if (id === "TargetFilter") {
      setTargetOptionsSelected(selectedOptions);
      setRecentFilter("target");
    }
    if (id === "FrequencyFilter") {
      setFrequencyOptionsSelected(selectedOptions);
      setRecentFilter("frequencies");
    }
    if (id === "ScheduleByFilter") {
      setScheduleByOptionsSelected(selectedOptions);
      setRecentFilter("createdBy");
    }
    if (id === "actionTypeFilter") {
      setActionTypeOptionsSelected(selectedOptions);
      setRecentFilter("actionType");
    }
    if (id === "ApprovalStatusFilter") {
      setApprovalStatusOptionSelected(selectedOptions);
      setRecentFilter("status");
    }

    setFilters({
      categoryFilter: false,
      hostFilter: false,
      categoryTypeFilter: false,
      TargetFilter: false,
      TagsFilter: false,
      FrequencyFilter: false,
      ScheduleByFilter: false,
      actionTypeFilter: false,
    });
  };

  return (
    <div
      className="jobs_filter_container"
      ref={divRef}
      style={propsStyle}
      data-testid="filter-container"
    >
      <input
        type="search"
        placeholder={placeholder}
        value={searchOption}
        className="jobs_filter_search_field"
        data-testid="search-advance-filter-test"
        onChange={handleSearchChange}
      />

      {isLoading ? (
        <div style={{ height: "225px" }}>Loading...</div>
      ) : filteredData?.length === 0 ? (
        <div style={{ height: "225px" }}>No Data Available</div>
      ) : (
        <div style={{ overflow: "auto", height: "225px" }}>
          <div className="jobs_filter_option_container">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={
                selectedOptions?.length === filteredData?.length &&
                filteredData?.length > 0
              }
              className="jobs_filters_checkboxes"
              id="jobs_filter_select_all"
            />
            <span>
              <label
                htmlFor="jobs_filter_select_all"
                className="jobs_filter_options_labels jobs_filter_select_all"
              >
                {UI_TEXTS.LABELS.SELECT_ALL}
              </label>
            </span>
          </div>
          <hr style={{ margin: "0px 0px 5px 0px" }} />

          {filteredData?.map((option, index) => (
            <div key={index} className="jobs_filter_option_container">
              <input
                type="checkbox"
                id={`checkbox-${index}`}
                checked={selectedOptions.some(
                  (item) => item.optionName === option.optionName
                )}
                onChange={() => toggleOption(option)}
                className="jobs_filters_checkboxes"
              />
              <span>
                <label
                  htmlFor={`checkbox-${index}`}
                  className="jobs_filter_options_labels"
                >
                  {option.optionName}
                </label>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="jobs_filters_btn_container">
        <div className="jobs_filters_count_container">
          {selectedOptions.length} Selected
        </div>
        <div style={{ display: "flex" }}>
          {selectedOptions.length > 0 && (
            <div
              className="jobs_filter_select_all jobs_filter_clear_all"
              onClick={handleClearAll}
            >
              {UI_TEXTS.LABELS.CLEAR_ALL}
            </div>
          )}
          <button
            className="jobs_filter_apply_btn"
            onClick={handleApply}
            data-testid="apply-filter-btn"
          >
            {UI_TEXTS.LABELS.APPLY}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
