import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./CustomPagination.css";
import { UI_TEXTS } from "../Constants/label-contants";

const CustomPagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRecordsChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "50px",
      }}
    >
      <div className="pagination-text">
        Page {currentPage} of {totalPages}
      </div>
      <Stack spacing={2} direction="row" alignItems="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Stack>
      <Select
        value={itemsPerPage}
        onChange={handleRecordsChange}
        className="custom-select pagination-text pagination_border"
      >
        <MenuItem value={10}>{UI_TEXTS.MENU_ITEMS.TEN_PER_PAGE}</MenuItem>
        <MenuItem value={25}>{UI_TEXTS.MENU_ITEMS.TWENTYFIVE_PER_PAGE}</MenuItem>
        <MenuItem value={50}>{UI_TEXTS.MENU_ITEMS.FIFTY_PER_PAGE}</MenuItem>
        <MenuItem value={100}>{UI_TEXTS.MENU_ITEMS.HUNDRED_PER_PAGE}</MenuItem>
      </Select>
    </div>
  );
};

export default CustomPagination;
