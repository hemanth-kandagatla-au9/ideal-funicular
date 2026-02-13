import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Avatar,
  Stack,
  Divider,
  alpha,
  FormControlLabel,
  Collapse,
  Tooltip,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { fetchAllWorkflows } from "../../services/jobs/JobsService";
import "../planning/css/workflowmodal.css";
import { filterOperations } from "../../utils/CommonUtils";
import { Info, InfoOutlined } from "@mui/icons-material";
import { InfoCircle } from "iconsax-react";
 
export const WorkflowTriggerModal = ({
  open,
  onClose,
  commandId,
  initialConfig,
  onSave,
}) => {
  const dispatch = useDispatch();
  const [selectedWorkflows, setSelectedWorkflows] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedWorkflows, setExpandedWorkflows] = useState({});
  const [error, setError] = useState(null);
  const [hasWorkflows, setHasWorkflows] = useState(true);
 
  const { workflows } = useSelector((state) => ({
    workflows: state.jobs.workflows,
  }));
 
  console.log("getWorkflows", workflows);
 
  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setHasWorkflows(true);
      
      dispatch(fetchAllWorkflows())
        .then((response) => {
          if (!response?.data || (Array.isArray(response.data) && response.data.length === 0)) {
            setHasWorkflows(false);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading workflows:", err);
          setError(
            err.response?.data?.message || 
            err.message || 
            "Failed to load workflows. Please try again."
          );
          setLoading(false);
          setHasWorkflows(false);
        });
      
      if (initialConfig) {
        const workflows = initialConfig.workflows || [];
        const filters = initialConfig.filters || [];
       
        // If we have workflowEvents but no workflows/filters,
        if (initialConfig.workflowEvents && !workflows.length) {
          const convertedWorkflows = [];
          const convertedFilters = [];
         
          initialConfig.workflowEvents.forEach(event => {
            // fetch workflow details
            convertedWorkflows.push({
              id: event.workflowId,
              name: `Workflow ${event.workflowId.substring(0, 8)}...`
            });
           
            if (event.eventConditions) {
              event.eventConditions.forEach(condition => {
                convertedFilters.push({
                  id: uuidv4(),
                  workflowId: event.workflowId,
                  condition: condition.operator,
                  value: condition.value,
                  valueType: typeof condition.value,
                  jsonKey: condition.jsonField || ""
                });
              });
            }
          });
         
          setSelectedWorkflows(convertedWorkflows);
          setFilters(convertedFilters);
        } else {
          setSelectedWorkflows(workflows);
          setFilters(filters);
        }
       
        // Initialize expanded state
        const expandedState = {};
        (workflows || []).forEach(wf => {
          expandedState[wf.id] = true;
        });
        setExpandedWorkflows(expandedState);
      } else {
        setSelectedWorkflows([]);
        setFilters([]);
        setExpandedWorkflows({});
      }
    }
  }, [open, initialConfig, dispatch]);
 
  // Stop loading when workflows are loaded - removed as we handle it in the fetch promise
  // useEffect(() => {
  //   if (workflows && Array.isArray(workflows)) {
  //     const timer = setTimeout(() => {
  //       setLoading(false);
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [workflows]);
 
  // Get all unique categories
  const categories = useMemo(() => {
    if (!workflows || !Array.isArray(workflows)) return [];
    const uniqueCategories = [
      ...new Set(
        workflows
          .filter(
            (wf) => wf?.status?.toUpperCase() === "PUBLISHED" && wf.category
          )
          .map((wf) => wf.category)
      ),
    ];
    return uniqueCategories.sort();
  }, [workflows]);

  // Filter workflows based on search term and category
  const filteredWorkflows = useMemo(() => {
    if (!workflows || !Array.isArray(workflows)) return [];

    let filtered = workflows.filter(
      (wf) => wf?.status?.toUpperCase() === "PUBLISHED"
    );

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((wf) => wf.category === categoryFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (wf) =>
          wf.name?.toLowerCase().includes(term) ||
          wf.description?.toLowerCase().includes(term) ||
          wf.category?.toLowerCase().includes(term) ||
          wf.createdBy?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [workflows, searchTerm, categoryFilter]);
 
  const handleSave = () => {
    console.log('Filters before saving:', filters);
  
    const workflowEvents = selectedWorkflows.map(workflow => ({
      workflowId: workflow.id,
      eventConditions: filters
        .filter(filter => filter.workflowId === workflow.id && filter.condition && filter.value !== undefined)
        .map(filter => ({
          operator: filter.condition,
          value: filter.value,
          jsonField: filter.jsonKey || filter.jsonField || null
        }))
    }));

    console.log('Workflow events being saved:', workflowEvents);
    const config = {
      commandId,
      enabled: true,
      workflows: selectedWorkflows,
      workflowEvents: workflowEvents,
      filters: filters.filter(f => f.workflowId && f.condition && f.value !== undefined)
    };

    console.log('Saving workflow config:', config);
    onSave(config);
    onClose();
  };
  const addFilter = (workflowId) => {
    setFilters([
      ...filters,
      {
        id: uuidv4(),
        workflowId,
        condition: "greater_than",
        value: "",
        valueType: "number",
        jsonField: "",
      },
    ]);
  };

  const updateFilter = (filterId, updates) => {
    setFilters(
      filters.map((f) => (f.id === filterId ? { ...f, ...updates } : f))
    );
  };

  const removeFilter = (filterId) => {
    setFilters(filters.filter((f) => f.id !== filterId));
  };

  const getWorkflowFilters = (workflowId) => {
    return filters.filter((f) => f.workflowId === workflowId);
  };

  // Helper function to get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(", ").filter((part) => part.trim() !== "");
    if (parts.length === 0) return "?";
    return parts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date in "Mon DD, YYYY" format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time in "HH:MM AM/PM" format
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Truncate text for description
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Truncate name to max characters
  const truncateName = (name, maxLength = 20) => {
    if (!name) return "Unknown";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const handleWorkflowToggle = (workflow) => {
    const isSelected = selectedWorkflows.some((w) => w.id === workflow.id);

    if (isSelected) {
      setSelectedWorkflows(
        selectedWorkflows.filter((w) => w.id !== workflow.id)
      );
      setFilters(filters.filter((f) => f.workflowId !== workflow.id));
      // expanded state
      setExpandedWorkflows(prev => {
        const newState = { ...prev };
        delete newState[workflow.id];
        return newState;
      });
    } else {
      setSelectedWorkflows([
        ...selectedWorkflows,
        {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          category: workflow.category,
          createdBy: workflow.createdBy,
          status: workflow.status,
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
        },
      ]);
      setExpandedWorkflows(prev => ({
        ...prev,
        [workflow.id]: true
      }));
    }
  };

  const handleSaveAndNext = () => {
    setActiveTab(1);
  };

  const handleBack = () => {
    setActiveTab(0);
  };

  const toggleWorkflowExpand = (workflowId) => {
    setExpandedWorkflows(prev => ({
      ...prev,
      [workflowId]: !prev[workflowId]
    }));
  };
  const removeJsonKey = (filterId) => {
    setFilters(filters.map(f =>
      f.id === filterId ? { ...f, jsonKey: "" } : f
    ));
  };
 
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    dispatch(fetchAllWorkflows())
      .then((response) => {
        if (!response?.data || (Array.isArray(response.data) && response.data.length === 0)) {
          setHasWorkflows(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to load workflows. Please try again."
        );
        setLoading(false);
        setHasWorkflows(false);
      });
  };
 
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: "workflow_dialog_paper",
      }}
    >
      <DialogTitle className="workflow_dialog_title">
        <Box className="workflow_title_container">
          <Typography
            variant="h5"
            component="div"
            className="workflow_title_text"
          >
            Select Workflow Template
          </Typography>
          <Typography variant="body2" className="workflow_title_subtext">
            Choose workflows to trigger based on command execution
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="workflow_close_button"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
 
      <DialogContent dividers className="workflow_dialog_content">
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          className="workflow_tabs"
        >
          <Tab label="Select Workflows" className="workflow_tab" />
          <Tab
            label="Configure Conditions"
            className="workflow_tab"
            disabled={selectedWorkflows.length === 0}
          />
        </Tabs>

        {activeTab === 0 && (
          <Box className="workflow_tab_content">
            {/* {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Retry
                  </Button>
                }
              >
                <Typography variant="body2">
                  {error}
                </Typography>
              </Alert>
            )} */}

            <Box className="workflow_search_container">
              <Box className="workflow_search_header">
                {/* Heading and count on the left */}
                <Box className="workflow_results_info">
                  <Typography
                    variant="subtitle1"
                    className="workflow_results_title"
                  >
                    Available Workflows
                    <Typography
                      component="span"
                      variant="body2"
                      className="workflow_results_count"
                    >
                      {filteredWorkflows.length}
                    </Typography>
                  </Typography>
                </Box>

                {/* Search and filter on the right */}
                <Box className="workflow_search_filter_container">
                  <Box className="workflow_search_bar">
                    <TextField
                      fullWidth
                      placeholder="Search by workflow name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      variant="outlined"
                      size="small"
                      disabled={loading || error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon
                              color="action"
                              className="workflow_search_icon"
                            />
                          </InputAdornment>
                        ),
                        className: "workflow_search_input",
                      }}
                      className="workflow_search_field"
                    />
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      size="small"
                      disabled={loading || error}
                      startAdornment={
                        <InputAdornment
                          position="start"
                          className="workflow_filter_adornment"
                        >
                          <FilterListIcon fontSize="small" color="action" />
                        </InputAdornment>
                      }
                      className="workflow_category_select"
                    >
                      <MenuItem value="all">
                        <Box className="workflow_menu_item">All Categories</Box>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          <Box className="workflow_menu_item">
                            <CategoryIcon fontSize="small" />
                            {category}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
              </Box>

              {/* Selected chip below both sections */}
              {/* {selectedWorkflows.length > 0 && (
                <Box className="workflow_selected_indicator">
                  <Chip
                    label={`${selectedWorkflows.length} selected`}
                    color="primary"
                    size="medium"
                    className="workflow_selected_chip"
                  />
                </Box>
              )} */}
            </Box>

            {/* Loader initially */}
            {loading ? (
              <Box className="workflow_loading_container">
                <CircularProgress
                  size={60}
                  thickness={4}
                  className="workflow_loading_spinner"
                />
                <Typography className="workflow_loading_text">
                  Loading workflows...
                </Typography>
              </Box>
            ) : error ? (
              <Box className="workflow_empty_state">
                <ErrorOutlineIcon className="workflow_empty_icon" color="error" sx={{ fontSize: 64 }} />
                <Typography variant="h6" className="workflow_empty_title">
                  Unable to Load Workflows
                </Typography>
                <Typography variant="body2" className="workflow_empty_subtitle">
                  {error}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleRetry}
                  sx={{ mt: 2 }}
                  startIcon={<SearchIcon />}
                >
                  Try Again
                </Button>
              </Box>
            ) : !hasWorkflows || filteredWorkflows.length === 0 ? (
              <Box className="workflow_empty_state">
                <SearchIcon className="workflow_empty_icon" />
                <Typography variant="h6" className="workflow_empty_title">
                  No workflows found
                </Typography>
                <Typography variant="body2" className="workflow_empty_subtitle">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No published workflows available at the moment"}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredWorkflows.map((workflow) => {
                  const isSelected = selectedWorkflows.some(
                    (w) => w.id === workflow.id
                  );
                  const displayName = truncateName(
                    workflow.createdBy || "Unknown",
                    20
                  );
                  const fullName = workflow.createdBy || "Unknown";

                  return (
                    <Grid item xs={12} md={6} lg={4} key={workflow.id}>
                      <Card
                        className={`workflow_card ${
                          isSelected ? "workflow_card_selected" : ""
                        }`}
                        onClick={() => handleWorkflowToggle(workflow)}
                      >
                        {/* Checkbox in top-right corner */}
                        <Box className="workflow_card_checkbox_container">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleWorkflowToggle(workflow)}
                            color="primary"
                            className="workflow_card_checkbox"
                          />
                        </Box>

                        <CardContent className="workflow_card_content">
                         
                          <Typography
                            variant="h6"
                            className={`workflow_card_title workflow-name ${
                              isSelected ? "workflow_card_title_selected" : ""
                            }`}
                            title={workflow.name}

                          >
                            {workflow.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            className="workflow_card_description workflow-description"
                            title={workflow.description}
                          >
                            {truncateText(
                              workflow.description
                            )}
                          </Typography>

                          <Divider className="workflow_card_divider" />

                          {/* Category */}
                          <Box className="workflow_info_section">
                            <Box className="workflow_info_content">
                              <CategoryIcon className="workflow_info_icon" />
                              <Typography
                                variant="body2"
                                className="workflow_info_text"
                              >
                                {workflow.category || "Uncategorized"}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Creator and Date in single line */}
                          <Box className="workflow_creator_date_container">
                            <Box
                              className="workflow_creator_container"
                              title={fullName}
                            >
                              <PersonIcon
                                fontSize="small"
                                className="workflow_creator_icon"
                              />
                              <Typography
                                variant="body2"
                                className="workflow_creator_name"
                              >
                                {displayName}
                              </Typography>
                            </Box>
                            <Box className="workflow_date_container">
                              <CalendarTodayIcon
                                fontSize="small"
                                className="workflow_date_icon"
                              />
                              <Typography
                                variant="body2"
                                className="workflow_date_text"
                              >
                                {formatDate(workflow.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box className="workflow_conditions_container">
            <Box className="workflow_conditions_header">
              <Typography variant="h5" className="workflow_conditions_title">
                Configure Trigger Conditions
              </Typography>
              <Typography
                variant="body2"
                className="workflow_conditions_subtitle"
              >
                Define specific conditions for when each selected workflow
                should trigger
              </Typography>
            </Box>

            {selectedWorkflows.length === 0 ? (
              <Box className="workflow_no_selection_state">
                <AddIcon className="workflow_no_selection_icon" />
                <Typography
                  variant="h6"
                  className="workflow_no_selection_title"
                >
                  No workflows selected
                </Typography>
                <Typography
                  variant="body2"
                  className="workflow_no_selection_text"
                >
                  Please select workflows in the previous tab to configure
                  conditions
                </Typography>
              </Box>
            ) : (
              <Box className="workflow_conditions_list_container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {selectedWorkflows.map((workflow) => {
                  const isExpanded = expandedWorkflows[workflow.id] || false;
                  const workflowFilters = getWorkflowFilters(workflow.id);
                  
                  return (
                    <Card key={workflow.id} className="workflow_condition_card">
                      <CardContent className="workflow_condition_card_content">
                        {/* Workflow Header with Expand/Collapse */}
                        <Box className="workflow_condition_header">
                          <Box
                            className="workflow_condition_info"
                            style={{ flex: 1 }}
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  toggleWorkflowExpand(workflow.id)
                                }
                                className="workflow_expand_button"
                              >
                                {isExpanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                              <Typography
                                variant="h6"
                                className="workflow_condition_name"
                              >
                                {workflow.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => addFilter(workflow.id)}
                            variant="contained"
                            size="medium"
                            className="workflow_add_condition_button"
                          >
                            Add Condition
                          </Button>
                        </Box>

                        <Collapse in={isExpanded}>
                          {workflowFilters.length > 0 ? (
                            <Box
                              className="workflow_conditions_scroll_container"
                              style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                marginTop: "16px",
                                paddingRight: "8px",
                              }}
                            >
                              {workflowFilters.map((filter) => (
                                <Box
                                  key={filter.id}
                                  className="workflow_condition_item"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    marginBottom: "12px",
                                    padding: "12px",
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <Box
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      width: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      className="workflow_condition_label"
                                      style={{
                                        minWidth: "60px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      If result
                                    </Typography>

                                    <Select
                                      value={filter.condition}
                                      onChange={(e) =>
                                        updateFilter(filter.id, {
                                          condition: e.target.value,
                                        })
                                      }
                                      size="small"
                                      className="workflow_condition_select"
                                      style={{ minWidth: "140px" }}
                                    >
                                      {filterOperations.map((operation) => (
                                        <MenuItem
                                          key={operation.value}
                                          value={operation.value}
                                        >
                                          {operation.label}
                                        </MenuItem>
                                      ))}
                                    </Select>

                                    <TextField
                                      size="small"
                                      placeholder="Enter value"
                                      value={filter.value}
                                      onChange={(e) =>
                                        updateFilter(filter.id, {
                                          value: e.target.value,
                                        })
                                      }
                                      className="workflow_condition_input"
                                      type={
                                        filter.condition.includes("greater") ||
                                        filter.condition.includes("less") ||
                                        filter.condition.includes("equals")
                                          ? "number"
                                          : "text"
                                      }
                                      style={{ flex: 1, minWidth: "120px" }}
                                    />

                                    <IconButton
                                      size="small"
                                      onClick={() => removeFilter(filter.id)}
                                      color="error"
                                      className="workflow_condition_delete_button"
                                      style={{ marginLeft: "auto" }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      width: "100%",
                                    }}
                                  >
                                    <Box
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: "60px",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        style={{
                                          fontWeight: "500",
                                          marginRight: "4px",
                                        }}
                                      >
                                        JSON-Key
                                      </Typography>
                                      <Tooltip
                                        title="If expected output is JSON, enter field value to compare"
                                        arrow
                                      >
                                        <IconButton
                                          size="small"
                                          sx={{ padding: "2px" }}
                                        >
                                          <InfoOutlined
                                            fontSize="small"
                                            color="primary"
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>

                                    <TextField
                                      size="small"
                                      placeholder="Enter JSON field name (optional)"
                                      value={filter.jsonKey || ""}
                                      onChange={(e) =>
                                        updateFilter(filter.id, {
                                          jsonKey: e.target.value,
                                        })
                                      }
                                      className="workflow_condition_input"
                                      style={{ flex: 1, minWidth: "120px" }}
                                    />

                                    <IconButton
                                      size="small"
                                      onClick={() => removeJsonKey(filter.id)}
                                      color="error"
                                      className="workflow_jsonkey_delete_button"
                                      disabled={!filter.jsonKey}
                                      style={{
                                        marginLeft: "auto",
                                        opacity: filter.jsonKey ? 1 : 0.3,
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <Box
                              className="workflow_no_conditions_state"
                              style={{ marginTop: "16px" }}
                            >
                              <Typography
                                variant="body2"
                                className="workflow_no_conditions_text"
                              >
                                No conditions configured. Workflow will always
                                trigger when command completes.
                              </Typography>
                            </Box>
                          )}
                        </Collapse>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions className="workflow_dialog_actions">
        <Box className="workflow_actions_container">
          <Box className="workflow_selection_summary">
            <Typography variant="body1" className="workflow_selection_count">
              {selectedWorkflows.length} workflows selected
            </Typography>
            {selectedWorkflows.length > 0 && activeTab === 0 && (
              <Typography variant="caption" className="workflow_selection_hint">
                Switch to Conditions tab to configure triggers
              </Typography>
            )}
          </Box>
          <Box className="workflow_action_buttons">
            <Button
              onClick={onClose}
              variant="outlined"
              className="workflow_cancel_button"
            >
              Cancel
            </Button>
            
            {/* Conditional rendering based on active tab */}
            {activeTab === 0 ? (
              <Button
                onClick={handleSaveAndNext}
                variant="contained"
                disabled={selectedWorkflows.length === 0}
                className="workflow_next_button"
              >
                Save & Next
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  className="workflow_back_button"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  className="workflow_save_button"
                >
                  Save Configuration
                </Button>
              </>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
