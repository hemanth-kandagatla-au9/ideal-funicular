import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/planning/Sidebar.component";
import SubHeader from "../../components/planning/SubHeader.component";
import { CustomDataGrid } from "../../components/common/CustomDatagrid/CustomDatagrid";
import CustomFilter from "../../components/common/CustomFilters/CustomFilter";
import { useMemo } from "react";
import { IconButton, Tooltip, Checkbox, Box, Button } from "@mui/material";
import { TickCircle, CloseCircle } from "iconsax-react";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";
import TableIcon from "../../assets/images/tableIcon.svg";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ConfirmationModal } from "./common/ConfirmationModal";
import {
  getApprovalRequests,
  handleApproveRejectRequest,
  handleBulkApproveReject,
} from "../../services/jobs/JobsService";
import { useDispatch, useSelector } from "react-redux";
import {
  DateTimeFormat,
  DateTimeIconHtml,
} from "../../components/ui/icons/Icons";
import { TOAST_MESSAGES } from "../../components/common/Constants/label-contants";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import ReactJson from "react-json-view";
import { getUsernameFromCookies } from "../../utils/cookieUtility";
import { formattedDate } from "../../utils/CommonUtils";

function ApprovalsPage() {
  const dispatch = useDispatch();
  const [sidebarActiveTab, setSidebarActiveTab] = useState("approvals");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [selectedModule, setSelectedModule] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [recentFilter, setRecentFilter] = useState("");

  const [multipleSelectedRecords, setMultipleSelectedRecords] = useState([]);

  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showModal, setShowModal] = useState({
    open: false,
    actionType: "",
    isBulk: false,
    row: null,
  });

  const username = getUsernameFromCookies();

  const approvalRequestsData = useSelector(
    (state) => state.jobs.approvalRequests || []
  );
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const writePerForRequestApproval = hasInsightsPermission(
    permissionState,
    "Request Approval",
    PERMISSION_LIST.REQUEST_APPROVAL_WRITE
  );

  const [moduleOptions, setModuleOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [allModuleOptions, setAllModuleOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);

  useEffect(() => {
    if (initialDataLoaded) {
      const fetchData = async () => {
        setFilterLoading(true);
        try {
          await dispatch(
            getApprovalRequests(
              currentPage,
              itemsPerPage,
              selectedStatus.length > 0 ? selectedStatus.join(",") : undefined,
              selectedModule.length > 0 ? selectedModule.join(",") : undefined,
              false,
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
    if (approvalRequestsData && approvalRequestsData.length > 0) {
      const uniqueModules = [
        ...new Set(approvalRequestsData.map((item) => item.moduleType)),
      ].filter(Boolean);
      const formattedModuleOptions = uniqueModules.map((module) => ({
        value: module,
        label: module,
        id: module,
      }));
      setModuleOptions(formattedModuleOptions);

      const uniqueStatuses = [
        ...new Set(approvalRequestsData.map((item) => item.status)),
      ].filter(Boolean);
      const formattedStatusOptions = uniqueStatuses.map((status) => ({
        value: status,
        label: status,
        id: status,
      }));
      setStatusOptions(formattedStatusOptions);
    }
  }, [approvalRequestsData]);

  const fetchRequests = async () => {
    setLoading(true);
    setFilterLoading(true);
    try {
      const response = await dispatch(
        getApprovalRequests(
          currentPage,
          itemsPerPage,
          selectedStatus.length > 0 ? selectedStatus.join(",") : undefined,
          selectedModule.length > 0 ? selectedModule.join(",") : undefined,
          true,
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
      setInitialDataLoaded(true);
    } catch (error) {
      setInitialDataLoaded(true);
      console.error("Error fetching requests:", error);
      toast.error(TOAST_MESSAGES.ERROR.FETCH);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

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
    resetPaginationOnstatusChange();
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
    resetPaginationOnstatusChange();
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
    resetPaginationOnstatusChange();
    setFilterLoading(true);
    setSelectedModule([]);
    setSelectedStatus([]);
    setFilterLoading(false);
  };

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
          No changes detected
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
                  <tr
                    key={i}
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  >
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
                      {field === "commands" ? (
                        <ReactJson
                          src={oldValue}
                          name={false}
                          collapsed={true}
                          displayDataTypes={false}
                          enableClipboard={false}
                        />
                      ) : (
                        formatCellContent(oldValue)
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #EAECF0",
                      }}
                    >
                      {field === "commands" ? (
                        <ReactJson
                          src={newValue}
                          name={false}
                          collapsed={true}
                          displayDataTypes={false}
                          enableClipboard={false}
                        />
                      ) : (
                        formatCellContent(newValue, field)
                      )}
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
        <IconButton
          size="small"
          onClick={handleViewChanges}
          title="View changes"
          aria-label="View changes"
        >
          <img src={TableIcon} alt="taleIcon" style={{ opacity: "0.7" }} />
        </IconButton>
      </div>
    );
  };
  const columns = [
    {
      field: "recordId",
      headerName: "Request ID",
      minWidth: 100,
      flex: 1,
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
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const isReports = params?.row?.moduleType === "REPORTS";
        const label = isReports ? "PUBLISH" : params?.row?.actionType ?? "";

        return (
          <Tooltip title={label} placement="top" enterDelay={500}>
            {label}
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
    },
    {
      field: "requestedBy",
      headerName: "Requested By",
      minWidth: 120,
      flex: 1.2,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
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
      field: "approverGroup",
      // headerName: "Approved/Rejected By",
      headerName: "Approval Group",
      minWidth: 120,
      flex: 1.2,
    },
    {
      field: "updatedAt",
      headerName: "Date",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <DateTimeFormat date={params.row.updatedAt} type="updated" />
      ),
    },
    writePerForRequestApproval && {
      field: "actions",
      headerName: "Actions",
      minWidth: 80,
      flex: 0.8,
      renderCell: (params) => {
        const isDisabledByStatus = params.row.status !== "PENDING";
        const isSelfRequest = params.row.requestedBy === username;
        const isDisabled = isDisabledByStatus || isSelfRequest;

        return (
          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <Tooltip
              title={
                isSelfRequest ? "Cannot approve your own request" : "Approve"
              }
            >
              <span style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
                <IconButton
                  aria-label="approve"
                  disabled={isDisabled}
                  onClick={() => handleApprove(params.row)}
                  size="small"
                >
                  <TickCircle
                    size="20"
                    color={isDisabled ? "#B0B0B0" : "#75C02B"}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                isSelfRequest ? "Cannot reject your own request" : "Reject"
              }
            >
              <span style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
                <IconButton
                  aria-label="reject"
                  disabled={isDisabled}
                  onClick={() => handleReject(params.row)}
                  size="small"
                >
                  <CloseCircle
                    size="20"
                    color={isDisabled ? "#B0B0B0" : "#B02222"}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ].filter(Boolean);

  const handleBulkApprove = () => {
    setIsBulkActionLoading(true);
    const updatedRequests = requests.map((req) =>
      multipleSelectedRecords.some((selected) => selected.id === req.id)
        ? { ...req, status: "Approved", approvedBy: "Current User" }
        : req
    );

    setRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
    setMultipleSelectedRecords([]);
    setIsBulkActionLoading(false);
    setShowBulkApproveModal(false);
    toast.success(
      `${multipleSelectedRecords.length} requests approved successfully`
    );
  };

  const handleBulkReject = () => {
    setIsBulkActionLoading(true);
    const updatedRequests = requests.map((req) =>
      multipleSelectedRecords.some((selected) => selected.id === req.id)
        ? { ...req, status: "Rejected", approvedBy: "Current User" }
        : req
    );

    setRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
    setMultipleSelectedRecords([]);
    setIsBulkActionLoading(false);
    setShowBulkRejectModal(false);
    toast.success(
      `${multipleSelectedRecords.length} requests rejected successfully`
    );
  };

  // const disableCheckbox = (row) => {
  //   return row.status === "APPROVED" || row.status === "REJECTED";
  // };

  const disableCheckbox = (row) => {
    const isSelfRequest = row.requestedBy === username;
    return (
      row.status === "APPROVED" || row.status === "REJECTED" || isSelfRequest
    );
  };

  const handleApprove = (row) => {
    setShowModal({
      open: true,
      actionType: UI_TEXTS.ACTION_TYPES.APPROVE,
      isBulk: false,
      row,
    });
  };

  const handleReject = (row) => {
    setShowModal({
      open: true,
      actionType: UI_TEXTS.ACTION_TYPES.REJECT,
      isBulk: false,
      row,
    });
  };

  const handleAcceptAll = () => {
    setShowModal({
      open: true,
      actionType: UI_TEXTS.ACTION_TYPES.APPROVE,
      isBulk: true,
      row: null,
    });
  };

  const handleRejectAll = () => {
    setShowModal({
      open: true,
      actionType: UI_TEXTS.ACTION_TYPES.REJECT,
      isBulk: true,
      row: null,
    });
  };

  const handleConfirmAction = async (rejectionReason = "") => {
    setIsBulkActionLoading(true);

    try {
      if (showModal.isBulk) {
        const requestData = {
          requestIds: multipleSelectedRecords.map(
            (record) => record._id || record.id
          ),
          action: showModal.actionType.toUpperCase(),
          rejectionReason:
            showModal.actionType === UI_TEXTS.ACTION_TYPES.REJECT
              ? rejectionReason
              : "",
        };

        const result = await dispatch(handleBulkApproveReject(requestData));

        if (result?.success) {
          toast.success(
            `${multipleSelectedRecords.length} requests ${
              showModal.actionType === UI_TEXTS.ACTION_TYPES.APPROVE
                ? "approved"
                : "rejected"
            } successfully`
          );
          fetchRequests();
          setMultipleSelectedRecords([]);
        }
      } else {
        const requestData = {
          requestId: showModal.row._id || showModal.row.id,
          action: showModal.actionType.toUpperCase(),
          rejectionReason:
            showModal.actionType === UI_TEXTS.ACTION_TYPES.REJECT
              ? rejectionReason
              : "",
        };

        const result = await dispatch(handleApproveRejectRequest(requestData));

        if (result?.success) {
          toast.success(
            `Request ${
              showModal.actionType === UI_TEXTS.ACTION_TYPES.APPROVE
                ? "approved"
                : "rejected"
            } successfully`
          );
          fetchRequests();
        }
      }
    } catch (error) {
      console.error(
        `Error in ${showModal.isBulk ? "bulk" : "single"} ${
          showModal.actionType
        }:`,
        error
      );
      toast.error(
        `Failed to ${showModal.actionType} ${
          showModal.isBulk ? "requests" : "request"
        }`
      );
    } finally {
      setIsBulkActionLoading(false);
      setShowModal({ ...showModal, open: false });
    }
  };

  const approvalRequestsPagination = useSelector(
    (state) => state.jobs.approvalRequestsPagination || []
  );

  const resetPaginationOnstatusChange = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
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

  return (
    <div>
      <SubHeader />
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
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
              fontFamily: "Manrope",
              lineHeight: "40px",
              color: " rgb(16, 24, 40)",
              fontSize: "18px",
              fontWeight: "600",
              // paddingLeft: "14px",
            }}
          >
            {UI_TEXTS.TEXTS.REQUEST_APPROVAL}
          </div>
          <CustomFilter
            filtersConfig={filtersConfig}
            filterLoading={filterLoading}
            appliedFilters={formattedAppliedFilters}
            onFilterChange={handleFilterChange}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
            selectedPosition="bottom"
          />

          <div
            style={{
              flex: 1,
              overflow: "auto",
              marginTop: "20px",
              overflowY: "hidden",
            }}
          >
            <CustomDataGrid
              rows={approvalRequestsData}
              columns={columns}
              pageLoader={loading || filterLoading}
              sortingMode="client"
              hideFooter={false}
              tableHeight={multipleSelectedRecords.length > 0 ? "94%" : "99%"}
              largeCells={true}
              getRowId={(row) => row.id}
              isMultiselect={true}
              bulkAction={multipleSelectedRecords.length > 0}
              onAcceptAll={handleAcceptAll}
              onRejectAll={handleRejectAll}
              setMultipleSelectedRecords={setMultipleSelectedRecords}
              disableCheckbox={disableCheckbox}
              multipleSelectedRecords={multipleSelectedRecords.length}
              writePerForRequestApproval={writePerForRequestApproval}
              autoHeight={true}
              getRowHeight={getRowHeight}
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
                  textTransform: "full-width",
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
                <DialogTitle>Changes </DialogTitle>
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
          {showBulkApproveModal && (
            <Dialog
              open={showBulkApproveModal}
              onClose={() => setShowBulkApproveModal(false)}
            >
              <DialogTitle>Confirm Bulk Approval</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to approve{" "}
                  {multipleSelectedRecords.length} selected requests?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowBulkApproveModal(false)}>
                  {UI_TEXTS.BUTTONS.CANCEL}
                </Button>
                <Button
                  onClick={handleBulkApprove}
                  color="primary"
                  disabled={isBulkActionLoading}
                >
                  {isBulkActionLoading ? "Processing..." : "Approve"}
                </Button>
              </DialogActions>
            </Dialog>
          )}
          {showBulkRejectModal && (
            <Dialog
              open={showBulkRejectModal}
              onClose={() => setShowBulkRejectModal(false)}
            >
              <DialogTitle>
                {UI_TEXTS.DIALOG_TITLE.CONFIRM_BULK_REJECTION}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to reject{" "}
                  {multipleSelectedRecords.length} selected requests?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowBulkRejectModal(false)}>
                  {UI_TEXTS.BUTTONS.CANCEL}
                </Button>
                <Button
                  onClick={handleBulkReject}
                  color="error"
                  disabled={isBulkActionLoading}
                >
                  {isBulkActionLoading ? "Processing..." : "Reject"}
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <ConfirmationModal
            open={showModal.open}
            onClose={() => setShowModal({ ...showModal, open: false })}
            actionType={showModal.actionType}
            isBulkAction={showModal.isBulk}
            count={multipleSelectedRecords.length}
            onConfirm={handleConfirmAction}
            isLoading={isBulkActionLoading}
          />
          <div style={{ borderTop: "1px solid #ddd", padding: "0 10px" }}>
            <CustomPagination
              currentPage={approvalRequestsPagination.currentPage || 1}
              setCurrentPage={(newPage) => {
                setCurrentPage(newPage);
              }}
              totalPages={approvalRequestsPagination.totalPages || 1}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(newSize) => {
                setItemsPerPage(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApprovalsPage;
