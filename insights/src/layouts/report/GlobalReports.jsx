import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import "./css/report.css";
import FilterIcon from "../../assets/images/Filter.png";
import ReportCard from "./ReportCard/ReportCard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  fetchGlobalReportData,
  getUsersList,
} from "../../services/configurations/configService";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";
import GlobalReportsEmpty from "../../components/common/EmptyPage/GlobalReportsEmptyPage";
import classes from "../../components/planning/css/subheader.module.css";
import Search from "../../components/ui/search/Search.component";
import { useDebounce } from "../../utils/useDebounce";
import { ReportHeaderSkeleton } from "../../utils/CommonUtils";
import {
  Select,
  MenuItem,
  FormControl,
  styled,
  Tooltip,
  tooltipClasses,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "../../services/jobs/JobsService";
import FilterDropdown from "../../components/ui/customdropdown/FilterDropdown";
import TagsFilter from "../../components/ui/customdropdown/TagsFilter";
import { toast } from "react-toastify";
import { Category } from "iconsax-react";
import AccordionSkeleton from "../../components/ui/skeletons/AccordionSkeleton";
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

function GlobalReports(props) {
  const dispatch = useDispatch();
  const reportData = useSelector((state) => state?.reports?.globalReport.data);
  const categoryOptions = useSelector(
    (state) =>
      state?.reports?.globalReport?.data?.filterOptions?.categories?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      ) || []
  );
  const tagOptions = useSelector(
    (state) =>
      state?.reports?.globalReport?.data?.filterOptions?.tags?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      ) || []
  );
  const createdByOptions = useSelector(
    (state) =>
      state?.reports?.globalReport?.data?.filterOptions?.createdBy?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      ) || []
  );
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const totalReport = useSelector(
    (state) => state?.reports?.globalReport?.data.totalActiveRecords
  );
  const [sortOption, setSortOption] = useState("sort");
  const [processedReports, setProcessedReports] = useState([]);

  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

  // State to track expanded accordions
  const [expandedCategories, setExpandedCategories] = useState({});

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
      const payload = {
        type: "GLOBAL",
        search: searchQuery,
        recentFilter,
      };

      if (categories.length > 0) {
        payload.categories = categories;
      }

      if (tags.length > 0) {
        payload.tags = tags;
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

      console.log("Global Reports API Payload with date range:", payload);

      await dispatch(fetchGlobalReportData(payload)).unwrap();
    } catch (error) {
      console.error("Failed to fetch global reports:", error);
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
      (tagsSelected.length > 0 && !tagsView) ||
      (tagsOptionsSelected.length > 0 && !tagsView) ||
      createdByOptionsSelected.length > 0 ||
      (startDate && endDate)
    ) {
      setShowReset(true);
    } else if (tagsViewTagsSelected.length > 0 && tagsView) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [
    categoriesSelected,
    tagsSelected,
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

  // Modified useEffect to handle filters properly
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
    dateRangeSelected,
  ]);

  const handleSearch = (searchQuery) => {
    setSearchText(searchQuery);
  };

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

  useEffect(() => {
    if (reportData?.data) {
      const updated = applySort(reportData.data, sortOption);
      setProcessedReports(updated);
    }
  }, [reportData, sortOption]);

  // Group reports by category
  const categorizedReports = useMemo(() => {
    if (!processedReports?.length) return {};

    return processedReports.reduce((acc, report) => {
      const category = report.scheduleCategory || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(report);
      return acc;
    }, {});
  }, [processedReports]);

  useEffect(() => {
    if (Object.keys(categorizedReports).length > 0) {
      const categories = Object.keys(categorizedReports);
      const initialExpanded = {};
      categories.forEach((category) => {
        initialExpanded[category] = false;
      });
      setExpandedCategories(initialExpanded);
    }
  }, [categorizedReports]);

  const handleAccordionChange = (category) => (event, isExpanded) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: isExpanded,
    }));
  };

  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
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
      setTagsSelected([]);
      setTagsOptionsSelected([]);
      setCreatedByOptionsSelected([]);
      setStartDate("");
      setEndDate("");
      setDateRangeSelected(false);
    }
  };

  // const handleDateRangeApply = () => {
  //   if (startDate && endDate) {
  //     setDateRangeSelected(true);
  //     propsSetFilters({
  //       ...propsFilters,
  //       dateRangeFilter: false,
  //     });
  //   } else {
  //     toast.error("Please select both start and end dates", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 2000,
  //     });
  //   }
  // };

  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      setDateRangeSelected(true);
      propsSetFilters({
        ...propsFilters,
        dateRangeFilter: false,
      });

      const selectedCategories = categoriesSelected.map((c) => c.optionName);
      // const selectedTags = tagsView ? tagsViewTagsSelected : tagsSelected;
      const selectedTags = tagsView
        ? tagsViewTagsSelected
        : tagsOptionsSelected.map((c) => c.optionName);
      loadReports(
        debouncedSearchText,
        selectedCategories,
        selectedTags,
        createdByOptionsSelected,
        startDate,
        endDate
      );
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
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // const handleEditReport = (report) => {
  //   if (loading) return;
  //   const fullReportData = reportData?.data?.find(
  //     (item) => item._id === report.id
  //   );

  //   if (fullReportData) {
  //     const reportForEdit = {
  //       _id: fullReportData._id,
  //       title: fullReportData.reportName,
  //       columns: fullReportData.columns || [],
  //     };

  //     setCurrentReport(reportForEdit);
  //     setModalOpen(true);
  //   }
  // };

  const handleEditReport = (report) => {
    if (loading) return;
    history.push(`/report/edit/${report.id}`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentReport(null);
  };

  const handleSubmitReport = (data) => {
    if (loading) return;
    if (currentReport) {
      console.log("Updated Report:", { ...currentReport, ...data });
    } else {
      console.log("New Report:", data);
    }
  };

  const handleCardClick = (reportId) => {
    history.push(`/reports/global-reports/${reportId}`);
  };

  const handleDuplicateReport = (report) => {
    if (loading) return;
    const fullReportData = reportData?.data?.find(
      (item) => item._id === report.id
    );
    // if (fullReportData) {
    //   const reportForClone = {
    //     title: `${fullReportData.reportName}`,
    //     columns: fullReportData.columns || [],
    //   };

    //   setCurrentReport(reportForClone);
    //   setModalOpen(true);
    // }
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
    dispatch(fetchGlobalReportData());
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
              {UI_TEXTS.HEADINGS.PUBLISHED_REPORTS}
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

            <span style={{ marginRight: "16px" }}>
              <div>
                <button
                  style={{
                    width: "100px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "1px solid #e4e4e4",
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

            <FormControl
              sx={{ width: "140px", borderRadius: "8px", marginRight: "16px" }}
            >
              <Select
                value={sortOption}
                onChange={handleSortChange}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "7px 14px",
                    fontSize: "14px",
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
          </div>
        </div>
      )}

      {/* Filters Section */}
      {showPlatformFilters && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "10vh",
            marginTop: "20px",
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
              <div className={classes.planner_drpbtnDiv}>
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
                            categoryFilter: false,
                            TagsFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            categoryFilter: true,
                            TagsFilter: false,
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
                            categoryFilter: false,
                            TagsFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            categoryFilter: false,
                            TagsFilter: true,
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

                    <div
                      data-testid="createdby-filter-btn"
                      style={{ marginLeft: "12px" }}
                      className={classes.planner_dropbtn}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => false}
                      onClick={() => {
                        if (propsFilters.CreatedByFilter) {
                          propsSetFilters({
                            categoryFilter: false,
                            TagsFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            categoryFilter: false,
                            TagsFilter: false,
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
                    </div>

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
                            categoryFilter: false,
                            TagsFilter: false,
                            CreatedByFilter: false,
                            dateRangeFilter: false,
                          });
                        } else {
                          propsSetFilters({
                            categoryFilter: false,
                            TagsFilter: false,
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
                          categoryFilter: false,
                          TagsFilter: false,
                          CreatedByFilter: false,
                          dateRangeFilter: false,
                        });
                      } else {
                        propsSetFilters({
                          categoryFilter: false,
                          TagsFilter: true,
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
                  isLoading={loading}
                  id="categoryFilter"
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
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  recentFilter={recentFilter}
                  setRecentFilter={setRecentFilter}
                />
              )}

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
                  isLoading={loading}
                  filters={propsFilters}
                  setFilters={propsSetFilters}
                  style={{
                    marginLeft: "230px",
                    height: "367px",
                  }}
                  placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.CREATED_BY}
                  data={dropDownFilterOptions}
                  categoriesSelected={categoriesSelected}
                  setCategoriesSelected={setCategoriesSelected}
                  scheduleByOptionsSelected={createdByOptionsSelected}
                  setScheduleByOptionsSelected={setCreatedByOptionsSelected}
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
                    marginLeft: "350px",
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
                                margin: "0px",
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
                                  margin: "0px",
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
                                  margin: "0px",
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
                                  margin: "0px",
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
                              {UI_TEXTS.LABELS.CREATED_BY} :{" "}
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
                            <p style={{ padding: "0px", margin: "0px" }}>
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
        // <div className="reports-container">
        //   <div className="reports-grid loading">
        //     {[...Array(16)].map((_, index) => (
        //       <ReportCardSkeleton key={index} />
        //     ))}
        //   </div>
        // </div>
        <div
          className="reports-container"
          style={{
            padding: "16px",
            marginTop: "20px",
          }}
        >
          <AccordionSkeleton />
        </div>
      ) : (
        <div
          className="reports-container"
          style={{
            height: "calc(100vh - 280px)",
            overflowY: "auto",
            padding: "0px 16px 16px 16px",
            // backgroundColor: "#fafafa",
          }}
        >
          {Object.keys(categorizedReports).length > 0 ? (
            <div style={{ marginTop: "10px" }}>
              {Object.entries(categorizedReports).map(([category, reports]) => (
                <Accordion
                  key={category}
                  expanded={expandedCategories[category] || false}
                  onChange={handleAccordionChange(category)}
                  sx={{
                    marginBottom: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": {
                      margin: "16px 0",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                    sx={{
                      // backgroundColor: "#fafafaff",
                      // borderBottom: "1px solid #e9ecef",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      minHeight: "40px",
                      "&.Mui-expanded": {
                        minHeight: "40px",
                        borderBottomLeftRadius: "0",
                        borderBottomRightRadius: "0",
                        borderTopLeftRadius: "0",
                        borderTopColor: "0",
                      },
                      "& .MuiAccordionSummary-content": {
                        margin: "6px 0",
                      },
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        paddingRight: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "30%",
                        }}
                      >
                        <IconButton
                          style={{
                            background: "#f4f6ff",
                            borderRadius: "50%",
                            height: "35px",
                            width: "35px",
                          }}
                        >
                          <Category size="18" color="#2961f4" />
                        </IconButton>
                        <Typography
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#101828",
                            fontFamily: "Manrope",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                          }}
                          title={category}
                        >
                          {category.length > 40
                            ? `${category.substring(0, 37)}...`
                            : category}
                        </Typography>
                        {/* <span style={{ 
                          marginLeft: "12px", 
                          backgroundColor: "#7367f0",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}>
                          {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
                        </span> */}
                      </div>

                      <p className="category_no_reports_text">
                        Number of reports:
                        <span className="category_reports_count">
                          {reports.length ?? 0}
                        </span>
                      </p>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ padding: "16px", backgroundColor: "#fbfbfb" }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      {reports.map((report) => {
                        const hasWrite = hasInsightsPermission(
                          permissionState,
                          "Reports",
                          PERMISSION_LIST.REPORTS_WRITE
                        );

                        const hasPublishAsSystem = hasInsightsPermission(
                          permissionState,
                          "Reports",
                          PERMISSION_LIST.REPORTS_PUBLISH_AS_SYSTEM
                        );

                        const allowedOptions = [];
                        if (hasWrite) allowedOptions.push("clone");
                        // if (hasPublishAsSystem && report?.publishType) {
                        //   allowedOptions.push("clone");
                        // }
                        if (hasPublishAsSystem && report?.publishType)
                          allowedOptions.push("edit");

                        return (
                          <ReportCard
                            key={report._id}
                            report={{
                              id: report._id,
                              title: report.reportName,
                              date: report.date,
                              version: report.version,
                              username: report.username,
                              templateIcon: report.templateIcon,
                              scheduleCategory: report.scheduleCategory,
                              publishType: report.publishType,
                            }}
                            allowedOptions={allowedOptions}
                            onEdit={handleEditReport}
                            onDuplicate={handleDuplicateReport}
                            onDelete={handleDeleteReport}
                            onClick={handleCardClick}
                            hasWriteAccess={hasWrite || hasPublishAsSystem}
                            hasPublishAsSystem={hasPublishAsSystem}
                            isPublished={true}
                            showVersion={false}
                          />
                        );
                      })}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          ) : (
            <GlobalReportsEmpty />
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalReports;
