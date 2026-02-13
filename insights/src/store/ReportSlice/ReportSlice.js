import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  fetchReportData,
  getReportDefaultColumnOptions,
  getReportDefaultJobsOptions,
  getReportDefaultTagsOptions,
  fetchGlobalReportData,
} from "../../services/configurations/configService";

const initialState = {
  reportData: {
    data: [],
    status: "loading",
    error: null,
  },
  globalReport: {
    data: [],
    status: "loading",
    error: null,
  },
  saveOperation: {
    status: "idle",
    error: null,
    savedReport: null,
  },
  defaultColumns: {
    data: [],
    status: "idle",
    error: null,
  },
  tags: {
    data: [],
    status: "idle",
    error: null,
  },
  jobs: {
    data: [],
    status: "idle",
    error: null,
  },
  scheduleFilters: {
    hostnames: [],
    runAs: [],
    categoryName: [],
    command: [],
    tags: [],
  },
};

export const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    fetchDataSuccess(state, action) {
      state.loading = false;
      if (action.payload.type === "scheduleFilters") {
        state.scheduleFilters = action.payload.data;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReportData.pending, (state) => {
        state.reportData.status = "loading";
        state.reportData.error = null;
      })
      .addCase(fetchReportData.rejected, (state) => {
        state.reportData.status = "error";
        state.reportData.data = [];
        state.reportData.error = "Error while fetching the data";
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.reportData.status = action.payload.flag;
        state.reportData.data = action.payload.data;
        state.reportData.error = null;
      })

      .addCase(fetchGlobalReportData.pending, (state) => {
        state.globalReport.status = "loading";
        state.globalReport.error = null;
      })
      .addCase(fetchGlobalReportData.rejected, (state) => {
        state.globalReport.status = "error";
        state.globalReport.data = [];
        state.globalReport.error = "Error while fetching the data";
      })
      .addCase(fetchGlobalReportData.fulfilled, (state, action) => {
        state.globalReport.status = action.payload.flag;
        state.globalReport.data = action.payload.data;
        state.globalReport.error = null;
      })

      .addCase(getReportDefaultColumnOptions.pending, (state) => {
        state.defaultColumns = { status: "loading", data: [], error: null };
      })
      .addCase(getReportDefaultColumnOptions.rejected, (state, action) => {
        state.defaultColumns = {
          status: "error",
          data: [],
          error: action.payload.error,
        };
      })
      .addCase(getReportDefaultColumnOptions.fulfilled, (state, action) => {
        state.defaultColumns = {
          status: "success",
          data: action.payload.data,
          error: null,
        };
      })
      .addCase(getReportDefaultJobsOptions.pending, (state) => {
        state.jobs = { status: "loading", data: [], error: null };
      })
      .addCase(getReportDefaultJobsOptions.rejected, (state, action) => {
        state.jobs = {
          status: "error",
          data: [],
          error: action.payload.error,
        };
      })
      .addCase(getReportDefaultJobsOptions.fulfilled, (state, action) => {
        state.jobs = {
          status: "success",
          data: action.payload.data,
          error: null,
        };
      })
      .addCase(getReportDefaultTagsOptions.pending, (state) => {
        state.tags = { status: "loading", data: [], error: null };
      })
      .addCase(getReportDefaultTagsOptions.rejected, (state, action) => {
        state.tags = {
          status: "error",
          data: [],
          error: action.payload.error,
        };
      })
      .addCase(getReportDefaultTagsOptions.fulfilled, (state, action) => {
        state.tags = {
          status: "success",
          data: action.payload.data,
          error: null,
        };
      });
  },
});

export const { fetchDataSuccess } = reportSlice.actions;

export default reportSlice.reducer;
