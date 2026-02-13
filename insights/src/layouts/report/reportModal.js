import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import "./css/reportmodal.css";
import {
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Box,
  OutlinedInput,
  MenuItem,
  ToggleButtonGroup,
  Grid,
  Select,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchReportData,
  getReportDefaultColumnOptions,
  getReportDefaultJobsOptions,
  getReportDefaultTagsOptions,
  getReportGlobalFilters,
  saveOrUpdateReport,
  getFilteredSchedules,
} from "../../services/configurations/configService";
import {
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import { RiDragMoveLine } from "react-icons/ri";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SubHeader from "../../components/planning/SubHeader.component";
import Sidebar from "../../components/planning/Sidebar.component";
import { getCategories } from "../../services/jobs/JobsService";
import {
  LanguageToggleButtons,
  ReportsCategoryToggleButtons,
} from "../../components/common/CommonComponents/ReusableFields";
import { debounce } from "lodash";
import MultiSelectWithCreateOption from "../../components/planning/MultiSelectWithCreate";
import { Filter } from "iconsax-react";
import CustomFilter from "../../components/common/CustomFilters/CustomFilter";
import { isLoadingInHost } from "../../utils/DetectHost";
// Adding Schedules logic
// Sortable item component (unchanged)
function SortableItem({
  columnObj,
  id,
  value,
  operator,
  setOperator,
  itemValue,
  setItemValue,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id });

  return (
    <div className={`filter-container ${isDragging ? "dragging" : ""}`}>
      <div
        className="drag-handle"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <RiDragMoveLine cursor="pointer" size={24} />
        <Tooltip title={value}>
          <span className="filter-value">{value}</span>
        </Tooltip>
      </div>

      <div className="operator-select">
        <select
          value={operator}
          onChange={(e) =>
            setOperator(
              `${columnObj?.column}-${columnObj?.job}`,
              e.target.value
            )
          }
        >
          <option value="Select Operator">
            {UI_TEXTS.TEXTS.SELECT_OPERATOR}
          </option>
          <option value="equals">{UI_TEXTS.TEXTS.EQUALS}</option>
          <option value="contains">{UI_TEXTS.TEXTS.CONTAINS}</option>
          {/* <option value="and">{UI_TEXTS.TEXTS.AND}</option>
          <option value="or">{UI_TEXTS.TEXTS.OR}</option>
          <option value="starts_with">{UI_TEXTS.TEXTS.START_WITH}</option>
          <option value="ends_with">{UI_TEXTS.TEXTS.END_WITH}</option>
          <option value="not_equals">{UI_TEXTS.TEXTS.NOT_EQUALS}</option> */}
          {/* <option value="includes">{UI_TEXTS.TEXTS.INCLUDES}</option> */}
        </select>
        <span className="select-arrow">▼</span>
      </div>

      <div className="value-input">
        <input
          type="text"
          value={itemValue}
          onChange={(e) =>
            setItemValue(
              `${columnObj?.column}-${columnObj?.job}`,
              e.target.value
            )
          }
          placeholder="Value"
        />
      </div>
    </div>
  );
}

const steps = [
  "Report Details",
  "Select Schedule",
  "Filters & Others (Optional)",
];

