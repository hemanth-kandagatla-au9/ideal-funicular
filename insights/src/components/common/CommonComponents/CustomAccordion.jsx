import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  IconButton,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  CircularProgress,
  Grid,
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from "@mui/material";
import "./common.css";
import { UI_TEXTS } from "../Constants/label-contants";

const JobSummary = ({ jobData }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#F8FAFC",
        borderRadius: "8px",
        padding: "8px",
        border: "1px solid #E2E8F0",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={4} sm={6} md={4}>
          <Typography
            variant="subtitle2"
            className="job-summery-accordion-label"
          >
            {UI_TEXTS.TYPOGRAPHY.JOB_TITLE}
          </Typography>
          <Typography variant="body1" className="job-summery-accordion-value">
            {jobData?.jobName || "-"}
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography
            variant="subtitle2"
            className="job-summery-accordion-label"
          >
            {UI_TEXTS.TYPOGRAPHY.JOB_CATEGORY}
          </Typography>
          <Typography variant="body1" className="job-summery-accordion-value">
            {jobData?.categoryName || "-"}
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography
            variant="subtitle2"
            className="job-summery-accordion-label"
          >
            {UI_TEXTS.LABELS.SCHEDULE_TYPE}
          </Typography>
          <Typography variant="body1" className="job-summery-accordion-value">
            {jobData?.scheduleType || "-"}
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography
            variant="subtitle2"
            className="job-summery-accordion-label"
          >
            {UI_TEXTS.LABELS.JOB_FREQUENCY}
          </Typography>
          <Typography
            variant="body1"
            className="job-summery-accordion-value"
          ></Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography
            variant="subtitle2"
            className="job-summery-accordion-label"
          >
            {UI_TEXTS.LABELS.JOB_TAGS}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {jobData?.tags?.length > 0 ? (
              jobData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: "#E2E8F0",
                    color: "#1E293B",
                    fontSize: "13px",
                  }}
                />
              ))
            ) : (
              <Typography
                variant="body1"
                className="job-summery-accordion-value"
              >
                {"-"}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography
            variant="subtitle2"
            className="job-summery-accordion-label"
          >
            {UI_TEXTS.LABELS.TYPE}
          </Typography>
          <Typography variant="body1" className="job-summery-accordion-value">
            {jobData?.categoryType || "-"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobSummary;
