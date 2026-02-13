import classes from "./css/tasklist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getJobs,
  getCategories,
  getHosts,
  getTargets,
  deleteJob,
  getFrequency,
  getJobsByTags,
  getCommandCategory,
  getTags,
  getCategoriesFilterOptions,
  getJobFilterOptions,
} from "../../services/jobs/JobsService";
import Search from "../ui/search/Search.component";
import CDropdown from "../ui/customdropdown/Dropdown.component";
import "./css/tasks.css";
import { borderRadius, styled } from "@mui/system";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import TaskListCardsTable from "./TaskListCardsTable.component";
import { useSelector } from "react-redux";
import FilterDropdown from "../ui/customdropdown/FilterDropdown";
import TagCards from "./TagCards";
import { useDispatch } from "react-redux";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import Filter from "../../assets/images/Filter.png";
import { Refresh } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Add } from "iconsax-react";
import {
  jobsSortOptions,
  tagsViewSortOptions,
} from "../common/Constants/constantObjects";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import EmptyPage from "../common/EmptyPage/EmptyPage";
import {
  FilterHeaderSkeleton,
  statusColorMap,
  TagCardsSkeleton,
  TaskListTableSkeleton,
} from "../common/CommonComponents/ReusableFields";
import { isLoadingInHost } from "../../utils/DetectHost";
import { getUsersList } from "../../services/configurations/configService";
import { hasInsightsPermission,PERMISSION_LIST } from "../../utils/permissionUtil";

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

