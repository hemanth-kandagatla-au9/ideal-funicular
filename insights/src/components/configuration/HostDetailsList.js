import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Button,
  Tooltip,
  Modal,
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import classes from "../auth/role/css/taskList.module.css";
import PopUp from "../popup/popUp.component";
import { DateTimeIconHtml } from "../ui/icons/Icons";
import Search from "../ui/search/Search.component";
import { HostsModal } from "./HostsModal";
import {
  AxiosInstance,
  deleteHost,
} from "../../services/configurations/configService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  exportSAPFactsData,
  exportSAPFactsDataService,
  getSapFactHosts,
  getSapFactsColumns,
  getSapFactsFilterOptions,
  syncSAPFactsCloumns,
} from "../../services/jobs/JobsService";
import { useDispatch, useSelector } from "react-redux";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { Global, Refresh2, TickCircle } from "iconsax-react";
import LanguageIcon from "@mui/icons-material/Language";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import SubHeader from "../planning/SubHeader.component";
import Sidebar from "../planning/Sidebar.component";
import { bulkAgentAction } from "../../services/configurations/configService";
import { getUsernameFromCookies } from "../../utils/cookieUtility";
import SelectedServersModal from "./SelectedServersModal";
import EnvironmentModal from "./EnvironmentModal";
import BulkActionLogs from "./BulkActionLogs";
import "./css/common.css";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import { FaRegCopy } from "react-icons/fa";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import EmptyPage from "../common/EmptyPage/EmptyPage";
import SapFactFilters from "./SapFactFilter/SapFactFilterComponent";
import CustomPill from "../common/CustomPill/CustomPill";
import Filter from "../../assets/images/Filter.png";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { isLoadingInHost } from "../../utils/DetectHost";

