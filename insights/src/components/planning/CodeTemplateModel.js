import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Radio,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Chip,
  styled,
  tooltipClasses,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { getTemplateDetails } from "../../store/TemplateSlice/templateSlice";
import { useDispatch, useSelector } from "react-redux";
import "../../layouts/Marketplace/marketplace.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  colorSets,
  formattedDate,
  getTemplateIcon,
} from "../../utils/CommonUtils";
import Search from "../ui/search/Search.component";
import { Calendar, User, UserOctagon } from "iconsax-react";
import CodeIcon from "../../assets/images/webide.png";
import CommandEditorDialog from "../common/commonEditorDialogue";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import VariableInputModal from "./CodeTemplateInputModel";
import EmptyPage from "../common/EmptyPage/EmptyPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FilterIcon } from "./../ui/icons/Icons";
import classes from "../../components/planning/css/subheader.module.css";
import FilterDropdown from "../ui/customdropdown/FilterDropdown";
import * as React from "react";

const TemplateModal = ({
  open,
  onClose,
  onSelect,
  handleReset,
  onSelectTemplate,
  filterWithoutArguments,
  selectedActionType,
}) => {
  const dispatch = useDispatch();
  const store = useSelector((store) => store.templates);
  const [templateData, setTemplateData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("sort");
  const [showEditor, setShowEditor] = useState(false);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [currentCommandScripts, setCurrentCommandScripts] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentEditorTemplateName, setCurrentEditorTemplateName] =
    useState(null);
  const [variableValues, setVariableValues] = useState({});
  const [showPlatformFilters, setShowPlatformFilters] = useState(false);
  const [dropDownFilterOptions, setFilterDropdownOptions] = useState([]);
  const [createdByOptionsSelected, setCreatedByOptionsSelected] = useState([]);
  const [tagsOptionsSelected, setTagsOptionsSelected] = useState([]);
  const [codeTemplateFilters, setCodeTemplateFilters] = useState({
    TagsFilter: false,
    CreatedByFilter: false,
  });
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

  useEffect(() => {
    if (codeTemplateFilters.TagsFilter) {
      setFilterDropdownOptions(tagsOptions);
    } else if (codeTemplateFilters.CreatedByFilter) {
      setFilterDropdownOptions(createdByOptions);
    } else {
      setFilterDropdownOptions([]);
    }
  }, [codeTemplateFilters]);

  const [showReset, setShowReset] = useState(false);
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

  // Use ref for debounce timer
  const debounceTimerRef = useRef(null);

  // Check if we should show empty state
  const showEmptyState = templateData.length === 0 && !loading;
  // Check if it's due to search or no templates at all
  const isEmptyDueToSearch = debouncedSearchTerm && templateData.length === 0;
  const isEmptyNoTemplates = !debouncedSearchTerm && templateData.length === 0;

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setSelectedTemplate(null);
      setSortOption("sort");
    }
  }, [open]);

  const handleCloseAndReset = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedTemplate(null);
    setSortOption("sort");
    setShowPlatformFilters(false);
    handleClearFilter();
    onClose();
    if (handleReset) handleReset();
  };

  // Map frontend sort options to backend sort options
  const getBackendSortOption = (frontendSort) => {
    switch (frontendSort) {
      case "recent":
        return "newest";
      case "oldest":
        return "oldest";
      case "a-z":
        return "name_asc";
      case "z-a":
        return "name_desc";
      case "sort":
      default:
        return "newest";
    }
  };

  // Debounce search function
  const handleSearchChange = (value) => {
    setSearchTerm(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounce (500ms)
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500);
  };

  // Fetch templates with backend search and sort
  useEffect(() => {
    let fetched = false;

    const fetchTemplates = async () => {
      if (fetched || !open) return;
      setLoading(true);
      fetched = true;
      try {
        const payload = {
          search: debouncedSearchTerm || "",
          templateType: selectedActionType || "",
          tags: tagsOptionsSelected.map((o) => o.optionName).join(","),
          createdBy: createdByOptionsSelected
            .map((o) => o.optionName)
            .join(","),
          status: "",
          sort:
            sortOption === "sort" ? "newest" : getBackendSortOption(sortOption),
        };

        const response = await dispatch(getTemplateDetails(payload));

        if (response.payload?.success) {
          let templates = response.payload.data || [];

          // Filter out CMDB_API templates
          templates = templates.filter((template) => {
            return template.templateType !== "CMDB_API";
          });

          // Apply filterWithoutArguments if needed
          if (filterWithoutArguments) {
            templates = templates.filter((template) => {
              const noArguments = !template.enableArguemts;
              const noVariables =
                !template.variableParameters ||
                Object.keys(template.variableParameters).length === 0;
              return noArguments && noVariables;
            });
          }

          setTemplateData(templates);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();

    // Cleanup function
    return () => {
      fetched = true;
    };
  }, [
    dispatch,
    open,
    debouncedSearchTerm,
    sortOption,
    filterWithoutArguments,
    selectedActionType,
    tagsOptionsSelected,
    createdByOptionsSelected,
  ]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Use Redux store data if available (for initial load when search is empty)
  useEffect(() => {
    if (store?.templateData?.data && !loading && debouncedSearchTerm === "") {
      const filtered = store.templateData.data.filter((template) => {
        if (template.templateType === "CMDB_API") return false;

        if (filterWithoutArguments) {
          const noArguments = !template.enableArguemts;
          const noVariables =
            !template.variableParameters ||
            Object.keys(template.variableParameters).length === 0;

          return noArguments && noVariables;
        }

        return true;
      });

      setTemplateData(filtered);
    }
  }, [
    store?.templateData?.data,
    filterWithoutArguments,
    loading,
    debouncedSearchTerm,
  ]);

  // const hasVariableParameters = (template) => {
  //   return (
  //     template.variableParameters &&
  //     Object.keys(template.variableParameters).length > 0
  //   );
  // };

  // const handleSelect = (template) => {
  //   setSelectedTemplate(template._id);

  //   // If template has variable parameters (object is not empty), show the input modal
  //   if (hasVariableParameters(template)) {
  //     setCurrentTemplate(template);
  //     setShowVariableModal(true);
  //   } else {
  //     // If no variable parameters, select the template directly
  //     onSelectTemplate(template);
  //   }
  // };

  // const handleVariableValuesSave = (values) => {
  //   setVariableValues((prev) => ({
  //     ...prev,
  //     [currentTemplate._id]: values,
  //   }));

  //   // Create template object with variable values
  //   const templateWithVariables = {
  //     ...currentTemplate,
  //     variableParameters: values, // This will replace the empty values with user input
  //   };

  //   onSelectTemplate(templateWithVariables);
  //   setShowVariableModal(false);
  //   setCurrentTemplate(null);
  // };

  const hasVariableParameters = (template) => {
    return (
      template.variableParameters &&
      Object.keys(template.variableParameters).length > 0
    );
  };

  const shouldShowVariableModal = (template) => {
    return hasVariableParameters(template) || template.enableArguemts === true;
  };

  const handleSelect = (template) => {
    setSelectedTemplate(template._id);
    console.log(
      "shouldShowVariableModal(template)",
      shouldShowVariableModal(template)
    );
    // If template has variable parameters OR enableArguments is true, show the input modal
    if (shouldShowVariableModal(template)) {
      setCurrentTemplate(template);
      setShowVariableModal(true);
    } else {
      // If no variable parameters and enableArguments is false, select the template directly
      onSelectTemplate(template);
      handleClearFilter();
    }
  };

  const handleVariableValuesSave = (values) => {
    setVariableValues((prev) => ({
      ...prev,
      [currentTemplate._id]: values,
    }));

    // Create template object with variable values
    const templateWithVariables = {
      ...currentTemplate,
      variableParameters: values,
    };

    // Extract arguments if enableArguments is true and arguments field exists
    if (currentTemplate.enableArguemts && values.arguments) {
      templateWithVariables.args = values.arguments;
      // Remove arguments from variableParameters to keep them separate
      const { arguments: args, ...variableParams } = values;
      templateWithVariables.variableParameters = variableParams;
    }

    onSelectTemplate(templateWithVariables);
    setShowVariableModal(false);
    setCurrentTemplate(null);
  };

  const handleOpenEditor = (template) => {
    setCurrentCommandScripts(template.commandScripts);
    setCurrentEditorTemplateName(template.templateName);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setCurrentCommandScripts(null);
    setCurrentEditorTemplateName(null);
  };

  const handleCloseVariableModal = () => {
    setShowVariableModal(false);
    setCurrentTemplate(null);
    setSelectedTemplate(null);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      const selected = templateData.find((t) => t._id === selectedTemplate);

      // Include variable values if they exist
      const selectedWithVariables = variableValues[selectedTemplate]
        ? {
            ...selected,
            variableParameters: {
              ...selected.variableParameters,
              ...variableValues[selectedTemplate],
            },
          }
        : selected;

      onSelectTemplate(selectedWithVariables);
      handleClearFilter();
      onClose();
    }
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

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
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

  useEffect(() => {
    setShowReset(
      tagsOptionsSelected.length > 0 || createdByOptionsSelected.length > 0
    );
  }, [tagsOptionsSelected, createdByOptionsSelected]);

  const handleClearFilter = () => {
    setTagsOptionsSelected([]);
    setCreatedByOptionsSelected([]);
    setCodeTemplateFilters({
      TagsFilter: false,
      CreatedByFilter: false,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseAndReset}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            height: "90vh",
            margin: "auto",
            width: "78vw",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <DialogTitle className="card-main-title">
            Select Template from Code Marketplace
          </DialogTitle>
          <div
            style={{ paddingRight: "5px", marginTop: "10px", display: "flex" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              <FormControl sx={{ width: "200px" }}>
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
              <Search
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_TEMPLATE_BY_NAME}
                searchIconTowardsRight
                onEnterClear
                customeCss={{ right: "5px", position: "relative" }}
                selection="single"
                handleSearchText={handleSearchChange}
                setSearchTextProp={handleSearchChange}
              />
            </div>
            <CloseIcon
              sx={{ color: "brown", cursor: "pointer", margin: "15px" }}
              onClick={handleCloseAndReset}
              data-testid="sidedrawer-close-icon"
            />
          </div>
        </div>
        {showPlatformFilters && (
          <div
            style={{
              marginTop: "8px",
              width: "100%",
            }}
          >
            <div
              data-testid="assetFilterTest"
              onBlur={() => toggleDropdown(false)}
              onFocus={() => toggleDropdown(true)}
            >
              <div className={classes.planner_drpbtnDiv}>
                <>
                  <div
                    data-testid="tags-filter-btn"
                    style={{ marginLeft: "25px" }}
                    className={classes.planner_dropbtn}
                    role="button"
                    tabIndex={0}
                    onKeyUp={() => false}
                    onClick={() => {
                      if (codeTemplateFilters.TagsFilter) {
                        setCodeTemplateFilters({
                          TagsFilter: false,
                          CreatedByFilter: false,
                        });
                      } else {
                        setCodeTemplateFilters({
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
                        marginRight: "25px",
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
                          TagsFilter: false,
                          CreatedByFilter: false,
                        });
                      } else {
                        setCodeTemplateFilters({
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
                  (tagsOptionsSelected && tagsOptionsSelected.length > 0)) && (
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

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: "10px 0 0 10px",
                  marginBottom: "-10px",
                }}
              >
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
          </div>
        )}
        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : showEmptyState ? (
            // Empty State
            <div
              style={{
                width: "100%",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmptyPage
                title={
                  isEmptyDueToSearch
                    ? "No Template Found"
                    : "Create Your First Template"
                }
                subtitle={
                  isEmptyDueToSearch
                    ? `No Template match your search "${debouncedSearchTerm}"`
                    : "Get started by creating your first Template"
                }
              />
            </div>
          ) : (
            // Templates Grid
            <Grid container spacing={2}>
              {templateData.map((template, itemIndex) => {
                if (
                  template.status !== "REJECTED" &&
                  template.status !== "PENDING_APPROVAL"
                ) {
                  return (
                    <Grid item xs={4} key={template._id}>
                      <Card
                        style={{
                          width: "100%",
                          height: "240px",
                          borderRadius: "12px",
                          border: "1px solid #e0e0e0",
                          boxShadow: "none",
                          position: "relative",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        // onClick={(e) => {
                        //   if (
                        //     !e.target.closest('button, [role="button"]') &&
                        //     template.status !== "PENDING_APPROVAL" &&
                        //     template.status !== "PENDING"
                        //   ) {
                        //     handleSelect(template);
                        //   }
                        // }}
                      >
                        <CardContent
                          style={{
                            padding: "12px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="user_details">
                            <span className="user_info">
                              <Calendar
                                size="18"
                                color="#64748b"
                                style={{ marginRight: "5px" }}
                              />
                              {formattedDate(template?.createdAt)}{" "}
                              <span style={{ margin: "5px" }}>|</span>
                              <User
                                size="18"
                                color="#64748b"
                                style={{ marginRight: "5px" }}
                              />
                              {template?.createdBy || "-"}
                            </span>
                            <span>
                              <div
                                style={{ textAlign: "center" }}
                                className="template_info_container"
                              >
                                {template?.templateType}
                              </div>
                            </span>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                              }}
                            >
                              {getTemplateIcon(template.templateIcon)}
                              <div className="no-card-click">
                                {template.status === "PENDING_APPROVAL" && (
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
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <Typography className="marketplace-card-title">
                                  {template.templateName}
                                </Typography>
                              </div>
                              {template.status !== "PENDING_APPROVAL" && (
                                <FormControlLabel
                                  control={
                                    <Radio
                                      checked={
                                        selectedTemplate === template._id
                                      }
                                      onChange={() => handleSelect(template)}
                                      onClick={(ev) => ev.stopPropagation()}
                                      value={template._id}
                                    />
                                  }
                                  label=""
                                />
                              )}
                            </div>
                          </div>

                          <Typography className="marketplace-card-description-schedule">
                            {template.description}
                          </Typography>

                          <Grid
                            container
                            className="marketplace-features-btn-container"
                          >
                            {template?.tags &&
                              (Array.isArray(template.tags)
                                ? template.tags.filter((t) => t?.trim())
                                    .length > 0
                                : typeof template.tags === "string"
                                ? template.tags
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
                                  {(Array.isArray(template.tags)
                                    ? template.tags.slice(0, 4)
                                    : template.tags.split(",").slice(0, 4)
                                  ).map((tag, tagIndex) => {
                                    const trimmedTag = tag?.trim();
                                    if (!trimmedTag) return null;

                                    const colorStyle = getTagColor(
                                      template,
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
                                </Box>
                              )}
                          </Grid>

                          <div className="marketplace-footer">
                            <div style={{ marginTop: "7px" }}>
                              {template?.templateVersion && (
                                <span
                                  className="version-tag"
                                  style={{
                                    fontSize: "12px",
                                  }}
                                >
                                  {template.isVersionRestored &&
                                  template.restoredFrom?.originalVersion
                                    ? template.restoredFrom.originalVersion
                                    : template.templateVersion}
                                </span>
                              )}
                            </div>
                            {template.status !== "PENDING_APPROVAL" && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  marginTop: "10px",
                                  alignItems: "center",
                                  position: "relative",
                                }}
                              >
                                <Tooltip title="Command Scripts Editor" arrow>
                                  <IconButton
                                    onClick={() => handleOpenEditor(template)}
                                    size="small"
                                    style={{
                                      backgroundColor: "#f2f7f3",
                                      ":hover": { backgroundColor: "#f2f7f3" },
                                    }}
                                  >
                                    <img
                                      src={CodeIcon}
                                      alt="code editor"
                                      style={{ width: 20 }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            disabled={!selectedTemplate || loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              UI_TEXTS.BUTTONS.TEMPLATE_SELECTED
            )}
          </Button>
        </DialogActions>

        {codeTemplateFilters.TagsFilter && (
          <FilterDropdown
            id="tagsFilter"
            isLoading={loading}
            filters={codeTemplateFilters}
            setFilters={setCodeTemplateFilters}
            style={{
              position: "absolute",
              top: "15vh",
              left: "25px",
              marginTop: "8px",
              height: "367px",
              zIndex: 1300,
            }}
            placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.TAGS}
            data={dropDownFilterOptions}
            tagsOptionsSelected={tagsOptionsSelected}
            setTagsOptionsSelected={setTagsOptionsSelected}
          />
        )}

        {codeTemplateFilters.CreatedByFilter && (
          <FilterDropdown
            id="ScheduleByFilter"
            isLoading={loading}
            filters={codeTemplateFilters}
            setFilters={setCodeTemplateFilters}
            style={{
              position: "absolute",
              top: "15vh",
              left: "25px",
              marginTop: "8px",
              height: "367px",
              zIndex: 1300,
            }}
            placeholder={UI_TEXTS.PLACEHOLDERS_FILTERS.CREATED_BY}
            data={dropDownFilterOptions}
            scheduleByOptionsSelected={createdByOptionsSelected}
            setScheduleByOptionsSelected={setCreatedByOptionsSelected}
          />
        )}
      </Dialog>

      {showEditor && (
        <CommandEditorDialog
          open={showEditor}
          onClose={handleCloseEditor}
          command={currentCommandScripts}
          viewOnly={true}
          handleSaveChanges={false}
          dataVariable={currentEditorTemplateName}
        />
      )}

      {showVariableModal && currentTemplate && (
        <VariableInputModal
          open={showVariableModal}
          onClose={handleCloseVariableModal}
          variableParameters={currentTemplate.variableParameters}
          onSave={handleVariableValuesSave}
          templateName={currentTemplate.templateName}
          enableArguments={currentTemplate.enableArguemts}
        />
      )}
    </>
  );
};

export default TemplateModal;