function TaskList(props) {
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [tagsViewSearch, setTagsViewSearch] = useState("");
  const [sortBy, setSortBy] = useState("Sort By");
  const [tagsViewSort, setTagsViewSort] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [categoryTypesSelected, setCategoryTypesSelected] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryTypeOptions, setCategoryTypeOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [hostOptions, setHostOptions] = useState([]);
  const [hostOptionsSelected, setHostOptionsSelected] = useState([]);
  const [TargetOptions, setTargetOptions] = useState([
    { optionName: "testTarget1" },
    { optionName: "testTarget2" },
  ]);
  const [TargetOptionsSelected, setTargetOptionsSelected] = useState([]);
  const categoryType = [
    { optionName: "Global" },
    { optionName: "Local" },
    // { optionName: "Smart" },
  ];
  const [actionTypeOptions, setActionTypeOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [frequencyOptionsSelected, setFrequencyOptionsSelected] = useState([]);
  const [dropDownFilterOptions, setFilterDropdownOptions] = useState([]);
  const [tagsView, setTagsView] = useState(false);
  const [tagsViewData, setTagsViewData] = useState([]);
  const [tagsViewTagsSelected, setTagsViewTagsSelected] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(true);
  const getAllJobsData = useSelector((state) => state?.jobs?.jobs);
  const [filteredJobs, setFilteredJobs] = useState(getAllJobsData);
  const JobsData = useSelector((state) => state.jobs.totalCount);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [jobStatusType, setJobStatusType] = useState("all");
  const [isAnyFilterSelected, setIsAnyFilterSelected] = useState(false);
  const [scheduleByOptions, setScheduleByOptions] = useState([]);
  const [scheduleByOptionsSelected, setScheduleByOptionsSelected] = useState(
    []
  );
  const [actionTypeOptionsSelected, setActionTypeOptionsSelected] = useState(
    []
  );
  const [tagsOptionsSelected, setTagsOptionsSelected] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [jobsStatusCount, setJobsStatusCount] = useState(false);
  const [recentFilter, setRecentFilter] = useState("");
  const permissionState = useSelector((state) => state.jobs?.permissions);
  
  const writePermForSchedule = hasInsightsPermission(
      permissionState,
      "Schedule",
      PERMISSION_LIST.SCHEDULE_WRITE
    );

  useEffect(() => {
    const hasSelection =
      categoriesSelected?.length > 0 ||
      categoryTypesSelected?.length > 0 ||
      hostOptionsSelected?.length > 0 ||
      TargetOptionsSelected?.length > 0 ||
      (tagsViewTagsSelected?.length > 0 && tagsView) ||
      frequencyOptionsSelected?.length > 0 ||
      scheduleByOptionsSelected?.length > 0;

    setIsAnyFilterSelected(hasSelection);
  }, [
    categoriesSelected,
    categoryTypesSelected,
    hostOptionsSelected,
    TargetOptionsSelected,
    tagsViewTagsSelected,
    frequencyOptionsSelected,
    scheduleByOptionsSelected,
    tagsView,
  ]);

  const dispatch = useDispatch();
  const {
    setFilters: propsSetFilters,
    filters: propsFilters,
    showFilters: propsShowFilters,
  } = props;

  const elementRef = useRef(null);

  const [showPlatformFilters, setShowPlatformFilters] =
    useState(propsShowFilters);

  const [showReset, setShowReset] = useState(false);

  // Function to fetch all users for Schedule By filter
  const fetchAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      let allUsers = [];
      let currentPage = 1;
      let totalPages = 1;
      const pageSize = 100;
      const seenUserIds = new Set();

      while (currentPage <= totalPages) {
        const response = await getUsersList({
          pageNo: currentPage,
          pageSize: pageSize,
          search: "",
        });

        if (response?.flag === "success") {
          const newUsers = (response.data || []).filter((user) => {
            if (seenUserIds.has(user.userId)) {
              return false;
            }
            seenUserIds.add(user.userId);
            return true;
          });

          allUsers = [...allUsers, ...newUsers];
          totalPages = response.pagination?.totalPage || 1;
          currentPage++;
        } else {
          console.error("Failed to fetch users:", response?.message);
          break;
        }
      }

      const userOptions = allUsers.map((user) => ({
        optionName: user.username || user.jnjMSUsername,
        userId: user.userId,
        name: user.name,
        email: user.email,
      }));

      // setScheduleByOptions(userOptions);
      return userOptions;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users list", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return [];
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const onDeleteAction = async (job) => {
    if (!job?.isOneTime) {
      let jobDeleted = await dispatch(deleteJob(job._id));
      if (jobDeleted?.data?.statusCode === 200) {
        toast.success(TOAST_MESSAGES.OTHERS.JOB_DELETED_SUCCESSFULLY, {
          position: "top-right",
          autoClose: 4000,
        });
        fetchData();
      }
    }
  };

  useEffect(() => {
    setFilteredJobs(getAllJobsData);
  }, [getAllJobsData]);

  const handleSort = (e = "") => {
    const value = e;
    setSortBy(value);
  };

  const handleTagsViewSort = (e = "") => {
    const value = e;
    setTagsViewSort(value);
  };

  const handleStatusView = (filterType) => {
    setCurrentPage(1);
    setTotalPages(1);
    setItemsPerPage(10);
    setJobStatusType(filterType);
  };

  useEffect(() => {
    if (!getAllJobsData || tagsView) return;

    let filtered = [...getAllJobsData];

    // switch (jobStatusType) {
    //   case "all":
    //     break;
    //   case "active_jobs":
    //     filtered = filtered.filter(
    //       (job) =>
    //         job.jobRunning === true &&
    //         job.scheduleType !== "AD_HOC" &&
    //         job.frequency !== "Execute one time" &&
    //         job.status !== "PENDING_APPROVAL" &&
    //         job.status !== "REJECTED"
    //     );
    //     break;
    //   case "paused_jobs":
    //     filtered = filtered.filter((job) => job.jobRunning === false);
    //     break;
    //   case "adhoc_job":
    //     filtered = filtered.filter(
    //       (job) =>
    //         job.scheduleType === "AD_HOC" && job.status !== "PENDING_APPROVAL"
    //     );
    //     break;
    //   case "execute_one_time":
    //     filtered = filtered.filter(
    //       (job) => job.frequency === "Execute one time"
    //     );
    //     break;
    //   case "pending_approval":
    //     filtered = filtered.filter((job) => job.status === "PENDING_APPROVAL");
    //     break;
    //   case "rejected_jobs":
    //     filtered = filtered.filter((job) => job.status === "REJECTED");
    //     break;
    //   default:
    //     break;
    // }

    // setFilteredJobs(filtered);
  }, [getAllJobsData, jobStatusType]);

  const spaceWarningTimerTasks = useRef(null);
  const spaceWarningTimerTags = useRef(null);

  const filterTasks = async (e) => {
    if (spaceWarningTimerTasks.current) {
      clearTimeout(spaceWarningTimerTasks.current);
    }

    if (e && e.trim() === "" && e.length > 0) {
      spaceWarningTimerTasks.current = setTimeout(() => {
        if (!toast.isActive("space-warning-tasks")) {
          toast.warning("Search cannot contain only spaces", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            toastId: "space-warning-tasks",
          });
        }
      }, 500);
      return;
    }
    setSearchText(e);
  };

  const filterTagsViewData = async (e) => {
    if (spaceWarningTimerTags.current) {
      clearTimeout(spaceWarningTimerTags.current);
    }

    if (e && e.trim() === "" && e.length > 0) {
      spaceWarningTimerTags.current = setTimeout(() => {
        if (!toast.isActive("space-warning-tags")) {
          toast.warning("Search cannot contain only spaces", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            toastId: "space-warning-tags",
          });
        }
      }, 500);
      return;
    }
    setTagsViewSearch(e);
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
      setCategoryTypesSelected([]);
      setHostOptionsSelected([]);
      setTargetOptionsSelected([]);
      setFrequencyOptionsSelected([]);
      setScheduleByOptionsSelected([]);
      setActionTypeOptionsSelected([]);
      setTagsOptionsSelected([]);
    }
  };

  const handleTagSwitch = () => {
    setTagsView((prevState) => !prevState);
    setTagsViewSearch("");
    setSearchText("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) {
        return;
      }
      const elementTop = elementRef.current.getBoundingClientRect().top;
      const stickyHeader = document.querySelector(
        "#planner_tasklist_sticky-header"
      );
      if (elementTop <= 0) {
        stickyHeader?.classList.add(
          "planner_taskList_columnName_header_container_atTop"
        );
      } else {
        stickyHeader?.classList.remove(
          "planner_taskList_columnName_header_container_atTop"
        );
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchData = async ({
    searchText,
    sortBy,
    categoriesSelected,
    categoryTypesSelected,
    currentPage,
    itemsPerPage,
    tagsOptionsSelected,
    jobStatusType,
    TargetOptionsSelected,
    hostOptionsSelected,
    frequencyOptionsSelected,
    scheduleByOptionsSelected,
    actionTypeOptionsSelected,
  }) => {
    try {
      if (!tagsView) {
        setIsLoading(true);
        const createdBy = scheduleByOptionsSelected
          .map((opt) => opt.optionName)
          .join(",");
        const actionType = actionTypeOptionsSelected
          .map((opt) => opt.optionName)
          .join(",");
        const tags = tagsOptionsSelected.map((opt) => opt.optionName);
        const jobsData = await dispatch(
          getJobs(
            searchText,
            sortBy,
            categoriesSelected,
            categoryTypesSelected,
            currentPage,
            itemsPerPage,
            tags,
            TargetOptionsSelected,
            hostOptionsSelected,
            frequencyOptionsSelected,
            jobStatusType,
            createdBy,
            actionType
          )
        );

        const filterData = await dispatch(
          getJobFilterOptions(
            searchText,
            sortBy,
            categoriesSelected,
            categoryTypesSelected,
            currentPage,
            itemsPerPage,
            tags,
            TargetOptionsSelected,
            hostOptionsSelected,
            frequencyOptionsSelected,
            jobStatusType,
            createdBy,
            actionType,
            recentFilter
          )
        );

        setCategoryOptions(
          filterData?.data?.data?.categoryName?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );
        setCategoryTypeOptions(
          filterData?.data?.data?.categoryType?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );
        setHostOptions(
          filterData?.data?.data?.hostname?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );
        setTagsOptions(
          filterData?.data?.data?.tags?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );
        // setTargetOptions();
        setFrequencyOptions(
          filterData?.data?.data?.frequency?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );
        setScheduleByOptions(
          filterData?.data?.data?.createdBy?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );
        setActionTypeOptions(
          filterData?.data?.data?.actionType?.map((eachObj) => ({
            optionName: eachObj,
          })) || []
        );

        setJobsCount(jobsData?.data?.pagination?.totalCount);
        setJobsStatusCount(jobsData?.data?.statusCounts);
        setJobs(jobsData?.data?.data);

        const totalCount = jobsData?.data?.pagination?.totalCount || 0;
        const totalPage = jobsData?.data?.pagination?.totalPage || 1;

        if (totalCount < 10) {
          setTotalPages(1);
          setCurrentPage(1);
        } else {
          setTotalPages(totalPage);
        }

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching jobs data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const trimmed = searchText.trim();
      // if (trimmed === '' && searchText.length > 0) {
      //   toast.error("Please enter a valid schedule", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 2000,
      //   });
      //   setSearchText('');
      //   return;
      // }
      fetchData({
        searchText,
        sortBy,
        categoriesSelected,
        categoryTypesSelected,
        currentPage,
        itemsPerPage,
        tagsOptionsSelected,
        jobStatusType,
        TargetOptionsSelected,
        hostOptionsSelected,
        frequencyOptionsSelected,
        scheduleByOptionsSelected,
        actionTypeOptionsSelected,
      });
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [
    searchText,
    sortBy,
    categoriesSelected,
    categoryTypesSelected,
    currentPage,
    itemsPerPage,
    tagsOptionsSelected,
    TargetOptionsSelected,
    hostOptionsSelected,
    frequencyOptionsSelected,
    scheduleByOptionsSelected,
    tagsView,
    actionTypeOptionsSelected,
    jobStatusType,
  ]);
  // JobStatus-only trigger (no pagination or full fetch)
  useEffect(() => {
    if (jobStatusType && !tagsView) {
      fetchData({ jobStatusType });
    }
  }, [jobStatusType]);

  useEffect(() => {
    if (tagsView) {
      fetchCardsData();
      setSortBy("");
    }
  }, [
    tagsView,
    tagsViewTagsSelected,
    tagsViewSearch,
    tagsViewSort,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    fetchCardsData();
  }, []);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const stored = localStorage.getItem("sidebarExpanded");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const latest = localStorage.getItem("sidebarExpanded");
      setIsSidebarExpanded(latest ? JSON.parse(latest) : false);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData({
      searchText,
      sortBy,
      categoriesSelected,
      categoryTypesSelected,
      currentPage,
      itemsPerPage,
      tagsOptionsSelected,
      jobStatusType,
      TargetOptionsSelected,
      hostOptionsSelected,
      frequencyOptionsSelected,
      scheduleByOptionsSelected,
      actionTypeOptionsSelected,
    });
  };

  const fetchCardsData = async () => {
    if (tagsView) {
      if (tagsView) {
        setIsLoading(true);
        const jobsDataByTags = await dispatch(
          getJobsByTags(
            tagsViewSearch,
            tagsViewSort,
            tagsViewTagsSelected,
            currentPage,
            itemsPerPage
          )
        );
        setTagsViewData(jobsDataByTags?.data?.data);
        setTotalPages(jobsDataByTags?.data?.pagination?.totalPage);
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    if (
      (categoriesSelected.length > 0 ||
        categoryTypesSelected.length > 0 ||
        TargetOptionsSelected.length > 0 ||
        hostOptionsSelected.length > 0 ||
        tagsOptionsSelected.length > 0 ||
        frequencyOptionsSelected.length > 0 ||
        actionTypeOptionsSelected.length > 0 ||
        scheduleByOptionsSelected.length > 0) &&
      !tagsView
    ) {
      setShowReset(true);
    } else if (tagsViewTagsSelected.length > 0 && tagsView) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [
    categoriesSelected,
    categoryTypesSelected,
    tagsOptionsSelected,
    TargetOptionsSelected,
    hostOptionsSelected,
    frequencyOptionsSelected,
    scheduleByOptionsSelected,
    actionTypeOptionsSelected,
    tagsView,
  ]);

  useEffect(() => {
    if (propsFilters?.categoryTypeFilter) {
      setFilterDropdownOptions(categoryTypeOptions);
    }
    if (propsFilters?.categoryFilter) {
      setFilterDropdownOptions(categoryOptions);
    }
    if (propsFilters?.hostFilter) {
      setFilterDropdownOptions(hostOptions);
    }
    if (propsFilters?.TagsFilter) {
      setFilterDropdownOptions(tagsOptions);
    }
    if (propsFilters?.TargetFilter) {
      setFilterDropdownOptions(TargetOptions);
    }
    if (propsFilters?.FrequencyFilter) {
      setFilterDropdownOptions(frequencyOptions);
    }
    if (propsFilters?.ScheduleByFilter) {
      setFilterDropdownOptions(scheduleByOptions);
    }
    if (propsFilters?.actionTypeFilter) {
      setFilterDropdownOptions(actionTypeOptions);
    }
  }, [propsFilters, propsSetFilters]);

  const setModalIsOpenToTrue = () => {
    history.push("/schedule");
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
    if (document.querySelector("#TaskList thead"))
      document.querySelector("#TaskList thead").style.position = "sticky";
  };

  const handleRefreshButton = () => {
    fetchData({
      searchText,
      sortBy,
      categoriesSelected,
      categoryTypesSelected,
      currentPage,
      itemsPerPage,
      tagsOptionsSelected,
      jobStatusType,
      TargetOptionsSelected,
      hostOptionsSelected,
      frequencyOptionsSelected,
      scheduleByOptionsSelected,
      actionTypeOptionsSelected,
    });
  };

  const getJobCount = (jobStatusType) => {
    // if (jobStatusType === "all") return jobsCount;

    const statusMap = {
      active_jobs: jobsStatusCount?.active_jobs,
      paused_jobs: jobsStatusCount?.paused_jobs,
      adhoc_job: jobsStatusCount?.adhoc_job,
      execute_one_time: jobsStatusCount?.execute_one_time,
      pending_approval: jobsStatusCount?.pending_approval,
      rejected_jobs: jobsStatusCount?.rejected_jobs,
      all: jobsStatusCount?.all,
    };

    return statusMap[jobStatusType] || 0;
  };

  return (
    <>
      <div className={classes.iabot_taskListContainer}>
        <div>
          {/* ===============================Generate Report Row============================== */}
          {false ? (
            <FilterHeaderSkeleton />
          ) : (
            <div data-testid="tasklist" className={classes.iabot_filter_row}>
              <section className="iabot_jobsCountTasklist">
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Manrope",
                    color: "#101828",
                    fontSize: "18px",
                    fontWeight: 600,
                    marginRight: "150px",
                    marginTop: "10px",
                  }}
                >
                  {!isLoadingInHost ? UI_TEXTS.LABELS.SCHEDULE : "All"}
                  <Tooltip title={JobsData ?? 0}>
                    <div className="count_forModule_container">
                      <span className="count_forModule_ellipsis">
                        {JobsData ?? 0}
                      </span>
                    </div>
                  </Tooltip>
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    // marginLeft: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {!isLoadingInHost
                    ? UI_TEXTS.MESSAGES.MANAGE_AD_HOC_AND_SCHEDULE_TASKS
                    : ""}
                </span>
              </section>
              <section
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "10px",
                  gap: "10px",
                }}
              >
                {/* ==========================  Filter Icon ============================ */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    style={{
                      border: "1px solid #e4e4e4",
                      width: "40px",
                      height: "40px",
                    }}
                    onClick={handleRefreshButton}
                    size="medium"
                    color="#344054"
                    title="Refresh"
                  >
                    <Refresh />
                  </IconButton>
                </div>

                {/* ==========================  Filter Icon ============================ */}

                {/* ========================== Search (Jobs by Title) Bar =============================== */}
                <div>
                  {!tagsView && (
                    <Search
                      className={classes.planner_searchBar}
                      placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_SCHEDULE}
                      searchIconTowardsRight
                      selection="single"
                      handleSearchText={(e) => filterTasks(e)}
                      setSearchTextProp={setSearchText}
                      setJobs={setJobs}
                    />
                  )}
                  {tagsView && (
                    <Search
                      className={classes.planner_searchBar}
                      placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_SCHEDULE}
                      searchIconTowardsRight
                      selection="single"
                      handleSearchText={(e) => filterTagsViewData(e)}
                      setSearchTextProp={setTagsViewSearch}
                      setJobs={setJobs}
                    />
                  )}
                </div>
                {/* ========================== Search (Tasks by Title) Bar =============================== */}

                {/* =================================== Sort By Dropdown =================================== */}
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
                    <img src={Filter} />
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

                <div>
                  {!tagsView && (
                    <CDropdown
                      cname={classes.sortByFilter_Drpdown}
                      cnameToggleTitle={"sortByFilter_Drpdown"}
                      handleChangeCustom={(e) => handleSort(e)}
                      data={jobsSortOptions}
                      value="Sort By"
                    />
                  )}
                  {tagsView && (
                    <CDropdown
                      cname={classes.sortByFilter_Drpdown}
                      cnameToggleTitle={"sortByFilter_Drpdown"}
                      handleChangeCustom={(e) => handleTagsViewSort(e)}
                      data={tagsViewSortOptions}
                      value="Sort By"
                    />
                  )}
                </div>
                {writePermForSchedule && (
                <div
                  data-testid="addplannerTaskBtn"
                  id="AddTask"
                  className={[
                    classes.iabot_addTemplate,
                    classes.iabot_addjob_btn,
                  ].join(" ")}
                  onClick={setModalIsOpenToTrue}
                >
                  <Add size="20" color="#FFFFFF" />
                  <span
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {" "}
                    {UI_TEXTS.ADD_TEXT.NEW_SCHEDULE}
                  </span>
                </div>
                )}

              </section>
            </div>
          )}
          {/* ===============================Generate Report Row============================== */}
        </div>
        <div className={classes.indicator_container}>
          {Object.entries(statusColorMap).map(
            ([status, { color, filterType }]) => (
              <div
                className={classes.indicator_item}
                key={status}
                onClick={() => handleStatusView(filterType)}
                style={{ cursor: "pointer" }}
              >
                {status !== "All" && (
                  <div
                    className={classes.indicator_dot}
                    style={{ backgroundColor: color }}
                  />
                )}
                <span
                  // className={classes.indicator_label}
                  className={`${classes.indicator_label} ${
                    jobStatusType === filterType ? classes.active : ""
                  }`}
                >
                  {status} {`(${getJobCount(filterType)})`}
                </span>
              </div>
            )
          )}
        </div>
        {showPlatformFilters && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "6vh",
              marginTop: "10px",
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
                              ScheduleByFilter: false,
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
                              ScheduleByFilter: false,
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
                      </div>
                      <div
                        date-testid="tags-filter-btn"
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
                              TagsFilter: true,
                              FrequencyFilter: false,
                              ScheduleByFilter: false,
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
                        data-testid="scheduleby-filter-btn"
                        style={{ marginLeft: "12px" }}
                        className={classes.planner_dropbtn}
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => false}
                        onClick={() => {
                          if (propsFilters.ScheduleByFilter) {
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
                              FrequencyFilter: false,
                              ScheduleByFilter: true,
                            });
                          }
                        }}
                      >
                        {UI_TEXTS.LABELS.SCHEDULE_BY}
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
                      </div>
                    </>
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
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.CATEGORIES}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}
                {/* ========================category type filter========================= */}
                {propsFilters.categoryTypeFilter && (
                  <FilterDropdown
                    id="categoryTypeFilter"
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "127px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.JOB_TYPE}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}

                {/*===========================hosts filter================================*/}

                {propsFilters.hostFilter && (
                  <FilterDropdown
                    id="hostFilter"
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "260px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.HOST}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}
                {propsFilters.TargetFilter && (
                  <FilterDropdown
                    id="TargetFilter"
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "350px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.TARGET}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}

                {/*===========================tags filter================================*/}

                {propsFilters.TagsFilter && (
                  <FilterDropdown
                    id="tagsFilter"
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "260px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.TAGS}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    tagsOptionsSelected={tagsOptionsSelected}
                    setTagsOptionsSelected={setTagsOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}

                {propsFilters.FrequencyFilter && (
                  <FilterDropdown
                    id="FrequencyFilter"
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "496px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.FREQUENCY}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    frequencyOptionsSelected={frequencyOptionsSelected}
                    setFrequencyOptionsSelected={setFrequencyOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}

                {/* Add Schedule By filter dropdown */}
                {propsFilters.ScheduleByFilter && (
                  <FilterDropdown
                    id="ScheduleByFilter"
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "620px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.SCHEDULE_BY}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    frequencyOptionsSelected={frequencyOptionsSelected}
                    setFrequencyOptionsSelected={setFrequencyOptionsSelected}
                    scheduleByOptionsSelected={scheduleByOptionsSelected}
                    setScheduleByOptionsSelected={setScheduleByOptionsSelected}
                    setActionTypeOptionsSelected={setActionTypeOptionsSelected}
                    tagsOptionsSelected={tagsOptionsSelected}
                    setTagsOptionsSelected={setTagsOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}

                {/* Action Type filter dropdown */}
                {propsFilters.actionTypeFilter && (
                  <FilterDropdown
                    id="actionTypeFilter"
                    isLoading={isLoading}
                    filters={propsFilters}
                    setFilters={propsSetFilters}
                    style={{
                      marginLeft: "620px",
                      height: "367px",
                    }}
                    placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.ACTION_TYPE}
                    data={dropDownFilterOptions}
                    categoriesSelected={categoriesSelected}
                    setCategoriesSelected={setCategoriesSelected}
                    categoryTypesSelected={categoryTypesSelected}
                    setCategoryTypesSelected={setCategoryTypesSelected}
                    hostOptionsSelected={hostOptionsSelected}
                    setHostOptionsSelected={setHostOptionsSelected}
                    TargetOptionsSelected={TargetOptionsSelected}
                    setTargetOptionsSelected={setTargetOptionsSelected}
                    frequencyOptionsSelected={frequencyOptionsSelected}
                    setFrequencyOptionsSelected={setFrequencyOptionsSelected}
                    scheduleByOptionsSelected={scheduleByOptionsSelected}
                    setScheduleByOptionsSelected={setScheduleByOptionsSelected}
                    actionTypeOptionsSelected={actionTypeOptionsSelected}
                    setActionTypeOptionsSelected={setActionTypeOptionsSelected}
                    tagsOptionsSelected={setTagsOptionsSelected}
                    setTagsOptionsSelected={setTagsOptionsSelected}
                    recentFilter={recentFilter}
                    setRecentFilter={setRecentFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {/* ====================================== Filtered Options Name Section ================================= */}
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

          {categoryTypesSelected && categoryTypesSelected.length !== 0 && (
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
                      {categoryTypesSelected
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
                    {UI_TEXTS.FILTERS_TEXT.JOB_TYPE} :{" "}
                    <b>
                      {categoryTypesSelected
                        ?.map((eachObj) => eachObj.optionName)
                        ?.join(",")?.length > 50
                        ? ` ${categoryTypesSelected
                            .map((eachObj) => eachObj.optionName)
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${categoryTypesSelected
                            .map((eachObj) => eachObj.optionName)
                            .join(", ")}`}
                    </b>
                    <span
                      onClick={() => setCategoryTypesSelected([])}
                      style={{ marginLeft: "5px", fontWeight: "900" }}
                    >
                      {UI_TEXTS.LABELS.CROSS}
                    </span>
                  </div>
                </p>
              </HtmlTooltip>
            </div>
          )}

          {hostOptionsSelected && hostOptionsSelected.length !== 0 && (
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
                      {hostOptionsSelected
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
                    {UI_TEXTS.LABELS.HOST} :{" "}
                    <b>
                      {hostOptionsSelected
                        ?.map((eachObj) => eachObj.optionName)
                        ?.join(",")?.length > 50
                        ? ` ${hostOptionsSelected
                            ?.map((eachObj) => eachObj.optionName)
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${hostOptionsSelected
                            ?.map((eachObj) => eachObj.optionName)
                            ?.join(", ")}`}
                    </b>
                    <span
                      onClick={() => setHostOptionsSelected([])}
                      style={{ marginLeft: "5px", fontWeight: "900" }}
                    >
                      {UI_TEXTS.LABELS.CROSS}
                    </span>
                  </div>
                </p>
              </HtmlTooltip>
            </div>
          )}

          {TargetOptionsSelected && TargetOptionsSelected.length !== 0 && (
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
                      {TargetOptionsSelected.map(
                        (eachObj) => eachObj.optionName
                      ).join(",")}
                    </p>
                  </React.Fragment>
                }
              >
                <p>
                  <div
                    className={classes.planner_resetAllFilterBtn}
                    style={{ border: "1px solid #7367f0" }}
                  >
                    {UI_TEXTS.HEADER_TEXT.TARGET} :{" "}
                    <b>
                      {TargetOptionsSelected?.map(
                        (eachObj) => eachObj.optionName
                      )?.join(",")?.length > 50
                        ? ` ${TargetOptionsSelected?.map(
                            (eachObj) => eachObj.optionName
                          )
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${TargetOptionsSelected?.map(
                            (eachObj) => eachObj.optionName
                          )?.join(", ")}`}
                    </b>
                    <span
                      onClick={() => setTargetOptionsSelected([])}
                      style={{ marginLeft: "5px", fontWeight: "900" }}
                    >
                      {UI_TEXTS.LABELS.CROSS}
                    </span>
                  </div>
                </p>
              </HtmlTooltip>
            </div>
          )}

          {tagsOptionsSelected && tagsOptionsSelected.length !== 0 && (
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
                    {UI_TEXTS.LABELS.TAGS} :{" "}
                    <b>
                      {tagsOptionsSelected
                        ?.map((eachObj) => eachObj.optionName)
                        ?.join(",")?.length > 50
                        ? ` ${tagsOptionsSelected
                            .map((eachObj) => eachObj.optionName)
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${tagsOptionsSelected
                            .map((eachObj) => eachObj.optionName)
                            .join(", ")}`}
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

          {frequencyOptionsSelected && frequencyOptionsSelected.length !== 0 && (
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
                      {frequencyOptionsSelected
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
                    {UI_TEXTS.LABELS.FREQUENCY} :{" "}
                    <b>
                      {frequencyOptionsSelected
                        ?.map((eachObj) => eachObj.optionName)
                        ?.join(",")?.length > 50
                        ? ` ${frequencyOptionsSelected
                            ?.map((eachObj) => eachObj.optionName)
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${frequencyOptionsSelected
                            ?.map((eachObj) => eachObj.optionName)
                            ?.join(", ")}`}
                    </b>
                    <span
                      onClick={() => setFrequencyOptionsSelected([])}
                      style={{ marginLeft: "5px", fontWeight: "900" }}
                    >
                      {UI_TEXTS.LABELS.CROSS}
                    </span>
                  </div>
                </p>
              </HtmlTooltip>
            </div>
          )}

          {scheduleByOptionsSelected && scheduleByOptionsSelected.length !== 0 && (
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
                      {scheduleByOptionsSelected

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
                      {scheduleByOptionsSelected
                        ?.map((eachObj) => eachObj.optionName)
                        ?.join(",")?.length > 50
                        ? ` ${scheduleByOptionsSelected
                            .map((eachObj) => eachObj.optionName)
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${scheduleByOptionsSelected
                            .map((eachObj) => eachObj.optionName)
                            .join(", ")}`}
                    </b>
                    <span
                      onClick={() => setScheduleByOptionsSelected([])}
                      style={{ marginLeft: "5px", fontWeight: "900" }}
                    >
                      {UI_TEXTS.LABELS.CROSS}
                    </span>
                  </div>
                </p>
              </HtmlTooltip>
            </div>
          )}

          {actionTypeOptionsSelected && actionTypeOptionsSelected.length !== 0 && (
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
                      {actionTypeOptionsSelected
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
                    {UI_TEXTS.LABELS.ACTION_TYPE} :{" "}
                    <b>
                      {actionTypeOptionsSelected
                        ?.map((eachObj) => eachObj.optionName)
                        ?.join(",")?.length > 50
                        ? ` ${actionTypeOptionsSelected
                            .map((eachObj) => eachObj.optionName)
                            ?.join(",   ")
                            ?.substring(0, 50)} ... `
                        : `${actionTypeOptionsSelected
                            .map((eachObj) => eachObj.optionName)
                            .join(", ")}`}
                    </b>
                    <span
                      onClick={() => setActionTypeOptionsSelected([])}
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
      </div>
      {/* ====================================== Filtered Options Name Section ================================= */}

      <main
        className={classes.planner_tList_MainTag}
        style={{ height: "62vh", overflowY: "hidden" }}
      >
        <div id="tList">
          {/* 👇 Conditionally render rest */}
          {isLoading ? (
            tagsView ? (
              <TagCardsSkeleton />
            ) : (
              <TaskListTableSkeleton />
            )
          ) : (
            <>
              {filteredJobs.length === 0 &&
              !jobStatusType &&
              !tagsView &&
              !searchText &&
              !isAnyFilterSelected ? (
                <EmptyPage
                  title="Create Your First Schedule"
                  subtitle="Get started by creating your first scheduled task"
                />
              ) : filteredJobs.length === 0 &&
                jobStatusType === "execute_one_time" ? (
                <EmptyPage
                  title="No Execute One Time Schedules Found"
                  subtitle="There are no Execute One Time Schedules at the moment"
                />
              ) : filteredJobs.length === 0 &&
                (jobStatusType === "paused_jobs" ||
                  jobStatusType === "active_jobs" ||
                  jobStatusType === "adhoc_job" ||
                  jobStatusType === "pending_approval" ||
                  jobStatusType === "rejected_jobs") ? (
                <EmptyPage
                  title={`No ${jobStatusType.replace(/_/g, " ")} found`}
                  subtitle={`There are no ${jobStatusType.replace(
                    /_/g,
                    " "
                  )} at the moment`}
                />
              ) : (!tagsView && (!filteredJobs || filteredJobs.length === 0)) ||
                (tagsView && (!tagsViewData || tagsViewData.length === 0)) ? (
                (searchText && searchText.trim() !== "") ||
                (tagsViewSearch && tagsViewSearch.trim() !== "") ? (
                  <EmptyPage
                    title="Schedule Not Found"
                    subtitle={`No Schedule match your search "${
                      tagsView ? tagsViewSearch : searchText
                    }".`}
                  />
                ) : (
                  <EmptyPage
                    title="Schedule Not Found"
                    subtitle="Currently, there are no matching schedules"
                  />
                )
              ) : (
                <>
                  {!tagsView && (
                    <div
                      style={{ maxWidth: isSidebarExpanded ? "87vw" : "96vw" }}
                      className={classes.tasklist_cards}
                    >
                      <TaskListCardsTable
                        elementRef={elementRef}
                        isLoading={isLoading}
                        jobs={filteredJobs}
                        onDeleteAction={onDeleteAction}
                        totalJobs={jobsCount}
                        isSidebarExpanded={isSidebarExpanded}
                        showPlatformFilters={showPlatformFilters}
                        isAnyFilterSelected={isAnyFilterSelected}
                        onRefresh={handleRefresh}
                      />
                    </div>
                  )}
                  {tagsView && (
                    <TagCards data={tagsViewData} isLoading={isLoading} />
                  )}

                  <div
                    style={{
                      borderTop: "1px solid #ddd",
                      width: "98vw",
                      padding: "0 10px",
                      position: "fixed",
                      bottom: 10,
                      maxWidth: isSidebarExpanded ? "87vw" : "96vw",
                      zIndex: 99,
                      backgroundColor: "#ffff",
                    }}
                  >
                    <CustomPagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                      totalPages={totalPages}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
export default TaskList;
