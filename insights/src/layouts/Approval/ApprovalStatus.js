import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/planning/Sidebar.component";
import SubHeader from "../../components/planning/SubHeader.component";
import { CustomDataGrid } from "../../components/common/CustomDatagrid/CustomDatagrid";
import CustomFilter from "../../components/common/CustomFilters/CustomFilter";
import { useMemo } from "react";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { getRequestStatusList } from "../../services/jobs/JobsService";
import { toast } from "react-toastify";
import {
  DateTimeFormat,
  DateTimeIconHtml,
} from "../../components/ui/icons/Icons";
import {
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import { formattedDate, getFormattedDate } from "../../utils/CommonUtils";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import TableIcon from "../../assets/images/tableIcon.svg";

function ApprovalStatus() {
  const dispatch = useDispatch();
  const [sidebarActiveTab, setSidebarActiveTab] = useState("approval_status");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [rowHeights, setRowHeights] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [selectedModule, setSelectedModule] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const requestStatusList = useSelector(
    (state) => state.jobs.requestStatusList
  );
  const approvalStatusPagination = useSelector(
    (state) => state.jobs.requestStatusPagination || []
  );

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [allModuleOptions, setAllModuleOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [recentFilter, setRecentFilter] = useState("");

  useEffect(() => {
    if (initialDataLoaded) {
      const fetchData = async () => {
        setFilterLoading(true);
        try {
          await dispatch(
            getRequestStatusList(
              currentPage,
              itemsPerPage,
              selectedStatus.length > 0 ? selectedStatus.join(",") : undefined,
              selectedModule.length > 0 ? selectedModule.join(",") : undefined,
              recentFilter
            )
          );
        } catch (error) {
          console.error("Error fetching requests:", error);
          toast.error(TOAST_MESSAGES.ERROR.FETCH);
        } finally {
          setFilterLoading(false);
        }
      };

      fetchData();
    }
  }, [
    selectedStatus,
    selectedModule,
    currentPage,
    itemsPerPage,
    initialDataLoaded,
  ]);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, itemsPerPage, selectedStatus, selectedModule]);

  useEffect(() => {
    if (requestStatusList && requestStatusList.length > 0) {
      const uniqueModules = [
        ...new Set(requestStatusList.map((item) => item.moduleType)),
      ].filter(Boolean);
      const formattedModuleOptions = uniqueModules.map((module) => ({
        value: module,
        label: module,
        id: module,
      }));
      setModuleOptions(formattedModuleOptions);

      const uniqueStatuses = [
        ...new Set(requestStatusList.map((item) => item.status)),
      ].filter(Boolean);
      const formattedStatusOptions = uniqueStatuses.map((status) => ({
        value: status,
        label: status,
        id: status,
      }));
      setStatusOptions(formattedStatusOptions);
    }
  }, [requestStatusList]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getRequestStatusList(
          currentPage, // Use currentPage directly (already 1-based)
          itemsPerPage, // Use itemsPerPage directly
          selectedStatus.length > 0 ? selectedStatus.join(",") : undefined,
          selectedModule.length > 0 ? selectedModule.join(",") : undefined,
          recentFilter
        )
      );
      const formattedModuleOptions = response?.filterOptions?.moduleType?.map(
        (module) => ({
          value: module,
          label: module,
          id: module,
        })
      );
      setAllModuleOptions(formattedModuleOptions);
      const formattedStatusOptions = response?.filterOptions?.status?.map(
        (status) => ({
          value: status,
          label: status,
          id: status,
        })
      );
      setAllStatusOptions(formattedStatusOptions);
    } catch (error) {
      console.log("Approval Status: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const scroller = document.querySelector(".MuiDataGrid-virtualScroller");

      if (scroller) {
        scroller.scrollTop = 0;
      } else {
        const parent = document.querySelector(".custom-set-table-container");
        if (parent) {
          parent.scrollTop = 0;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    if (filteredRequests.length > 0 && !loading) {
      setTimeout(() => {
        setRowHeights((prev) => ({ ...prev }));
      }, 100);
    }
  }, [filteredRequests, loading]);

  const filterOptions = useMemo(() => {
    const modules = [...new Set(requests.map((item) => item.module))];
    const statuses = [...new Set(requests.map((item) => item.status))];
    const actions = [...new Set(requests.map((item) => item.action))];
    const requestedBys = [...new Set(requests.map((item) => item.requestedBy))];
    const approvedBys = [...new Set(requests.map((item) => item.approvedBy))];

    return {
      module: modules.map((module) => ({
        value: module,
        label: module,
        id: module,
      })),
      status: statuses.map((status) => ({
        value: status,
        label: status,
        id: status,
      })),
      action: actions.map((action) => ({
        value: action,
        label: action,
        id: action,
      })),
      requestedBy: requestedBys.map((name) => ({
        value: name,
        label: name,
        id: name,
      })),
      approvedBy: approvedBys.map((name) => ({
        value: name,
        label: name,
        id: name,
      })),
    };
  }, [requests]);

  const filtersConfig = [
    {
      id: "module",
      type: "multi-select-with-search",
      name: "module",
      placeholder: "Select Module",
      options: allModuleOptions,
      value: selectedModule,
      onChange: (value) => handleFilterChange("module", value),
    },
    {
      id: "status",
      type: "multi-select-with-search",
      name: "status",
      placeholder: "Select Status",
      options: allStatusOptions,
      value: selectedStatus,
      onChange: (value) => handleFilterChange("status", value),
    },
  ];

  const formattedAppliedFilters = useMemo(() => {
    const result = {};

    if (selectedModule.length > 0) {
      result.module = selectedModule;
    }

    if (selectedStatus.length > 0) {
      result.status = selectedStatus;
    }

    return result;
  }, [selectedModule, selectedStatus]);

  const handleFilterChange = (filterKey, value) => {
    setCurrentPage(1);
    const selectedValues = value?.target
      ? value.target.value
      : Array.isArray(value)
      ? value
      : [value];

    switch (filterKey) {
      case "module":
        setSelectedModule(selectedValues);
        setRecentFilter("moduleType");
        break;
      case "status":
        setSelectedStatus(selectedValues);
        setRecentFilter("status");
        break;
      default:
        break;
    }
  };

  const handleRemoveFilter = (filterKey) => {
    setFilterLoading(true);

    switch (filterKey) {
      case "module":
        setSelectedModule([]);
        break;
      case "status":
        setSelectedStatus([]);
        break;
      default:
        break;
    }

    setFilterLoading(false);
  };

  const handleClearAllFilters = () => {
    setFilterLoading(true);
    setSelectedModule([]);
    setSelectedStatus([]);
    setFilterLoading(false);
  };

  const renderValue = (params) => {
    const row = params.row;
    const prevValue = row.previousValue;
    const currentValue = row.requestPayload;

    const hiddenFields = [
      "username",
      "_id",
      "isDeleted",
      "status",
      "createdBy",
      "updatedBy",
      "createdAt",
      "reason",
      "updatedAt",
      "approvedAt",
      "isProcessed",
      "processedAt",
      "collectionName",
      "idField",
      "commandCategoryId",
      "isActive",
      "active",
      "scriptData",
      "codeTemplate",
      "outputOpenSearchIndex",
      "hostIds",
      "templateId",
      "isVersionRestored",
      "jobStartDate",
      "isOneTime",
      "jobName",
      "isHighestVersion",
      "cmdb_table",
    ];

    const dateFields = [
      "updatedAt",
      "createdAt",
      "approvedAt",
      "processedAt",
      "date",
    ];

    const filterFields = (data) => {
      if (Array.isArray(data)) {
        return data.map((item) => filterFields(item));
      }
      if (typeof data === "object" && data !== null) {
        const result = {};
        for (const [key, val] of Object.entries(data)) {
          if (!hiddenFields.includes(key)) {
            if (dateFields.includes(key) && val) {
              result[key] = formattedDate(val);
            } else if (typeof val === "object" && val !== null) {
              result[key] = filterFields(val);
            } else {
              result[key] = val;
            }
          }
        }
        return result;
      }
      return data;
    };

    const filteredPrevValue = filterFields(prevValue);
    const filteredCurrentValue = filterFields(currentValue);

    const getObjectChanges = (prevObj = {}, newObj = {}) => {
      const changes = {};
      const allKeys = new Set([
        ...Object.keys(prevObj || {}),
        ...Object.keys(newObj || {}),
      ]);

      allKeys.forEach((key) => {
        const prevVal = prevObj?.[key];
        const newVal = newObj?.[key];

        if (JSON.stringify(prevVal) !== JSON.stringify(newVal)) {
          changes[key] = {
            oldValue: prevVal !== undefined ? prevVal : "",
            newValue: newVal !== undefined ? newVal : "",
          };
        }
      });

      return changes;
    };

    const changes = getObjectChanges(filteredPrevValue, filteredCurrentValue);

    // On icon click: Store data for modal and open it
    const handleViewChanges = () => {
      setSelectedChanges({ changes });
      setOpenModal(true);
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100%",
          padding: "8px",
        }}
      >
        <Tooltip title="View changes">
          <IconButton
            size="small"
            onClick={handleViewChanges}
            aria-label="View changes"
          >
            <img src={TableIcon} alt="Table Icon" style={{ opacity: "0.7" }} />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const allNA =
    (requestStatusList || []).length > 0 &&
    (requestStatusList || []).every(
      (r) =>
        !r.approvedBy ||
        r.approvedBy === "-" ||
        (typeof r.approvedBy === "object" &&
          Object.keys(r.approvedBy).length === 0)
    );

  const renderTableContent = (changes) => {
    if (!changes || Object.keys(changes).length === 0) {
      return (
        <div
          style={{
            padding: "12px",
            textAlign: "center",
            color: "#6c757d",
            fontSize: "13px",
          }}
        >
          {UI_TEXTS.MESSAGES.NO_CHANGES_DETECTED}
        </div>
      );
    }

    const formatCellContent = (value, field) => {
      const strValue =
        typeof value === "object" ? JSON.stringify(value) : String(value || "");

      return (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
            color: field === "runAs" ? "#fcfafaff" : "#212529",
            fontSize: "13px",
            backgroundColor: field === "runAs" ? "#d81515ff" : "transparent",
          }}
          title={strValue}
        >
          {strValue}
        </div>
      );
    };

    return (
      <div
        style={{
          width: "100%",
          background: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #e9ecef",
        }}
      >
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#F6F9FF",
                  textAlign: "left",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <th
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    color: "#495057",
                    borderBottom: "1px solid #EAECF0",
                    width: "33%",
                    backgroundColor: "#F6F9FF",
                  }}
                >
                  Field Name
                </th>
                <th
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    color: "#495057",
                    borderBottom: "1px solid #EAECF0",
                    width: "33%",
                    backgroundColor: "#F6F9FF",
                  }}
                >
                  Old Value
                </th>
                <th
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    color: "#495057",
                    borderBottom: "1px solid #EAECF0",
                    width: "34%",
                    backgroundColor: "#F6F9FF",
                  }}
                >
                  New Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(changes).map(
                ([field, { oldValue, newValue }], i) => (
                  <tr key={i} style={{ backgroundColor: "#ffffff" }}>
                    <td
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #EAECF0",
                      }}
                    >
                      {formatCellContent(field)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #EAECF0",
                      }}
                    >
                      {formatCellContent(oldValue)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #EAECF0",
                      }}
                    >
                      {formatCellContent(newValue, field)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: "_id",
      headerName: "Request ID",
      minWidth: 150,
      flex: 1.5,
      renderCell: (params) => {
        const date = new Date(params.row.updatedAt || Date.now());
        const dateTimeStr = date
          .toISOString()
          .replace(/[-:T]/g, "")
          .slice(0, 14);
        const uniqueCode = params.row.recordId
          ? params.row.recordId.slice(-4).toUpperCase()
          : "0000";
        const displayValue = `INS-REQ-${dateTimeStr}-${uniqueCode}`;
        return (
          <Tooltip title={displayValue} placement="top" arrow>
            <span
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayValue}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "moduleType",
      headerName: "Module",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "actionType",
      headerName: "User Action",
      minWidth: 150,
      flex: 1.5,
      renderCell: (params) => {
        const value =
          params?.row?.moduleType === "REPORTS"
            ? "PUBLISH"
            : params?.row?.actionType;

        return (
          <Tooltip title={value || ""} placement="top" enterDelay={500}>
            {value}
          </Tooltip>
        );
      },
    },
    {
      field: "changes",
      headerName: "Changes",
      minWidth: 100,
      flex: 1,
      renderCell: renderValue,
      cellClassName: "changes-cell", // Add this for additional styling
      sortable: false,
    },
    //  {
    //   field: "requestedBy",
    //   headerName: "Requested By",
    //   flex: 1,
    // },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top" enterDelay={500}>
          <span
            style={{
              color:
                params.value === "APPROVED"
                  ? "#4CAF50"
                  : params.value === "REJECTED"
                  ? "#F44336"
                  : "#FF9800",
            }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "rejectionReason",
      headerName: "Reason",
      minWidth: 200,
      flex: 2,
      renderCell: (params) => {
        const reason = params.value;

        if (!reason || reason === undefined || reason === null) {
          return "--";
        }

        if (typeof reason === "string" && reason.trim() === "") {
          return "-";
        }

        return reason;
      },
    },
    {
      field: "approverGroup",
      headerName: "Approval Group",
      minWidth: 200,
      flex: 2,
    },
    {
      field: "approvedBy",
      headerName: "Approved/Rejected By",
      minWidth: 100,
      flex: 1,
      sortable: !allNA,
      // renderCell: (params) => {
      //   return params.value ? params.value : "-";
      // },
      headerClassName: allNA ? "no-sort-arrow" : "",
      renderCell: (params) => {
        const val = params.value;
        if (
          !val ||
          (typeof val === "object" && Object.keys(val).length === 0)
        ) {
          return "-";
        }
        return typeof val === "object" ? JSON.stringify(val) : String(val);
      },
    },
    {
      field: "updatedAt",
      headerName: "Date",
      minWidth: 164,
      flex: 1.6,
      renderCell: (params) => (
        <DateTimeFormat date={params.row.updatedAt} type="updated" />
      ),
    },
  ];

  const getRowHeight = (params) => {
    const baseHeight = 120; // Minimum row height for other columns
    const request = filteredRequests.find((r) => r.id === params.id);

    if (!request?.changes) return baseHeight;

    const changesCount = Object.keys(request.changes).length;
    if (changesCount === 0) return baseHeight;

    // Calculate height based on number of changes (28px per row + 40px for header)
    const changesHeight = Math.min(changesCount * 28 + 40, 300);

    // Return the taller of the base height or calculated changes height
    return Math.max(baseHeight, changesHeight);
  };

  // Add this to your styles or inline in the DataGrid props
  const gridStyles = {
    "& .changes-cell": {
      display: "flex",
      alignItems: "center",
      padding: "8px 0",
    },
  };

  const rows = requestStatusList.map((flow, index) => ({
    ...flow,
    id: flow._id || `flow-${index}`,
    index: index,
  }));

  return (
    <div>
      <SubHeader />
      <div style={{ display: "flex", height: "90vh", overflow: "hidden" }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "0 14px",
          }}
        >
          <div
            style={{
              lineHeight: "40px",
              // paddingLeft: "14px",
              fontFamily: "Manrope",
              color: " rgb(16, 24, 40)",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {UI_TEXTS.TEXTS.REQUEST_STATUS}
          </div>

          <CustomFilter
            filtersConfig={filtersConfig}
            filterLoading={filterLoading}
            appliedFilters={formattedAppliedFilters}
            onFilterChange={handleFilterChange}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
          />

          <div style={{ flex: 1, overflow: "auto", marginTop: "20px" }}>
            <CustomDataGrid
              rows={rows}
              columns={columns}
              pageLoader={loading || filterLoading}
              rowCount={filteredRequests.length}
              paginationMode="client"
              onPaginationModelChange={setPaginationModel}
              paginationModel={paginationModel}
              tableHeight="98%"
              largeCells={true}
              getRowId={(row) => row.id}
              getRowHeight={getRowHeight}
              autoHeight={false}
              disableColumnFilter
              disableColumnMenu
              treeData
              getTreeDataPath={(row) => (row.isTree ? row.hierarchyPath : null)}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  color: "#667085",
                  textTransform: "capitalize !important",
                  fontSize: "14px",
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "600",
                  fontSize: "14px",
                  fontFamily: "Manrope",
                },
                "& .changes-cell": {
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 0",
                },
              }}
            />
          </div>

          <div style={{ borderTop: "1px solid #ddd", padding: "0 10px" }}>
            <CustomPagination
              currentPage={approvalStatusPagination.currentPage || 1}
              setCurrentPage={(newPage) => setCurrentPage(newPage)}
              totalPages={approvalStatusPagination.totalPages || 1}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(newSize) => {
                setItemsPerPage(newSize);
                setCurrentPage(1);
              }}
            />
          </div>

          {openModal && (
            <Dialog
              open={openModal}
              onClose={() => setOpenModal(false)}
              maxWidth="lg"
              fullWidth
              scroll="paper"
              sx={{
                "& .MuiPaper-root": {
                  paddingBottom: "30px",
                },
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <DialogTitle>Changes</DialogTitle>
                <div
                  onClick={() => setOpenModal(false)}
                  style={{
                    marginRight: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClearIcon
                    style={{
                      cursor: "pointer",
                      color: "#05060F99",
                      fontSize: "20px",
                    }}
                  />
                </div>
              </div>
              <div style={{ border: "1px solid #F2F2F5", width: "100%" }} />
              <DialogContent>
                {selectedChanges && renderTableContent(selectedChanges.changes)}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprovalStatus;