const ReportModal = () => {
  const dispatch = useDispatch();
  const { scheduleFilters } = useSelector((state) => state.reports);
  const history = useHistory();
  const { reportId } = useParams();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [reportName, setReportName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [searchColumn, setSearchColumn] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [reportDuration, setReportDuration] = useState(1);
  const [durationError, setDurationError] = useState("");
  const defaultColumns = useSelector((state) => state.reports.defaultColumns);
  const jobsState = useSelector((state) => state.reports.jobs);
  const tagsState = useSelector((state) => state.reports.tags);
  const reportData = useSelector((state) => state?.reports?.reportData.data);
  const [loading, setLoading] = useState(false);
  const [loadingColumns, setLoadingColumns] = useState(false);
  const [sidebarActiveTab, setSidebarActiveTab] = useState("reports");
  const [loadingOptions, setLoadingOptions] = useState({
    columns: false,
    jobs: false,
    tags: false,
  });
  const [reportDescription, setReportDescription] = useState("Johnson");
  const [isScheduleSelected, setIsScheduleSelected] = useState(false);
  const [reportIcon, setReportIcon] = useState("");
  const [category, setCategory] = useState("");
  const [viewOnly, setViewOnly] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [scheduleCategory, setScheduleCategory] = useState("");
  const [scheduleCategoryError, setScheduleCategoryError] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [reportType, setReportType] = useState("MY_REPORT");
  const [columnsDragged, setColumnsDragged] = useState(false);
  const [reportNameError, setReportNameError] = useState("");

  const categoriesData = useSelector(
    (state) =>
      state.jobs.categories?.filter(
        (category) => category.status !== "PENDING_APPROVAL"
      ) || []
  );
  const allJobsData = useSelector((state) => state.jobs);
  console.log("allJobsData", allJobsData);

  const columnOptions = defaultColumns.data || [];
  const jobOptions = jobsState.data || [];
  const tagOptions = tagsState.data || [];

  const ScheduleCategories = categoriesData?.map((cat) => ({
    label: cat.categoryName,
    value: cat.categoryName,
  }));

  const reportDataMyReports = useSelector(
    (state) => state?.reports?.reportData.data
  );
  const reportDataGlobalReports = useSelector(
    (state) => state?.reports?.globalReport.data
  );

  const fetchCategoriesData = async () => {
    const data = await dispatch(getCategories());
  };

  useEffect(() => {
    fetchCategoriesData();
    dispatch(getReportDefaultJobsOptions());
  }, []);

  const [operatorValues, setOperatorValues] = useState({});
  const [columnValues, setColumnValues] = useState({});
  const [recentFilter, setRecentFilter] = useState("");
  const [selectedHostName, setSelectedHostName] = useState([]);
  const [selectedScheduleType, setSelectedScheduleType] = useState([]);
  const [selectedRunas, setSelectedRunas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedJobDesc, setSelectedJobDesc] = useState([]);
  const [filters, setFilters] = useState({
    hostname: [],
    tags: [],
    scheduleType: [],
    runas: [],
    category: [],
    categoryName: [],
    runAs: [],
    jobDescription: [],
    runId: [],
    recentFilter,
  });
  const [filterLoading, setFilterLoading] = useState(false);
  const [globalFilterOptions, setGlobalFilterOptions] = useState({
    hostname: [],
    categoryName: [],
    scheduleType: [],
    jobDescription: [],
    runAs: [],
  });
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const transformOptions = (options) => {
    return options.map((option, index) => ({
      id: option,
      label: option,
      value: option,
    }));
  };

  useEffect(() => {
    const loadGlobalFilters = async () => {
      try {
        const result = await dispatch(getReportGlobalFilters()).unwrap();
        if (result.success) {
          setGlobalFilterOptions(result.data);
        }
      } catch (err) {
        // toast.error("Failed to load filter options");
      }
    };
    loadGlobalFilters();
  }, [dispatch]);

  const fetchFilteredSchedules = useCallback(
    debounce(async (filters) => {
      setFilterLoading(true);
      try {
        const result = await dispatch(getFilteredSchedules(filters)).unwrap();
        if (result.success) {
          setFilteredSchedules(result.data);
          setSelectedJobs((prevSelected) =>
            prevSelected.filter((job) => result.data.includes(job))
          );
        }
      } catch (err) {
        toast.error("Failed to fetch filtered schedules");
        setFilteredSchedules([]);
      } finally {
        setFilterLoading(false);
      }
    }, 500),
    [dispatch]
  );

  // Effect to trigger schedule filtering when filters change
  useEffect(() => {
    // Check if any filter has values
    const hasActiveFilters = Object.values(filters).some(
      (filter) => Array.isArray(filter) && filter.length > 0
    );

    if (hasActiveFilters) {
      fetchFilteredSchedules(filters);
    } else {
      // If no filters, reset to all schedules
      setFilteredSchedules(jobOptions);
    }
  }, [filters, fetchFilteredSchedules, jobOptions]);

  const handleInputChange = (field, value) => {
    if (field === "reportName") {
      const normalizedValue = value.trim();

      if (!normalizedValue) {
        setReportNameError("");
      } else if (/[^a-zA-Z0-9\s-]/.test(normalizedValue)) {
        setReportNameError(
          "Special characters are not allowed except hyphen (-)"
        );
      } else {
        setReportNameError("");
      }
      setReportName(value);
    }
  };

  const handleInputBlur = (field, value) => {
    if (field === "reportName") {
      const normalizedValue = value.trim();
      const isEditMode = !!reportId;
      const isDuplicate = location.state?.isDuplicate;

      // Length validation
      if (
        normalizedValue &&
        (normalizedValue.length < 5 || normalizedValue.length > 100)
      ) {
        setReportNameError("Report name must be between 5 and 100 characters");
        return;
      }

      // Only check for duplicates when NOT editing (new report or duplicate)
      if (normalizedValue && (!isEditMode || isDuplicate)) {
        // Combine both My Reports and Global Reports
        const allReports = [
          ...(reportDataMyReports?.data || []),
          ...(reportDataGlobalReports?.data || []),
        ];

        const duplicateReport = allReports.find((report) => {
          const existingName = report.reportName
            ?.toString()
            .trim()
            .toLowerCase();
          const newName = normalizedValue.toLowerCase();

          // Check if names match
          if (existingName === newName) {
            return true;
          }
          return false;
        });

        if (duplicateReport) {
          setReportNameError("Report name already exists");
          return;
        }
      }

      setReportNameError("");
    }
  };

  const filtersConfig = [
    {
      id: "hostname",
      name: "hostname",
      placeholder: "Hostname",
      options: transformOptions(globalFilterOptions.hostname || []),
      value: selectedHostName,
      onChange: (value) => handleFilterChange("hostname", value),
    },
    {
      id: "categoryName",
      name: "categoryName",
      placeholder: "Category",
      options: transformOptions(globalFilterOptions.categoryName || []),
      value: selectedCategory,
      onChange: (value) => handleFilterChange("categoryName", value),
    },
    {
      id: "scheduleType",
      name: "scheduleType",
      placeholder: "Schedule Type",
      options: transformOptions(globalFilterOptions.scheduleType || []),
      value: selectedScheduleType,
      onChange: (value) => handleFilterChange("scheduleType", value),
    },
    {
      id: "jobDescription",
      name: "jobDescription",
      placeholder: "ScheduleDescription",
      options: transformOptions(globalFilterOptions.jobDescription || []),
      value: selectedJobDesc,
      onChange: (value) => handleFilterChange("jobDescription", value),
    },
    {
      id: "runAs",
      name: "runAs",
      placeholder: "Run As",
      options: transformOptions(globalFilterOptions.runAs || []),
      value: selectedRunas,
      onChange: (value) => handleFilterChange("runAs", value),
    },
  ];

  const handleFilterChange = (key, value) => {
    const selectedValues = value?.target
      ? value.target.value
      : Array.isArray(value)
      ? value
      : [value];

    setFilters((prev) => ({
      ...prev,
      [key]: selectedValues,
    }));

    switch (key) {
      case "hostname":
        setSelectedHostName(selectedValues);
        break;
      case "categoryName":
        setSelectedCategory(selectedValues);
        break;
      case "tags":
        setSelectedTags(selectedValues);
        break;
      case "scheduleType":
        setSelectedScheduleType(selectedValues);
        break;
      case "runAs":
        setSelectedRunas(selectedValues);
        break;
      case "jobDescription":
        setSelectedJobDesc(selectedValues);
        break;

      default:
        break;
    }
  };

  const handleRemoveFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: [],
    }));

    switch (key) {
      case "hostname":
        setSelectedHostName([]);
        break;
      case "tags":
        setSelectedTags([]);
        break;
      case "command":
        setSelectedScheduleType([]);
        break;
      case "runas":
        setSelectedRunas([]);
        break;
      case "category":
        setSelectedCategory([]);
        break;
      case "categoryName":
        setSelectedCategory([]);
        break;
      case "scheduleType":
        setSelectedScheduleType([]);
        break;
      case "runAs":
        setSelectedRunas([]);
        break;
      case "jobDescription":
        setSelectedJobDesc([]);
        break;

      default:
        break;
    }
  };

  // Get filtered options for display (combines search and filter results)
  const getDisplayOptions = () => {
    const hasActiveFilters = Object.values(filters).some(
      (filter) => Array.isArray(filter) && filter.length > 0
    );

    let options = hasActiveFilters ? filteredSchedules : jobOptions;

    // Apply local search filter
    if (searchTerm) {
      options = options.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return options;
  };

  const displayOptions = getDisplayOptions();

  const clearAllFilters = () => {
    setSelectedHostName([]);
    setSelectedTags([]);
    setSelectedScheduleType([]);
    setSelectedRunas([]);
    setSelectedCategory([]);
    setSelectedJobDesc([]);
    // setFilteredData([]);

    setFilters({
      hostname: [],
      tags: [],
      scheduleType: [],
      runas: [],
      category: [],
      categoryName: [],
      runAs: [],
      jobDescription: [],
      runId: [],
      recentFilter,
    });
  };

  const handleSetOperator = (id, operator) => {
    setOperatorValues((prev) => ({
      ...prev,
      [id]: operator,
    }));
  };

  const handleSetItemValue = (id, value) => {
    setColumnValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateScheduleCategory = (value) => {
    if (!value) {
      return "Schedule Category is required";
    }
    return "";
  };

  const handleScheduleCategoryChange = (event, newValue) => {
    // const value = newValue ? newValue.categoryName || newValue : "";
    const value = event.target.value || "";
    setScheduleCategory(value);

    const error = validateScheduleCategory(value);
    setScheduleCategoryError(error);
  };

  const handleTagsChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags); // Always an array
    // const error = validateTags(newSelectedTags);
    setScheduleCategoryError(error);
  };

  const validateTags = (tagsArray) => {
    if (!Array.isArray(tagsArray) || tagsArray.length === 0) {
      return "Tags are required";
    }
    return "";
  };

  const handleIconChange = (newIcon) => {
    if (newIcon !== null) {
      setReportIcon(
        typeof newIcon === "string" ? newIcon : String(newIcon || "")
      );
    }
  };
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOrderedColumns((items) => {
        // items is an array of column objects containing sortableId
        const oldIndex = items.findIndex((it) => it.sortableId === active.id);
        const newIndex = items.findIndex((it) => it.sortableId === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        setColumnsDragged(true);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // const validateDuration = (value) => {
  //   if (value === "") return "Duration is required";
  //   const numValue = parseInt(value);
  //   if (isNaN(numValue) || numValue < 1) {
  //     return "Duration must be at least 1 day";
  //   }
  //   return "";
  // };

  const validateDuration = (value) => {
    if (!value) return "Duration is required";
    if (value.length > 3) return "Duration cannot exceed 3 digits";
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return "Duration must be a number";
    if (numValue < 1) return "Duration must be at least 1 day";
    if (numValue > 999) return "Maximum duration is 999 days";
    return "";
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setReportDuration(value);

    const error = validateDuration(value);
    setDurationError(error);
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Validate report name
    const trimmedReportName = reportName.trim();
    if (!trimmedReportName) {
      setReportNameError("Report name is required");
      return;
    }
    if (trimmedReportName.length < 5 || trimmedReportName.length > 100) {
      setReportNameError("Report name must be between 5 and 100 characters");
      return;
    }

    // Validate duration
    const durationStr = reportDuration.toString().trim();
    if (!durationStr) {
      setDurationError("Duration is required");
      return;
    }
    if (durationStr.length > 3) {
      setDurationError("Duration cannot exceed 3 digits");
      return;
    }
    const numDuration = parseInt(durationStr, 10);
    if (isNaN(numDuration)) {
      setDurationError("Duration must be a number");
      return;
    }
    if (numDuration < 1) {
      setDurationError("Duration must be at least 1 day");
      return;
    }
    if (numDuration > 999) {
      setDurationError("Maximum duration is 999 days");
      return;
    }

    // const durationValidationError = validateDuration(reportDuration);
    // if (currentStep === 2 && durationValidationError) {
    //   setDurationError(durationValidationError);
    //   return;
    // }

    if (currentStep === 2 && selectedOptions.length === 0) {
      setError("Please select at least one column.");
      setTouched(false);
      return;
    }
    setTouched(true);
    if (selectedOptions?.length !== orderedColumns?.length) {
      // setOrderedColumns([...selectedOptions]);
      setOrderedColumns(ensureSortableColumns(selectedOptions));
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const trimmedReportName = reportName.trim();

    // Only check for duplicates when CREATING NEW report (not editing)
    if (!reportId && !location.state?.isDuplicate) {
      const allReports = [
        ...(reportDataMyReports?.data || []),
        ...(reportDataGlobalReports?.data || []),
      ];

      const duplicateReport = allReports.find((report) => {
        const existingName = report.reportName?.toString().trim().toLowerCase();
        const newName = trimmedReportName.toLowerCase();
        return existingName === newName;
      });

      if (duplicateReport) {
        toast.error("A report with this name already exists");
        setReportNameError("Report name already exists");
        return;
      }
    }

    // Validation for duplicate when DUPLICATING (not editing)
    if (location.state?.isDuplicate) {
      const allReports = [
        ...(reportDataMyReports?.data || []),
        ...(reportDataGlobalReports?.data || []),
      ];

      const duplicateReport = allReports.find((report) => {
        const existingName = report.reportName?.toString().trim().toLowerCase();
        const newName = trimmedReportName.toLowerCase();
        return existingName === newName;
      });

      if (duplicateReport) {
        toast.error("A report with this name already exists");
        setReportNameError("Report name already exists");
        return;
      }
    }

    const durationValidationError = validateDuration(reportDuration);
    if (durationValidationError) {
      setDurationError(durationValidationError);
      return;
    }

    const scheduleCategoryValue =
      typeof scheduleCategory === "object"
        ? scheduleCategory?.props?.value
        : scheduleCategory;

    if (!scheduleCategoryValue) {
      setScheduleCategoryError("Schedule Category is required");
      return;
    }

    setLoading(true);

    const isEditMode = !!reportId;
    const isDuplicate = location.state?.isDuplicate;
    const transformedColumns = orderedColumns.map((el) => ({
      job: el.job,
      column: el.column,
      operator: operatorValues[`${el?.column}-${el?.job}`] || "",
      value: columnValues[`${el?.column}-${el?.job}`] || "",
    }));

    let publishedReportsLocal = JSON.parse(
      localStorage.getItem("publishedReportsLocal") || "[]"
    );
    if (!Array.isArray(publishedReportsLocal)) {
      publishedReportsLocal = [];
      localStorage.setItem(
        "publishedReportsLocal",
        JSON.stringify(publishedReportsLocal)
      );
    }

    const reportDataToSave = {
      reportName,
      description: reportDescription,
      jobs: selectedJobs,
      tags: selectedTags,
      columns: transformedColumns,
      duration: parseInt(reportDuration),
      scheduleCategory: scheduleCategoryValue,
      templateIcon: reportIcon,
      ...(isEditMode && { reportId: reportId }),
      type: reportType,
    };

    try {
      const response = await dispatch(
        saveOrUpdateReport(reportDataToSave)
      ).unwrap();

      if (isEditMode && response) {
        const reportIdStr = reportId.toString();
        const index = publishedReportsLocal.findIndex(
          (obj) =>
            obj.publish === reportIdStr || obj.publish_as_system === reportIdStr
        );
        if (index > -1) {
          publishedReportsLocal.splice(index, 1);
          localStorage.setItem(
            "publishedReportsLocal",
            JSON.stringify(publishedReportsLocal)
          );
        }
        toast.success(TOAST_MESSAGES.OTHERS.REPORT_UPDATE_SUCCESSFULLY);
      } else if (isDuplicate) {
        toast.success(TOAST_MESSAGES.OTHERS.REPORT_CLONED_SUCCESSFULLY);
      } else {
        toast.success(TOAST_MESSAGES.OTHERS.NEW_REPORT_CREATED_SUCCESSFULLY);
      }

      // Redirect back to reports page
      history.push("/report?tab=myReports");
      dispatch(fetchReportData());
    } catch (err) {
      console.error("Failed to save/update report:", err);
      toast.error(
        err.message || TOAST_MESSAGES.OTHERS.FAILED_TO_SAVE_OR_UPDATE
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push("/report?tab=myReports");
  };

  const handleToggle = (value) => {
    setSelectedJobs((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSelectAllSchedules = () => {
    if (selectedJobs.length === displayOptions.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(displayOptions);
    }
  };

  const isAllSelected = selectedJobs.length === jobOptions.length;
  const filteredOptions = jobOptions.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (job, column) =>
    selectedOptions.some((item) => item.job === job && item.column === column);

  const handleToggleColumn = (job, column) => {
    if (selectedOptions?.length === 300) {
      return toast.warning("You can select up to 300 columns only.");
    }
    setSelectedOptions((prev) => {
      const exists = prev.some(
        (item) => item.job === job && item.column === column
      );
      if (exists) {
        return prev.filter(
          (item) => !(item.job === job && item.column === column)
        );
      } else {
        return [...prev, { job, column }];
      }
    });
  };

  const [initialSelection, setInitialSelection] = useState(null); // Snapshot of original in edit mode

  // Helper to normalize columns (includes operators/values, sorted for comparison)
  const normalizeColumns = (columns, operators = {}, values = {}) => {
    return columns
      .map((col) => ({
        job: col.job,
        column: col.column,
        operator: operators[`${col.column}-${col.job}`] || "",
        value: values[`${col.column}-${col.job}`] || "",
      }))
      .sort((a, b) =>
        `${a.job}-${a.column}`.localeCompare(`${b.job}-${b.column}`)
      );
  };

  const getFilteredOptions = () => {
    if (!searchColumn) return columnOptions;

    const lowerSearch = searchColumn.toLowerCase();

    const filtered = {};

    for (const [job, column] of Object.entries(columnOptions)) {
      const matches = column.filter((col) =>
        col.toLowerCase().includes(lowerSearch)
      );
      if (matches.length > 0) {
        filtered[job] = matches;
      }
    }

    return filtered;
  };

  const filteredColumnOptions = getFilteredOptions();

  const columnArr = [];
  // Filter to selected jobs only
  const selectedJobColumns = {};
  Object.entries(filteredColumnOptions).forEach(([job, column]) => {
    if (selectedJobs.includes(job)) {
      selectedJobColumns[job] = column;
    }
  });
  Object.entries(selectedJobColumns).forEach(([job, column]) => {
    column.forEach((col) => {
      columnArr.push({
        job: job,
        column: col,
      });
    });
  });

  const handleSelectAllColumns = () => {
    if (columnArr?.length > 300) {
      return toast.warning("You can select up to 300 columns only.");
    }
    if (selectedOptions.length === columnArr.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(columnArr);
    }
  };

  useEffect(() => {
    if (selectedJobs.length === 0) {
      setLoadingColumns(false);
      return;
    }
    setLoadingColumns(true);
    dispatch(getReportDefaultColumnOptions({ jobs: selectedJobs }))
      .unwrap()
      .finally(() => {
        setLoadingColumns(false);
      });
  }, [selectedJobs]);

  useEffect(() => {
    setLoadingColumns(true);
    dispatch(getReportDefaultColumnOptions({ jobs: selectedJobs }))
      .unwrap()
      .finally(() => {
        setLoadingColumns(false);
      });
  }, [selectedJobs]);

  useEffect(() => {
    if (!jobsState.data || jobsState.data.length === 0) {
      setLoadingOptions((prev) => ({ ...prev, jobs: true }));
      dispatch(getReportDefaultJobsOptions())
        .unwrap()
        .finally(() => setLoadingOptions((prev) => ({ ...prev, jobs: false })));
    }

    if (!tagsState.data || tagsState.data.length === 0) {
      setLoadingOptions((prev) => ({ ...prev, tags: true }));
      dispatch(getReportDefaultTagsOptions())
        .unwrap()
        .finally(() => setLoadingOptions((prev) => ({ ...prev, tags: false })));
    }
  }, [dispatch]);

  useEffect(() => {
    const updatedOptions = selectedOptions.filter((el) => {
      if (selectedJobs.includes(el.job)) {
        return el;
      }
    });
    setSelectedOptions(updatedOptions);
  }, [selectedJobs]);

  // Load report data for editing OR duplicate
  // Load report data for editing OR duplicate

  useEffect(() => {
    setInitialSelection(null);

    // Handle duplicate data from route state
    if (location.state?.duplicateData) {
      const duplicateData = location.state.duplicateData;
      setReportName(duplicateData.reportName || "");
      setReportDescription(duplicateData.description || "");
      setReportDuration(duplicateData.duration || 1);
      setSelectedJobs(duplicateData.jobs || []);
      setSelectedTags(duplicateData.tags || []);
      setSelectedOptions(duplicateData.columns || []);
      // setOrderedColumns(duplicateData.columns || []);
      setOrderedColumns(ensureSortableColumns(duplicateData.columns));
      setScheduleCategory(duplicateData.scheduleCategory || "");
      setReportIcon(duplicateData.templateIcon || "");

      const initialOperatorValues = {};
      const initialColumnValues = {};
      duplicateData.columns.forEach((item) => {
        initialOperatorValues[`${item?.column}-${item?.job}`] = item.operator;
        initialColumnValues[`${item?.column}-${item?.job}`] = item.value;
      });
      setOperatorValues(initialOperatorValues);
      setColumnValues(initialColumnValues);
    }
    // Handle edit mode
    else if (reportId) {
      let reportToEdit = reportData?.data?.find(
        (item) => item._id === reportId
      );

      if (!reportToEdit) {
        reportToEdit = reportDataGlobalReports?.data?.find(
          (item) => item._id === reportId
        );
      }
      if (reportToEdit) {
        console.log("reportToEdit.columns => ", reportToEdit.columns);
        const loadedReportName = reportToEdit.reportName || "";
        const loadedReportDescription = reportToEdit.description || "";
        const loadedReportDuration = reportToEdit.duration || 1;
        const loadedSelectedJobs = reportToEdit.jobs || [];
        const loadedSelectedTags = reportToEdit.tags || [];
        const loadedSelectedOptions = reportToEdit.columns || [];
        const loadedScheduleCategory = reportToEdit.scheduleCategory || "";
        const loadedReportIcon = reportToEdit.templateIcon || "";
        const loadedReportType = reportToEdit.type || "";

        // Set current values
        setReportName(loadedReportName);
        setReportDescription(loadedReportDescription);
        setReportDuration(loadedReportDuration.toString());
        setSelectedJobs(loadedSelectedJobs);
        setSelectedTags(loadedSelectedTags);
        setSelectedOptions(loadedSelectedOptions);
        // setOrderedColumns(loadedSelectedOptions);
        setOrderedColumns(ensureSortableColumns(loadedSelectedOptions));
        setScheduleCategory(loadedScheduleCategory);
        setReportIcon(loadedReportIcon);
        setReportType(loadedReportType);

        const initialOperatorValues = {};
        const initialColumnValues = {};
        reportToEdit.columns.forEach((item) => {
          initialOperatorValues[`${item?.column}-${item?.job}`] = item.operator;
          initialColumnValues[`${item?.column}-${item?.job}`] = item.value;
        });
        setOperatorValues(initialOperatorValues);
        setColumnValues(initialColumnValues);

        const initialColumns = normalizeColumns(
          loadedSelectedOptions,
          initialOperatorValues,
          initialColumnValues
        );
        setInitialSelection({
          reportName: loadedReportName.trim(),
          description: loadedReportDescription.trim(),
          duration: parseInt(loadedReportDuration),
          jobs: [...loadedSelectedJobs].sort(),
          tags: [...loadedSelectedTags].sort(),
          columns: initialColumns,
          scheduleCategory: loadedScheduleCategory,
          reportIcon: loadedReportIcon,
          type: loadedReportType,
        });
      }
    }
  }, [reportId, reportData, location.state, reportDataGlobalReports]);

  const isSelectionUnchanged = () => {
    if (!initialSelection || !reportId) return false;

    const currentSelection = {
      reportName: reportName.trim(),
      description: reportDescription.trim(),
      duration: parseInt(reportDuration),
      jobs: [...selectedJobs].sort(),
      tags: [...selectedTags].sort(),
      columns: normalizeColumns(orderedColumns, operatorValues, columnValues),
      scheduleCategory:
        typeof scheduleCategory === "string"
          ? scheduleCategory
          : scheduleCategory?.value || scheduleCategory?.categoryName || "", // Fallback to string
      reportIcon:
        typeof reportIcon === "string" ? reportIcon : String(reportIcon || ""),
    };

    return (
      JSON.stringify(initialSelection.reportName) ===
        JSON.stringify(currentSelection.reportName) &&
      JSON.stringify(initialSelection.description) ===
        JSON.stringify(currentSelection.description) &&
      JSON.stringify(initialSelection.duration) ===
        JSON.stringify(currentSelection.duration) &&
      JSON.stringify(initialSelection.jobs) ===
        JSON.stringify(currentSelection.jobs) &&
      JSON.stringify(initialSelection.tags) ===
        JSON.stringify(currentSelection.tags) &&
      JSON.stringify(initialSelection.columns) ===
        JSON.stringify(currentSelection.columns) &&
      JSON.stringify(initialSelection.scheduleCategory) ===
        JSON.stringify(currentSelection.scheduleCategory) &&
      JSON.stringify(initialSelection.reportIcon) ===
        JSON.stringify(currentSelection.reportIcon)
    );
  };

  console.log("selectedOptions => ", selectedOptions);
  console.log("selectedJobs => ", selectedJobs);
  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  const ensureSortableColumns = (arr = []) =>
    (arr || []).map((item, idx) => ({
      ...item,
      sortableId:
        item?.sortableId ||
        `${String(item?.job || "job")}-${String(
          item?.column || "col"
        )}-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
    }));

  return (
    <div
      className={`report-topwrapper ${isLoadingInHost ? 'platform-mode' : ''}`}
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <SubHeader
        data-test="planner-layout-subheader"
        data-testid="subheader-test"
      />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar activeTab="report" setActiveTab={setSidebarActiveTab} />
        <div className={`report-form-container ${isLoadingInHost ? 'platform-form-container' : ''}`}>
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleCancel}
              style={{
                marginRight: "10px",
                height: "50px",
                width: "50px",
                backgroundColor: "EFF0F1 !important",
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <div>
              <span
                style={{
                  lineHeight: "28px",
                  letterSpacing: "0%",
                  fontFamily: "Manrope",
                  color: "rgb(16, 24, 40)",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {reportId
                  ? UI_TEXTS.HEADINGS.EDIT_REPORT
                  : location.state?.isDuplicate
                  ? "Duplicate Report"
                  : UI_TEXTS.HEADINGS.CREATE_REPORT}
              </span>
            </div>
          </div>

          <Stepper activeStep={currentStep - 1} sx={{ mb: 1.5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    fontFamily: "Manrope",
                    "& .MuiStepLabel-label": {
                      fontWeight: "500",
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                <>
                  <div
                    className={`report-scrollable-content ${isLoadingInHost ? 'platform-scrollable-content' : ''}`}
                    style={{ height: "65vh", overflowY: "auto" }}
                  >
                    <div className="report-form-row">
                      <div className="report-form-group">
                        <label className="custom-label">
                          {UI_TEXTS.HEADINGS.REPORT_TITLE}
                          <span className="iabot_required">*</span>
                        </label>
                        <OutlinedInput
                          type="text"
                          value={reportName}
                          // onChange={(e) => {
                          //   const value = e.target.value;
                          //   // While typing: Basic alphanumeric validation
                          //   if (!value.trim()) {
                          //     setReportNameError("");
                          //   } else if (/[^a-zA-Z0-9\s-]/.test(value)) {
                          //     setReportNameError(
                          //       "Special characters are not allowed except hyphen (-)"
                          //     );
                          //   } else {
                          //     setReportNameError("");
                          //   }
                          //   setReportName(value);
                          // }}
                          // onBlur={(e) => {
                          //   const value = e.target.value.trim();
                          //   // On blur: Comprehensive validation
                          //   if (
                          //     value &&
                          //     (value.length < 5 || value.length > 100)
                          //   ) {
                          //     setReportNameError(
                          //       "Report name must be between 5 and 100 characters"
                          //     );
                          //   } else if (!value) {
                          //     setReportNameError("Report name is required");
                          //   }
                          // }}
                          onChange={(e) =>
                            handleInputChange("reportName", e.target.value)
                          }
                          onBlur={(e) =>
                            handleInputBlur("reportName", e.target.value)
                          }
                          placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_REPORT_TITLE}
                          required
                          fullWidth
                          error={!!reportNameError}
                          sx={{
                            marginTop: 1,
                            borderRadius: "16px",
                            background: "none",
                            height: "50px !important",
                          }}
                        />
                        {/* Error message for report name */}
                        {reportNameError && (
                          <p
                            style={{
                              color: "red",
                              marginTop: "5px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {reportNameError}
                          </p>
                        )}
                      </div>
                      <div className="report-form-group">
                        <label className="custom-label">
                          {UI_TEXTS.LABELS.DURATION}{" "}
                          <span className="iabot_required">*</span>
                          <Tooltip title="Report Duration minimum 1 day (up to 3 digits allowed).">
                            <InfoOutlinedIcon
                              sx={{
                                fontSize: "16px",
                                color: "#667085",
                                cursor: "pointer",
                                marginLeft: "6px",
                                verticalAlign: "middle",
                              }}
                            />
                          </Tooltip>
                        </label>
                        <OutlinedInput
                          type="number"
                          value={reportDuration}
                          onChange={(e) => {
                            const value = e.target.value;
                            // While typing: Only allow digits and limit to 3 digits
                            if (value === "" || /^[1-9]\d{0,2}$/.test(value)) {
                              setReportDuration(value);
                              // Clear error when user starts typing
                              if (durationError) {
                                setDurationError("");
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            // On blur: Comprehensive validation
                            if (!value) {
                              setDurationError("Duration is required");
                            } else if (value.length > 3) {
                              setDurationError(
                                "Duration cannot exceed 3 digits"
                              );
                            } else if (parseInt(value, 10) < 1) {
                              setDurationError(
                                "Duration must be at least 1 day"
                              );
                            } else if (parseInt(value, 10) > 999) {
                              setDurationError("Maximum duration is 999 days");
                            } else {
                              setDurationError("");
                            }
                          }}
                          placeholder="Enter duration in days (1-999)"
                          fullWidth
                          min={1}
                          max={999}
                          inputProps={{
                            min: 1,
                            max: 999,
                            onKeyDown: (e) => {
                              // Block non-numeric characters
                              if (
                                e.key === "-" ||
                                e.key === "+" ||
                                e.key === "." ||
                                e.key === "e" ||
                                e.key === "E"
                              ) {
                                e.preventDefault();
                              }
                              // Prevent typing beyond 3 digits
                              if (
                                e.target.value.length >= 3 &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight" &&
                                e.key !== "Tab"
                              ) {
                                e.preventDefault();
                              }
                            },
                          }}
                          onPaste={(e) => {
                            const paste = e.clipboardData.getData("text");
                            // Allow only digits 1-999
                            if (
                              !/^[1-9]\d{0,2}$/.test(paste) ||
                              parseInt(paste, 10) > 999
                            ) {
                              e.preventDefault();
                            }
                          }}
                          endAdornment={
                            <InputAdornment position="end">days</InputAdornment>
                          }
                          error={!!durationError}
                          sx={{
                            marginTop: 1,
                            borderRadius: "16px",
                            height: "50px !important",
                          }}
                        />
                        {/* Error message for duration */}
                        {durationError && (
                          <p
                            style={{
                              color: "red",
                              marginTop: "5px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {durationError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="report-form-row">
                      <div className="report-form-group">
                        <label className="custom-label">
                          Category
                          <span className="iabot_required">*</span>
                        </label>

                        <Select
                          displayEmpty
                          size="small"
                          value={scheduleCategory}
                          onChange={handleScheduleCategoryChange}
                          input={<OutlinedInput />}
                          renderValue={(selected) =>
                            selected || "Select Category"
                          }
                          error={!!scheduleCategoryError}
                          sx={{
                            width: "100%",
                            borderRadius: "16px",
                            mt: 0.5,
                            height: "50px !important",
                            "& .MuiOutlinedInput-input": {
                              fontSize: "0.875rem",
                            },
                            "& .MuiMenuItem-root": {
                              padding: "0px !important",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 200,
                                "& .MuiMenuItem-root": {
                                  fontFamily: "Manrope",
                                  padding: "8px 16px",
                                  minHeight: "auto",
                                },
                              },
                            },
                          }}
                        >
                          {ScheduleCategories?.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              <Tooltip
                                key={opt.value}
                                title={
                                  <div
                                    style={{
                                      maxHeight: "100px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {opt.value}
                                  </div>
                                }
                              >
                                <span
                                  style={{
                                    maxWidth: "500px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {opt.label}
                                </span>
                              </Tooltip>
                            </MenuItem>
                          ))}
                        </Select>
                        {scheduleCategoryError && (
                          <p
                            style={{
                              color: "red",
                              marginTop: "5px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {scheduleCategoryError}
                          </p>
                        )}
                      </div>
                      <div className="report-form-group">
                        <div
                          className="custom-input-wrapper"
                          style={{ marginTop: "4px" }}
                        >
                          <span
                            className="market_place_title_ele"
                            style={{ marginBottom: "2px" }}
                          >
                            {UI_TEXTS.HEADER_TEXT.TAGS}
                          </span>
                          <MultiSelectWithCreateOption
                            label="Create Tags"
                            sx={{
                              width: "100%",
                              height: "50px !important",
                              borderRadius: "16px !important",
                              "& .MuiOutlinedInput-input": {
                                padding: "0px 14px",
                                fontSize: "0.875rem",
                              },
                            }}
                            selectedValues={selectedTags}
                            onSelectionChange={handleTagsChange}
                            moduleName="reports"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="custom-label">
                      {UI_TEXTS.LABELS.CHOOSE_ICON}
                      {/* <span className="iabot_required">*</span> */}
                    </label>
                    <div className="report-icon-selector-wrapper">
                      <ToggleButtonGroup
                        value={reportIcon}
                        exclusive
                        onChange={(e, newIcon) => handleIconChange(newIcon)}
                        className="lang-toggle-group"
                      >
                        <ReportsCategoryToggleButtons />
                      </ToggleButtonGroup>
                    </div>
                    <div
                      className="report-form-group"
                      style={{ marginTop: "10px" }}
                    >
                      <label className="custom-label">
                        {UI_TEXTS.LABELS.DESCRIPTION}
                      </label>
                      <TextField
                        multiline
                        rows={1.2}
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        placeholder={
                          UI_TEXTS.PLACEHOLDERS.ENTER_REPORT_DESCRIPTION
                        }
                        fullWidth
                        sx={{
                          marginTop: 1,
                          // height: "175px !important",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px !important",
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="report-modal-actions">
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{
                        borderRadius: "8px",
                        borderColor: "#d0d5dd",
                        color: "#344054",
                        textTransform: "none",
                        fontWeight: 600,
                        padding: "8px 16px",
                        fontFamily: "Manrope",
                      }}
                    >
                      {UI_TEXTS.BUTTONS.CANCEL}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      // disabled={loading || selectedOptions.length === 0}
                      // disabled={
                      //   loading ||
                      //   // selectedOptions.length === 0 ||
                      //   reportName.trim() === "" ||
                      //   !scheduleCategory ||
                      //   // !reportIcon ||
                      //   !!durationError
                      // }

                      disabled={
                        loading ||
                        reportName.trim() === "" ||
                        !!reportNameError ||
                        !scheduleCategory ||
                        !!durationError ||
                        reportDuration.toString().trim() === "" ||
                        reportDuration.toString().length > 3 ||
                        parseInt(reportDuration, 10) < 1 ||
                        parseInt(reportDuration, 10) > 999
                      }
                      sx={{
                        borderRadius: "10px",
                        backgroundColor: "#2961F4",
                        textTransform: "none",
                        fontWeight: 600,
                        padding: "8px 16px",
                        "&:hover": {
                          backgroundColor: "#1a4fd4",
                        },
                        fontFamily: "Manrope",
                      }}
                    >
                      {UI_TEXTS.BUTTONS.NEXT}
                    </Button>
                  </div>
                </>
              ) : currentStep === 2 ? (
                <>
                  <div>
                    <Box className="custom_filter_container">
                      <Box
                        className="full-width"
                        style={{
                          display: filtersVisible ? "flex" : "none",
                          width: "100%",
                          margin: "0px !important",
                        }}
                      >
                        <CustomFilter
                          filterTitle={"Report Filters"}
                          filtersConfig={filtersConfig}
                          appliedFilters={filters}
                          onFilterChange={handleFilterChange}
                          onRemoveFilter={handleRemoveFilter}
                          onClearAllFilters={clearAllFilters}
                          recentFilter={recentFilter}
                          filterLoading={filterLoading}
                          ref={React.createRef()}
                        />
                      </Box>
                      <Box className="custom_filter_icon_container">
                        <div
                          className="filter_container"
                          onClick={toggleFilters}
                          style={{ cursor: "pointer", marginTop: "20px" }}
                        >
                          <Tooltip title="Filters">
                            <span>
                              <Filter
                                size="25"
                                color="#2961F4"
                                variant="Bold"
                              />
                            </span>
                          </Tooltip>
                        </div>
                      </Box>
                    </Box>

                    <div className="report-step-row">
                      <section style={{ width: "50%" }}>
                        <Box sx={{ p: 2 }}>
                          <label className="custom-label">
                            Select Schedule
                            <span className="iabot_required">*</span>
                            {filterLoading ? (
                              <CircularProgress size={16} sx={{ ml: 1 }} />
                            ) : (
                              <span
                                style={{ color: "#102459" }}
                              >{` (${selectedJobs.length})`}</span>
                            )}
                          </label>

                          <TextField
                            fullWidth
                            placeholder="Search Schedule"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                              mb: "5px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "16px",
                              },
                            }}
                          />

                          <Paper
                            className="scrollable-container"
                            variant="outlined"
                            sx={{
                              maxHeight: 280,
                              height: 280,
                              overflowY: "auto",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {displayOptions.length === 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 280,
                                  color: "#000000DE",
                                  fontSize: "14px",
                                  fontFamily: "Manrope",
                                }}
                              >
                                {filterLoading
                                  ? "Loading..."
                                  : "No schedules found"}
                              </Box>
                            ) : (
                              <>
                                <section
                                  style={{
                                    padding: "5px 16px",
                                    borderBottom: "1px solid #cdcdcd",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          selectedJobs.length ===
                                            displayOptions.length &&
                                          displayOptions.length > 0
                                        }
                                        onChange={handleSelectAllSchedules}
                                      />
                                    }
                                    label="Select All"
                                  />
                                </section>
                                <section style={{ padding: "0px 16px" }}>
                                  {displayOptions.map((item) => (
                                    <Box key={item}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={selectedJobs.includes(
                                              item
                                            )}
                                            onChange={() => handleToggle(item)}
                                          />
                                        }
                                        label={item}
                                      />
                                    </Box>
                                  ))}
                                </section>
                              </>
                            )}
                          </Paper>
                        </Box>
                      </section>

                      <section style={{ width: "50%" }}>
                        <Box sx={{ p: 2 }}>
                          <label className="custom-label">
                            Select Columns
                            <span className="iabot_required">*</span>
                            <span
                              style={{ color: "#102459" }}
                            >{` (${selectedOptions.length})`}</span>
                          </label>
                          <TextField
                            fullWidth
                            disabled={selectedJobs.length === 0}
                            size="small"
                            variant="outlined"
                            placeholder="Search columns..."
                            value={searchColumn}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            sx={{
                              mb: "5px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "16px",
                              },
                            }}
                          />

                          <Paper
                            className="scrollable-container"
                            variant="outlined"
                            sx={{
                              maxHeight: 280,
                              height: 280,
                              overflowY: "auto",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {selectedJobs.length === 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 280,
                                  color: "#000000DE",
                                  fontSize: "14px",
                                  fontFamily: "Manrope",
                                }}
                              >
                                No Schedule Selected
                              </Box>
                            ) : loadingColumns ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: "130px",
                                }}
                              >
                                <CircularProgress size={32} />
                              </Box>
                            ) : Object.keys(filteredColumnOptions).length ===
                              0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 280,
                                  color: "#000000DE",
                                  fontSize: "14px",
                                  fontFamily: "Manrope",
                                }}
                              >
                                Columns not found
                              </Box>
                            ) : (
                              <>
                                <section
                                  style={{
                                    padding: "5px 16px",
                                    borderBottom: "1px solid #cdcdcd",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          selectedOptions.length ===
                                            columnArr.length &&
                                          columnArr.length > 0
                                        }
                                        onChange={handleSelectAllColumns}
                                      />
                                    }
                                    label="Select All"
                                  />
                                </section>
                                <section style={{ padding: "0px 16px" }}>
                                  {Object.entries(filteredColumnOptions).map(
                                    ([job, options], i) => (
                                      <Box key={job} mb={2}>
                                        {i > 0 && <Divider sx={{ mb: 1 }} />}
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          fontWeight="bold"
                                          sx={{
                                            textTransform: "uppercase",
                                            mb: 1,
                                            display: "block",
                                          }}
                                        >
                                          {job}
                                        </Typography>
                                        <FormGroup>
                                          {options?.map((option) => (
                                            <FormControlLabel
                                              key={`${job}-${option}`}
                                              control={
                                                <Checkbox
                                                  disabled={
                                                    selectedJobs.length === 0
                                                  }
                                                  checked={isSelected(
                                                    job,
                                                    option
                                                  )}
                                                  onChange={() =>
                                                    handleToggleColumn(
                                                      job,
                                                      option
                                                    )
                                                  }
                                                />
                                              }
                                              label={option}
                                            />
                                          ))}
                                        </FormGroup>
                                      </Box>
                                    )
                                  )}
                                </section>
                              </>
                            )}
                          </Paper>
                        </Box>
                      </section>
                    </div>
                  </div>

                  <div className="report-modal-actions">
                    <Button
                      variant="outlined"
                      onClick={handlePrevious}
                      disabled={loading}
                      sx={{ borderRadius: "10px" }}
                    >
                      {UI_TEXTS.BUTTONS.BACK}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      // disabled={loading || selectedOptions.length === 0}
                      disabled={
                        loading || selectedOptions.length === 0
                        // reportName.trim() === "" ||
                        // !!durationError
                      }
                      sx={{ borderRadius: "10px", fontFamily: "Manrope" }}
                    >
                      {UI_TEXTS.BUTTONS.NEXT}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="report-step-row1">
                    <label className="reports_caption">
                      {UI_TEXTS.LABELS.ARRANGE_COLUMN_ORDERS_FILTER}
                    </label>
                    <div
                      style={{
                        marginTop: "10px",
                        border: "1px solid #eee",
                        borderRadius: "4px",
                        padding: "10px",
                        height: "370px",
                        overflowY: "auto",
                      }}
                    >
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={orderedColumns.map((c) => c.sortableId)}
                          strategy={verticalListSortingStrategy}
                        >
                          {orderedColumns.map((el) => (
                            <SortableItem
                              columnObj={el}
                              key={el?.sortableId}
                              id={el?.sortableId}
                              value={
                                <span
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "0.65rem",
                                      color: "#555",
                                    }}
                                  >
                                    {el?.job}
                                  </span>
                                  <span style={{ fontSize: "0.85rem" }}>
                                    {el?.column}
                                  </span>
                                </span>
                              }
                              operator={
                                operatorValues[`${el?.column}-${el?.job}`] ||
                                UI_TEXTS.TEXTS.SELECT_OPERATOR
                              }
                              itemValue={
                                columnValues[`${el?.column}-${el?.job}`] || ""
                              }
                              setOperator={(id, operator) =>
                                handleSetOperator(id, operator)
                              }
                              setItemValue={(id, value) =>
                                handleSetItemValue(id, value)
                              }
                            />
                          ))}
                        </SortableContext>
                        <DragOverlay>
                          {activeId ? (
                            <div
                              style={{
                                backgroundColor: "#e6f7ff",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "12px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                              }}
                            >
                              {orderedColumns.find(
                                (c) => c.sortableId === activeId
                              )?.column || activeId}
                            </div>
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <Button
                      variant="outlined"
                      onClick={handlePrevious}
                      disabled={loading}
                      sx={{ borderRadius: "10px", fontFamily: "Manrope" }}
                    >
                      {UI_TEXTS.BUTTONS.BACK}
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={
                        !(reportId && columnsDragged) &&
                        (loading ||
                          !!durationError ||
                          (reportId && isSelectionUnchanged()))
                      }
                      sx={{ borderRadius: "10px", marginLeft: "10px" }}
                    >
                      {reportId
                        ? UI_TEXTS.HEADINGS.UPDATE_REPORT
                        : UI_TEXTS.HEADINGS.CREATE_REPORT}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
