import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import "./css/report.css";
import FilterIcon from "../../assets/images/Filter.png";
import classes from "../../components/planning/css/subheader.module.css";
import IconStart from "../../assets/images/Icon start.png";
import ReportCard from "./ReportCard/ReportCard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  fetchReportData,
  getUsersList,
} from "../../services/configurations/configService";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";
import MyReportsEmpty from "../../components/common/EmptyPage/MyReportsEmptyPage";
import Search from "../../components/ui/search/Search.component";
import { useDebounce } from "../../utils/useDebounce";
import {
  Select,
  MenuItem,
  FormControl,
  styled,
  Tooltip,
  tooltipClasses,
  ClickAwayListener,
} from "@mui/material";
import { ReportHeaderSkeleton } from "../../utils/CommonUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "../../services/jobs/JobsService";
import FilterDropdown from "../../components/ui/customdropdown/FilterDropdown";
import TagCards from "../../components/planning/TagCards";
import { toast } from "react-toastify";
import { isLoadingInHost } from "../../utils/DetectHost";

const ReportCardSkeleton = () => (
  <div className="report-card-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-circle">
        <div className="skeleton-box"></div>
      </div>
    </div>
    <div className="skeleton-line-1"></div>
    <div className="skeleton-line-2"></div>
    <div className="skeleton-line-3"></div>
  </div>
);

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#eef1ff",
    color: "#7367f0",
    width: "fix-content",
    fontSize: "12px",
    border: "1px solid #dadde9",
  },
}));

