import React, { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import {
  Modal,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import { Filter } from "iconsax-react";
import CustomSearch from "../common/CustomSearch/CustomSearch";
import CustomFilter from "../common/CustomFilters/CustomFilter";
import { getCMDBSchedulesLogsFilter } from "../../services/jobs/JobsService";
import { toast } from "react-toastify";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { TaskListTableSkeleton } from "../common/CommonComponents/ReusableFields";
import { Refresh } from "@mui/icons-material";
import { isLoadingInHost } from "../../utils/DetectHost";
import "../planning/css/tasks.css";
import "./css/common.css";

const CmbdViewLogs = ({
  open,
  onClose,
  jobDescription,
  columns,
  row,
  loading,
  totalPages,
  table,
  getScheduleLogsData,
}) => {
  const dispatch = useDispatch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentFilter, setRecentFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedHostName, setSelectedHostName] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedExecutionId, setSelectedExecutionId] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    setFilteredData(row);
    setRowData(row);
  }, [row]);

  useEffect(() => {
    getScheduleLogsFilterOptions(table);
  }, [
    selectedHostName,
    selectedBatch,
    selectedTable,
    selectedStatus,
    selectedExecutionId,
    searchTerm,
    open,
    table,
  ]);

  const handleGetScheduleLogsData = () => {
    getScheduleLogsData({
      pageNo: currentPage,
      pageSize: itemsPerPage,
      hostname: selectedHostName,
      table: table,
      status: selectedStatus,
      executionId: selectedExecutionId,
      batch: selectedBatch,
      searchValue: searchTerm,
    });
  };
  useEffect(() => {
    handleGetScheduleLogsData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (open) {
      // Included Missing Hosts Data
      let filtered = [...rowData];
      if (selectedHostName.length > 0) {
        filtered = filtered.filter((item) => {
          return selectedHostName.includes(item.hostname.toUpperCase());
        });
      }
      if (selectedTable.length > 0) {
        filtered = filtered.filter((item) =>
          selectedTable.includes(item.table)
        );
      }
      if (selectedStatus.length > 0) {
        filtered = filtered.filter((item) =>
          selectedStatus.includes(item.status)
        );
      }
      if (selectedBatch.length > 0) {
        filtered = filtered.filter((item) =>
          selectedBatch.includes(item.batch)
        );
      }
      if (selectedExecutionId.length > 0) {
        filtered = filtered.filter((item) =>
          selectedExecutionId.includes(item.executionId)
        );
      }
      setFilteredData(filtered);
      getScheduleLogsData({
        currentPage,
        itemsPerPage,
        hostname: selectedHostName,
        table: table,
        status: selectedStatus,
        executionId: selectedExecutionId,
        batch: selectedBatch,
        searchValue: searchTerm,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      });
      setCurrentPage(1);
    }
  }, [
    selectedHostName,
    selectedBatch,
    selectedTable,
    selectedStatus,
    selectedExecutionId,
    searchTerm,
    open,
  ]);

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce(
        (value) => {
          setSearchTerm(value);
        },
        1000,
        { leading: false, trailing: true }
      ),
    []
  );

  useEffect(() => {
    return () => debouncedSetSearchTerm.cancel();
  }, [debouncedSetSearchTerm]);

  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase().trim();
    debouncedSetSearchTerm(value);
  };

  // Filter Functions Start here

  const transformOptions = (options, filterName) => {
    return options.map((option, index) => ({
      id: option,
      label: filterName === "status" ? getStatusText(option) : option,
      value: option,
    }));
  };

  function getStatusText(statusCode) {
    const statusMap = {
      200: "Success",
      201: "Created",
      400: "Bad Request",
      404: "Not Found",
      500: "Error",
    };
    return statusMap[statusCode] || "Unknown";
  }

  const [filters, setFilters] = useState({
    hostname: [],
    status: [],
    table: [],
    executionId: [],
    batch: [],
  });

  const filtersConfig = [
    {
      id: "hostname",
      name: "hostname",
      placeholder: "Hostname",
      options: transformOptions(filterOptions?.hostname || [], "hostname"),
      value: selectedHostName,
      onChange: (value) => handleFilterChange("hostname", value),
    },
    {
      id: "status",
      name: "status",
      placeholder: "Status",
      options: transformOptions(filterOptions?.status || [], "status"),
      value: selectedStatus,
      onChange: (value) => handleFilterChange("status", value),
    },
    {
      id: "table",
      name: "table",
      placeholder: "Table",
      options: transformOptions(filterOptions?.table || [], "table"),
      value: selectedTable,
      onChange: (value) => handleFilterChange("table", value),
    },
    {
      id: "executionId",
      name: "executionId",
      placeholder: "Execution ID",
      options: transformOptions(
        filterOptions?.executionId || [],
        "executionId"
      ),
      value: selectedExecutionId,
      onChange: (value) => handleFilterChange("executionId", value),
    },
    {
      id: "batch",
      name: "batch",
      placeholder: "Batch",
      options: transformOptions(filterOptions?.batch || [], "batch"),
      value: selectedBatch,
      onChange: (value) => handleFilterChange("batch", value),
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
      [key]:
        key === "status" ? selectedValues.map(getStatusText) : selectedValues,
    }));

    console.log(filters);

    switch (key) {
      case "hostname":
        setSelectedHostName(selectedValues);
        break;
      case "status":
        setSelectedStatus(selectedValues);
        break;
      case "executionId":
        setSelectedExecutionId(selectedValues);
        break;
      case "batch":
        setSelectedBatch(selectedValues);
        break;
      case "table":
        setSelectedTable(selectedValues);
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
      case "status":
        setSelectedStatus([]);
        break;
      case "batch":
        setSelectedBatch([]);
        break;
      case "executionId":
        setSelectedExecutionId([]);
        break;
      case "table":
        setSelectedTable([]);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    // Keep the latest RunID filter when clearing others
    // const latestRunId = allRunIds.length > 0 ? allRunIds[0].runId : null;

    setSelectedHostName([]);
    setSelectedBatch([]);
    setSelectedExecutionId([]);
    setSelectedTable([]);
    setSelectedStatus([]);
    // setFilteredData([]);

    setFilters({
      hostname: [],
      status: [],
      table: [],
      executionId: [],
      batch: [],
    });
  };

  const getScheduleLogsFilterOptions = async (table) => {
    let query = "?";

    if (table) {
      query += `table=${encodeURIComponent(table)}&`;
    }

    if (selectedHostName) {
      query += `hostname=${encodeURIComponent(selectedHostName)}&`;
    }

    if (selectedStatus) {
      query += `status=${encodeURIComponent(selectedStatus)}&`;
    }

    if (selectedExecutionId) {
      query += `executionId=${encodeURIComponent(selectedExecutionId)}&`;
    }

    if (selectedBatch) {
      query += `batch=${encodeURIComponent(selectedBatch)}&`;
    }

    if (searchTerm) {
      query += `searchValue=${encodeURIComponent(searchTerm)}&`;
    }

    try {
      const response = await dispatch(getCMDBSchedulesLogsFilter(query));
      let filters = response?.data?.data || [];
      setFilterOptions(filters);
    } catch (error) {
      console.error("Error fetching CMDB schedule logs filter data:", error);
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_FETCH_DATA);
    } finally {
    }
  };

  // Filter Function ends here

  return (
    <>
      <Modal open={open} onClose={onClose} className="modal-overlay">
        <Box
          className={isLoadingInHost ? "modal-container platform-cmdb-logs-modal" : "modal-container"}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "96vh",
            width: "96vw",
            margin: "auto",
          }}
        >
          <Box
            className="modal-header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 className="modal-title">{UI_TEXTS.LABELS.CMDB_LOGS}</h2>
              <span className="logs-sub-title">{jobDescription}</span>
            </div>
            <IconButton onClick={onClose} className="modal-close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 2,
              p: 2,
            }}
          >
            {/* Right Panel */}
            <Box sx={{ width: true ? "100%" : "88%", pl: 2 }}>
              <div
                className="modal-content"
                style={{
                  maxWidth: "100%",
                  boxShadow: "none",
                  padding: "0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box className="search_filter_container">
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
                        onClick={handleGetScheduleLogsData}
                        size="medium"
                        color="#344054"
                        title="Refresh"
                      >
                        <Refresh />
                      </IconButton>
                    </div>
                    <div
                      className="filter_container"
                      onClick={toggleFilters}
                      style={{ cursor: "pointer" }}
                    >
                      <Tooltip title="filter" placement="top" arrow>
                        <Filter size="25" color="#2961F4" variant="Bold" />
                      </Tooltip>
                    </div>

                    <CustomSearch
                      data={[]}
                      handleChange={handleSearchChange}
                      searchTerm={searchTerm}
                      clearSearch={() => setSearchTerm("")}
                      placeholder="Search by hostname,table"
                    />
                  </Box>
                </Box>
                {loading ? (
                  <TaskListTableSkeleton />
                ) : (
                  <Box
                    className="full-width"
                    style={{
                      display: filtersVisible ? "flex" : "none",
                      width: "100%",
                      margin: "0px !important",
                    }}
                  >
                    <CustomFilter
                      filterTitle={"Logs Filter"}
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
                )}
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "60vh",
                      width: "100%",
                      mt: 1,
                      overflow: "auto",
                    }}
                  >
                    <CustomDataGrid
                      rows={filteredData || []}
                      columns={columns}
                      paginationMode="client"
                      sortingMode="client"
                      hideFooter={true}
                      tableHeight="95%"
                    />
                  </Box>
                )}
              </div>

              <div
                style={{
                  position: "relative",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1300, // Higher than modal content
                  borderTop: "1px solid #ddd",
                  padding: "10px",
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
              {/* )} */}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CmbdViewLogs;
