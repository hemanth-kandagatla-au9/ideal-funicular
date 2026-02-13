import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import { useEffect, useState } from "react";
import { AxiosInstance } from "../../services/configurations/configService";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../common/Constants/label-contants";
import { formattedDate } from "../../utils/CommonUtils";

export default function BulkActionLogs({ open, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [logData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSortChange = (model) => {
    if (model.length === 0) {
      fetchData();
      return;
    }

    const { field, sort: order } = model[0];

    if (field === "date") {
      const sorted = [...logData].sort((a, b) => {
        const dateA = new Date(a.date || a.endTime).getTime();
        const dateB = new Date(b.date || b.endTime).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });

      setLogsData(sorted);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await AxiosInstance.get(
      `/app-config/getBulkActionLogs?pageNo=${currentPage}&pageSize=${itemsPerPage}`
    );
    const { data, pagination } = response.data;
    setLogsData(data);
    setTotalPages(pagination.totalPage);
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open, currentPage, itemsPerPage]);

  // Function to calculate row height based on data items length
  const getRowHeight = (params) => {
    const dataItems = params?.model?.data || [];
    // Base height + height per item (adjust these values as needed)
    return 48 + dataItems.length * 24; // 48px base + 24px per item
  };

  const columns = [
    { field: "jobId", headerName: "Job ID", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "username", headerName: "User", flex: 1 },
    { field: "status", headerName: "Status", flex: 0.6 },
    {
      field: "data",
      headerName: "Data",
      flex: 3,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const dataArray = params.row.data;
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return (
            <div style={{ padding: "4px 8px", fontSize: "12px" }}>
              {UI_TEXTS.MESSAGES.NO_DATA}
            </div>
          );
        }

        const tdStyle = {
          border: "1px solid #ccc",
          padding: "4px 8px",
          fontSize: "12px",
          wordBreak: "break-word",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        };

        return (
          <div
            style={{
              padding: "4px 0",
              width: "100%",
              position: "relative",
              zIndex: 1,
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e0e0e0",
                fontSize: "11px",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f5f5f5",
                    lineHeight: "normal",
                  }}
                >
                  <th
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "4px 8px",
                      textAlign: "left",
                      fontWeight: "600",
                      width: "35%",
                    }}
                  >
                    {UI_TEXTS.TABLE_TEXTS.SERVER}
                  </th>
                  <th
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "4px 8px",
                      textAlign: "left",
                      fontWeight: "600",
                      width: "33%",
                    }}
                  >
                    {UI_TEXTS.TABLE_TEXTS.STATUS}
                  </th>
                  <th
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "4px 8px",
                      textAlign: "left",
                      fontWeight: "600",
                      width: "33%",
                    }}
                  >
                    {UI_TEXTS.TABLE_TEXTS.MESSAGE}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataArray.map((item, idx) => {
                  const isSuccess = item?.success;
                  const statusColor = isSuccess ? "#4caf50" : "#f44336";

                  return (
                    <tr style={{ lineHeight: "normal" }} key={idx}>
                      <td style={tdStyle}>
                        <Tooltip title={item?.hostname || "-"} placement="top">
                          <span>{item?.hostname || "-"}</span>
                        </Tooltip>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: statusColor,
                          fontWeight: "bold",
                        }}
                      >
                        {isSuccess ? "Success" : "Failed"}
                      </td>
                      <td style={tdStyle}>
                        <Tooltip title={item?.message || "-"} placement="top">
                          <span>{item?.message || "-"}</span>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: UI_TEXTS.TABLE_TEXTS.DATE,
      flex: 1,
      renderCell: (params) => {
        const dateStr = params.row.date || params.row.endTime;

        if (!dateStr) return "-";

        return formattedDate(dateStr);
      },
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: {
          height: "94vh",
          maxHeight: "none",
          maxWidth: "100%",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>{UI_TEXTS.LABELS.BULK_ACTION_LOGS}</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ height: "100%" }}>
        <div style={{ height: "calc(100% - 60px)", width: "100%" }}>
          <CustomDataGrid
            rows={logData}
            columns={columns}
            rowCount={totalPages * itemsPerPage}
            paginationMode="server"
            sortingMode="server"
            rowCursorPointer={true}
            hideFooter={false}
            tableHeight="100%"
            getRowId={(row) => row._id}
            largeCells={true}
            pageLoader={loading}
            getRowHeight={getRowHeight} // Add this prop for dynamic row height
            disableRowSelectionOnClick
            onSortModelChange={handleSortChange}
          />
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={(newPage) => setCurrentPage(newPage)}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
            pageInput={pageInput}
            setPageInput={setPageInput}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