function MyReports(props) {
  const dispatch = useDispatch();
  const reportData = useSelector((state) => state?.reports?.reportData.data);
  const categoryOptions =
    useSelector((state) =>
      state?.reports?.reportData?.data?.filterOptions?.categories?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      )
    ) || [];
  const tagOptions =
    useSelector((state) =>
      state?.reports?.reportData?.data?.filterOptions?.tags?.map((eachObj) => ({
        optionName: eachObj,
      }))
    ) || [];
  const createdByOptions =
    useSelector((state) =>
      state?.reports?.reportData?.data?.filterOptions?.createdBy?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      )
    ) || [];
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const ReportTagsData = useSelector((state) => state?.reportTags);
  const totalReport = useSelector(
    (state) => state?.reports?.reportData?.data.totalActiveRecords
  );
  const [sortOption, setSortOption] = useState("sort");
  const [processedReports, setProcessedReports] = useState([]);
  const history = useHistory();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [disableText, setDisableText] = useState(false);
  const [searchText, setSearchText] = useState("");
  const {
    setFilters: propsSetFilters,
    filters: propsFilters,
    showFilters: propsShowFilters,
  } = props;
  const [showPlatformFilters, setShowPlatformFilters] =
    useState(propsShowFilters);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [tagsOptionsSelected, setTagsOptionsSelected] = useState([]);
  const [tagsView, setTagsView] = useState(false);
  const [tagsViewData, setTagsViewData] = useState([]);
  const [tagsViewTagsSelected, setTagsViewTagsSelected] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [showReset, setShowReset] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 800);
  const [dropDownFilterOptions, setFilterDropdownOptions] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
  const [createdByOptionsSelected, setCreatedByOptionsSelected] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeSelected, setDateRangeSelected] = useState(false);
  const [recentFilter, setRecentFilter] = useState("");

  const handleAddReport = () => {
    if (loading) return;
    history.push("/report/create");
  };

  const handleEditReport = (report) => {
    if (loading) return;
    history.push(`/report/edit/${report.id}`);
  };
  const handleCardClick = (reportId) => {
    history.push(`/reports/my-reports/${reportId}`);
  };

  const handleDuplicateReport = (report) => {
    if (loading) return;
    const fullReportData = reportData?.data?.find(
      (item) => item._id === report.id
    );
    console.log("fullReportData", fullReportData);

    if (fullReportData) {
      // Create a clean duplicate object without _id and with updated name
      const duplicateData = {
        reportName: `${fullReportData.reportName}`,
        description: fullReportData.description || "",
        duration: fullReportData.duration || 1,
        jobs: [...(fullReportData.jobs || [])],
        tags: [...(fullReportData.tags || [])],
        scheduleCategory: fullReportData.scheduleCategory,
        templateIcon: fullReportData.templateIcon || "BsCommand",
        columns: fullReportData.columns
          ? fullReportData.columns.map((col) => ({
              job: col.job,
              column: col.column,
              operator: col.operator || "",
              value: col.value || "",
            }))
          : [],
      };
      history.push("/report/create", {
        duplicateData: duplicateData,
        isDuplicate: true,
      });
    }
  };

  const handleDeleteReport = (report) => {
    if (loading) return;
    dispatch(fetchReportData());
  };

  // const loadReports = async (searchQuery = "") => {
  //   setLoading(true);
  //   try {
  //     await dispatch(fetchReportData({ search: searchQuery })).unwrap();
  //   } catch (error) {
  //     console.error("Failed to fetch reports:", error);
  //   } finally {
  //     setLoading(false);
  //     if (initialLoading) {
  //       setInitialLoading(false);
  //     }
  //   }
  // };

  const loadReports = async (
    searchQuery = "",
    categories = [],
    tags = [],
    scheduleByOptionsSelected,
    startDate = "",
    endDate = "",
    recentFilter = ""
  ) => {
    setLoading(true);

    try {
      const payload = { search: searchQuery, recentFilter };

      if (categories.length > 0) {
        payload.categories = categories; // e.g., ["Network", "Security"]
      }

      if (tags.length > 0) {
        payload.tags = tags; // e.g., ["urgent", "weekly"]
      }

      const createdBy = createdByOptionsSelected
        .map((opt) => opt.optionName)
        .join(",");

      if (createdBy) {
        payload.createdBy = createdBy;
      }

      // Add date range to payload only when both dates are selected
      if (startDate && endDate) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }

      console.log("API Payload with date range:", payload); // Debug log

      await dispatch(fetchReportData(payload)).unwrap();
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);

      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      categoriesSelected.length > 0 ||
      (tagsOptionsSelected.length > 0 && !tagsView) ||
      createdByOptionsSelected.length > 0 ||
      (startDate && endDate)
      // categoryTypesSelected.length > 0 ||
      // TargetOptionsSelected.length > 0 ||
      // hostOptionsSelected.length > 0 ||
      // frequencyOptionsSelected.length > 0
    ) {
      setShowReset(true);
    } else if (tagsViewTagsSelected.length > 0 && tagsView) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [
    categoriesSelected,
    // categoryTypesSelected,
    // tagsSelected,
    // TargetOptionsSelected,
    // hostOptionsSelected,
    // frequencyOptionsSelected,
    tagsOptionsSelected,
    createdByOptionsSelected,
    tagsView,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    if (propsFilters?.categoryFilter) {
      setFilterDropdownOptions(categoryOptions);
    }
    if (propsFilters?.TagsFilter) {
      setFilterDropdownOptions(tagOptions);
    }
    if (propsFilters?.CreatedByFilter) {
      setFilterDropdownOptions(createdByOptions);
    }
  }, [propsFilters, propsSetFilters]);

  useEffect(() => {
    loadReports();
  }, [dispatch]);

  //   useEffect(() => {
  //   const selectedCategories = categoriesSelected.map(c => c.optionName);
  //   const selectedTags = tagsView ? tagsViewTagsSelected : tagsSelected;
  //   loadReports("", selectedCategories, selectedTags);
  // }, [dispatch]);

  // Modified useEffect to handle date range properly
  useEffect(() => {
    if (initialLoading) return;
    const selectedCategories = categoriesSelected.map((c) => c.optionName);
    const selectedTags = tagsView
      ? tagsViewTagsSelected
      : tagsOptionsSelected.map((c) => c.optionName);

    // For date range, only include it in the API call when both dates are selected
    const dateRangeToSend = dateRangeSelected
      ? { startDate, endDate }
      : { startDate: "", endDate: "" };

    loadReports(
      debouncedSearchText,
      selectedCategories,
      selectedTags,
      createdByOptionsSelected,
      dateRangeToSend.startDate,
      dateRangeToSend.endDate,
      recentFilter
    );
  }, [
    debouncedSearchText,
    categoriesSelected,
    tagsOptionsSelected,
    tagsView,
    tagsViewTagsSelected,
    createdByOptionsSelected,
    dateRangeSelected, // Only trigger when dateRangeSelected changes
  ]);

  // Effect for debounced search
  // useEffect(() => {
  //   if (initialLoading) return;
  //   loadReports(debouncedSearchText);
  // }, [debouncedSearchText]);

  const handleSearch = (searchQuery) => {
    setSearchText(searchQuery);
  };

  // const applyFiltersAndSort = (
  //   allReports,
  //   searchValue,
  //   sortValue,
  //   categories,
  //   tags
  // ) => {
  //   if (!allReports) return [];

  //   let filtered = [...allReports];

  //   // --- Search Filter ---

  //   if (searchValue) {
  //     filtered = filtered.filter((item) =>
  //       item.reportName?.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   }

  //   // --- Category Filter ---

  //   if (categories && categories.length > 0) {
  //     const selectedCategoryNames = categories.map((c) => c.optionName);
  //     filtered = filtered.filter((item) => {
  //       return selectedCategoryNames.includes(item.scheduleCategory);
  //     });
  //   }

  //   // --- Tags Filter ---

  //   if (tags && tags.length > 0) {
  //     filtered = filtered.filter((item) => {
  //       if (!item.tags || !Array.isArray(item.tags)) return false;
  //       return tags.every((tag) => item.tags.includes(tag));

  //       // OR use .some() for "any tag matches":
  //       // return tags.some(tag => item.tags.includes(tag));
  //     });
  //   }

  //   // --- Sorting ---

  //   const sorted = filtered.sort((a, b) => {
  //     switch (sortValue) {
  //       case "recent":
  //         return new Date(b.createdAt) - new Date(a.createdAt);
  //       case "oldest":
  //         return new Date(a.createdAt) - new Date(b.createdAt);
  //       case "a-z":
  //         return a.reportName.localeCompare(b.reportName);
  //       case "z-a":
  //         return b.reportName.localeCompare(a.reportName);
  //       default:
  //         return 0;
  //     }
  //   });

  //   return sorted;
  // };

 const applySort = (allReports, sortValue) => {
  if (!allReports) return [];

  if (sortValue === "sort") return allReports;

  return [...allReports].sort((a, b) => {
    const nameA = a.reportName?.toLowerCase() || "";
    const nameB = b.reportName?.toLowerCase() || "";

    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;



    switch (sortValue) {
      case "recent":
        return dateB - dateA; 


      case "oldest":
        return dateA - dateB;

      case "a-z":
        return nameA.localeCompare(nameB);

      case "z-a":
        return nameB.localeCompare(nameA);

      default:
        return 0;
    }
  });
};

  // useEffect(() => {
  //   if (reportData?.data) {
  //     const currentTags = tagsView ? tagsViewTagsSelected : tagsSelected;

  //     const updated = applyFiltersAndSort(
  //       reportData.data,
  //       debouncedSearchText,
  //       sortOption,
  //       categoriesSelected,
  //       currentTags
  //     );
  //     setProcessedReports(updated);
  //   }
  // }, [
  //   reportData,
  //   debouncedSearchText,
  //   sortOption,
  //   categoriesSelected,
  //   tagsSelected,
  //   tagsView,
  //   tagsViewTagsSelected,
  // ]);

  // const handleSortChange = (event) => {
  //   const newSortOption = event.target.value;
  //   setSortOption(newSortOption);
  // };

  useEffect(() => {
    if (reportData?.data) {
      const updated = applySort(reportData.data, sortOption);

      setProcessedReports(updated);
    }
  }, [reportData, sortOption]);

  const handleSortChange = (event) => {
    const newSortOption = event.target.value;

    setSortOption(newSortOption);

    // No need to reload from server—just re-sort existing filtered data
  };

  const toggleDropdown = (e) => {
    if (e) {
      if (document.querySelector("#TaskList thead")) {
        document.querySelector("#TaskList thead").style.position = "relative";
      }
    } else {
      if (document.querySelector("#TaskList thead")) {
        document.querySelector("#TaskList thead").style.position = "sticky";
      }
    }
  };

  const handleClearFilter = () => {
    if (tagsView) {
      setTagsViewTagsSelected([]);
    } else {
      setCategoriesSelected([]);
      // setCategoryTypesSelected([]);
      // setHostOptionsSelected([]);
      // setTargetOptionsSelected([]);
      setTagsSelected([]);
      setTagsOptionsSelected([]);
      // setFrequencyOptionsSelected([]);
      setCreatedByOptionsSelected([]);
      // setActionTypeOptionsSelected([]);
      setStartDate("");
      setEndDate("");
      setDateRangeSelected(false);
    }
  };

  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      setDateRangeSelected(true);
      propsSetFilters({
        ...propsFilters,
        dateRangeFilter: false,
      });
      // API call will be triggered by the useEffect due to dateRangeSelected change
    } else {
      toast.error("Please select both start and end dates", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDateRangeClear = () => {
    setStartDate("");
    setEndDate("");
    setDateRangeSelected(false);
    // API call will be triggered by the useEffect due to dateRangeSelected change
  };

  // Handle individual date changes without triggering API
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    // Don't set dateRangeSelected here, wait for Apply button
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    // Don't set dateRangeSelected here, wait for Apply button
  };

  return (
    <div className={isLoadingInHost ? 'platform-reports-wrapper' : ''}>
      {initialLoading ? (
        <ReportHeaderSkeleton />
      ) : (
        <div
          style={{
            margin: "-10px 0px 10px 0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <section>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "Manrope",
                fontSize: "16px",
                color: "#101828",
                fontWeight: 600,
                marginLeft: "15px",
              }}
            >
              {UI_TEXTS.HEADINGS.ALL_REPORTS}{" "}
              <Tooltip title={totalReport ?? 0}>
                <div className="count_forModule_container">
                  <span className="count_forModule_ellipsis">
                    {totalReport ?? 0}
                  </span>
                </div>
              </Tooltip>
            </span>
          </section>

          <div style={{ display: "flex" }}>
            <span style={{ marginRight: "16px" }}>
              <Search
                className={classes.planner_searchBar}
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_REPORT}
                searchIconTowardsRight
                selection="single"
                handleSearchText={handleSearch}
                setSearchTextProp={setSearchText}
                setJobs={reportData.data}
                value={searchText}
                disableIconClick
              />
            </span>
            <FormControl
              sx={{ width: "140px", borderRadius: "8px", marginRight: "16px" }}
            >
              <Select
                value={sortOption}
                onChange={handleSortChange}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "7px 14px",
                  },
                  borderRadius: "16px",
                }}
              >
                <MenuItem
                  value="sort"
                  className="sort-label"
                  sx={{ color: "#999 !important" }}
                >
                  {UI_TEXTS.FILTERS_TEXT.SORT_BY}
                </MenuItem>

                <MenuItem value="recent" className="sort-label">
                  {UI_TEXTS.FILTERS_TEXT.NEWEST_FIRST}
                </MenuItem>
                <MenuItem value="oldest" className="sort-label">
                  {UI_TEXTS.FILTERS_TEXT.OLDEST_FIRST}
                </MenuItem>
                <MenuItem value="a-z" className="sort-label">
                  {UI_TEXTS.FILTERS_TEXT.ALPHABETIC_ORDER}
                </MenuItem>
                <MenuItem value="z-a" className="sort-label">
                  {UI_TEXTS.FILTERS_TEXT.REVERSE_ALPHABETIC_ORDER}
                </MenuItem>
              </Select>
            </FormControl>
            <span style={{ marginRight: "16px" }}>
              {/**Don't  remove the code needed for developemnt  */}
              <div>
                <button
                  style={{
                    width: "100px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "1px solid #eeeeee",
                  }}
                  onClick={() => {
                    if (showPlatformFilters) {
                      setShowPlatformFilters(false);
                    } else setShowPlatformFilters(true);
                  }}
                >
                  <img src={FilterIcon} alt="" />
                  <span
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 600,
                      fontSize: "12px",
                      lineHeight: "20px",
                      letterSpacing: "0%",
                      padding: "8px",
                      color: "#344054",
                    }}
                  >
                    {UI_TEXTS.FILTERS_TEXT.FILTERS}
                  </span>
                </button>
              </div>
            </span>
            {/* Conditionally render New Report button based on write permission */}
            {hasInsightsPermission(
              permissionState,
              "Reports",
              PERMISSION_LIST.REPORTS_WRITE,
            ) && (
              <div
                data-testid="addplannerTaskBtn"
                id="AddTask"
                className={[
                  classes.iabot_addTemplate,
                  classes.iabot_addjob_btn,
                ].join(" ")}
                style={{ width: "128px" }}
                onClick={handleAddReport}
                disabled={loading}
              >
                <img
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  src={IconStart}
                  alt="Add icon"
                />
                {UI_TEXTS.ADD_TEXT.NEW_REPORT}
              </div>
            )}
          </div>
        </div>
      )}
      {showPlatformFilters && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "10vh",
            marginTop: !loading ? "30px" : "5px",
            marginLeft: "-20px",
          }}
        >
          {showPlatformFilters && (
            <div
              style={{ paddingLeft: "10px" }}
              data-testid="assetFilterTest"
              onBlur={() => toggleDropdown(false)}
              onFocus={() => toggleDropdown(true)}
            >
              {/*================== Filter Block Starts==================*/}
              <div className={classes.planner_drpbtnDiv}>
                {/* ==========================hosts filter================================== */}
                {!tagsView && (
                  <>
                    <div
                      data-testid="category-advance-filter-btn"
                      style={{ marginLeft: "24px" }}
                      className={classes.planner_dropbtn}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => false}
                      onClick={() => {
                        if (propsFilters.categoryFilter) {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: true,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        }
                      }}
                    >
                      {UI_TEXTS.FILTERS_TEXT.CATEGORIES}
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{
                          color: "#82807C",
                          marginLeft: "10px",
                          marginRight: "12px",
                        }}
                        data-testid="categories-filter-arrow-icon"
                      />
                    </div>
                    {/* <div
                        data-testid="job-type-adv-filter-btn"
                        style={{ marginLeft: "12px" }}
                        className={classes.planner_dropbtn}
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => false}
                        onClick={() => {
                          if (propsFilters.categoryTypeFilter) {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                            });
                          } else {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: true,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                            });
                          }
                        }}
                      >
                        {UI_TEXTS.FILTERS_TEXT.JOB_TYPE}
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          style={{
                            color: "#82807C",
                            marginLeft: "10px",
                            marginRight: "12px",
                          }}
                        />
                      </div>
                      <div
                        date-testid="host-filter-btn"
                        style={{ marginLeft: "12px" }}
                        className={classes.planner_dropbtn}
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => false}
                        onClick={() => {
                          if (propsFilters.hostFilter) {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                            });
                          } else {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: true,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                            });
                          }
                        }}
                      >
                        {UI_TEXTS.LABELS.HOST}
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          style={{
                            color: "#82807C",
                            marginLeft: "10px",
                            marginRight: "12px",
                          }}
                        />
                      </div> */}
                    <div
                      data-testid="tags-filter-btn"
                      style={{ marginLeft: "12px" }}
                      className={classes.planner_dropbtn}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => false}
                      onClick={() => {
                        if (propsFilters.TagsFilter) {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: true,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        }
                      }}
                    >
                      {UI_TEXTS.LABELS.TAGS}
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{
                          color: "#82807C",
                          marginLeft: "10px",
                          marginRight: "12px",
                        }}
                      />
                    </div>

                    {/* <div
                        data-testid="frequency-filter-btn"
                        style={{ marginLeft: "12px" }}
                        className={classes.planner_dropbtn}
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => false}
                        onClick={() => {
                          if (propsFilters.FrequencyFilter) {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                            });
                          } else {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: true,
                              ScheduleByFilter: false,
                            });
                          }
                        }}
                      >
                        {UI_TEXTS.LABELS.FREQUENCY}
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          style={{
                            color: "#82807C",
                            marginLeft: "10px",
                            marginRight: "12px",
                          }}
                        />
                      </div>

                      

                      <div
                        data-testid="actiontype-filter-btn"
                        style={{ marginLeft: "12px" }}
                        className={classes.planner_dropbtn}
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => false}
                        onClick={() => {
                          if (propsFilters.actionTypeFilter) {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                              actionTypeFilter: false,
                            });
                          } else {
                            propsSetFilters({
                              assetFilter: false,
                              platformFilter: false,
                              categoryFilter: false,
                              hostFilter: false,
                              categoryTypeFilter: false,
                              TargetFilter: false,
                              TagsFilter: false,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
                              actionTypeFilter: true,
                            });
                          }
                        }}
                      >
                        {UI_TEXTS.LABELS.ACTION_TYPE}
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          style={{
                            color: "#82807C",
                            marginLeft: "10px",
                            marginRight: "12px",
                          }}
                        />
                      </div> */}

                    {/* <div
                      data-testid="createdby-filter-btn"
                      style={{ marginLeft: "12px" }}
                      className={classes.planner_dropbtn}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => false}
                      onClick={() => {
                        if (propsFilters.CreatedByFilter) {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: true,
                            dateRangeFilter: false,
                          });
                        }
                      }}
                    >
                      {UI_TEXTS.LABELS.CREATED_BY}
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{
                          color: "#82807C",
                          marginLeft: "10px",
                          marginRight: "12px",
                        }}
                      />
                    </div> */}

                    {/* Date Range Filter */}
                    <div
                      data-testid="date-range-filter-btn"
                      style={{ marginLeft: "12px" }}
                      className={classes.planner_dropbtn}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => false}
                      onClick={() => {
                        if (propsFilters.dateRangeFilter) {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            assetFilter: false,
                            platformFilter: false,
                            categoryFilter: false,
                            hostFilter: false,
                            categoryTypeFilter: false,
                            TargetFilter: false,
                            TagsFilter: false,
                            FrequencyFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: true,
                          });
                        }
                      }}
                    >
                      {UI_TEXTS.FILTERS_TEXT.DATE_RANGE}
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{
                          color: "#82807C",
                          marginLeft: "10px",
                          marginRight: "12px",
                        }}
                      />
                    </div>
                  </>
                )}

                {tagsView && (
                  <div
                    data-testid="tagsview-tags-btn"
                    style={{ marginLeft: "12px" }}
                    className={classes.planner_dropbtn}
                    role="button"
                    tabIndex={0}
                    onKeyUp={() => false}
                    onClick={() => {
                      if (propsFilters.TagsFilter) {
                        propsSetFilters({
                          // assetFilter: false,
                          // platformFilter: false,
                          categoryFilter: false,
                          // hostFilter: false,
                          // categoryTypeFilter: false,
                          // TargetFilter: false,
                          TagsFilter: false,
                          // FrequencyFilter: false,
                          CreatedByFilter: false,
                          dateRangeFilter: false,
                        });
                      } else {
                        propsSetFilters({
                          // assetFilter: false,
                          // platformFilter: false,
                          categoryFilter: false,
                          // hostFilter: false,
                          // categoryTypeFilter: false,
                          // TargetFilter: false,
                          TagsFilter: true,
                          // FrequencyFilter: false,
                          CreatedByFilter: false,
                          dateRangeFilter: false,
                        });
                      }
                    }}
                  >
                    {UI_TEXTS.LABELS.TAGS}
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      style={{
                        color: "#82807C",
                        marginLeft: "10px",
                        marginRight: "12px",
                      }}
                    />
                  </div>
                )}

                {((showReset && !tagsView) ||
                  (tagsViewTagsSelected.length > 0 && tagsView)) && (
                  <div>
                    <button
                      type="button"
                      className={classes.planner_resetAllFilterBtn}
                      onClick={handleClearFilter}
                      data-testid="reset-filter-btn"
                    >
                      {UI_TEXTS.FILTERS_TEXT.RESET_FILTER}
                      <span style={{ marginLeft: "5px", fontWeight: "900" }}>
                        {UI_TEXTS.LABELS.CROSS}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {propsFilters.categoryFilter && (
                <FilterDropdown
                  id="categoryFilter"
                  isLoading={loading}
                  filters={propsFilters}
                  setFilters={propsSetFilters}
                  style={{
                    marginLeft: "25px",
                    height: "367px",
                  }}
                  placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.CATEGORIES}
                  data={dropDownFilterOptions}
                  categoriesSelected={categoriesSelected}
                  setCategoriesSelected={setCategoriesSelected}
                  tagsOptionsSelected={tagsOptionsSelected}
                  setTagsOptionsSelected={setTagsOptionsSelected}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  recentFilter={recentFilter}
                  setRecentFilter={setRecentFilter}
                />
              )}

              {/*===========================tags filter================================*/}

              {propsFilters.TagsFilter && (
                <FilterDropdown
                  id="tagsFilter"
                  isLoading={loading}
                  filters={propsFilters}
                  setFilters={propsSetFilters}
                  style={{
                    marginLeft: "150px",
                    height: "367px",
                  }}
                  placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.TAGS}
                  data={dropDownFilterOptions}
                  categoriesSelected={categoriesSelected}
                  setCategoriesSelected={setCategoriesSelected}
                  tagsOptionsSelected={tagsOptionsSelected}
                  setTagsOptionsSelected={setTagsOptionsSelected}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  recentFilter={recentFilter}
                  setRecentFilter={setRecentFilter}
                />
              )}

              {propsFilters.CreatedByFilter && (
                <FilterDropdown
                  id="ScheduleByFilter"
                  filters={propsFilters}
                  setFilters={propsSetFilters}
                  style={{
                    marginLeft: "280px",
                    height: "367px",
                  }}
                  placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.CREATED_BY}
                  data={dropDownFilterOptions}
                  categoriesSelected={categoriesSelected}
                  setCategoriesSelected={setCategoriesSelected}
                  // categoryTypesSelected={categoryTypesSelected}
                  // setCategoryTypesSelected={setCategoryTypesSelected}
                  // hostOptionsSelected={hostOptionsSelected}
                  // setHostOptionsSelected={setHostOptionsSelected}
                  // TargetOptionsSelected={TargetOptionsSelected}
                  // setTargetOptionsSelected={setTargetOptionsSelected}
                  // frequencyOptionsSelected={frequencyOptionsSelected}
                  // setFrequencyOptionsSelected={setFrequencyOptionsSelected}
                  scheduleByOptionsSelected={createdByOptionsSelected}
                  setScheduleByOptionsSelected={setCreatedByOptionsSelected}
                  // setActionTypeOptionsSelected={setActionTypeOptionsSelected}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  recentFilter={recentFilter}
                  setRecentFilter={setRecentFilter}
                />
              )}

              {propsFilters.dateRangeFilter && (
                <ClickAwayListener
                  onClickAway={() =>
                    propsSetFilters({
                      categoryFilter: false,
                      TagsFilter: false,
                      CreatedByFilter: false,
                      dateRangeFilter: false,
                    })
                  }
                >
                  <div
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      marginLeft: "230px",
                      width: "300px",
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "4px",
                          display: "block",
                        }}
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #d0d5dd",
                          borderRadius: "8px",
                          width: "100%",
                          fontSize: "14px",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "4px",
                          display: "block",
                        }}
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #d0d5dd",
                          borderRadius: "8px",
                          width: "100%",
                          fontSize: "14px",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleDateRangeClear}
                        style={{
                          padding: "8px 16px",
                          border: "1px solid #d0d5dd",
                          borderRadius: "6px",
                          backgroundColor: "white",
                          fontSize: "14px",
                          cursor: "pointer",
                          flex: 1,
                        }}
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleDateRangeApply}
                        style={{
                          padding: "8px 16px",
                          border: "1px solid #7367f0",
                          borderRadius: "6px",
                          backgroundColor: "#7367f0",
                          color: "white",
                          fontSize: "14px",
                          cursor: "pointer",
                          flex: 1,
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </ClickAwayListener>
              )}

              {!loading && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "10px",
                    // gap: "10px",
                    paddingLeft: "10px",
                  }}
                >
                  {categoriesSelected && categoriesSelected.length !== 0 && (
                    <div>
                      <HtmlTooltip
                        placement="top-start"
                        title={
                          <React.Fragment>
                            <p
                              style={{
                                maxHeight: "100px",
                                overflowY: "auto",
                                padding: "0px",
                              }}
                            >
                              {categoriesSelected
                                .map((eachObj) => eachObj.optionName)
                                .join(",")}
                            </p>
                          </React.Fragment>
                        }
                      >
                        <p>
                          <div
                            className={classes.planner_resetAllFilterBtn}
                            style={{ border: "1px solid #7367f0" }}
                          >
                            {UI_TEXTS.LABELS.CATEGORY} :{" "}
                            <b>
                              {categoriesSelected
                                ?.map((eachObj) => eachObj.optionName)
                                ?.join(",")?.length > 50
                                ? ` ${categoriesSelected
                                    .map((eachObj) => eachObj.optionName)
                                    ?.join(",   ")
                                    ?.substring(0, 50)} ... `
                                : `${categoriesSelected
                                    .map((eachObj) => eachObj.optionName)
                                    .join(", ")}`}
                            </b>
                            <span
                              onClick={() => setCategoriesSelected([])}
                              style={{ marginLeft: "5px", fontWeight: "900" }}
                            >
                              {UI_TEXTS.LABELS.CROSS}
                            </span>
                          </div>
                        </p>
                      </HtmlTooltip>
                    </div>
                  )}

                  {tagsOptionsSelected &&
                    tagsOptionsSelected.length !== 0 &&
                    !tagsView && (
                      <div>
                        <HtmlTooltip
                          placement="top-start"
                          title={
                            <React.Fragment>
                              <p
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                  padding: "0px",
                                }}
                              >
                                {tagsOptionsSelected
                                  .map((o) => o.optionName)
                                  .join(",")}
                              </p>
                            </React.Fragment>
                          }
                        >
                          <p>
                            <div
                              className={classes.planner_resetAllFilterBtn}
                              style={{ border: "1px solid #7367f0" }}
                            >
                              {UI_TEXTS.LABELS.TAGS} :{" "}
                              <b>
                                {(() => {
                                  const joined = tagsOptionsSelected
                                    .map((o) => o.optionName)
                                    .join(", ");
                                  return joined.length > 50
                                    ? ` ${joined.substring(0, 50)} ... `
                                    : `${joined}`;
                                })()}
                              </b>
                              <span
                                onClick={() => setTagsOptionsSelected([])}
                                style={{ marginLeft: "5px", fontWeight: "900" }}
                              >
                                {UI_TEXTS.LABELS.CROSS}
                              </span>
                            </div>
                          </p>
                        </HtmlTooltip>
                      </div>
                    )}

                  {tagsViewTagsSelected &&
                    tagsViewTagsSelected.length !== 0 &&
                    tagsView && (
                      <div>
                        <HtmlTooltip
                          placement="top-start"
                          title={
                            <React.Fragment>
                              <p
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                  padding: "0px",
                                }}
                              >
                                {tagsViewTagsSelected.join(",")}
                              </p>
                            </React.Fragment>
                          }
                        >
                          <p>
                            <div
                              className={classes.planner_resetAllFilterBtn}
                              style={{ border: "1px solid #7367f0" }}
                            >
                              {UI_TEXTS.LABELS.TAGS} :{" "}
                              <b>
                                {tagsViewTagsSelected.join(",")?.length > 50
                                  ? ` ${tagsViewTagsSelected
                                      .join(",   ")
                                      ?.substring(0, 50)} ... `
                                  : `${tagsViewTagsSelected?.join(", ")}`}
                              </b>
                              <span
                                onClick={() => setTagsViewTagsSelected([])}
                                style={{ marginLeft: "5px", fontWeight: "900" }}
                              >
                                {UI_TEXTS.LABELS.CROSS}
                              </span>
                            </div>
                          </p>
                        </HtmlTooltip>
                      </div>
                    )}

                  {createdByOptionsSelected &&
                    createdByOptionsSelected.length !== 0 && (
                      <div>
                        <HtmlTooltip
                          placement="top-start"
                          title={
                            <React.Fragment>
                              <p
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                  padding: "0px",
                                }}
                              >
                                {createdByOptionsSelected

                                  .map((eachObj) => eachObj.optionName)
                                  .join(",")}
                              </p>
                            </React.Fragment>
                          }
                        >
                          <p>
                            <div
                              className={classes.planner_resetAllFilterBtn}
                              style={{ border: "1px solid #7367f0" }}
                            >
                              {UI_TEXTS.LABELS.SCHEDULE_BY} :{" "}
                              <b>
                                {createdByOptionsSelected
                                  ?.map((eachObj) => eachObj.optionName)
                                  ?.join(",")?.length > 50
                                  ? ` ${createdByOptionsSelected
                                      .map((eachObj) => eachObj.optionName)
                                      ?.join(",   ")
                                      ?.substring(0, 50)} ... `
                                  : `${createdByOptionsSelected
                                      .map((eachObj) => eachObj.optionName)
                                      .join(", ")}`}
                              </b>
                              <span
                                onClick={() => setCreatedByOptionsSelected([])}
                                style={{ marginLeft: "5px", fontWeight: "900" }}
                              >
                                {UI_TEXTS.LABELS.CROSS}
                              </span>
                            </div>
                          </p>
                        </HtmlTooltip>
                      </div>
                    )}

                  {startDate && endDate && dateRangeSelected && (
                    <div>
                      <HtmlTooltip
                        placement="top-start"
                        title={
                          <React.Fragment>
                            <p style={{ padding: "0px" }}>
                              {startDate} to {endDate}
                            </p>
                          </React.Fragment>
                        }
                      >
                        <p>
                          <div
                            className={classes.planner_resetAllFilterBtn}
                            style={{ border: "1px solid #7367f0" }}
                          >
                            {UI_TEXTS.FILTERS_TEXT.DATE_RANGE} :{" "}
                            <b>
                              {startDate} - {endDate}
                            </b>
                            <span
                              onClick={handleDateRangeClear}
                              style={{ marginLeft: "5px", fontWeight: "900" }}
                            >
                              {UI_TEXTS.LABELS.CROSS}
                            </span>
                          </div>
                        </p>
                      </HtmlTooltip>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div className="reports-container">
          <div className="reports-grid loading">
            {[...Array(16)].map((_, index) => (
              <ReportCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="reports-container"
          style={{
            height: "calc(100vh - 235px)",
            overflowY: "auto",
            padding: "0px 0px 0px 16px",
            // backgroundColor: "#fafafa",
          }}
        >
          {processedReports?.length > 0 ? (
            <div
              style={{
                display: "grid",
                // gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
                // alignItems: "center",
                padding: "0 10px 10px 10px",
                width: "100%",
                marginTop: "10px",
              }}
            >
              {processedReports.map((report) => {
                const hasWrite = hasInsightsPermission(
                  permissionState,
                  "Reports",
                  PERMISSION_LIST.REPORTS_WRITE,
                );

                const hasPublishAsSystem = hasInsightsPermission(
                  permissionState,
                  "Reports",
                  PERMISSION_LIST.REPORTS_PUBLISH_AS_SYSTEM,
                );

                return (
                  <ReportCard
                    key={report._id}
                    report={{
                      id: report._id,
                      title: report.reportName,
                      date: report.date,
                      username: report.username,
                      version: report.version,
                      status: report.status,
                      disableText: disableText,
                      templateIcon: report.templateIcon,
                      scheduleCategory: report.scheduleCategory,
                      description: report.description,
                    }}
                    onEdit={handleEditReport}
                    onDuplicate={handleDuplicateReport}
                    onDelete={handleDeleteReport}
                    onClick={handleCardClick}
                    hasWriteAccess={hasWrite}
                    hasPublishAsSystem={hasPublishAsSystem}
                    showVersion={true}
                  />
                );
              })}
            </div>
          ) : (
            <MyReportsEmpty />
          )}
        </div>
      )}
    </div>
  );
}

export default MyReports;
