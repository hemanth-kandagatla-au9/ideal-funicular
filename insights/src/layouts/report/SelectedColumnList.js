import React from "react";
import { Box, Typography, IconButton, Paper, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const SelectedColumnList = ({ selectedOptions, onRemove, onClear }) => {
  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <label className="custom-label">
          Select Columns ({selectedOptions.length})
        </label>
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", color: "primary.main" }}
          onClick={onClear}
        >
          Clear All
        </Typography>
      </Box>

      <Stack
        className="scrollable-container"
        spacing={1}
        sx={{
          maxWidth: 300,
          maxHeight: 250,
          height: 250,
          border: "1px solid #ccc",
          borderRadius: 2,
          overflowX: "auto",
          overflowY: "auto",
          p: 1,
        }}
      >
        {selectedOptions.map((item, index) => (
          <Paper
            key={`${item.job}-${item.column}-${index}`}
            elevation={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              wordBreak: "break-all",
            }}
          >
            <div>
              <section>
                {item.column}
                {` (${item.job})`}
              </section>
            </div>
            <div>
              <IconButton size="small" onClick={() => onRemove(item)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default SelectedColumnList;
