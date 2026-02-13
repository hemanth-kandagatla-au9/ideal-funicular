import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Box,
  Menu,
  MenuItem,
  Checkbox,
  IconButton,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./GlobalTable.css";
import Button from "../Button/Button";
// import BaseIconButton from "../Button/BaseIconButton";
// import DownloadButton, { UploadButton } from "../Button/DownloadButton";
import { Tooltip } from "@mui/material";
import ModalCustomLoader from "../loader/ModalCustomLoader";
import NoData from "../NoDataComponent/NoData";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const GlobalTable = ({
  headers = [],
  data = [],
  pageLoader = false,
  rowsPerPageOptions = [10, 25, 50, 100],
  rowsPerPage,
  page,
  totalRows,
  onPageChange = () => {},
  onRowsPerPageChange,
  renderCell,
  openRow,
  renderExpandedRow,
  AddButtonProp,
  AddButton,
  onExportProp,
  onExport,
  isDownloading,
  disableExport = false,
  exportToolTip = "",
  isEndDatePassed,
  bulkUploadBtn = false,
  bulkUploadFn = () => {},
  hideFooter,
  onSort,
  sortBy,
  sortOrder,
  height,
}) => {
  const [hiddenColumns, setHiddenColumns] = useState(
    headers.filter((header) => !header.default).map((header) => header.key) ??
      []
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleColumnVisibility = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const visibleHeaders = headers.filter(
    (header) => !hiddenColumns.includes(header.key)
  );
  const showData = visibleHeaders.length === 0 ? false : true;

  return (
    <>
      {AddButtonProp || onExportProp || bulkUploadBtn ? (
        <div className="table_container_global">
          {AddButtonProp && (
            <span>
              <Button
                type="primary"
                data-testid="addbutton-test"
                onClick={AddButton}
                style={{ marginRight: "10px" }}
              >
                Add {AddButtonProp}
              </Button>
            </span>
          )}
        </div>
      ) : null}

      <TableContainer
        component={Paper}
        className="table-container"
        sx={{ height, overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell first-cell">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {/* Select All / Deselect All Option */}
                  <MenuItem
                    onClick={() => {
                      const allVisible = hiddenColumns.length === 0;
                      if (allVisible) {
                        // hide all columns
                        setHiddenColumns(headers.map((h) => h.key));
                      } else {
                        setHiddenColumns([]);
                      }
                    }}
                  >
                    <Checkbox
                      checked={hiddenColumns.length === 0}
                      indeterminate={
                        hiddenColumns.length > 0 &&
                        hiddenColumns.length < headers.length
                      }
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setHiddenColumns([]); // show all
                        } else {
                          setHiddenColumns(headers.map((h) => h.key)); // hide all
                        }
                      }}
                    />
                    <ListItemText
                      primary={
                        hiddenColumns.length === 0
                          ? "Deselect All"
                          : "Select All"
                      }
                      sx={{
                        ".MuiTypography-root": {
                          fontSize: "12px",
                          fontFamily: "Manrope",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </MenuItem>

                  {headers.map((header) => (
                    <MenuItem key={header.key}>
                      <Checkbox
                        checked={!hiddenColumns.includes(header.key)}
                        onChange={() => toggleColumnVisibility(header.key)}
                      />
                      <ListItemText
                        primary={header.label}
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: "12px",
                            fontFamily: "Manrope",
                            fontWeight: 600,
                          },
                        }}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
              {visibleHeaders.map((header) => (
                <TableCell key={header.key} className="table-head-cell">
                  {header.sortable ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "right",
                        cursor: "pointer",
                      }}
                      onClick={() => onSort && onSort(header.key)}
                    >
                      {header.label}
                      {sortBy === header.key &&
                        (sortOrder === "asc" ? (
                          <ArrowUpwardIcon
                            fontSize="small"
                            style={{ ml: "5px" }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            fontSize="small"
                            style={{ ml: "5px" }}
                          />
                        ))}
                    </div>
                  ) : (
                    header.label
                  )}
                </TableCell>
              ))}
              <TableCell className="table-head-cell last-cell" />
            </TableRow>
          </TableHead>

          <TableBody>
            {pageLoader ? (
              <TableRow>
                <TableCell colSpan={visibleHeaders.length + 2}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="65vh"
                  >
                    <ModalCustomLoader isLoading={pageLoader} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : !showData || !data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleHeaders.length + 2}>
                  <NoData />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow>
                    <TableCell
                      className={
                        row.isEndDatePassed
                          ? "table-cell-disabled"
                          : "table-cell"
                      }
                    >
                      {""}
                    </TableCell>
                    {visibleHeaders.map(({ key }) => (
                      <TableCell
                        key={key}
                        className={
                          row.isEndDatePassed
                            ? "table-cell-disabled"
                            : "table-cell"
                        }
                      >
                        {renderCell ? renderCell(row, key) : row[key] || "-"}
                      </TableCell>
                    ))}
                    <TableCell
                      className={
                        row.isEndDatePassed
                          ? "table-cell-disabled"
                          : "table-cell"
                      }
                    >
                      {""}
                    </TableCell>
                  </TableRow>
                  {openRow === row._id && renderExpandedRow && (
                    <TableRow>
                      <TableCell
                        className="collapse-container"
                        colSpan={visibleHeaders.length + 2}
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}

            {/* {!pageLoader && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleHeaders.length + 2}>
                  <NoData />
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>

          {data.length < 15 &&
            Array.from({ length: 15 - data.length }).map((_, index) => (
              <TableRow key={`empty-row-${index}`}>
                <TableCell
                  style={{ border: "none" }}
                  colSpan={headers.length + 2}
                >
                  <p></p>
                </TableCell>
              </TableRow>
            ))}

          {!hideFooter && (
            <TableFooter className="table-footer">
              <TableRow>
                <TableCell
                  colSpan={
                    visibleHeaders.length > 0 ? visibleHeaders.length + 2 : 10
                  }
                  className="pagination-footer-cell"
                >
                  <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={totalRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    classes={{
                      select: "table-pagination-select",
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </>
  );
};

export default GlobalTable;
