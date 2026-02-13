import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import ReactJson from "react-json-view";
import { Box, Tooltip, Typography } from "@mui/material";
import GlobalTable from "../../components/common/GlobalTable/GlobalTable.js";
import Utils from "../../utils/utils.js";
import SubHeader from "../../components/planning/SubHeader.component.js";
import Sidebar from "../../components/planning/Sidebar.component.js";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination.js";
import { AxiosInstance } from "../../services/configurations/configService.js";
import {
  DATA_ASSET_HEADERS,
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants.js";
import { formattedDate } from "../../utils/CommonUtils.js";
import CustomFilter from "../../components/common/CustomFilters/CustomFilter.js";
import "./AuditLogs.css";
import moment from "moment";

toast.configure();

function AuditLogs() {
  const [sidebarActiveTab, setSidebarActiveTab] = useState("auditLogs");
  const [versionData, setVersionData] = useState([]);
  const suppressPageChange = useRef(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 25,
    totalItems: 0,
    totalPages: 0,
    totalCount: 0,
  });
  const [pageLoader, setPageLoader] = useState(false);

  //filter states
  const [filters, setFilters] = useState({
    username: [],
    module: [],
    actionType: [],
  });

  const [filterOptions, setFilterOptions] = useState({});
  const [selectedUsername, setSelectedUsername] = useState([]);
  const [selectedActionType, setSelectedActionType] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [recentFilter, setRecentFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchLogs = useCallback(
    async (
      pageNo,
      pageSize,
      selectedUsername,
      selectedModule,
      selectedActionType,
      startDate,
      endDate
    ) => {
      setPageLoader(true);
      try {
        let query = `/auth/getAuditLogs?pageNo=${pageNo}&pageSize=${pageSize}`;
        if (selectedUsername.length) {
          query += `&username=${selectedUsername.join(",")}`;
        }
        if (selectedModule.length) {
          query += `&module=${selectedModule.join(",")}`;
        }
        if (selectedActionType.length) {
          query += `&actionType=${selectedActionType.join(",")}`;
        }
        if (startDate && endDate) {
          const startDateUTC = moment(startDate, "YYYY-MM-DD")
            .startOf("day") // local midnight
            .utc()
            .toISOString();
          const endDateUTC = moment(startDate, "YYYY-MM-DD")
            .endOf("day") // local midnight
            .utc()
            .toISOString();
          query += `&startDate=${startDateUTC}&endDate=${endDateUTC}`;
        }
        const response = await AxiosInstance.get(query);
        const data = response.data.data || [];
        setVersionData(data);
        setPagination((prev) => ({
          ...prev,
          totalItems: response.data.pagination.totalCount,
          totalPages: Math.ceil(response.data.pagination.totalCount / pageSize),
        }));
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setPageLoader(false);
      }
    },
    []
  );

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

  const sortedData = useMemo(() => {
    if (!sortBy) return versionData;
    return [...versionData].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "updatedAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === "object" && aVal !== null) {
        aVal = JSON.stringify(aVal)?.toLowerCase();
        bVal = JSON.stringify(bVal)?.toLowerCase();
      } else if (typeof aVal === "string") {
        aVal = aVal?.toLowerCase();
        bVal = bVal?.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [versionData, sortBy, sortOrder]);

  useEffect(() => {
    fetchLogs(
      pagination.currentPage,
      pagination.itemsPerPage,
      selectedUsername,
      selectedModule,
      selectedActionType,
      dateRange.startDate,
      dateRange.endDate
    );
  }, [
    fetchLogs,
    pagination.currentPage,
    pagination.itemsPerPage,
    selectedUsername,
    selectedModule,
    selectedActionType,
    dateRange.endDate,
  ]);

  const handleChangePage = (_, newPage) => {
    if (suppressPageChange.current) {
      suppressPageChange.current = false;
      return;
    }
    const updatedPage = newPage + 1;
    setPagination((prev) => ({ ...prev, currentPage: updatedPage }));
    fetchLogs(updatedPage, pagination.itemsPerPage);
  };

  const formatAuditDates = (data) => {
    if (!data || typeof data !== "object") return data;

    const DATE_KEYS = [
      "createdAt",
      "updatedAt",
      "approvedAt",
      "date",
      "Created At",
      "Updated At",
      "Approved At",
      "rejectedAt",
    ];

    if (Array.isArray(data)) {
      return data.map(formatAuditDates);
    }

    const result = {};
    Object.keys(data).forEach((key) => {
      if (DATE_KEYS.includes(key) && data[key]) {
        result[key] = formattedDate(data[key]);
      } else {
        result[key] = formatAuditDates(data[key]);
      }
    });

    return result;
  };

  const handleChangeRowsPerPage = (event) => {
    let newItemsPerPage;
    if (typeof event === "number") {
      newItemsPerPage = event;
    } else {
      newItemsPerPage = parseInt(event.target.value, 10);
    }
    suppressPageChange.current = true;
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
      totalPages: Math.ceil(prev.totalItems / newItemsPerPage),
    }));
    fetchLogs(1, newItemsPerPage);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const isEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((el, i) => isEqual(el, b[i]));
    }
    if (typeof a === "object" && typeof b === "object" && a && b) {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => isEqual(a[key], b[key]));
    }
    return a === b;
  };

  const getUpdatedFieldsOnly = (prev = {}, updated = {}) => {
    const excludedKeys = ["createdAt", "updatedAt"];
    const result = {};

    Object.keys(updated).forEach((key) => {
      if (!excludedKeys.includes(key) && !isEqual(prev[key], updated[key])) {
        result[key] = updated[key];
      }
    });

    return result;
  };

  const renderValue = (value) => {
    if (value === null || value === "" || value === " ") {
      return <span>{UI_TEXTS.MESSAGES.NO_DATA}</span>;
    }

    const isDate = (val) => {
      const parsedDate = new Date(val);
      return typeof val === "string" && !isNaN(parsedDate.getTime());
    };

    if (isDate(value)) {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
    }

    if (typeof value === "object" && value !== null) {
      return (
        <ReactJson
          src={value}
          name={false}
          collapsed={true}
          enableClipboard={false}
          displayDataTypes={false}
        />
      );
    }

    return <span>{String(value)}</span>;
  };

  const copyToClipboard = (data) => {
    if (data) {
      const text =
        typeof data === "object" ? JSON.stringify(data, null, 2) : data;
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success(TOAST_MESSAGES.SUCCESS.COPY))
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error(TOAST_MESSAGES.ERROR.COPY);
        });
    }
  };

  const renderCell = (row, key) => {
    const value = row[key];

    if (key === "previousValue" || key === "updatedValue") {
      if (!value || Object.keys(value).length === 0)
        return <span>{UI_TEXTS.MESSAGES.NO_DATA}</span>;

      const displayValue = formatAuditDates(value);

      // if (displayValue.createdAt) {
      //   displayValue.createdAt = formattedDate(displayValue.createdAt);
      // }

      // if (displayValue.updatedAt) {
      //   displayValue.updatedAt = formattedDate(displayValue.updatedAt);
      // }

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderValue(displayValue)}
          <i
            className="fa fa-copy"
            onClick={() => copyToClipboard(value)}
            style={{ marginLeft: "8px", cursor: "pointer" }}
            data-tip="Copy"
            data-for={`copy-tooltip-${row._id}-${key}`}
          />
        </div>
      );
    }

    if (key === "changes") {
      const changes = formatAuditDates(
        getUpdatedFieldsOnly(row.previousValue || {}, row.updatedValue || {})
      );
      if (!changes || Object.keys(changes).length === 0)
        return <span>{UI_TEXTS.MESSAGES.NO_CHANGES}</span>;

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderValue(changes)}
          <i
            className="fa fa-copy"
            onClick={() => copyToClipboard(changes)}
            style={{ marginLeft: "8px", cursor: "pointer" }}
            data-tip="Copy"
            data-for={`copy-tooltip-${row._id}-${key}`}
          />
        </div>
      );
    }

    if (key === "updatedAt") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {formattedDate(row.updatedAt)}
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return renderValue(value);
    }

    return value ?? "-";
  };

  //Filter Options

  const fetchLogOptions = async (pageNo, pageSize) => {
    setPageLoader(true);
    setFilterLoading(true);
    try {
      let query = `/auth/getAuditLogOptions?pageNo=${pageNo}&pageSize=${pageSize}`;
      if (selectedUsername.length) {
        query += `&username=${selectedUsername.join(",")}`;
      }
      if (selectedModule.length) {
        query += `&module=${selectedModule.join(",")}`;
      }
      if (selectedActionType.length) {
        query += `&actionType=${selectedActionType.join(",")}`;
      }
      if (recentFilter) {
        query += `&recentFilter=${recentFilter}`;
      }
      if (dateRange.startDate && dateRange.endDate) {
        const startDateUTC = moment(dateRange.startDate, "YYYY-MM-DD")
          .startOf("day") // local midnight
          .utc()
          .toISOString();
        const endDateUTC = moment(dateRange.endDate, "YYYY-MM-DD")
          .endOf("day") // local midnight
          .utc()
          .toISOString();
        query += `&startDate=${startDateUTC}&endDate=${endDateUTC}`;
      }
      const response = await AxiosInstance.get(query);
      const data = response.data.data || {};
      setFilterOptions(data);
      setFilterLoading(false);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchLogOptions();
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    selectedUsername,
    selectedModule,
    selectedActionType,
    dateRange.endDate,
  ]);

  const resetPagination = () => {
    pagination.currentPage = 1;
  };

  const transformOptions = (options) => {
    return options.map((option, index) => ({
      id: option,
      label: option,
      value: option,
    }));
  };

  const handleFilterChange = (key, value) => {
    resetPagination();
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
      case "username":
        setSelectedUsername(selectedValues);
        setRecentFilter("username");
        break;
      case "module":
        setSelectedModule(selectedValues);
        setRecentFilter("module");
        break;
      case "actionType":
        setSelectedActionType(selectedValues);
        setRecentFilter("actionType");
        break;
      default:
        break;
    }
  };

  const filtersConfig = [
    {
      id: "username",
      name: "username",
      placeholder: "User Name",
      options: transformOptions(filterOptions?.username || []),
      value: selectedUsername,
      onChange: (value) => handleFilterChange("username", value),
    },
    {
      id: "module",
      name: "module",
      placeholder: "Module",
      options: transformOptions(filterOptions?.module || []),
      value: selectedModule,
      onChange: (value) => handleFilterChange("module", value),
    },
    {
      id: "actionType",
      name: "actionType",
      placeholder: "Action Type",
      options: transformOptions(filterOptions?.actionType || []),
      value: selectedActionType,
      onChange: (value) => handleFilterChange("actionType", value),
    },
  ];

  const handleRemoveFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: [],
    }));

    switch (key) {
      case "username":
        setSelectedUsername([]);
        break;
      case "module":
        setSelectedModule([]);
        break;
      case "actionType":
        setSelectedActionType([]);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedUsername([]);
    setSelectedModule([]);
    setSelectedActionType([]);

    setFilters({
      username: [],
      module: [],
      actionType: [],
    });
    setDateRange({ startDate: null, endDate: null });
  };

  return (
    <div>
      <SubHeader />
      <div style={{ display: "flex", height: "91vh" }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
        />
        <div style={{ padding: "7px 11px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography className="users-title">
              {UI_TEXTS.TEXTS.AUDIT_LOGS}
            </Typography>
            <Tooltip title={pagination.totalItems ?? 0}>
              <div className="count_forModule_container">
                <span className="count_forModule_ellipsis">
                  {pagination.totalItems ?? 0}
                </span>
              </div>
            </Tooltip>
          </div>

          <div className="audit_logs_filters_container">
            <Box
              className="full-width"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                margin: "0 0 20px 0",
                alignItems: "flex-start",
              }}
            >
              <CustomFilter
                // filterTitle={"Audit Logs Filter"}
                filtersConfig={filtersConfig}
                appliedFilters={filters}
                onFilterChange={handleFilterChange}
                onRemoveFilter={handleRemoveFilter}
                onClearAllFilters={clearAllFilters}
                recentFilter={recentFilter}
                filterLoading={filterLoading}
                ref={React.createRef()}
                fromDate={dateRange.startDate}
                toDate={dateRange.endDate}
                setFromDate={(startDate) =>
                  setDateRange((prev) => ({ ...prev, startDate }))
                }
                setToDate={(endDate) =>
                  setDateRange((prev) => ({ ...prev, endDate }))
                }
                renderDateRangePicker={true}
              />
            </Box>
          </div>

          <div
            style={{
              maxWidth: isSidebarExpanded ? "87vw" : "96vw",
              flex: 1,
              position: "absolute",
              width: "98vw",
            }}
          >
            <GlobalTable
              headers={DATA_ASSET_HEADERS}
              // data={versionData}
              data={sortedData}
              pageLoader={pageLoader}
              rowsPerPage={pagination.itemsPerPage}
              page={pagination.currentPage - 1}
              totalRows={pagination.totalItems}
              onPageChange={(e, newPage) => handleChangePage(e, newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              renderCell={renderCell}
              hideFooter={true}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              height="67vh"
            />
          </div>

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
              currentPage={pagination.currentPage}
              setCurrentPage={(newPage) => handleChangePage(null, newPage - 1)}
              itemsPerPage={pagination.itemsPerPage}
              setItemsPerPage={(n) => handleChangeRowsPerPage(n)}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
