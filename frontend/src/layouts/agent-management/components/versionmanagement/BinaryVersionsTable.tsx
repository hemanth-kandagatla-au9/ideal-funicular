import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { BinaryVersion } from "./binarytypes";
import BinaryVersionsColumns from "./BinaryVersionsColumns";
import Pagination from "../../../../components/ui/pagination/Pagination.component";

interface BinaryVersionsTableProps {
  style?: React.CSSProperties;
  versions: BinaryVersion[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    showSizeChanger: boolean;
  };
  onView?: (version: BinaryVersion) => void;
  onEdit?: (version: BinaryVersion) => void;
}

const BinaryVersionsTable = ({ versions, pagination, onView, onEdit, style }: BinaryVersionsTableProps) => {
  const columns = BinaryVersionsColumns({ onView, onEdit });

  const handlePagination = (limit: number, pageNo: number) => {
    pagination.onChange(pageNo, limit);
  };

  const handleRowsPerPage = (limit: number) => {
    pagination.onChange(1, limit);
  };

  return (
    <Box sx={{ height: "calc(100vh - 150px)", minHeight: 200, width: "100%", display: "flex", flexDirection: "column", ...style }}>
      <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
        <DataGrid
          rows={versions}
          columns={columns}
          getRowId={row => row.id}
          disableVirtualization
          hideFooterPagination
          hideFooterSelectedRowCount
          disableSelectionOnClick
          disableColumnMenu
          initialState={{
            sorting: {
              sortModel: [{ field: "buildDate", sort: "asc" }],
            },
          }}
          sx={{
  border: "none",
  height: "100%",
  backgroundColor: "#ffffff",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f9fafb",
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#f9fafb",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    fontFamily: "Johnson text",
  },

  "& .MuiDataGrid-main": {
    backgroundColor: "#ffffff",
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    py: 2,
    fontFamily: "Johnson text",
  },

  "& .MuiDataGrid-row": {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(144, 106, 255, 0.08)",
      "&:hover": {
        backgroundColor: "rgba(144, 106, 255, 0.1)",
      },
    },
  },
}}
          getRowHeight={() => "auto"}
        />
      </Box>

      <Box sx={{ flex: "0 0 auto" }}>
        <Pagination
          handlePagination={handlePagination}
          handleRowsPerPage={handleRowsPerPage}
          pagination={{
            pageNo: pagination.current,
            totalPage: Math.ceil(pagination.total / pagination.pageSize),
            totalRows: pagination.total,
            limit: pagination.pageSize,
          }}
        />
      </Box>
    </Box>
  );
};

export default BinaryVersionsTable;

