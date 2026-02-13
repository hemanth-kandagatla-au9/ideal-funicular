import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
} from "../../store/JobSlice/jobsSlice";
import { axiosInstance } from "../jobs/JobsService";
const { post, get, del } = Config.apiEndpoints.jobs;

const token = getLocalAccessToken();
const authActionsPath = Config.apiEndpoints.auth;
export const AxiosInstance = new AxiosInstanceClass(
  `${
    process.env.REACT_APP_BACKEND_URL
      ? process.env.REACT_APP_BACKEND_URL
      : "http://localhost:3001"
  }`
).init(token);
// export const AxiosAuthInstance = new AxiosInstanceClass(
//   `${
//     process.env.REACT_APP_BACKEND_AUTH_URL
//       ? process.env.REACT_APP_BACKEND_AUTH_URL
//       : "http://localhost:3004"
//   }`
// ).init(token);

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response?.data?.message === "Session Expired") {
      sessionStorage.clear();
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  }
);
// AxiosAuthInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response?.data?.message === "Session Expired") {
//       sessionStorage.clear();
//       window.location.href = "/session-expired";
//     }
//     return Promise.reject(error);
//   }
// );

const initialState = {
  hostname: "",
  port: "",
  categoryName: "",
  indexName: "",
};
export const addHosts = createAsyncThunk(
  "addhost",
  async (hostData, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(`${post.createHost}`, hostData);
      return response;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const deleteHost = async (hostId) => {
  try {
    if (hostId) {
      const response = await AxiosInstance.post(`${del.deleteHost}`, {
        hostId: hostId,
      });
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getHostById = createAsyncThunk(
  "getHostById",
  async (hostId, thunkAPI) => {
    try {
      if (hostId) {
        const response = await AxiosInstance.get(
          `${get.getHostById}?hostId=${hostId}`
        );
        return response.data;
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const addCategory = createAsyncThunk(
  "AddCategory",
  async (categoryData, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(
        `${post.createCategory}`,
        categoryData
      );
      return response;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const deleteCategory = async (categoryId) => {
  try {
    if (categoryId) {
      const response = await AxiosInstance.post(`${del.deleteCategory}`, {
        categoryId: categoryId,
      });
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getCategoryById = createAsyncThunk(
  "getCategory",
  async (categoryId, thunkAPI) => {
    try {
      if (categoryId) {
        const response = await AxiosInstance.get(
          `${get.getCategoryById}?categoryId=${categoryId}`
        );
        return response;
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);
export const addOpenSearchIndex = createAsyncThunk(
  "addOpenSearchIndex",
  async (indexData, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(
        `${post.createOpenSearchIndex}`,
        indexData
      );
      return response;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const deleteOpenSearchIndex = async (indexId) => {
  try {
    if (indexId) {
      const response = await AxiosInstance.post(
        `${del.deleteOpenSearchIndex}`,
        { indexId: indexId }
      );
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getOpenSearchIndexById = createAsyncThunk(
  "getOpenSearchIndex",
  async (indexId, thunkAPI) => {
    try {
      if (indexId) {
        const response = await AxiosInstance.get(
          `${get.getOpenSearchIndexById}?indexId=${indexId}`
        );
        return response;
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const addCommandCategory = async (commandCategoryData) => {
  try {
    const response = await AxiosInstance.post(
      post.createCommandCategory,
      commandCategoryData
    );
    return response;
  } catch (err) {
    console.error(
      "Error creating command category:",
      err?.response?.data || err.message
    );
    throw err;
  }
};

export const getCommandCategoryById = async (commandCategoryId) => {
  try {
    if (commandCategoryId) {
      const response = await AxiosInstance.get(
        `${get.getCommandCategoryById}?commandCategoryId=${commandCategoryId}`
      );
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};
export const getServerTypes = async () => {
  try {
    const response = await AxiosInstance.get(`${get.getServerTypes}`);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCommandCategory = async (commandCategoryId) => {
  try {
    if (commandCategoryId) {
      const response = await AxiosInstance.post(
        `${del.deleteCommandCategory}`,
        { commandCategoryId: commandCategoryId }
      );
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getOpenSearchIndex = async (queryParams) => {
  try {
    if (!queryParams?.jobId) {
      return { error: "jobId is required" };
    }
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await AxiosInstance.get(
      `${get.getOpenSearchIndex}?${queryString}`
    );
    return response.data.data || [];
  } catch (err) {
    console.error("Error fetching logs:", err);
    return { error: err.message };
  }
};

export const getOpenSearchIndexByRunId = async (queryParams) => {
  try {
    if (!queryParams?.jobId) {
      return { error: "jobId is required" };
    }
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await AxiosInstance.get(
      `${get.getOpenSearchIndexByRunId}?${queryString}`
    );
    return response || [];
  } catch (err) {
    console.error("Error fetching logs:", err);
    return { error: err.message };
  }
};

// export const fetchReportData = createAsyncThunk(
//   "handleListReports",
//   async (params = {}, thunkAPI) => {
//     // Accept params object
//     let url = `/report/handleListReports`;
//     const queryParams = new URLSearchParams();
//     console.log("paramsss=========>", params);
//     // Add search parameter if provided
//     if (params?.search) {
//       queryParams.append("searchText", params.search);
//     }

//     if (params?.categoriesSelected?.length) {
//       const categories = params?.categoriesSelected
//         .map((eachCategoryObj) => eachCategoryObj.optionName)
//         .join(",");
//       url += `categoryName=${categories}&`;
//     }

//     if (params?.tagsSelected && params?.tagsSelected?.length > 0) {
//       const tags = params.tagsSelected.join(",");
//       url += `tags=${tags}&`;
//     }

//     // Add type parameter if provided
//     if (params?.type) {
//       queryParams.append("type", encodeURIComponent(params.type));
//     }

//     // Combine all query parameters
//     if (queryParams.toString()) {
//       url += `?${queryParams.toString()}`;
//     }

//     try {
//       const response = await AxiosInstance.get(url);
//       return response;
//     } catch (err) {
//       console.log(err);
//       return thunkAPI.rejectWithValue({ error: err.message });
//     }
//   }
// );

// Get Report Tags
export const getReportTags = (searchText) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const getReportTags = "/report/getReportTags";
    let url = searchText
      ? `${getReportTags}?tagName=${searchText}`
      : getReportTags;
    const response = await axiosInstance.get(url);
    dispatch(fetchDataSuccess({ type: "reportTags", data: response.data }));
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch tags"));
    throw error;
  }
};

export const fetchReportData = createAsyncThunk(
  "handleListReports",
  async (params = {}, thunkAPI) => {
    let url = `/report/handleListReports`;

    const queryParams = new URLSearchParams();

    console.log("paramsss=========>", params);

    // 1. Search text
    if (params?.search) {
      queryParams.append("searchText", params.search);
    }

    // 2. Categories (expect array of strings: ["Network", "Security"])
    if (Array.isArray(params?.categories) && params.categories.length > 0) {
      // Backend likely expects comma-separated string
      queryParams.append("categoryName", params.categories.join(","));
    }

    // 3. Tags (expect array of strings: ["urgent", "weekly"])
    if (Array.isArray(params?.tags) && params.tags.length > 0) {
      queryParams.append("tags", params.tags.join(","));
    }

    // 4. Created By
    if (params.createdBy && params.createdBy.length > 0) {
      queryParams.append("createdBy", encodeURIComponent(params.createdBy));
    }
    if (params.recentFilter) {
      queryParams.append(
        "recentFilter",
        encodeURIComponent(params.recentFilter)
      );
    }

    // 5. Date Range - ADD THIS SECTION
    if (params?.startDate && params?.endDate) {
      queryParams.append("startDate", params.startDate);
      queryParams.append("endDate", params.endDate);
      console.log("Date range added to query params:", {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    }

    // 6. Type (if needed)
    if (params?.type) {
      queryParams.append("type", encodeURIComponent(params.type));
    }

    // Build final URL with query string
    const queryString = queryParams.toString();

    if (queryString) {
      url += `?${queryString}`;
    }

    console.log("Final URL with query params:", url); // Debug log

    try {
      const response = await AxiosInstance.get(url);
      return response;
    } catch (err) {
      console.error("Error fetching reports:", err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);
export const fetchGlobalReportData = createAsyncThunk(
  "handleGlobalListReports",
  async (params = {}, thunkAPI) => {
    let url = `/report/handleListReports`;
    const queryParams = new URLSearchParams();
    // Add search parameter if provided
    if (params?.search) {
      queryParams.append("searchText", params.search);
    }
    // 2. Categories (expect array of strings: ["Network", "Security"])
    if (Array.isArray(params?.categories) && params.categories.length > 0) {
      // Backend likely expects comma-separated string
      queryParams.append("categoryName", params.categories.join(","));
    }

    // 3. Tags (expect array of strings: ["urgent", "weekly"])
    if (Array.isArray(params?.tags) && params.tags.length > 0) {
      queryParams.append("tags", params.tags.join(","));
    }

    // 4. Created By
    if (params.createdBy && params.createdBy.length > 0) {
      queryParams.append("createdBy", encodeURIComponent(params.createdBy));
    }
    if (params.recentFilter) {
      queryParams.append(
        "recentFilter",
        encodeURIComponent(params.recentFilter)
      );
    }
    // 5. Date Range - ADD THIS SECTION
    if (params?.startDate && params?.endDate) {
      queryParams.append("startDate", params.startDate);
      queryParams.append("endDate", params.endDate);
      console.log("Date range added to query params:", {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    }
    // Add type parameter if provided
    if (params?.type) {
      queryParams.append("type", encodeURIComponent(params.type));
    }

    // Combine all query parameters
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    try {
      const response = await AxiosInstance.get(url);
      return response;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const saveOrUpdateReport = createAsyncThunk(
  "saveOrUpdateReport",
  async (reportData, thunkAPI) => {
    try {
      if (reportData) {
        const response = await AxiosInstance.post(
          `/report/handleReport`,
          reportData
        );
        return response.data;
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const deleteReport = async (reportId) => {
  try {
    if (reportId) {
      const response = await AxiosInstance.post(`/report/handleDeleteReport`, {
        reportId: reportId, // Make sure this matches exactly what your backend expects
      });
      // Return the entire response so you can check status codes
      return response;
    }
  } catch (err) {
    console.error("Error deleting report:", err);
    throw err;
  }
};

// Add this to your existing API calls in the file
export const getReportDefaultColumnOptions = createAsyncThunk(
  "reports/getDefaultColumns",
  async (reqObj, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(
        `/report/getReportDefaultColumnOptions`,
        reqObj
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching default column options:", err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);
export const getReportDefaultJobsOptions = createAsyncThunk(
  "reports/getDefaultJobs",
  async (params, thunkAPI) => {
    try {
      // Include params in the API request
      const response = await AxiosInstance.get(
        `/report/getReportDefaultJobsOptions`,
        { params } // Pass the parameters as query parameters
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching default Job options:", err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Updated getReportDefaultTagsOptions with parameters
export const getReportDefaultTagsOptions = createAsyncThunk(
  "reports/getDefaultTags",
  async (params, thunkAPI) => {
    try {
      // Include params in the API request
      const response = await AxiosInstance.get(
        `/report/getReportDefaultTagsOptions`,
        { params } // Pass the parameters as query parameters
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching default Tag options:", err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const getReportDetailsById = async ({
  reportId,
  pageNo = 1,
  pageSize = 3,
}) => {
  try {
    if (reportId) {
      const response = await AxiosInstance.get(
        `${get.getReportsDetails}?reportId=${reportId}&pageNo=${pageNo}&pageSize=${pageSize}`
      );
      return response.data;
    }
    throw new Error("Report ID is required");
  } catch (err) {
    console.error("Error fetching report details:", err);
    return null;
  }
};

export const publishGlobalReports = createAsyncThunk(
  "publishReport",
  async (reportId, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(`${post.publishReports}`, {
        reportId,
        publishType: "",
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);
export const publishGlobalReportsAsSystem = createAsyncThunk(
  "publishReportAsSystem",
  async (reportId, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(`${post.publishReports}`, {
        reportId,
        publishType: "system",
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);
export const authAction = async (data) => {
  try {
    return await AxiosInstance.post(`${authActionsPath.post.authaction}`, data);
  } catch (error) {
    return error.response;
  }
};
export const loginActionInsight = async (data) => {
  try {
    // return await AxiosAuthInstance.post(`/auth/login`, data);
    return await AxiosInstance.post(`auth/loginInsights`, data);
  } catch (error) {
    return error.response;
  }
};
export const getPermissionAction = createAsyncThunk(
  "getPermissionAction",
  async (params, thunkAPI) => {
    // let url = `auth/vs`;
    let url = `auth/getUserPermissions`;
    try {
      // const response = await AxiosAuthInstance.get(url);
      const response = await AxiosInstance.get(url);
      return response;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const authLogoutAction = async (data) => {
  try {
    return await AxiosInstance.post("/auth/authaction", data);
  } catch (error) {
    console.error("Authentication Error:", error);
    return error.response;
  }
};

export const getUsersList = async ({
  pageNo = 1,
  pageSize = 10,
  search = "",
}) => {
  try {
    let url = `${get.getUsersList}?`;

    if (pageNo) {
      url += `pageNo=${pageNo}&`;
    }
    if (pageSize) {
      url += `pageSize=${pageSize}&`;
    }

    if (search) {
      url += `searchValue=${search}`;
    }
    const response = await AxiosInstance.get(url);

    return response.data;
  } catch (err) {
    console.error("Error fetching users list:", err);
    throw err;
  }
};

//
export const bulkAgentAction = async (data) => {
  try {
    return await AxiosInstance.post(
      `${post.bulkAgentAction}?type=${data.type}`,
      data
    );
  } catch (error) {
    return error.response;
  }
};

export const getReportGlobalFilters = createAsyncThunk(
  "reports/getGlobalFilters",
  async (params = {}, thunkAPI) => {
    try {
      const response = await AxiosInstance.get(`/report/global-filters`, {
        params,
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching report global filters:", err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Add this function to your configService.js file
export const getFilteredSchedules = createAsyncThunk(
  "reports/getFilteredSchedules",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(
        `/report/filter-schedules`,
        filters
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching filtered schedules:", err);
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const exportReportData = createAsyncThunk(
  "reports/exportReportData",
  async (params, thunkAPI) => {
    try {
      console.log(" Export API called with params:", params);

      let reportId;
      let format = "excel";

      if (typeof params === "string") {
        reportId = params;
      } else if (typeof params === "object" && params !== null) {
        reportId = params.reportId || params.id;
        format = params.format || "excel";
      } else {
        throw new Error("Invalid parameters passed to exportReportData");
      }

      console.log(" Sending export request:", { reportId, format });

      const response = await AxiosInstance.post("/report/handleExportReport", {
        reportId,
        format,
      });

      console.log(" Export API response received");
      return response.data;
    } catch (error) {
      console.error(" Error exporting report:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      return thunkAPI.rejectWithValue({
        error: error.message,
        response: error.response?.data,
      });
    }
  }
);

export const deleteCmdbJob = async (table) => {
  try {
    if (table) {
      const response = await AxiosInstance.post(`${del.deleteCmdbJob}`, {
        table: table,
      });
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};