function HostDetailsList() {
  const dispatch = useDispatch();
  const SAPFactsColumns =
    useSelector((state) => state.jobs.sapFactsColumnsConfig.data) || [];
  const enabledColumns = SAPFactsColumns.filter((el) => el.active);
  const [searchFilter, setSearchFilter] = useState(null);
  const [editData, setEditData] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [hostData, setHostData] = useState([]);
  const [editJobId, setEditJobId] = useState();
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [sidebarActiveTab, setSidebarActiveTab] = useState("server");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedServerNames, setSelectedServerNames] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showDropdownModel, setShowDropdownModel] = useState(false);
  const [showSelectedHostsModal, setShowSelectedHostsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showheaderKeys, setShowHeaderKeys] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(false);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const textRef3 = useRef(null);
  const textRef4 = useRef(null);
  const username = getUsernameFromCookies();
  const [recentFilter, setRecentFilter] = useState("");
  const [sapFactsFilterOptions, setSapFactsFilterOptions] = useState([]);
  const [sapFactsFilterSelectedOptions, setSapFactsFilterSelectedOptions] =
    useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [exportHandleFlag, setExportHandleFlag] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const stored = localStorage.getItem("sidebarExpanded");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(async () => {
    await syncSAPFactsCloumns();
    dispatch(getSapFactsColumns());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const latest = localStorage.getItem("sidebarExpanded");
      setIsSidebarExpanded(latest ? JSON.parse(latest) : false);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  const handleExportAllData = async () => {
    setLoading(true);
    try {
      const enabledColumnsForExport = enabledColumns.map((col) => ({
        source: col.source,
        category: col.category,
        columnName: col.columnName,
        active: col.active,
      }));

      // Prepare filters
      const filterParams = {};
      Object.keys(sapFactsFilterSelectedOptions).forEach((key) => {
        if (Array.isArray(sapFactsFilterSelectedOptions[key])) {
          filterParams[key] = sapFactsFilterSelectedOptions[key].join(",");
        }
      });

      const exportPayload = {
        masterSearch: searchFilter || "",
        enabledColumns: enabledColumnsForExport,
        ...filterParams,
      };

      const result = await dispatch(exportSAPFactsData(exportPayload));

      if (exportSAPFactsData.fulfilled.match(result)) {
        const response = result.payload;

        if (response.success && response.data && response.data.length > 0) {
          const csvData = response.data;
          const totalCount = response.totalCount || 0;

          // Convert to CSV
          const headers = Object.keys(csvData[0]);
          const csvContent = [
            headers.map((h) => `"${h}"`).join(","),
            ...csvData.map((row) =>
              headers
                .map((header) => {
                  const value = row[header] || "";
                  return `"${String(value).replace(/"/g, '""')}"`;
                })
                .join(",")
            ),
          ].join("\n");

          // Download file
          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sap_facts_export_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast.success(`Exported ${totalCount} records successfully`);
        } else {
          toast.warning("No data available for export");
        }
      } else if (exportSAPFactsData.rejected.match(result)) {
        toast.error(result.payload?.message || "Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const permissionState = useSelector((state) => state.jobs?.permissions);
  const writePermForServer = hasInsightsPermission(
    permissionState,
    "SAP Facts",
    PERMISSION_LIST.SAP_FACTS_WRITE
  );

  const envPermForServer = hasInsightsPermission(
    permissionState,
    "SAP Facts",
    PERMISSION_LIST.SAP_FACTS_ENV
  );

  const syncPermForServer = hasInsightsPermission(
    permissionState,
    "SAP Facts",
    PERMISSION_LIST.SAP_FACTS_SYNC
  );

  const bulkPermForServer = hasInsightsPermission(
    permissionState,
    "SAP Facts",
    PERMISSION_LIST.SAP_FACTS_BULK_LOGS
  );

  const getHostData = async ({ masterSearch, pageSize, pageNo }) => {
    let query = "?";
    setLoading(true);
    if (masterSearch) {
      query = query + `masterSearch=${masterSearch}&`;
    }
    if (pageSize) {
      query = query + `pageSize=${pageSize}&`;
    }
    if (pageNo) {
      query = query + `pageNo=${pageNo}`;
    }

    Object.keys(sapFactsFilterSelectedOptions).forEach((el) => {
      // 1. Process the array elements
      const encodedValues = sapFactsFilterSelectedOptions[el].map((item) =>
        // Replace newline character '\n' with its URL-encoded form '%0A'
        item.replace(/\n/g, "%0A")
      );

      // 2. Join the processed elements with a comma
      const joinedValues = encodedValues.join(",");

      // 3. Append to the query string
      // Note: The key 'el' must also be URI-encoded, but since it contains no
      // special characters here, we can skip it for simplicity.
      query += `&${el}=${joinedValues}`;
    });

    try {
      const response = await dispatch(getSapFactHosts(query));
      let fetchedData = response?.data?.data || [];
      setHostData(fetchedData);
      const totallCount =
        response?.data?.pagination?.totalCount || fetchedData.length;
      const totalPage = response?.data?.pagination?.totalPage || 1;
      setTotalCount(totallCount || 0);
      if (totallCount < 10) {
        setTotalPages(1);
      } else {
        setTotalPages(totalPage);
      }
    } catch (error) {
      console.error("Error fetching host data:", error);
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_FETCH_HOST_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(
      () => {
        getHostData({
          masterSearch: searchFilter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });
        // setLoading(false)
      },

      searchFilter ? 1000 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [
    showTaskModal,
    modalShow,
    searchFilter,
    itemsPerPage,
    pageInput,
    currentPage,
    sapFactsFilterSelectedOptions,
  ]);

  useEffect(() => {
    setSelectAll(
      selectedRows.length === hostData.length && hostData.length > 0
    );
  }, [selectedRows, hostData]);

  const handleCopy = (event, ref, index) => {
    event.stopPropagation(); // Prevents bubbling
    if (ref.current) {
      const text = ref.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    }
  };

  const onEditAction = async (rowData) => {
    setIsEditClicked(true);
    setEditJobId(rowData?._id);
    setShowTaskModal(true);
  };

  const handleDelete = async (id) => {
    deleteHost(id)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          toast.success(TOAST_MESSAGES.OTHERS.HOST_DELETED_SUCCESSFULLY);
          setModalShow(false);
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_HOST);
      });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectedServerNames([]);
    } else {
      setSelectedRows(hostData.map((row) => row._id));
      setSelectedServerNames(
        hostData.map((row) => ({
          hostname: row.hostname,
          port: row.port || 20101,
        }))
      );
    }
    setSelectAll(!selectAll);
  };

  const handleClearAll = () => {
    setSelectedRows([]);
    setSelectAll(false);
    setSelectedServerNames([]);
  };

  const handleRowSelect = (rowId, hostname, port) => {
    setSelectedRows((prevRows) => {
      if (prevRows.includes(rowId)) {
        setSelectedServerNames((prevNames) =>
          prevNames.filter(
            (server) => server.hostname !== hostname || server.port !== port
          )
        );
        return prevRows.filter((id) => id !== rowId);
      } else {
        setSelectedServerNames((prevNames) => [
          ...prevNames,
          { hostname, port },
        ]);
        return [...prevRows, rowId];
      }
    });
  };

  const bulkAction = async (data) => {
    try {
      if (!selectedServerNames?.length) {
        toast.warning(TOAST_MESSAGES.OTHERS.PLEASE_SELECT_ATLEAST_ONE_SERVER);
        return;
      }
      const res = await bulkAgentAction({
        type: data.type,
        payload: selectedServerNames.map((item) => ({
          ...item,
          ...(data.env && { env: data.env }),
        })),
        username,
      });

      if (res?.data?.message) {
        toast.success(res.data.message);
      }
      setShowDropdownModel(false);
    } catch (err) {
      toast.error(TOAST_MESSAGES.OTHERS.SOMETHING_WRONG);
    }
  };

  const handleOpenEnvModal = () => {
    setShowDropdownModel(true);
  };

  const handleCloseEnvModal = () => {
    setShowDropdownModel(false);
  };
  function camelCaseToTitleCase(str) {
    if (!str) return str;

    // Add space before uppercase letters and capitalize first letter
    const result = str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());

    return result;
  }

  function generateStaticColumns() {
    const columns = [
      {
        field: "actions",
        headerName: UI_TEXTS.TABLE_TEXTS.SELECT,
        flex: 1,
        renderCell: (params) => (
          <div style={{ paddingLeft: "8px" }}>
            <div
              onClick={() =>
                handleRowSelect(
                  params.row.id,
                  params.row.hostname,
                  params.row.port || 20101
                )
              }
              style={{ cursor: "pointer" }}
            >
              <TickCircle
                size="20"
                variant={
                  selectedRows.includes(params.row.id) ? "Bold" : "Linear"
                }
                color={
                  selectedRows.includes(params.row.id) ? "#3A7BC2" : "#64748B"
                }
              />
            </div>
          </div>
        ),
      },
    ];

    const enabledStaticColumns = enabledColumns.map((el) => el.columnName);
    if (enabledStaticColumns.includes("hostname")) {
      columns.push({
        field: "hostname",
        headerName: UI_TEXTS.TABLE_TEXTS.HOSTNAME,
        flex: 1.5,
        minWidth: 150,
        renderCell: (params) => (
          <div title={params.value || UI_TEXTS.NOT_FOUND.NO_HOSTNAME_AVAILABLE}>
            {params.value || "-"}
          </div>
        ),
      });
    }
    if (enabledStaticColumns.includes("accountToSudo")) {
      columns.push({
        field: "accountToSudo",
        headerName: UI_TEXTS.TABLE_TEXTS.ACCOUNT_TO_SUDO,
        minWidth: 190,
        getCellClassName: () => "blue-cell",
        renderCell: (params) => (
          <div
            title={
              params.value || UI_TEXTS.NOT_FOUND.NO_ACCOUNT_TO_SUDO_AVAILABLE
            }
            style={{
              backgroundColor: "#d1eef1",
              width: "100%",
              padding: "0 4px",
            }}
          >
            {params.value || "-"}
          </div>
        ),
        renderHeader: () => (
          <div>
            <section>{UI_TEXTS.TABLE_TEXTS.ACCOUNT_TO_SUDO}</section>
            {showheaderKeys && (
              <section>
                (
                <span style={{ textTransform: "none" }} ref={textRef1}>
                  accountToSudo
                </span>
                )
                <Tooltip title={copiedIndex === 1 ? "Copied!" : "Copy"}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleCopy(e, textRef1, 1)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </section>
            )}
          </div>
        ),
      });
    }
    if (enabledStaticColumns.includes("osInstance")) {
      columns.push({
        field: "osInstance",
        headerName: UI_TEXTS.TABLE_TEXTS.INSTANCE,
        minWidth: 100,
        minWidth: showheaderKeys ? 190 : 100,
        renderCell: (params) => (
          <div
            title={params.value || UI_TEXTS.NOT_FOUND.NO_INSTANCE_AVAILABLE}
            style={{
              backgroundColor: "#d1eef1",
              width: "100%",
              padding: "0 4px",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {params.value || "-"}
          </div>
        ),
        renderHeader: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <section>{UI_TEXTS.TABLE_TEXTS.INSTANCE}</section>
            {showheaderKeys && (
              <section
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                (
                <span style={{ textTransform: "none" }} ref={textRef2}>
                  osInstance
                </span>
                )
                <Tooltip title={copiedIndex === 2 ? "Copied!" : "Copy"}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleCopy(e, textRef2, 2)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </section>
            )}
          </div>
        ),
      });
    }
    if (enabledStaticColumns.includes("osInstanceType")) {
      columns.push({
        field: "osInstanceType",
        headerName: UI_TEXTS.TABLE_TEXTS.INSTANCE_TYPE,
        minWidth: 150,
        renderCell: (params) => (
          <div
            title={
              params.value || UI_TEXTS.NOT_FOUND.NO_INSTANCE_TYPE_AVAILABLE
            }
            style={{
              backgroundColor: "#d1eef1",
              width: "100%",
              padding: "0 4px",
            }}
          >
            {params.value || "-"}
          </div>
        ),
        renderHeader: () => (
          <div>
            <section>{UI_TEXTS.TABLE_TEXTS.INSTANCE_TYPE}</section>
            {showheaderKeys && (
              <section>
                {showheaderKeys && (
                  <section>
                    (
                    <span style={{ textTransform: "none" }} ref={textRef3}>
                      osInstanceType
                    </span>
                    )
                    <Tooltip title={copiedIndex === 3 ? "Copied!" : "Copy"}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleCopy(e, textRef3, 3)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </section>
                )}
              </section>
            )}
          </div>
        ),
      });
    }
    if (enabledStaticColumns.includes("osSystemId")) {
      columns.push({
        field: "osSystemId",
        headerName: UI_TEXTS.TABLE_TEXTS.SYSTEM_ID,
        minWidth: showheaderKeys ? 240 : 170,
        renderCell: (params) => (
          <div
            title={params.value || UI_TEXTS.NOT_FOUND.NO_SYSTEM_ID_AVAILABLE}
            style={{
              backgroundColor: "#d1eef1",
              width: "100%",
              padding: "0 4px",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {params.value || "-"}
          </div>
        ),
        renderHeader: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <section>{UI_TEXTS.TABLE_TEXTS.SYSTEM_ID}</section>
            {showheaderKeys && (
              <section
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                (
                <span style={{ textTransform: "none" }} ref={textRef4}>
                  osSystemId
                </span>
                )
                <Tooltip title={copiedIndex === 4 ? "Copied!" : "Copy"}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleCopy(e, textRef4, 4)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </section>
            )}
          </div>
        ),
      });
    }
    if (enabledStaticColumns.includes("timestamp")) {
      columns.push({
        field: "updatedAt",
        headerName: `${UI_TEXTS.TABLE_TEXTS.TIME_STAMP}(UTC)`,
        minWidth: 190,
        renderCell: (params) => {
          let date = params.row?.updatedAt ?? params.row?.createdAt ?? null;
          return formattedDate(date);
        },
      });
    }

    return columns;
  }

  const columns = generateStaticColumns();

  // Function to create dynamic CMDB columns with controlled sequence
  const createDynamicCMDBColumns = (hostData) => {
    if (!hostData || !Array.isArray(hostData) || hostData.length === 0) {
      console.log("hostData is not available yet:", hostData);
      return [];
    }

    // Define colors for CMDB categories - expanded color palette
    const CMDB_CATEGORY_COLORS = [
      "#f4ede7", // cmdb_ci_server (original)
      "#e7f4ed", // cmdb_rel_ci_app (original)
      "#e7edf4", // cmdb_rel_ci_aps (original)
      "#f4e7f4", // Light Purple
      "#fff4e7", // Light Peach
      "#e7f4f4", // Light Cyan
      "#f4f4e7", // Light Beige
      "#ede7f4", // Light Lavender
      "#e7fff4", // Mint
      "#ffe7f4", // Pink
      "#f4ffe7", // Light Lime
      "#e7e7f4", // Periwinkle
      "#f4f0e7", // Ivory
      "#e7f4ff", // Light Blue
      "#fff0e7", // Seashell
      "#f0e7f4", // Pale Purple
      "#e7fff0", // Pale Green
      "#fff7e7", // Cornsilk
      "#e7f7ff", // Alice Blue
      "#f7e7f4", // Pale Pink
    ];

    // Collect ALL unique CMDB categories from cmdbApi
    const cmdbCategories = new Set();

    // Collect unique keys from first few records only (for performance)
    const sampleData = hostData.slice(0, 50); // Limit to first 50 records

    sampleData.forEach((item) => {
      if (item?.cmdbApi && typeof item.cmdbApi === "object") {
        Object.keys(item.cmdbApi).forEach((objectKey) => {
          cmdbCategories.add(objectKey);
        });
      }
    });

    // Convert Set to Array and maintain a consistent order (alphabetical)
    const allCategories = Array.from(cmdbCategories).sort();

    // Create color mapping for CMDB categories
    const cmdbColorMapping = {};
    allCategories.forEach((category, index) => {
      cmdbColorMapping[category] =
        CMDB_CATEGORY_COLORS[index % CMDB_CATEGORY_COLORS.length];
    });

    // Use object to track found keys per category
    const foundKeys = {};

    // Initialize categories
    allCategories.forEach((category) => {
      foundKeys[category] = new Set();
    });
    // Collect field keys for each category
    sampleData.forEach((item) => {
      if (item?.cmdbApi && typeof item.cmdbApi === "object") {
        Object.keys(item.cmdbApi).forEach((objectKey) => {
          const nestedObject = item.cmdbApi[objectKey];

          if (nestedObject && typeof nestedObject === "object") {
            Object.keys(nestedObject).forEach((fieldKey) => {
              // Skip metadata fields
              if (fieldKey !== "updatedAt" && fieldKey !== "Host Name") {
                if (foundKeys[objectKey]) {
                  foundKeys[objectKey].add(fieldKey);
                }
              }
            });
          }
        });
      }
    });

    // Create columns for each category
    const dynamicColumns = [];

    allCategories.forEach((objectKey) => {
      const fieldKeys = foundKeys[objectKey];
      if (fieldKeys && fieldKeys.size > 0) {
        const backgroundColor = cmdbColorMapping[objectKey];

        // Sort fields alphabetically for consistency
        const sortedFieldKeys = Array.from(fieldKeys).sort();

        sortedFieldKeys.forEach((fieldKey) => {
          const columnField = `cmdb_${objectKey}_${fieldKey}`;

          // Check if column already exists to prevent duplicates
          if (!dynamicColumns.find((col) => col.field === columnField)) {
            dynamicColumns.push({
              field: columnField,
              headerName: fieldKey,
              minWidth: 120,
              flex: 1,
              sortable: true,
              renderCell: (params) => {
                const value = params.value || "-";
                const displayValue = value === "" ? "-" : String(value);

                return (
                  <div
                    title={displayValue}
                    style={{
                      backgroundColor: backgroundColor,
                      width: "100%",
                      height: "100%",
                      padding: "0 4px",
                      whiteSpace: "pre-wrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {displayValue.length > 200
                      ? `${displayValue.slice(0, 200)}…`
                      : displayValue}
                  </div>
                );
              },
            });
          }
        });
      }
    });

    // console.log("Generated CMDB columns:", dynamicColumns.length);
    // console.log("CMDB Categories found:", allCategories);
    return { columns: dynamicColumns, colorMapping: cmdbColorMapping };
  };

  // Expanded unique color palette for report_index
  const REPORT_INDEX_COLORS = [
    "#FFE4E1", // Misty Rose
    "#E6E6FA", // Lavender
    "#F0FFF0", // Honeydew
    "#FFF0F5", // Lavender Blush
    "#F5F5DC", // Beige
    "#F0F8FF", // Alice Blue
    "#FFFACD", // Lemon Chiffon
    "#E0FFFF", // Light Cyan
    "#FFEFD5", // Papaya Whip
    "#F8F8FF", // Ghost White
    "#FFDAB9", // Peach Puff
    "#E6FFE6", // Very Light Green
    "#F0E6FF", // Pale Lavender
    "#FFF5E6", // Linen
    "#E6F7FF", // Light Blue
    "#FFF0E6", // Floral White
    "#F5F0FF", // Pale Lilac
    "#E6FFF5", // Mint Cream
    "#FFF8E6", // Cornsilk
    "#F0F0FF", // Ghost Lavender
    "#FFFAF0", // Floral White
    "#E6FAFA", // Light Cyan 2
    "#FFF5F0", // Seashell
    "#FAF0E6", // Linen 2
    "#F0FAFF", // Alice Blue 2
    "#FFFAFA", // Snow
    "#E6F0FA", // Alice Blue 3
    "#FAFAFF", // Ghost White 2
    "#FFF0FA", // Lavender Blush 2
    "#F0FFF5", // Mint Cream 2
  ];

  // Function to create dynamic Report Index columns
  const createDynamicReportIndexColumns = (hostData) => {
    if (!Array.isArray(hostData)) {
      console.warn("Invalid hostData for report_index columns:", hostData);
      return { columns: [], objectColorMapping: {} };
    }

    const objectColorMapping = {}; // category -> color
    const columnMap = {}; // `${category}||${columnName}` -> { category, columnName }

    // Step 1: Collect categories, columns, and assign colors
    hostData.forEach((item) => {
      if (!item?.report_index || typeof item.report_index !== "object") return;

      Object.entries(item.report_index).forEach(([category, categoryValue]) => {
        // Assign color per category
        if (!objectColorMapping[category]) {
          const colorIndex =
            Object.keys(objectColorMapping).length % REPORT_INDEX_COLORS.length;
          objectColorMapping[category] = REPORT_INDEX_COLORS[colorIndex];
        }

        if (categoryValue && typeof categoryValue === "object") {
          Object.keys(categoryValue).forEach((columnName) => {
            const mapKey = `${category}||${columnName}`;

            if (!columnMap[mapKey]) {
              columnMap[mapKey] = { category, columnName };
            }
          });
        }
      });
    });

    // Step 2: Create MUI columns
    const columns = Object.values(columnMap).map(({ category, columnName }) => {
      const backgroundColor = objectColorMapping[category] || "#FFFFFF";

      return {
        field: `report_index_${category}_${columnName}`,
        headerName: columnName,
        minWidth: 150,
        flex: 1,
        sortable: true, //added true flag
        renderCell: (params) => {
          const value = params.row?.report_index?.[category]?.[columnName];

          const displayValue =
            value === undefined || value === "" ? "-" : String(value);

          return (
            <div
              title={displayValue}
              style={{
                backgroundColor,
                width: "100%",
                height: "100%",
                padding: "0 6px",
                whiteSpace: "pre-wrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayValue.length > 200
                ? `${displayValue.slice(0, 200)}…`
                : displayValue}
            </div>
          );
        },
      };
    });

    return { columns, objectColorMapping };
  };

  // Update the rows mapping to include report_index data
  const rows = hostData.map((dt, index) => {
    const rowData = {
      ...dt,
      id: dt._id,
      index: (currentPage - 1) * itemsPerPage + index,
    };

    // PROPERLY flatten nested cmdb objects into rowData
    if (dt.cmdbApi && typeof dt.cmdbApi === "object") {
      Object.entries(dt.cmdbApi).forEach(([objectKey, objectValue]) => {
        if (objectValue && typeof objectValue === "object") {
          Object.entries(objectValue).forEach(([fieldKey, fieldValue]) => {
            if (fieldKey !== "updatedAt" && fieldKey !== "Host Name") {
              const flattenedFieldName = `cmdb_${objectKey}_${fieldKey}`;
              rowData[flattenedFieldName] =
                fieldValue !== null && fieldValue !== undefined
                  ? fieldValue
                  : "-";
            }
          });
        } else {
          rowData[`cmdb_${objectKey}`] =
            objectValue !== null && objectValue !== undefined
              ? objectValue
              : "-";
        }
      });
    }

    // PROPERLY flatten report_index description keys into rowData
    if (dt.report_index && typeof dt.report_index === "object") {
      Object.entries(dt.report_index).forEach(([category, categoryValue]) => {
        if (categoryValue && typeof categoryValue === "object") {
          Object.entries(categoryValue).forEach(([fieldKey, fieldValue]) => {
            const flattenedFieldName = `report_index_${category}_${fieldKey}`;
            rowData[flattenedFieldName] =
              fieldValue !== null && fieldValue !== undefined
                ? fieldValue
                : "-";
          });
        }
      });
    }

    return rowData;
  });

  // Use memo for dynamic columns
  const dynamicReportCols = useMemo(() => {
    if (!Array.isArray(hostData) || hostData.length === 0)
      return { columns: [], colorMapping: {} };
    const dynamicReportIndexColumns = createDynamicReportIndexColumns(hostData);
    const enabledColumnsFields = enabledColumns.map(
      (el) => `${el.source}_${el.category}_${el.columnName}`
    );
    dynamicReportIndexColumns.columns =
      dynamicReportIndexColumns.columns.filter((item) =>
        enabledColumnsFields.includes(item.field)
      );
    return dynamicReportIndexColumns;
  }, [hostData, enabledColumns]);

  const dynamicCMDBCols = useMemo(() => {
    if (!Array.isArray(hostData) || hostData.length === 0)
      return { columns: [], colorMapping: {} };
    let dynamicCMDBColumnsResult = createDynamicCMDBColumns(hostData);
    const enabledColumnsFields = enabledColumns.map(
      (el) => `cmdb_${el.category}_${el.columnName}`
    );
    dynamicCMDBColumnsResult.columns = dynamicCMDBColumnsResult.columns.filter(
      (item) => enabledColumnsFields.includes(item.field)
    );
    return dynamicCMDBColumnsResult;
  }, [hostData, enabledColumns]);

  // Combine all columns
  const allColumns = [
    ...columns,
    ...dynamicReportCols.columns,
    ...dynamicCMDBCols.columns,
  ];
  // changes end here
  // changes end here

  const [logsData, setLogsData] = useState([]);
  const handleActionLogs = async () => {
    setShowLogsModal(true);
  };
  const handleCloseLogs = () => {
    setShowLogsModal(false);
  };

  function createOptions(inputObj) {
    const output = {};

    Object.keys(inputObj).forEach((key) => {
      const originalArray = inputObj[key];
      const transformedArray = originalArray.map((item) => ({
        value: item,
        checked: false,
      }));
      output[key] = transformedArray;
    });
    return output;
  }

  const getFilterLabel = (key) => {
    if (typeof key === "string" && key.includes("-of-")) {
      const arr = key.split("-of-");
      return `${arr[2]} (${arr[1]})`;
    }
    if (key === "hostname") return "Hostname";
    else if (key === "accountToSudo") return "Account To Sudo";
    else if (key === "osInstance") return "Instance";
    else if (key === "osInstanceType") return "Instance Type";
    else if (key === "osSystemId") return "System ID";
    return key;
  };

  const handleSapFactsFiltersSelectionChange = (
    filterKey,
    newSelectedValues
  ) => {
    setSapFactsFilterSelectedOptions((prev) => {
      if (!newSelectedValues || newSelectedValues.length === 0) {
        // remove that key entirely
        const { [filterKey]: _, ...rest } = prev;
        return rest;
      } else {
        // update with new values
        return {
          ...prev,
          [filterKey]: newSelectedValues,
        };
      }
    });
    setRecentFilter(filterKey);
  };

  const getFilterOptions = async ({ masterSearch, pageSize, pageNo }) => {
    let query = "?";
    setLoading(true);
    if (masterSearch) {
      query = query + `masterSearch=${masterSearch}&`;
    }
    if (pageSize) {
      query = query + `pageSize=${pageSize}&`;
    }
    if (pageNo) {
      query = query + `pageNo=${pageNo}&`;
    }
    if (recentFilter) {
      query = query + `recentFilter=${recentFilter}`;
    }
    Object.keys(sapFactsFilterSelectedOptions).forEach((el) => {
      // 1. Process the array elements
      const encodedValues = sapFactsFilterSelectedOptions[el].map((item) =>
        // Replace newline character '\n' with its URL-encoded form '%0A'
        item.replace(/\n/g, "%0A")
      );

      // 2. Join the processed elements with a comma
      const joinedValues = encodedValues.join(",");

      // 3. Append to the query string
      // Note: The key 'el' must also be URI-encoded, but since it contains no
      // special characters here, we can skip it for simplicity.
      query += `&${el}=${joinedValues}`;
    });
    const response = await dispatch(getSapFactsFilterOptions(query));
    if (response.status === 200) {
      setSapFactsFilterOptions(createOptions(response.data.data));
    }
  };

  useEffect(() => {
    getFilterOptions({
      masterSearch: searchFilter,
      pageSize: itemsPerPage,
      pageNo: currentPage,
    });
  }, [
    showTaskModal,
    modalShow,
    searchFilter,
    itemsPerPage,
    pageInput,
    currentPage,
    sapFactsFilterSelectedOptions,
  ]);

  const handleExportData = () => {
    setExportHandleFlag(true);
  };

  const resetFlag = () => {
    setExportHandleFlag(false);
  };

  const formattedDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} | ${formattedTime}`;
  };

  return (
    <div>
      <div>
        <SubHeader />
      </div>
      <div style={{ display: "flex", height: "calc(100dvh - 64px)" }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
        />
        <div
          style={{
            width: "100%",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: isLoadingInHost ? "relative" : "sticky",
              top: isLoadingInHost ? "auto" : 0,
              // padding: "6px 10px",
              // display: "flex",
              // alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              zIndex: isLoadingInHost ? "auto" : 1000,
              // flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: "16px",
              }}
            >
              <div
                className={classes.taskListForDiscovery}
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "rgb(16, 24, 40)",
                  display: "flex",
                }}
              >
                {!isLoadingInHost
                  ? UI_TEXTS.HEADER_TEXT.SAP_FACTS
                  : "All records"}
                <Tooltip title={totalCount ?? 0}>
                  <div
                    className="count_forModule_container"
                    style={{ margin: !isLoadingInHost ? "10px 0 0 4px" : "0" }}
                  >
                    <span className="count_forModule_ellipsis">
                      {totalCount ?? 0}
                    </span>
                  </div>
                </Tooltip>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{ display: "flex", gap: "10px", marginLeft: "10px" }}
                >
                  <Tooltip
                    title={
                      "Display variable names for scripting (click to copy)"
                    }
                  >
                    <FormControlLabel
                      label={
                        showheaderKeys ? "Show Variables" : "Show Variables"
                      }
                      control={
                        <Switch
                          checked={showheaderKeys}
                          onChange={(e) => setShowHeaderKeys(e.target.checked)}
                          color="primary"
                        />
                      }
                    />
                  </Tooltip>
                  {selectedRows.length > 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setShowSelectedHostsModal(true)}
                    >
                      {UI_TEXTS.BUTTONS.SELECTED}: {selectedRows.length}
                    </Button>
                  )}

                  <Button
                    size="small"
                    sx={{ fontFamily: "Manrope", borderRadius: "10px" }}
                    onClick={handleSelectAll}
                    variant="outlined"
                  >
                    {selectAll
                      ? UI_TEXTS.BUTTONS.DESELECT_ALL
                      : UI_TEXTS.LABELS.SELECT_ALL}
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleClearAll}
                    disabled={!selectedRows.length}
                    sx={{ borderRadius: "10px" }}
                  >
                    {UI_TEXTS.LABELS.CLEAR_ALL}
                  </Button>

                  {envPermForServer && (
                    <Tooltip title={UI_TEXTS.TOOLTIP_TEXT.CHANGE_ENVIRONMENT}>
                      <Button
                        variant="outlined"
                        onClick={handleOpenEnvModal}
                        disabled={!selectedRows.length}
                        sx={{ borderRadius: "10px" }}
                      >
                        <LanguageIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  )}
                  {syncPermForServer && (
                    <Tooltip title="Synchronize server data with the opensearch">
                      <Button
                        variant="outlined"
                        onClick={() => bulkAction({ type: "SYNC_CONFIG" })}
                        disabled={!selectedRows.length}
                        startIcon={<Refresh2 size="20" />}
                        sx={{ borderRadius: "10px" }}
                      >
                        {UI_TEXTS.BUTTONS.SYNC}
                      </Button>
                    </Tooltip>
                  )}
                  {bulkPermForServer && (
                    <Button
                      style={{ marginRight: "10px", borderRadius: "10px" }}
                      variant="outlined"
                      onClick={handleActionLogs}
                    >
                      {UI_TEXTS.LABELS.BULK_ACTION_LOGS}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                alignItems: "center",
                // marginBottom: "16px",
                position: "relative",
                flexWrap: "wrap",
              }}
            >
              {/* Insights Indicator */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: "rgb(209, 238, 241)", // Blue
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    fontWeight: 600,
                  }}
                >
                  {UI_TEXTS.LABELS.OS}
                </span>
              </div>

              {/* Update the indicator section to show object keys (APP, DB, etc.) */}
              {Object.entries(dynamicReportCols.objectColorMapping || {}).map(
                ([objectKey, color]) => (
                  <div
                    key={objectKey}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "Manrope",
                        fontWeight: 600,
                      }}
                    >
                      {objectKey.toUpperCase()}
                    </span>
                  </div>
                )
              )}

              {/* CMDB Indicators - Dynamically generated */}
              {Object.entries(dynamicCMDBCols.colorMapping || {}).map(
                ([objectKey, color]) => {
                  // Format display label based on category
                  let displayLabel;

                  // Check for specific categories to use existing text
                  if (
                    objectKey === "cmdb_ci_server" &&
                    UI_TEXTS?.LABELS?.CMDB_SERVER_CI
                  ) {
                    displayLabel = UI_TEXTS.LABELS.CMDB_SERVER_CI;
                  } else if (
                    objectKey === "cmdb_rel_ci_app" &&
                    UI_TEXTS?.LABELS?.CMDB_APP_CI
                  ) {
                    displayLabel = UI_TEXTS.LABELS.CMDB_APP_CI;
                  } else if (
                    objectKey === "cmdb_rel_ci_aps" &&
                    UI_TEXTS?.LABELS?.CMDB_APS_CI
                  ) {
                    displayLabel = UI_TEXTS.LABELS.CMDB_APS_CI;
                  } else {
                    // For all other categories (including ci_hardware), format as CMDB({key})
                    // Clean up the key: remove cmdb_ prefix if present and format
                    const cleanKey = objectKey
                      .replace(/^cmdb_/i, "") // Remove cmdb_ prefix
                      .replace(/_/g, " ") // Replace underscores with spaces
                      .toUpperCase();

                    displayLabel = `CMDB(${cleanKey})`;
                  }

                  return (
                    <div
                      key={`cmdb-${objectKey}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          fontFamily: "Manrope",
                          fontWeight: 600,
                        }}
                      >
                        {displayLabel}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {/* Search Bar in next row */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "16px 0px",
                gap: "12px",
              }}
            >
              <div>
                <button
                  style={{
                    width: "100px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "1px solid #eeeeee",
                  }}
                  onClick={toggleFilters}
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
              <Search
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH}
                searchIconTowardsRight
                onEnterClear
                customeCss={{ right: "5px", position: "relative" }}
                selection="single"
                handleSearchText={(e) => setSearchFilter(e)}
                setSearchTextProp={(e) => setSearchFilter(e)}
              />
              <Tooltip title="Export Data">
                <button
                  // onClick={handleExportData}
                  onClick={handleExportAllData}
                  size="small"
                  className="export-btn"
                >
                  Export Data
                  <CloudDownloadIcon />
                </button>
              </Tooltip>
            </div>
            {filtersVisible && (
              <div>
                <SapFactFilters
                  parentComponent={"sapFacts"}
                  getHostData={getHostData}
                  searchFilter={setSearchFilter}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  sapFactsFilterOptions={sapFactsFilterOptions}
                  setSapFactsFilterSelectedOptions={
                    setSapFactsFilterSelectedOptions
                  }
                  sapFactsFilterSelectedOptions={sapFactsFilterSelectedOptions}
                  handleSapFactsFiltersSelectionChange={
                    handleSapFactsFiltersSelectionChange
                  }
                  recentFilter={recentFilter}
                  setRecentFilter={setRecentFilter}
                />
              </div>
            )}
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {loading ? (
              <div>
                {/* Skeleton Loading */}
                <div
                  style={{
                    padding: "16px",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  {/* Skeleton Header */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        style={{
                          height: "40px",
                          background: "#e0e0e0",
                          borderRadius: "4px",
                          flex: index === 0 ? 1 : index === 1 ? 1.5 : 1,
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    ))}
                  </div>

                  {/* Skeleton Rows */}
                  {[...Array(7)].map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      {[...Array(6)].map((_, colIndex) => (
                        <div
                          key={colIndex}
                          style={{
                            height: "48px",
                            background: "#e0e0e0",
                            borderRadius: "4px",
                            flex: colIndex === 0 ? 1 : colIndex === 1 ? 1.5 : 1,
                            animation: "pulse 1.5s ease-in-out infinite",
                            animationDelay: `${rowIndex * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Add CSS for pulse animation */}
                <style>
                  {`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}
                </style>
              </div>
            ) : allColumns?.length ? (
              <CustomDataGrid
                rows={rows}
                columns={allColumns}
                rowCount={rows.length}
                paginationMode="client"
                sortingMode="client"
                rowCursorPointer={true}
                hideFooter={false}
                tableHeight={filtersVisible ? "90.5%" : "92%"}
                pageLoader={loading}
                pageType="servers"
                exportFlag={exportHandleFlag}
                onExportComplete={resetFlag}
                serverPage={true}
              />
            ) : (
              <div style={{ textAlign: "center", height: "74vh" }} colSpan={12}>
                <EmptyPage
                  title="Servers Not Found"
                  subtitle="Currently, there are no matching servers"
                />
              </div>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              background: "#fff",
              zIndex: 30,
              padding: "8px 10px",
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "flex-end",
              boxSizing: "border-box",
              width: "98vw",
              maxWidth: isSidebarExpanded ? "87vw" : "96vw",
            }}
          >
            <CustomPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              pageInput={pageInput}
              setPageInput={setPageInput}
            />
          </div>
          <BulkActionLogs open={showLogsModal} onClose={handleCloseLogs} />
          {/* Replace PopUp with MUI Modal */}
          <Modal
            open={modalShow}
            onClose={() => setModalShow(false)}
            aria-labelledby="delete-host-modal"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
              }}
            >
              <Typography id="delete-host-modal" variant="h6" component="h2">
                {UI_TEXTS.TYPOGRAPHY.DELETE_HOST}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_HOST}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={() => setModalShow(false)}>
                  {UI_TEXTS.BUTTONS.NO}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDelete(editData)}
                  sx={{ ml: 2 }}
                >
                  {UI_TEXTS.BUTTONS.YES}
                </Button>
              </Box>
            </Box>
          </Modal>
          <HostsModal
            isEditClicked={isEditClicked}
            isModalOpen={showTaskModal}
            setIsModelOpen={setShowTaskModal}
            hostId={editJobId}
          />

          <SelectedServersModal
            open={showSelectedHostsModal}
            onClose={() => setShowSelectedHostsModal(false)}
            selectedHosts={selectedServerNames}
          />

          <EnvironmentModal
            open={showDropdownModel}
            onClose={handleCloseEnvModal}
            onUpdate={(data) => bulkAction(data)}
            selectedCount={selectedRows.length}
          />
        </div>
      </div>
    </div>
  );
}

export default HostDetailsList;
