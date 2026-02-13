import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import Cookies from "universal-cookie";
import "./CustomDatagrid.css";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { UI_TEXTS } from "../Constants/label-contants";
import { formattedDate } from "../../../utils/CommonUtils";
import DownloadIcon from "@mui/icons-material/Download";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const CustomDataGrid = ({
  pageLoader,
  rows,
  columns,
  onPaginationModelChange,
  rowCount,
  getRowId,
  paginationMode,
  onSortModelChange,
  onRowClick,
  sortingMode = "client",
  rowCursorPointer,
  gridSize = "small",
  largeCells,
  hideFooter,
  tableHeight = "72vh",
  isMultiselect = false,
  bulkAction = false,
  onAcceptAll = () => {},
  onRejectAll = () => {},
  setMultipleSelectedRecords = () => {},
  disableCheckbox = (row) => false,
  multipleSelectedRecords,
  writePerForRequestApproval,
  filterModel,
  onFilterModelChange,
  filterMode = "client",
  component,
  getRowClassName,
  disableSorting = false,
  openRow,
  handleRowClick,
  alwaysVisibleColumns,
  expandableColumns,
  componentType,
  showColumnFilters = true,
  getRowHeight,
  customStyles,
  pageType = "",
  onVisibleColumnsChange,
  exportFlag,
  onExportComplete,
  serverPage,
  components = {}, // Accept custom components
}) => {
  const cookies = new Cookies();
  const loggedInUser = cookies.get("username") ?? "";
  const [isHovered, setIsHovered] = useState(false);
  const [pageSize, setPageSize] = useState(100);
  const [sortModel, setSortModel] = useState([]);
  const [displayRows, setDisplayRows] = useState(rows || []);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columnsWithVisibilityControl, setColumnsWithVisibilityControl] =
    useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const GLOABAL_COLUMN_KEY = "customDataGrid_columns";

  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(GLOABAL_COLUMN_KEY) || "{}"
      );
      return columns.reduce((acc, col) => {
        acc[col.field] = saved.hasOwnProperty(col.field)
          ? saved[col.field]
          : true;
        return acc;
      }, {});
    } catch (e) {
      return columns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {});
    }
  });

  useEffect(() => {
    setVisibleColumns((prev) => {
      const next = { ...prev };
      columns.forEach((col) => {
        if (!next.hasOwnProperty(col.field)) next[col.field] = true;
      });
      return next;
    });
  }, [columns]);

  useEffect(() => {
    try {
      localStorage.setItem(GLOABAL_COLUMN_KEY, JSON.stringify(visibleColumns));
    } catch (e) {}
  }, [visibleColumns]);
  const [exportToastId, setExportToastId] = useState(null);
  const MAX_VISIBLE = 3;

  const calculateHeight =
    gridSize === "large" && (rows?.length ?? 0) >= 10
      ? "65vh"
      : gridSize === "small" && (rows?.length ?? 0) >= 1
      ? "66vh"
      : "350px";

  useEffect(() => {
    if (rows) {
      setDisplayRows(rows);
    }
    if (exportFlag) {
      handleExportData();
    }
  }, [rows, exportFlag]);

  // const _handleSort = (newSortModel) => {
  //   // if (newSortModel[0]?.field === "hostname") {
  //   if (disableSorting) return;
  //   setSortModel(newSortModel);
  //   onSortModelChange?.(newSortModel);

  //   if (sortingMode === "server") {
  //     onSortModelChange?.(newSortModel);
  //   } else {
  //     const sortedRows = [...displayRows].sort((a, b) => {
  //       const { field, sort: sortDirection } = newSortModel[0];
  //       const valueA = String(a[field]).toLowerCase();
  //       const valueB = String(b[field]).toLowerCase();
  //       if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
  //       if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //     setDisplayRows(sortedRows);
  //   }
  //   // }
  // };
  const handleSort = (newSortModel) => {
    setSortModel(newSortModel);

    if (sortingMode === "server") {
      onSortModelChange?.(newSortModel);
    } else {
      if (newSortModel.length === 0) {
        // Reset to original order if sort is cleared
        setDisplayRows([...rows]);
        return;
      }

      const { field, sort: sortDirection } = newSortModel[0];
      const sortedRows = [...rows].sort((a, b) => {
        const valueA = String(a[field] ?? "").toLowerCase();
        const valueB = String(b[field] ?? "").toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });

      setDisplayRows(sortedRows);
    }
  };

  const Rows = useMemo(() => {
    return sortingMode === "client" ? displayRows : rows;
  }, [sortingMode, displayRows, rows]);

  const handlePageChanges = (model) => {
    setPageSize(model.pageSize);
    onPaginationModelChange?.(model);
  };

  const handleColumnMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleColumnVisibility = (field) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const filteredColumns = useMemo(() => {
    const visibleCols = columns.filter(
      (column) => visibleColumns[column.field]
    );
    if (onVisibleColumnsChange) {
      const visibleFields = visibleCols.map((col) => col.field);
      onVisibleColumnsChange(visibleFields);
    }
    return visibleCols;
  }, [columns, visibleColumns, onVisibleColumnsChange]);

  const allVisible = useMemo(
    () => columns.every((col) => visibleColumns[col.field]),
    [columns, visibleColumns]
  );

  const someVisible = useMemo(
    () => columns.some((col) => visibleColumns[col.field]),
    [columns, visibleColumns]
  );
  const handleSelectAll = () => {
    setVisibleColumns((prev) => {
      const newVis = { ...prev };
      const targetValue = allVisible ? false : true;
      columns.forEach((col) => {
        newVis[col.field] = targetValue;
      });
      return newVis;
    });
  };
  const handleParams = (params) => {
    if (params.field === "columnVisibility") {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Tooltip title={UI_TEXTS.TOOLTIP_TEXT.SHOW_OR_HIDE_COLUMNS}>
            <IconButton
              onClick={handleColumnMenuClick}
              size="small"
              sx={{ padding: 0 }}
            >
              <ViewColumnIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box display="flex" alignItems="center">
        <Box>{params.colDef.headerName}</Box>
        {!disableSorting && params.field === "hostname" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            ml={0.5}
          >
            <IconButton
              className="icon-button-root"
              disableRipple
              sx={{ padding: 0 }}
              onClick={() => handleSort([{ field: params.field, sort: "asc" }])}
            >
              <ArrowUp2 size="10" color="#64748b" />
            </IconButton>
            <IconButton
              className="icon-button-root"
              disableRipple
              sx={{ padding: 0 }}
              onClick={() =>
                handleSort([{ field: params.field, sort: "desc" }])
              }
            >
              <ArrowDown2 size="10" color="#64748b" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
    const selectedRecords = rows.filter((row) => newSelection.includes(row.id));
    setMultipleSelectedRecords(selectedRecords);
  };
  // Add export function
  const handleExportData = () => {
    try {
      const toastId = toast.loading("Exporting data...");
      setExportToastId(toastId);
      const dataToExport =
        selectedRows.length > 0
          ? rows.filter((row) => selectedRows.includes(row.id))
          : rows;
      const exportColumns = filteredColumns.filter(
        (col) => col.field !== "Select" && col.field !== "actions"
      );

      if (dataToExport.length === 0) {
        toast.update(toastId, {
          render: "No data available to export",
          type: "warning",
          isLoading: false,
          autoClose: 2000,
        });
        onExportComplete?.();
        return;
      }

      const csvContent = convertToCSV(dataToExport, exportColumns);
      downloadCSV(
        csvContent,
        `servers-export-${new Date().toISOString().split("T")[0]}.csv`
      );
      toast.update(toastId, {
        render: "Data exported successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      onExportComplete?.();
    } catch (error) {
      console.error("Export error:", error);

      // Show error toast
      if (exportToastId) {
        toast.update(exportToastId, {
          render: "Failed to export data",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.error("Failed to export data");
      }
      onExportComplete?.();
    }
  };
  // Add CSV conversion utility functions
  const convertToCSV = (data, columns) => {
    const headers = columns.map((col) => `"${col.headerName}"`).join(",");
    const rows = data
      .map((row) => columns.map((col) => `"${row[col.field] || ""}"`).join(","))
      .join("\n");

    return `${headers}\n${rows}`;
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  const renderBulkActions = () => {
    if (pageType === "servers" && !serverPage)
      return (
        <Tooltip title="Export Data">
          <button
            onClick={handleExportData}
            size="small"
            className="export-btn"
          >
            Export Data
            <CloudDownloadIcon />
          </button>
        </Tooltip>
      );
    if (!bulkAction || selectedRows.length === 0) return null;
    {
      /* Add Export Button */
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          gap: "8px",
          width: "97%",
        }}
      >
        <span style={{ marginTop: "5px", marginRight: "2px" }}>
          Selected Count: {multipleSelectedRecords}
        </span>
        {writePerForRequestApproval && (
          <>
            <Tooltip title={UI_TEXTS.TOOLTIP_TEXT.APPROVE_SELECTED}>
              <IconButton onClick={onAcceptAll} size="small">
                <TaskAltOutlinedIcon color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title={UI_TEXTS.TOOLTIP_TEXT.REJECT_SELECTED}>
              <IconButton onClick={onRejectAll} size="small">
                <CancelOutlinedIcon sx={{ color: "#B02222" }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    );
  };
  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontFamily: '"Roboto", Helvetica, sans-serif',
          color: "#000000DE",
          fontSize: "14px",
        }}
      >
        No results found.
      </Typography>
    </Box>
  );
  const pastelColors = [
    { background: "#FDF2FA", color: "#C11574" },
    { background: "#EFF8FF", color: "#175CD3" },
    { background: "#F9F5FF", color: "#6941C6" },
    { background: "#FFF6ED", color: "#C4320A" },
    { background: "#E0F7FA", color: "#006064" },
    { background: "#F1F8E9", color: "#33691E" },
    { background: "#EDE7F6", color: "#4527A0" },
    { background: "#FFF3E0", color: "#E65100" },
  ];

  function getRandomColor(tag) {
    // Simple hash based on character codes
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pastelColors.length;
    return pastelColors[index];
  }
  // function parseCronExpression(cronExpression) {
  //   const [min, hour, day, month, weekday] = cronExpression.trim().split(" ");
  //   const parts = [];

  //   const addPart = (value, label) => {
  //     const num = parseInt(value, 10);
  //     if (!isNaN(num)) {
  //       parts.push({ unit: label, value: num });
  //     }
  //   };

  //   if (month.startsWith("*/")) addPart(month.slice(2), "Month");
  //   if (day.startsWith("*/")) addPart(day.slice(2), "Day");
  //   if (weekday.startsWith("*/")) addPart(weekday.slice(2), "Week");
  //   if (hour.startsWith("*/")) addPart(hour.slice(2), "Hour");
  //   if (min.startsWith("*/")) addPart(min.slice(2), "Minute");

  //   if (parts.length === 0) return "Custom Schedule";

  //   // Sort in descending order of units
  //   const unitOrder = ["Month", "Week", "Day", "Hour", "Minute"];
  //   parts.sort((a, b) => unitOrder.indexOf(a.unit) - unitOrder.indexOf(b.unit));

  //   const readable = parts
  //     .map(({ value, unit }) => `${value} ${unit}${value > 1 ? "s" : ""}`)
  //     .join(", ");

  //   return `Every ${readable}`;
  // }
  const CustomRow = ({
    row,
    openRow,
    handleRowClick,
    alwaysVisibleColumns,
    expandableColumns,
  }) => {
    if (
      row?.privateJob &&
      row?.createdBy?.toLowerCase() !== loggedInUser?.toLowerCase() &&
      row?.status !== "REJECTED"
    ) {
      return null;
    }
    const visibleAlwaysColumns = alwaysVisibleColumns.filter(
      (column) => visibleColumns[column.field]
    );

    // const visibleExpandableColumns = expandableColumns?.filter(
    //   (column) => visibleColumns[column.field]
    // );

    const rowStatusStyle = (row) => {
      let borderColor;
      if (row.status === "PENDING_APPROVAL") {
        borderColor = "#ff9800";
      } else if (row.frequency === "Execute one time") {
        borderColor = "#0243f5";
      } else if (row.scheduleType === "AD_HOC") {
        borderColor = "#906AFF";
      } else if (row.jobRunning) {
        borderColor = "#4CAF50";
      } else {
        borderColor = "#BDBDBD";
      }
      if (row.status === "REJECTED") {
        borderColor = "rgb(238, 33, 33)";
      }

      const style = {
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "5px",
      };
      return style;
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2.5px",
          border: "0.5px solid #E0E0E0",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        // onClick={() => handleRowClick(row.id)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {visibleAlwaysColumns.map((column) => (
            <div
              key={`${row.id}-${column.field}`}
              style={{
                width: column.width,
                padding: "4px",
                minWidth: column.minWidth,
                ...(column.field === "expand" ? rowStatusStyle(row) : {}),
              }}
            >
              {column.renderCell
                ? column.renderCell({
                    row,
                    value: row[column.field],
                    field: column.field,
                  })
                : row[column.field]}
            </div>
          ))}
        </div>

        {openRow[row.id] && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "24px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div className="accordion-label">Schedule ID</div>
                <div className="accordion-column">
                  {row?.scheduleId || row?._id || "-"}
                </div>

                <div style={{ marginTop: "12px" }} className="accordion-label">
                  {UI_TEXTS.TABLE_TEXTS.CREATED_DATE}
                </div>
                <div className="accordion-column">
                  {row.createdAt ? formattedDate(row.createdAt) : "-"}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div className="accordion-label">
                  {UI_TEXTS.TABLE_TEXTS.CREATED_BY}
                </div>
                <div className="accordion-column">{row.createdBy || "-"}</div>

                <div style={{ marginTop: "12px" }} className="accordion-label">
                  {UI_TEXTS.TABLE_TEXTS.END_DATE}
                </div>
                {row?.scheduleType === "AD_HOC" || "STARTUP" ? (
                  <div className="accordion-column">
                    {row.jobEndDate ? formattedDate(row.jobEndDate) : "-"}
                  </div>
                ) : row?.frequency === "Execute one time" ? (
                  <div className="accordion-column">
                    {row.jobEndDate ? formattedDate(row.jobEndDate) : "-"}
                  </div>
                ) : (
                  <div className="accordion-column">
                    {row.jobEndDate
                      ? formattedDate(row.jobEndDate)
                      : row.jobStartDate
                      ? formattedDate(row.jobStartDate)
                      : "-"}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  fontFamily: "Manrope",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div className="accordion-label">
                  {UI_TEXTS.TABLE_TEXTS.TAGS}
                </div>
                <div className="tag-container">
                  {Array.isArray(row.tags) && row.tags.length > 0 ? (
                    <>
                      {row.tags.slice(0, MAX_VISIBLE).map((tag, index) => {
                        const { background, color } = getRandomColor(tag);

                        return (
                          <Tooltip title={tag} key={index}>
                            <span
                              className="tag"
                              style={{ backgroundColor: background, color }}
                            >
                              {tag}
                            </span>
                          </Tooltip>
                        );
                      })}

                      {row.tags.length > MAX_VISIBLE && (
                        <Tooltip title={row.tags.join(", ")} placement="top">
                          <span
                            className="tag"
                            style={{
                              background: "#ddd",
                              color: "#333",
                              cursor: "pointer",
                            }}
                          >
                            +{row.tags.length - MAX_VISIBLE} more
                          </span>
                        </Tooltip>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: "13px", color: "#888" }}>
                      {"-"}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: "12px" }} className="accordion-label">
                  Updated At
                </div>
                <div className="accordion-column">
                  {row?.updatedBy?.length ? formattedDate(row?.updatedAt) : "-"}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div className="accordion-label">Updated By</div>
                <div className="accordion-column">
                  {row?.updatedBy || "N/A"}
                </div>

                <div className="accordion-label">System Schedule</div>
                <div className="accordion-column">
                  {row?.isSystemPublish ? "YES" : "NO"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const updatedColumns = filteredColumns.map((column, index) =>
      index === 0 ? { ...column } : column
    );

    const columnsToShow = showColumnFilters
      ? (() => {
          const columnVisibilityObj = {
            field: "columnVisibility",
            headerName: "",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderHeader: handleParams,
            width: 50,
          };

          // Determine which column to replace
          const replaceField = pageType === "servers" ? "actions" : "expand";
          const replaceIndex = updatedColumns.findIndex(
            (col) => col.field === replaceField
          );

          if (replaceIndex !== -1) {
            // Replace 'actions' or 'expand' column with columnVisibility
            return updatedColumns.map((col, idx) =>
              idx === replaceIndex ? { ...col, ...columnVisibilityObj } : col
            );
          } else {
            // If no such column exists, add columnVisibility at the beginning
            return [columnVisibilityObj, ...updatedColumns];
          }
        })()
      : updatedColumns;

    setColumnsWithVisibilityControl(columnsToShow);
  }, [filteredColumns, showColumnFilters, pageType]);

  return (
    <Box
      className="custom-grid-topContainer"
      style={{ height: tableHeight, width: "100%" }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {renderBulkActions()}
      </Box>
      <Box
        className="custom-set-table-container"
        onMouseEnter={() => setIsHovered(true)}
        sx={{
          height: tableHeight,
          width: "100%",
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <DataGrid
          BorderBrush="Transparent"
          BorderThickness="0"
          className="custom-data-gridTable custom-scrollbar"
          getRowId={getRowId}
          rows={filteredColumns.length > 0 ? Rows : []}
          rowCount={rowCount ?? displayRows.length}
          rowHeight={largeCells ? 96 : 55}
          columns={columnsWithVisibilityControl}
          onVisibleColumnsChange={onVisibleColumnsChange}
          columnVisibilityModel={visibleColumns}
          onColumnVisibilityModelChange={(newModel) =>
            setVisibleColumns(newModel)
          }
          classes={{
            cell: "custom-cell",
            columnHeader: "custom-col-cell",
            row: rowCursorPointer ? "cursor-pointer" : undefined,
          }}
          columnHeaderHeight={60}
          initialState={{
            pagination: { paginationModel: { pageSize, page: 0 } },
          }}
          loading={pageLoader}
          sortModel={sortModel}
          onSortModelChange={handleSort}
          onPaginationModelChange={handlePageChanges}
          paginationMode={paginationMode}
          pageSizeOptions={[5, 10, 15, 25]}
          disableColumnMenu={true}
          disableRowSelectionOnClick={true}
          onRowClick={onRowClick}
          components={components}
          autoHeight={calculateHeight === 0}
          {...(getRowHeight && { getRowHeight })}
          sx={{
            ...(pageType === "servers" && {
              "& .MuiDataGrid-cell": {
                padding: "0 !important",
              },
            }),
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              color: "#667085",
              textTransform: "capitalize !important",
              fontSize: "14px",
              fontFamily: "Manrope",
              fontWeight: "600",
              // width: "100%",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "600",
              textTransform: "full-width",
              fontSize: "14px",
              fontFamily: "Manrope",
            },
            "& .MuiDataGrid-columnHeader": {
              padding: "0 8px",
            },
            "& .MuiDataGrid-columnHeader:first-of-type": {
              paddingLeft: "0",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              width: "100%",
            },
            height: "100%",
            overflow: isHovered ? "auto" : "hidden",
            "& .MuiDataGrid-virtualScroller": {
              overflow: isHovered ? "auto" : "hidden !important",
              overflowX: "auto !important",
              overflowY: "auto !important",
              paddingBottom: "3px",
              overflowX: "scroll !important",
            },
            "& .MuiDataGrid-selectedRowCount": {
              display: "none",
            },
            "& .Mui-disabled": {
              color: "rgba(0, 0, 0, 0.26)",
              cursor: "not-allowed",
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              position: "inherit",
            },
            "& .MuiDataGrid-columnHeaderCheckbox": {
              minWidth: 100,
              width: 100,
              display: "flex",
              justifyContent: "flex-start",
              padding: 0,
              margin: 0,
            },
          }}
          hideFooter={hideFooter}
          checkboxSelection={isMultiselect}
          onRowSelectionModelChange={handleSelectionModelChange}
          rowSelectionModel={selectedRows}
          isRowSelectable={(params) => !disableCheckbox(params.row)}
          getRowClassName={getRowClassName}
          slots={{
            ...(componentType === "taskListsCardsTable" && {
              row: (props) => (
                <CustomRow
                  {...props}
                  openRow={openRow}
                  handleRowClick={handleRowClick}
                  alwaysVisibleColumns={alwaysVisibleColumns}
                  expandableColumns={expandableColumns}
                />
              ),
            }),
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          filterModel={showColumnFilters ? filterModel : undefined}
          onFilterModelChange={
            showColumnFilters ? onFilterModelChange : undefined
          }
          filterMode={showColumnFilters ? filterMode : undefined}
          componentsProps={{
            cell: {
              showTooltip: true,
            },
          }}
        />
      </Box>

      {showColumnFilters && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleColumnMenuClose}
          PaperProps={{
            style: {
              maxHeight: 300,
              width: 200,
            },
          }}
        >
          <MenuItem
            key="selectAll"
            dense
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAll();
            }}
          >
            <Checkbox
              checked={allVisible}
              indeterminate={!allVisible && someVisible}
              onChange={handleSelectAll}
              size="small"
            />
            {allVisible ? "Deselect All" : "Select All"}
          </MenuItem>
          {columns.map((column) => (
            <MenuItem key={column.field} dense>
              <Checkbox
                checked={visibleColumns[column.field]}
                onChange={() => toggleColumnVisibility(column.field)}
                size="small"
              />
              {column.headerName}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};
