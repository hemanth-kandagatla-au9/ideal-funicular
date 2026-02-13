import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import SubHeader from "../../components/planning/SubHeader.component";
import Sidebar from "../../components/planning/Sidebar.component";
import { GoBlocked } from "react-icons/go";
import CodeIcon from "../../assets/images/webide.png";
import { Container } from "react-bootstrap";
import IconStart from "../../assets/images/Icon start.png";
import classes from "../../components/planning/css/subheader.module.css";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ConfirmationDialog from "../report/DeleteConfirmation";
import FilterIcon from "../../assets/images/Filter.png";
import { Refresh } from "@mui/icons-material";

import {
  Grid,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Skeleton,
  FormControl,
  Chip,
  Box,
  styled,
  tooltipClasses,
} from "@mui/material";
import "../../layouts/report/css/report.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTemplateModal from "./AddTemplate";
import { useDispatch, useSelector } from "react-redux";
import Search from "../../components/ui/search/Search.component";
import {
  DeleteTemplate,
  EditTemplate,
  getTemplateDetails,
  getTemplateTags,
} from "../../store/TemplateSlice/templateSlice";
import { Calendar, User, UserOctagon } from "iconsax-react";
import "./marketplace.css";
import CommandEditorDialog from "../../components/common/commonEditorDialogue";
import { TemplatesVersionModal } from "./TemplateVersion";
import {
  colorSets,
  getTemplateIcon,
  formattedDate,
  getEmptyPageSubtitle,
} from "../../utils/CommonUtils";
import {
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import TemplateCardSkeleton from "../../components/common/TemplateSkeleton";
import { ScheduleViewModal } from "./ScheduleViewModal";
import EmptyPage from "../../components/common/EmptyPage/EmptyPage";
import CodeDownloadComponent from "./CodeDownloadComponent";
import CodeCopyComponent from "./CodeCopyComponent";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import {
  getBashSnippet,
  getPowershellSnippet,
  getPythonSnippet,
} from "../../store/codeSnippetSlice/codeSnippetSlice";
import FilterDropdown from "../../components/ui/customdropdown/FilterDropdown";
import { getUsersList } from "../../services/configurations/configService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { getCommandCategory } from "../../services/jobs/JobsService";
import { isLoadingInHost } from "../../utils/DetectHost";
import CMDBQueryDialog from "../../components/planning/CMDBQueryDialog";
function AppStore() {
  const [sidebarActiveTab, setSidebarActiveTab] = useState("MarketPlace");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentItem, setcurrentItem] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [recentFilter, setRecentFilter] = useState("");
  const dispatch = useDispatch();
  const store = useSelector((store) => store.templates);
  const actionTypeOptions =
    useSelector((store) =>
      store.templates?.templateData?.filterOptions?.actionType?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      )
    ) || [];
  const tagsOptions =
    useSelector((store) =>
      store.templates?.templateData?.filterOptions?.tags?.map((eachObj) => ({
        optionName: eachObj,
      }))
    ) || [];
  const createdByOptions =
    useSelector((store) =>
      store.templates?.templateData?.filterOptions?.createdBy?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      )
    ) || [];
  const approvalStatusOptions =
    useSelector((store) =>
      store.templates?.templateData?.filterOptions?.approvalStatus?.map(
        (eachObj) => ({
          optionName: eachObj,
        })
      )
    ) || [];
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isLoading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("sort");
  const [showEditor, setShowEditor] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionId, setVersionId] = useState();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateForSchedule, setSelectedTemplateForSchedule] =
    useState(null);
  const [templateId, setTemplateID] = useState();
  const [templateName, setTemplateName] = useState();
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const [isViewModeForTemplate, setIsViewModeForTemplate] = useState(false);
  const [isModalOpen, setModelOpen] = useState(false);
  const [showCMDBQueryModal, setShowCMDBQueryModal] = useState(false);
  const [currentCMDBItem, setCurrentCMDBItem] = useState(null);

  const [dropDownFilterOptions, setFilterDropdownOptions] = useState([]);
  const [createdByOptionsSelected, setCreatedByOptionsSelected] = useState([]);
  const [tagsOptionsSelected, setTagsOptionsSelected] = useState([]);
  const [actionTypeOptionSelected, setActionTypeOptionSelected] = useState([]);
  const [approvalStatusOptionSelected, setApprovalStatusOptionSelected] =
    useState([]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showReset, setShowReset] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const [showPlatformFilters, setShowPlatformFilters] = useState(false);
  const [codeTemplateFilters, setCodeTemplateFilters] = useState({
    actionTypeFilter: false,
    TagsFilter: false,
    approvalStatusFilter: false,
    CreatedByFilter: false,
    dateRangeFilter: false,
  });
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  // Use refs for debouncing and preventing multiple calls
  const searchDebounceRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasInitialFetchRef = useRef(false);
  const editModalClosedRef = useRef(false);

  const handleCardClick = async (item, e) => {
    e.stopPropagation();
    setModelOpen(true);
    setIsViewModeForTemplate(true);
    setcurrentItem(item);
    editModalClosedRef.current = false;
  };

  const handleClearFilter = () => {
    setSearchFilter("");
    setSearchInputValue("");
    setSortOption("sort");
    setActionTypeOptionSelected([]);
    setTagsOptionsSelected([]);
    setCreatedByOptionsSelected([]);
    setApprovalStatusOptionSelected([]);

    // Clear any pending debounce timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
  };

  useEffect(() => {
    if (codeTemplateFilters.actionTypeFilter) {
      setFilterDropdownOptions(actionTypeOptions || []);
    } else if (codeTemplateFilters.TagsFilter) {
      setFilterDropdownOptions(tagsOptions || []);
    } else if (codeTemplateFilters.CreatedByFilter) {
      setFilterDropdownOptions(createdByOptions || []);
    } else if (codeTemplateFilters.approvalStatusFilter) {
      setFilterDropdownOptions(approvalStatusOptions || []);
    }
  }, [codeTemplateFilters]);

  const handleVersionClick = (item) => {
    setIsVersionModalOpen(true);
    setVersionId(item.templateId);
  };

  const writePermForCodeMarketPlace = hasInsightsPermission(
    permissionState,
    "Code Marketplace",
    PERMISSION_LIST.CODE_MARKETPLACE_WRITE
  );

  const writePermForCMDBTemplate = hasInsightsPermission(
    permissionState,
    "Code Marketplace",
    PERMISSION_LIST.CODE_MARKETPLACE_CMDB_WRITE
  );
  const deletePermForCMDBTemplate = hasInsightsPermission(
    permissionState,
    "Code Marketplace",
    PERMISSION_LIST.CODE_MARKETPLACE_CMDB_DELETE
  );

  const handleScheduleClick = (item, e) => {
    setIsScheduleModalOpen(true);
    setTemplateID(item.templateId);
    setTemplateName(item.templateName);
    setSelectedTemplateForSchedule(item);
  };

  const [templateData, setTemplateData] = useState(
    store?.templateData?.data || []
  );

  const [currentEditorItem, setCurrentEditorItem] = useState(null);

  const handleEditorClick = (item, e) => {
    e.stopPropagation();
    setCurrentEditorItem(item);
    setShowEditor(true);
  };

  const getColorSetForItem = (item, index) => {
    const itemId = item.id || index;
    const numericId =
      typeof itemId === "string" ? parseInt(itemId, 10) || 0 : itemId;
    return colorSets[numericId % colorSets.length];
  };

  const getTagColor = (item, tagIndex, index) => {
    const colorSet = getColorSetForItem(item, index);
    return colorSet[tagIndex % colorSet.length];
  };

  useEffect(() => {
    setSidebarActiveTab("MarketPlace");
  }, []);

  useEffect(() => {
    if (store?.templateData?.data) {
      setTemplateData(store.templateData.data);
      if (!initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    }
    setLoading(false);
  }, [store.templateData.data]);

  const fetchTemplateData = useCallback(
    async (forceRefresh = false) => {
      if (!isMountedRef.current) return;
      if (editModalClosedRef.current && !forceRefresh) {
        editModalClosedRef.current = false;
        return;
      }
      setIsLoadingCards(true);

      // Make sure sortOption is not "sort" when sending to API
      const sortValue = sortOption === "sort" ? "newest" : sortOption;

      const payload = {
        search: searchFilter,
        templateType: actionTypeOptionSelected
          .map((opt) => opt.optionName)
          .join(","),
        tags: tagsOptionsSelected.map((opt) => opt.optionName).join(","),
        createdBy: createdByOptionsSelected
          .map((opt) => opt.optionName)
          .join(","),
        sort: sortValue,
        status: approvalStatusOptionSelected
          .map((opt) => opt.optionName)
          .join(","),
        recentFilter: recentFilter,
      };

      try {
        const result = await dispatch(getTemplateDetails(payload));
        if (result?.payload && isMountedRef.current) {
          setIsLoadingCards(false);
          if (!initialLoadComplete) {
            setInitialLoadComplete(true);
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          setIsLoadingCards(false);
          if (!initialLoadComplete) {
            setInitialLoadComplete(true);
          }
        }
      }
    },
    [
      searchFilter,
      actionTypeOptionSelected,
      tagsOptionsSelected,
      createdByOptionsSelected,
      sortOption,
      approvalStatusOptionSelected,
      recentFilter,
      dispatch,
      initialLoadComplete,
    ]
  );

  const getFiltersOptions = async () => {
    try {
      const categoriesData = await dispatch(getCommandCategory());
      if (categoriesData?.data?.data) {
        setCategoryOptions(
          categoriesData.data.data.map((eachObj) => ({
            optionName: eachObj.commandCategory,
          }))
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    // Clear previous debounce timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!hasInitialFetchRef.current) {
      return;
    }

    // const hasFilterChanges =
    //   searchFilter ||
    //   actionTypeOptionSelected.length > 0 ||
    //   tagsOptionsSelected.length > 0 ||
    //   createdByOptionsSelected.length > 0 ||
    //   approvalStatusOptionSelected.length > 0 ||
    //   sortOption !== "sort";

    // Set debounced API call with a slightly longer delay for sort
    searchDebounceRef.current = setTimeout(
      () => {
        fetchTemplateData();
        setShouldRefetch(false);
      },
      sortOption !== "sort" ? 100 : 400
    );

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [
    searchFilter,
    actionTypeOptionSelected,
    tagsOptionsSelected,
    createdByOptionsSelected,
    sortOption,
    approvalStatusOptionSelected,
    shouldRefetch,
    fetchTemplateData,
  ]);

  // Initial load effect - runs only once on mount
  useEffect(() => {
    const initialFetch = async () => {
      if (!hasInitialFetchRef.current) {
        hasInitialFetchRef.current = true;
        await fetchTemplateData();
        await getFiltersOptions();
      }
    };

    initialFetch();

    return () => {
      isMountedRef.current = false;
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleSearchInputChange = (value) => {
    setSearchInputValue(value);

    // Clear previous debounce timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Set debounced search filter for API call
    searchDebounceRef.current = setTimeout(() => {
      setSearchFilter(value);
      setShouldRefetch(true);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setSearchFilter("");
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setShouldRefetch(true);
  };

  const [pythonSnippet, setPythonSnippet] = useState("");
  const [bashSnippet, setBashSnippet] = useState("");
  const [powershellSnippet, setPowershellSnippet] = useState("");
  const fetchPythonSnippetData = async () => {
    const response = await dispatch(getPythonSnippet());
    if (response?.payload?.data) {
      setPythonSnippet(response?.payload?.data);
    }
  };

  const fetchBashSnippetData = async () => {
    const response = await dispatch(getBashSnippet());
    if (response?.payload?.data) {
      setBashSnippet(response?.payload?.data);
    }
  };

  const fetchPowerShellSnippetData = async () => {
    const response = await dispatch(getPowershellSnippet());
    if (response?.payload?.data) {
      setPowershellSnippet(response?.payload?.data);
    }
  };

  useEffect(() => {
    fetchPythonSnippetData();
    fetchBashSnippetData();
    fetchPowerShellSnippetData();
  }, []);

  const handleCloseModal = () => {
    setcurrentItem(null);
    setSearchKey((prev) => prev + 1);
    setModelOpen(!isModalOpen);
    setIsViewModeForTemplate(false);
    editModalClosedRef.current = false;

    if (!isViewModeForTemplate) {
      fetchTemplateData(true);
    }
  };

  const handleEdit = async (item, e) => {
    e.stopPropagation();
    setModelOpen(true);
    setcurrentItem(item);
    setIsViewModeForTemplate(false);

    editModalClosedRef.current = false;
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    setcurrentItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSaveCMDBQuery = async (query) => {
    const canEdit =
      currentCMDBItem.status !== "PENDING_APPROVAL" &&
      currentCMDBItem.status !== "PENDING" &&
      currentCMDBItem.status !== "REJECTED";

    if (!canEdit) {
      toast.error("Editing is not allowed for this status");
      return;
    }

    try {
      setIsLoadingCards(true);
      let res = await dispatch(
        EditTemplate({
          templateId: currentCMDBItem.templateId,
          templateName: currentCMDBItem.templateName,
          templateVersion: currentCMDBItem.templateVersion,
          templateType: currentCMDBItem.templateType,
          query,
        })
      );
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
        setShowCMDBQueryModal(false);
        fetchTemplateData(true);
      }
    } catch (error) {
      toast.error(error || "Failed to save data");
    } finally {
      setIsLoadingCards(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await dispatch(DeleteTemplate(currentItem)).unwrap();

      if (result?.success) {
        toast.success(result?.message);
        setDeleteDialogOpen(false);
        setcurrentItem(null);
        fetchTemplateData(true);
      } else {
        toast.error(
          result?.message || TOAST_MESSAGES.OTHERS.DELETE_OPERATION_FAILED
        );
      }
    } catch (error) {
      console.error("Delete error:", error);

      // Handle different error scenarios with better messaging
      if (error.payload) {
        const {
          message,
          jobs = [],
          internalJobs = [],
          totalUsage,
        } = error.payload;

        if (totalUsage > 0) {
          const jobNames = [
            ...jobs.map((j) => j.name || j.scheduleId || j.id),
            ...internalJobs.map((j) => j.name || j.id),
          ];

          const usageMessage =
            jobNames.length > 3
              ? `Template is used in ${totalUsage} job(s). First few: ${jobNames
                  .slice(0, 3)
                  .join(", ")}...`
              : `Template is used in: ${jobNames.join(", ")}`;

          toast.error(`Cannot delete template. ${usageMessage}`, {
            autoClose: 5000,
          });
        } else {
          toast.error(
            message || TOAST_MESSAGES.OTHERS.FAILED_TO_DELETE_TEMPLATE
          );
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_DELETE_TEMPLATE);
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setcurrentItem(null);
    }
  };

  useEffect(() => {
    const hasFilter =
      searchFilter?.trim() ||
      actionTypeOptionSelected.length > 0 ||
      tagsOptionsSelected.length > 0 ||
      createdByOptionsSelected.length > 0 ||
      approvalStatusOptionSelected.length > 0;

    setShowReset(hasFilter);
  }, [
    searchFilter,
    actionTypeOptionSelected,
    tagsOptionsSelected,
    createdByOptionsSelected,
    approvalStatusOptionSelected,
  ]);

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

  const handleRefreshButton = () => {
    setSearchFilter("");
    setSearchInputValue("");
    setSortOption("sort");
    fetchTemplateData(true);

    // Clear any pending debounce timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
  };

  const HtmlTooltip = styled(({ className, ...codeTemplateFilters }) => (
    <Tooltip {...codeTemplateFilters} classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#eef1ff",
      color: "#7367f0",
      width: "fix-content",
      fontSize: "12px",
      border: "1px solid #dadde9",
    },
  }));

  useEffect(() => {
    setTemplates(templateData);
  }, [templateData]);

  return (
    <div
      data-testid="landingPageTestId"
      style={{
        display: "flex",
        flexDirection: "column",
        height: isLoadingInHost ? "auto" : "100vh",
      }}
    >
      <SubHeader
        data-test="planner-layout-subheader"
        data-testid="subheader-test"
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: isLoadingInHost ? "visible" : "hidden",
        }}
      >
        <Sidebar
          setActiveTab={setSidebarActiveTab}
          activeTab={sidebarActiveTab}
        />
        <div
          className={isLoadingInHost ? "platform-marketplace-wrapper" : ""}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: isLoadingInHost ? "visible" : "auto",
            width: "100%",
          }}
        >
          <Container
            id="discoveryLogTab"
            style={{
              padding: "0px 1px",
              maxWidth: "100%",
            }}
            fluid
          >
            <>
              <div
                style={{
                  position: isLoadingInHost ? "relative" : "sticky",
                  top: isLoadingInHost ? "auto" : 0,
                  padding: "6px 0",
                  margin: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  zIndex: isLoadingInHost ? "auto" : 1000,
                  flexWrap: "wrap",
                }}
              >
                <section className="iabot_jobsCount" style={{ padding: "4px" }}>
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 600,
                      width: "215px",
                      fontFamily: "Manrope",
                      color: " rgb(16, 24, 40)",
                      fontSize: "18px",
                    }}
                  >
                    {!isLoadingInHost
                      ? UI_TEXTS.TEXTS.CODE_MARKETE_PLACE
                      : "All Records"}
                    <Tooltip title={templates.length ?? 0}>
                      <div className="count_forModule_container">
                        <span className="count_forModule_ellipsis">
                          {templates.length ?? 0}
                        </span>
                      </div>
                    </Tooltip>
                  </span>
                </section>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>
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
                              fontWeight: 500,
                              fontSize: "14px",
                              lineHeight: "20px",
                              letterSpacing: "0%",
                              padding: "8px",
                              color: "#404040",
                            }}
                          >
                            {UI_TEXTS.FILTERS_TEXT.FILTERS}
                          </span>
                        </button>
                      </div>
                    </span>

                    <FormControl sx={{ width: "170px", borderRadius: "16px" }}>
                      <Select
                        value={sortOption}
                        onChange={handleSortChange}
                        sx={{
                          "& .MuiSelect-select": {
                            padding: "7px 14px",
                          },
                          borderRadius: "8px",
                          color: "#404040",
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          height: "40px",
                        }}
                      >
                        <MenuItem
                          value="sort"
                          className="dropdownText_appStore"
                        >
                          {UI_TEXTS.FILTERS_TEXT.SORT_BY}
                        </MenuItem>

                        <MenuItem
                          value="newest"
                          className="dropdownText_appStore"
                        >
                          {UI_TEXTS.FILTERS_TEXT.NEWEST_FIRST}
                        </MenuItem>
                        <MenuItem
                          value="oldest"
                          className="dropdownText_appStore"
                        >
                          {UI_TEXTS.FILTERS_TEXT.OLDEST_FIRST}
                        </MenuItem>
                        <MenuItem
                          value="name_asc"
                          className="dropdownText_appStore"
                        >
                          {UI_TEXTS.FILTERS_TEXT.ALPHABETIC_ORDER}
                        </MenuItem>
                        <MenuItem
                          value="name_desc"
                          className="dropdownText_appStore"
                        >
                          {UI_TEXTS.FILTERS_TEXT.REVERSE_ALPHABETIC_ORDER}
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <div>
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

                    <Search
                      placeholder={
                        UI_TEXTS.PLACEHOLDERS.SEARCH_TEMPLATE_BY_NAME
                      }
                      searchIconTowardsRight
                      onEnterClear
                      customeCss={{ right: "5px", position: "relative" }}
                      selection="single"
                      handleSearchText={handleSearchInputChange}
                      setSearchTextProp={searchInputValue}
                      onClear={handleClearSearch}
                      key={searchKey}
                    />
                  </div>

                  {writePermForCodeMarketPlace && (
                    <div
                      data-testid="addplannerTaskBtn"
                      id="AddTask"
                      className={[
                        classes.iabot_addTemplate,
                        classes.iabot_addjob_btn,
                      ].join(" ")}
                      style={{ width: "135px" }}
                      onClick={() => {
                        setModelOpen(true);
                        setcurrentItem(null);
                        setIsViewModeForTemplate(false);
                        editModalClosedRef.current = false;
                      }}
                    >
                      <img
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                        src={IconStart}
                        alt="Add icon"
                      />
                      {UI_TEXTS.ADD_TEXT.ADD_TEMPLATE}
                    </div>
                  )}
                </div>

                {/* ====================== Filters Section ========================== */}
                {showPlatformFilters && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                      flexBasis: "100%",
                      width: "100%",
                    }}
                  >
                    {showPlatformFilters && (
                      <div
                        data-testid="assetFilterTest"
                        onBlur={() => toggleDropdown(false)}
                        onFocus={() => toggleDropdown(true)}
                      >
                        <div className={classes.planner_drpbtnDiv}>
                          <>
                            <div
                              data-testid="category-advance-filter-btn"
                              style={{ marginLeft: "12px" }}
                              className={classes.planner_dropbtn}
                              role="button"
                              tabIndex={0}
                              onKeyUp={() => false}
                              onClick={() => {
                                if (codeTemplateFilters.actionTypeFilter) {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: false,
                                    CreatedByFilter: false,
                                  });
                                } else {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: true,
                                    TagsFilter: false,
                                    CreatedByFilter: false,
                                  });
                                }
                              }}
                            >
                              {UI_TEXTS.FILTERS_TEXT.ACTION_TYPE}
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
                                if (codeTemplateFilters.TagsFilter) {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: false,
                                    CreatedByFilter: false,
                                  });
                                } else {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: true,
                                    CreatedByFilter: false,
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
                              data-testid="approvalStatus-filter-btn"
                              style={{ marginLeft: "12px" }}
                              className={classes.planner_dropbtn}
                              role="button"
                              tabIndex={0}
                              onKeyUp={() => false}
                              onClick={() => {
                                if (codeTemplateFilters.approvalStatusFilter) {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: false,
                                    CreatedByFilter: false,
                                    approvalStatusFilter: false,
                                  });
                                } else {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: false,
                                    CreatedByFilter: false,
                                    approvalStatusFilter: true,
                                  });
                                }
                              }}
                            >
                              {UI_TEXTS.LABELS.APPROVAL_STATUS}
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
                                if (codeTemplateFilters.CreatedByFilter) {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: false,
                                    CreatedByFilter: false,
                                  });
                                } else {
                                  setCodeTemplateFilters({
                                    actionTypeFilter: false,
                                    TagsFilter: false,
                                    CreatedByFilter: true,
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
                          </>

                          {(showReset ||
                            (tagsOptionsSelected &&
                              tagsOptionsSelected.length > 0)) && (
                            <div>
                              <button
                                type="button"
                                className={classes.planner_resetAllFilterBtn}
                                onClick={handleClearFilter}
                                data-testid="reset-filter-btn"
                              >
                                {UI_TEXTS.FILTERS_TEXT.RESET_FILTER}
                                <span
                                  style={{
                                    marginLeft: "5px",
                                    fontWeight: "900",
                                  }}
                                >
                                  {UI_TEXTS.LABELS.CROSS}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>

                        {codeTemplateFilters.actionTypeFilter && (
                          <FilterDropdown
                            id="actionTypeFilter"
                            isLoading={isLoading}
                            filters={codeTemplateFilters}
                            setFilters={setCodeTemplateFilters}
                            style={{
                              marginLeft: "10px",
                              height: "367px",
                            }}
                            placeholder={
                              UI_TEXTS.PLACEHOLDERS_FILTERS.ACTION_TYPE
                            }
                            data={dropDownFilterOptions}
                            actionTypeOptionsSelected={actionTypeOptionSelected}
                            setActionTypeOptionsSelected={
                              setActionTypeOptionSelected
                            }
                            tagsOptionsSelected={tagsOptionsSelected}
                            setTagsOptionsSelected={setTagsOptionsSelected}
                            scheduleByOptionsSelected={createdByOptionsSelected}
                            setScheduleByOptionsSelected={
                              setCreatedByOptionsSelected
                            }
                            recentFilter={recentFilter}
                            setRecentFilter={setRecentFilter}
                          />
                        )}

                        {codeTemplateFilters.TagsFilter && (
                          <FilterDropdown
                            id="tagsFilter"
                            isLoading={isLoading}
                            filters={codeTemplateFilters}
                            setFilters={setCodeTemplateFilters}
                            style={{
                              marginLeft: "140px",
                              height: "367px",
                            }}
                            placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.TAGS}
                            data={dropDownFilterOptions}
                            actionTypeOptionsSelected={actionTypeOptionSelected}
                            setActionTypeOptionsSelected={
                              setActionTypeOptionSelected
                            }
                            tagsOptionsSelected={tagsOptionsSelected}
                            setTagsOptionsSelected={setTagsOptionsSelected}
                            scheduleByOptionsSelected={createdByOptionsSelected}
                            setScheduleByOptionsSelected={
                              setCreatedByOptionsSelected
                            }
                            recentFilter={recentFilter}
                            setRecentFilter={setRecentFilter}
                          />
                        )}

                        {codeTemplateFilters.approvalStatusFilter && (
                          <FilterDropdown
                            id="ApprovalStatusFilter"
                            isLoading={isLoading}
                            filters={codeTemplateFilters}
                            setFilters={setCodeTemplateFilters}
                            style={{
                              marginLeft: "225px",
                              height: "367px",
                            }}
                            placeholder={
                              UI_TEXTS.PLACEHOLDERS_FILTERS.APPROVAL_STATUS
                            }
                            data={dropDownFilterOptions}
                            actionTypeOptionsSelected={actionTypeOptionSelected}
                            setActionTypeOptionsSelected={
                              setActionTypeOptionSelected
                            }
                            tagsOptionsSelected={tagsOptionsSelected}
                            setTagsOptionsSelected={setTagsOptionsSelected}
                            scheduleByOptionsSelected={createdByOptionsSelected}
                            setScheduleByOptionsSelected={
                              setCreatedByOptionsSelected
                            }
                            approvalStatusOptionSelected={
                              approvalStatusOptionSelected
                            }
                            setApprovalStatusOptionSelected={
                              setApprovalStatusOptionSelected
                            }
                          />
                        )}

                        {codeTemplateFilters.CreatedByFilter && (
                          <FilterDropdown
                            id="ScheduleByFilter"
                            isLoading={isLoading}
                            filters={codeTemplateFilters}
                            setFilters={setCodeTemplateFilters}
                            style={{
                              marginLeft: "225px",
                              height: "367px",
                            }}
                            placeholder={
                              UI_TEXTS.PLACEHOLDERS_FILTERS.CREATED_BY
                            }
                            data={dropDownFilterOptions}
                            actionTypeOptionsSelected={actionTypeOptionSelected}
                            setActionTypeOptionsSelected={
                              setActionTypeOptionSelected
                            }
                            tagsOptionsSelected={tagsOptionsSelected}
                            setTagsOptionsSelected={setTagsOptionsSelected}
                            scheduleByOptionsSelected={createdByOptionsSelected}
                            setScheduleByOptionsSelected={
                              setCreatedByOptionsSelected
                            }
                            recentFilter={recentFilter}
                            setRecentFilter={setRecentFilter}
                          />
                        )}

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            padding: "10px 0 0 10px",
                            marginBottom: "-10px",
                          }}
                        >
                          {actionTypeOptionSelected &&
                            actionTypeOptionSelected.length !== 0 && (
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
                                        {actionTypeOptionSelected
                                          .map((eachObj) => eachObj.optionName)
                                          .join(",")}
                                      </p>
                                    </React.Fragment>
                                  }
                                >
                                  <p>
                                    <div
                                      className={
                                        classes.planner_resetAllFilterBtn
                                      }
                                      style={{ border: "1px solid #7367f0" }}
                                    >
                                      {UI_TEXTS.LABELS.CATEGORY} :{" "}
                                      <b>
                                        {actionTypeOptionSelected
                                          ?.map((eachObj) => eachObj.optionName)
                                          ?.join(",")?.length > 50
                                          ? ` ${actionTypeOptionSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              ?.join(",   ")
                                              ?.substring(0, 50)} ... `
                                          : `${actionTypeOptionSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              .join(", ")}`}
                                      </b>
                                      <span
                                        onClick={() =>
                                          setActionTypeOptionSelected([])
                                        }
                                        style={{
                                          marginLeft: "5px",
                                          fontWeight: "900",
                                        }}
                                      >
                                        {UI_TEXTS.LABELS.CROSS}
                                      </span>
                                    </div>
                                  </p>
                                </HtmlTooltip>
                              </div>
                            )}

                          {tagsOptionsSelected &&
                            tagsOptionsSelected.length !== 0 && (
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
                                      className={
                                        classes.planner_resetAllFilterBtn
                                      }
                                      style={{ border: "1px solid #7367f0" }}
                                    >
                                      {UI_TEXTS.LABELS.TAGS} :{" "}
                                      <b>
                                        {tagsOptionsSelected
                                          ?.map((eachObj) => eachObj.optionName)
                                          ?.join(",")?.length > 50
                                          ? ` ${tagsOptionsSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              ?.join(",   ")
                                              ?.substring(0, 50)} ... `
                                          : `${tagsOptionsSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              .join(", ")}`}
                                      </b>
                                      <span
                                        onClick={() =>
                                          setTagsOptionsSelected([])
                                        }
                                        style={{
                                          marginLeft: "5px",
                                          fontWeight: "900",
                                        }}
                                      >
                                        {UI_TEXTS.LABELS.CROSS}
                                      </span>
                                    </div>
                                  </p>
                                </HtmlTooltip>
                              </div>
                            )}

                          {approvalStatusOptionSelected &&
                            approvalStatusOptionSelected.length !== 0 && (
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
                                        {approvalStatusOptionSelected
                                          .map((eachObj) => eachObj.optionName)
                                          .join(",")}
                                      </p>
                                    </React.Fragment>
                                  }
                                >
                                  <p>
                                    <div
                                      className={
                                        classes.planner_resetAllFilterBtn
                                      }
                                      style={{ border: "1px solid #7367f0" }}
                                    >
                                      {UI_TEXTS.LABELS.APPROVAL_STATUS} :{" "}
                                      <b>
                                        {approvalStatusOptionSelected
                                          ?.map((eachObj) => eachObj.optionName)
                                          ?.join(",")?.length > 50
                                          ? ` ${approvalStatusOptionSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              ?.join(",   ")
                                              ?.substring(0, 50)} ... `
                                          : `${approvalStatusOptionSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              .join(", ")}`}
                                      </b>
                                      <span
                                        onClick={() =>
                                          setApprovalStatusOptionSelected([])
                                        }
                                        style={{
                                          marginLeft: "5px",
                                          fontWeight: "900",
                                        }}
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
                                      className={
                                        classes.planner_resetAllFilterBtn
                                      }
                                      style={{ border: "1px solid #7367f0" }}
                                    >
                                      {UI_TEXTS.LABELS.CREATED_BY} :{" "}
                                      <b>
                                        {createdByOptionsSelected
                                          ?.map((eachObj) => eachObj.optionName)
                                          ?.join(",")?.length > 50
                                          ? ` ${createdByOptionsSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              ?.join(",   ")
                                              ?.substring(0, 50)} ... `
                                          : `${createdByOptionsSelected
                                              .map(
                                                (eachObj) => eachObj.optionName
                                              )
                                              .join(", ")}`}
                                      </b>
                                      <span
                                        onClick={() =>
                                          setCreatedByOptionsSelected([])
                                        }
                                        style={{
                                          marginLeft: "5px",
                                          fontWeight: "900",
                                        }}
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
                    )}
                  </div>
                )}
              </div>

              <AddTemplateModal
                currentItem={currentItem}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                isViewModeForTemplates={isViewModeForTemplate}
                setIsViewModeForTemplate={setIsViewModeForTemplate}
                onSaveSuccess={() => {
                  fetchTemplateData(true); // Only fetch when save is successful
                }}
              />

              {showEditor && currentEditorItem && (
                <CommandEditorDialog
                  open={showEditor}
                  onClose={() => setShowEditor(false)}
                  command={currentEditorItem.commandScripts}
                  dataVariable={currentEditorItem.templateName}
                  setCommand={async (cmd) => {
                    const canEdit =
                      currentEditorItem.status !== "PENDING_APPROVAL" &&
                      currentEditorItem.status !== "PENDING" &&
                      currentEditorItem.status !== "REJECTED";

                    if (!canEdit) {
                      toast.error("Editing is not allowed for this status");
                      return;
                    }

                    try {
                      const response = await dispatch(
                        EditTemplate({
                          templateId: currentEditorItem.templateId,
                          templateVersion: currentEditorItem.templateVersion,
                          commandScripts: cmd,
                          templateName: currentEditorItem.templateName,
                          description: currentEditorItem.description,
                          templateType: currentEditorItem.templateType,
                          tags: currentEditorItem.tags,
                          templateIcon: currentEditorItem.templateIcon,
                          accessType: currentEditorItem.accessType,
                          approvalRequired: currentEditorItem.approvalRequired,
                        })
                      );

                      if (response?.payload?.success) {
                        setTemplateData((prev) =>
                          prev.map((item) =>
                            item.templateId === currentEditorItem.templateId
                              ? { ...item, commandScripts: cmd }
                              : item
                          )
                        );
                        toast.success(
                          response?.payload?.message
                            ? response?.payload?.message
                            : "Command Updated Successfully"
                        );
                        setShowEditor(false);
                      }
                    } catch (error) {
                      toast.error(
                        TOAST_MESSAGES.OTHERS.FAILED_TO_UPDATE_COMMAND
                      );
                    }
                  }}
                  viewOnly={
                    currentEditorItem.status === "PENDING_APPROVAL" ||
                    currentEditorItem.status === "PENDING" ||
                    currentEditorItem.status === "REJECTED"
                  }
                  handleSaveChanges={
                    currentEditorItem.status !== "PENDING_APPROVAL" &&
                    currentEditorItem.status !== "PENDING" &&
                    currentEditorItem.status !== "REJECTED"
                  }
                  showSaveButton={false}
                />
              )}

              <CMDBQueryDialog
                open={showCMDBQueryModal}
                item={currentCMDBItem}
                onClose={() => setShowCMDBQueryModal(false)}
                onSave={handleSaveCMDBQuery}
              />

              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {isLoading || isLoadingCards ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "16px",
                      padding: "0 10px 10px 10px",
                      width: "100%",
                    }}
                  >
                    {Array.from(new Array(12)).map((_, index) => (
                      <TemplateCardSkeleton key={index} />
                    ))}
                  </div>
                ) : templates && templates.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(400px, 1fr))",
                      gap: "16px",
                      padding: "12px",
                      width: "100%",
                    }}
                  >
                    {templates.map((item, itemIndex) => (
                      <Card
                        key={item.id || itemIndex}
                        style={{
                          width: "100%",
                          minHeight: "150px",
                          borderRadius: "12px",
                          border: "1px solid #e0e0e0",
                          boxShadow: "none",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardContent
                          style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "12px",
                          }}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(item, e);
                            }}
                          >
                            <div className="user_details">
                              <span className="user_info">
                                <Calendar
                                  size="18"
                                  color="#64748b"
                                  style={{ marginRight: "5px" }}
                                />
                                {item?.createdAt === item?.updatedAt
                                  ? formattedDate(item?.createdAt)
                                  : formattedDate(item?.updatedAt)}
                              </span>
                              <span>
                                <div
                                  style={{ textAlign: "center" }}
                                  className="template_info_container"
                                >
                                  {item?.templateType}
                                </div>
                                {item.templateType !== "CMDB_API" && (
                                  <span
                                    className="schedule_info_container"
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleScheduleClick(item, e);
                                    }}
                                  >
                                    In Use:{item?.scheduleCount}
                                  </span>
                                )}
                              </span>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "12px",
                                  cursor:
                                    item.status === "PENDING_APPROVAL" ||
                                    item.status === "PENDING"
                                      ? ""
                                      : "pointer",
                                }}
                                className="no-card-click"
                              >
                                {getTemplateIcon(item.templateIcon)}

                                <div className="no-card-click">
                                  {item.status === "PENDING_APPROVAL" && (
                                    <span
                                      className="approval-tag"
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      <UserOctagon size={20} color="#e62727" />
                                      {UI_TEXTS.PERMISSIONS.APPROVED_REQUIRED}
                                    </span>
                                  )}
                                  {item.status === "REJECTED" && (
                                    <span
                                      className="approval-tag"
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      <GoBlocked size={20} color="#e62727" />
                                      {"Approval Rejected"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Typography className="marketplace-card-title">
                                {item?.templateName}
                              </Typography>

                              <span className="marketplace-card-description">
                                {item?.description || "-"}
                              </span>

                              {item?.tags &&
                                (Array.isArray(item.tags)
                                  ? item.tags.filter((t) => t?.trim()).length >
                                    0
                                  : typeof item.tags === "string"
                                  ? item.tags
                                      .split(",")
                                      .filter((t) => t?.trim()).length > 0
                                  : false) && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "4px",
                                      minHeight: "32px",
                                    }}
                                  >
                                    {(Array.isArray(item.tags)
                                      ? item.tags.slice(0, 4)
                                      : item.tags.split(",").slice(0, 4)
                                    ).map((tag, tagIndex) => {
                                      const trimmedTag = tag?.trim();
                                      if (!trimmedTag) return null;

                                      const colorStyle = getTagColor(
                                        item,
                                        tagIndex,
                                        itemIndex
                                      );

                                      return (
                                        <Tooltip
                                          key={tagIndex}
                                          title={trimmedTag}
                                        >
                                          <Chip
                                            label={trimmedTag}
                                            size="small"
                                            sx={{
                                              backgroundColor:
                                                colorStyle.background,
                                              color: colorStyle.color,
                                              fontSize: "10px",
                                              fontWeight: 600,
                                              maxWidth: "150px",
                                              "& .MuiChip-label": {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                fontFamily: "Manrope",
                                              },
                                            }}
                                          />
                                        </Tooltip>
                                      );
                                    })}
                                    {item.tags.length > 4 && (
                                      <Tooltip
                                        title={item.tags.slice(4).join(", ")}
                                      >
                                        <Chip
                                          label={`+ ${item.tags.length - 4}`}
                                          size="small"
                                          sx={{
                                            fontSize: "10px",
                                            fontWeight: 600,
                                            maxWidth: "150px",
                                            "& .MuiChip-label": {
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                              fontFamily: "Manrope",
                                            },
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </Box>
                                )}
                            </div>
                          </div>

                          <div className="marketplace-footer">
                            <div
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <User
                                size="18"
                                color="#64748b"
                                style={{ marginRight: "6px" }}
                              />
                              <span
                                className="user_info"
                                style={{ cursor: "text" }}
                              >
                                {item?.createdBy || "-"}
                              </span>
                              {item?.templateVersion && (
                                <span
                                  className="version-tag"
                                  style={{
                                    fontSize: "12px",
                                    marginLeft: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    if (
                                      !e.target.closest(
                                        'button, [role="button"]'
                                      ) &&
                                      item.status !== "PENDING_APPROVAL" &&
                                      item.status !== "PENDING"
                                    ) {
                                      handleVersionClick(item);
                                    }
                                  }}
                                >
                                  {item.isVersionRestored &&
                                  item.restoredFrom?.originalVersion
                                    ? item.restoredFrom.originalVersion
                                    : item.templateVersion}
                                </span>
                              )}
                            </div>

                            {((item.templateType !== "CMDB_API" &&
                              writePermForCodeMarketPlace) ||
                              (item.templateType === "CMDB_API" &&
                                writePermForCMDBTemplate)) && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  marginTop: "10px",
                                  alignItems: "center",
                                  position: "relative",
                                }}
                              >
                                {item.templateType?.toLowerCase() !==
                                  "cmdb api" &&
                                  item.templateType?.toLowerCase() !==
                                    "sql" && (
                                    <CodeCopyComponent
                                      enableCodeInjection={
                                        item.enableCodeInjection
                                      }
                                      fileTitle={item.templateName}
                                      actionType={item.templateType}
                                      command={item.commandScripts}
                                      variableMapping={item.variableMapping}
                                      pythonSnippet={pythonSnippet}
                                      bashSnippet={bashSnippet}
                                      powershellSnippet={powershellSnippet}
                                    />
                                  )}
                                {item.templateType?.toLowerCase() !==
                                  "cmdb api" &&
                                  item.templateType?.toLowerCase() !==
                                    "sql" && (
                                    <CodeDownloadComponent
                                      enableCodeInjection={
                                        item.enableCodeInjection
                                      }
                                      fileTitle={item.templateName}
                                      actionType={item.templateType}
                                      command={item.commandScripts}
                                      variableMapping={item.variableMapping}
                                      pythonSnippet={pythonSnippet}
                                      bashSnippet={bashSnippet}
                                      powershellSnippet={powershellSnippet}
                                    />
                                  )}
                                <Tooltip
                                  title={
                                    item.templateType === "CMDB_API"
                                      ? "Query Editor"
                                      : "Command Scripts Editor"
                                  }
                                  arrow
                                >
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item.templateType === "CMDB_API") {
                                        setCurrentCMDBItem(item);
                                        setShowCMDBQueryModal(true);
                                      } else {
                                        handleEditorClick(item, e);
                                      }
                                    }}
                                    disabled={isViewModeForTemplate}
                                    size="small"
                                    style={{
                                      backgroundColor: "#f2f7f3",
                                      ":hover": {
                                        backgroundColor: "#f2f7f3",
                                      },
                                    }}
                                  >
                                    <img
                                      src={CodeIcon}
                                      alt="code editor"
                                      style={{ width: 20 }}
                                    />
                                  </IconButton>
                                </Tooltip>

                                {item.status !== "PENDING_APPROVAL" &&
                                  item.status !== "PENDING" &&
                                  item.status !== "REJECTED" && (
                                    <Tooltip title="Edit Template" arrow>
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEdit(item, e);
                                        }}
                                        size="small"
                                        style={{
                                          backgroundColor: "#f2f7f3",
                                          ":hover": {
                                            backgroundColor: "#f2f7f3",
                                          },
                                        }}
                                      >
                                        <EditIcon
                                          fontSize="small"
                                          style={{ color: "green" }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                {item.status !== "PENDING_APPROVAL" &&
                                  item.status !== "PENDING" &&
                                  item.status !== "REJECTED" &&
                                  item.templateType !== "CMDB_API" && (
                                    <Tooltip
                                      title={
                                        item.scheduleCount > 0
                                          ? "Template in use"
                                          : "Delete template"
                                      }
                                      arrow
                                    >
                                      <span
                                        onClick={(e) => {
                                          if (item.scheduleCount > 0) {
                                            e.stopPropagation();
                                          }
                                        }}
                                      >
                                        <IconButton
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item, e);
                                          }}
                                          disabled={
                                            item.scheduleCount > 0 || isDeleting
                                          }
                                          size="small"
                                          sx={{
                                            backgroundColor: "#fae8e8",
                                            "&:hover": {
                                              backgroundColor: "#fae8e8",
                                              opacity: 0.8,
                                            },
                                            "&.Mui-disabled": {
                                              backgroundColor: "#f5f5f5",
                                              opacity: 0.5,
                                            },
                                          }}
                                        >
                                          <DeleteIcon
                                            fontSize="small"
                                            sx={{
                                              color:
                                                item.scheduleCount > 0
                                                  ? "#9e9e9e"
                                                  : "#ed3737",
                                            }}
                                          />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <ConfirmationDialog
                      open={deleteDialogOpen}
                      onClose={() => setDeleteDialogOpen(false)}
                      onConfirm={handleConfirmDelete}
                      title={`Delete Template`}
                      message={`Are you sure you want to delete the template?`}
                      confirmText={"Yes,Delete"}
                      loading={isDeleting}
                    />

                    <TemplatesVersionModal
                      isModalOpen={isVersionModalOpen}
                      setIsModelOpen={setIsVersionModalOpen}
                      versionId={versionId}
                    />

                    <ScheduleViewModal
                      isModalOpen={isScheduleModalOpen}
                      setIsModelOpen={setIsScheduleModalOpen}
                      templateId={templateId}
                      templateName={templateName}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "80vh",
                      overflow: "hidden",
                    }}
                  >
                    {initialLoadComplete && (
                      <EmptyPage
                        title={
                          searchFilter ||
                          actionTypeOptionSelected.length > 0 ||
                          tagsOptionsSelected.length > 0 ||
                          createdByOptionsSelected.length > 0 ||
                          approvalStatusOptionSelected.length > 0
                        }
                        subtitle={getEmptyPageSubtitle(
                          searchFilter,
                          actionTypeOptionSelected,
                          tagsOptionsSelected,
                          createdByOptionsSelected,
                          approvalStatusOptionSelected
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            </>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default AppStore;
