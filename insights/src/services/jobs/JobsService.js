import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  addJobSuccess,
  deleteJobSuccess,
  fetchInternalJobsStart,
  fetchInternalJobsSuccess,
  fetchInternalJobsFailure,
  fetchRequestStatusSuccess,
  fetchRequestStatusFailure,
  fetchRequestStatusStart,
  fetchApprovalRequestsFailure,
  fetchApprovalRequestsSuccess,
  fetchApprovalRequestsStart,
  approveRejectRequestStart,
  approveRejectRequestSuccess,
  approveRejectRequestFailure,
  bulkActionFailure,
  bulkActionSuccess,
  bulkActionStart,
  fetchUserConfigurationsStart,
  fetchUserConfigurationsFailure,
  saveUserConfigStart,
  saveUserConfigSuccess,
  saveUserConfigFailure,
  savePublishAsSystemStart,
  savePublishAsSystemSuccess,
  fetchPublishAsSytemConfigurationsStart,
  fetchSapFactsColumnsConfigRequest,
  fetchSapFactsColumnsConfigSuccess,
  fetchSapFactsColumnsConfigFailure,
  saveCmdbConfigurationStart,
  saveCmdbConfigurationSuccess,
  fetchCmdbConfigurationsStart,
} from "../../store/JobSlice/jobsSlice";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchConfigFailure,
  fetchConfigStart,
  fetchConfigSuccess,
  updateConfigSuccess,
} from "../../store/ConfigSlice/ConfigSlice";
import Cookies from "universal-cookie";

const { post, get, del } = Config.apiEndpoints.jobs;
const cookies = new Cookies();
const loggedInUser = cookies.get("username")?.toLowerCase() ?? "";
const token = getLocalAccessToken();
export const axiosInstance = new AxiosInstanceClass(
  `${
    process.env.REACT_APP_BACKEND_URL
      ? process.env.REACT_APP_BACKEND_URL
      : "http://localhost:3001"
  }`
).init(token);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response?.data?.message === "Session Expired") {
      sessionStorage.clear();
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  }
);

//  fetchAllWorkflows:
export const fetchAllWorkflows =
  (params = {}) =>
  async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      const queryString = new URLSearchParams(params).toString();

      // Since your route is in authController, call it through /auth/
      const url = `/auth/api/insights/workflows${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Calling workflows endpoint:", url);

      const response = await axiosInstance.get(url);

      console.log("Workflows received:", response.data);

      dispatch(
        fetchDataSuccess({
          type: "workflows",
          data: response.data.data,
          pagination: response.data.pagination,
          totalCount: response.data.totalCount,
        })
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching workflows:", error);
      dispatch(fetchDataFailure(error.message || "Failed to fetch workflows"));
      throw error;
    }
  };

export const getJobs =
  (
    searchText,
    sortBy,
    categoriesSelected,
    categoryTypesSelected,
    currentPage,
    itemsPerPage,
    tagsSelected,
    TargetOptionsSelected,
    hostOptionsSelected,
    frequencyOptionsSelected,
    jobStatusType,
    createdBy,
    actionType
  ) =>
  async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      let url = `${get.getJobs}?`;

      if (searchText) {
        url += `searchJob=${encodeURIComponent(searchText)}&`;
      }

      if (loggedInUser) {
        url += `loggedInUser=${encodeURIComponent(loggedInUser)}&`;
      }

      if (sortBy === "created_date") {
        url += `sortByCreatedDate=-1&`;
      } else if (sortBy === "description") {
        url += `sortByJobDescription=1&`;
      } else if (sortBy === "category_type") {
        url += `sortByCategoryType=1&`;
      } else if (sortBy === "category") {
        url += `sortByCategory=1&`;
      }

      if (categoriesSelected?.length) {
        const categories = categoriesSelected
          .map((eachCategoryObj) => eachCategoryObj.optionName)
          .join(",");
        url += `categoryName=${categories}&`;
      }

      if (categoryTypesSelected?.length) {
        const categoryTypes = categoryTypesSelected
          .map((eachObj) => eachObj.optionName)
          .join(",");
        url += `categoryType=${categoryTypes}&`;
      }

      if (currentPage && itemsPerPage) {
        url += `pageNo=${currentPage}&pageSize=${itemsPerPage}&`;
      }

      if (tagsSelected && tagsSelected?.length > 0) {
        const tags = tagsSelected.join(",");
        url += `tags=${tags}&`;
      }

      if (TargetOptionsSelected && TargetOptionsSelected?.length > 0) {
        const Targets = TargetOptionsSelected.map(
          (eachObj) => eachObj.optionName
        ).join(",");
        url += `target=${Targets}&`;
      }

      if (hostOptionsSelected && hostOptionsSelected.length > 0) {
        const hosts = hostOptionsSelected
          .map((eachObj) => eachObj.optionName)
          .join(",");
        url += `hostname=${hosts}&`;
      }

      if (frequencyOptionsSelected && frequencyOptionsSelected.length > 0) {
        const frequency = frequencyOptionsSelected
          .map((eachObj) => eachObj.optionName)
          .join(",");
        url += `frequencies=${frequency}&`;
      }
      if (createdBy && createdBy.length > 0) {
        url += `createdBy=${encodeURIComponent(createdBy)}&`;
        console.log("Sending createdBy filter:", createdBy);
      }
      if (actionType && actionType.length > 0) {
        url += `actionType=${actionType}&`;
        console.log("Sending actionType filter:", actionType);
      }
      if (jobStatusType) {
        //  const jobStatus= jobStatusType===act
        url += `jobStatus=${jobStatusType}`;
      }

      // Remove trailing '&' if exists
      if (url.endsWith("&")) {
        url = url.slice(0, -1);
      }

      const response = await axiosInstance.get(url);
      dispatch(
        fetchDataSuccess({
          type: "jobs",
          data: response.data.data,
          totalCount: response.data.pagination.totalCount || 0,
        })
      );
      return response;
    } catch (error) {
      dispatch(fetchDataFailure(error.message || "Failed to fetch jobs"));
      throw error;
    }
  };

export const getJobFilterOptions =
  (
    searchText,
    sortBy,
    categoriesSelected,
    categoryTypesSelected,
    currentPage,
    itemsPerPage,
    tagsSelected,
    TargetOptionsSelected,
    hostOptionsSelected,
    frequencyOptionsSelected,
    jobStatusType,
    createdBy,
    actionType,
    recentFilter
  ) =>
  async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      let url = `${get.getJobFilterOptions}?`;

      if (searchText) {
        url += `searchJob=${encodeURIComponent(searchText)}&`;
      }

      if (loggedInUser) {
        url += `loggedInUser=${encodeURIComponent(loggedInUser)}&`;
      }

      if (sortBy === "created_date") {
        url += `sortByCreatedDate=-1&`;
      } else if (sortBy === "description") {
        url += `sortByJobDescription=1&`;
      } else if (sortBy === "category_type") {
        url += `sortByCategoryType=1&`;
      } else if (sortBy === "category") {
        url += `sortByCategory=1&`;
      }

      if (categoriesSelected?.length) {
        const categories = categoriesSelected
          .map((eachCategoryObj) => eachCategoryObj.optionName)
          .join(",");
        url += `categoryName=${categories}&`;
      }

      if (categoryTypesSelected?.length) {
        const categoryTypes = categoryTypesSelected
          .map((eachObj) => eachObj.optionName)
          .join(",");
        url += `categoryType=${categoryTypes}&`;
      }

      if (currentPage && itemsPerPage) {
        url += `pageNo=${currentPage}&pageSize=${itemsPerPage}&`;
      }

      if (tagsSelected && tagsSelected?.length > 0) {
        const tags = tagsSelected.join(",");
        url += `tags=${tags}&`;
      }

      if (TargetOptionsSelected && TargetOptionsSelected?.length > 0) {
        const Targets = TargetOptionsSelected.map(
          (eachObj) => eachObj.optionName
        ).join(",");
        url += `target=${Targets}&`;
      }

      if (hostOptionsSelected && hostOptionsSelected.length > 0) {
        const hosts = hostOptionsSelected
          .map((eachObj) => eachObj.optionName)
          .join(",");
        url += `hostname=${hosts}&`;
      }

      if (frequencyOptionsSelected && frequencyOptionsSelected.length > 0) {
        const frequency = frequencyOptionsSelected
          .map((eachObj) => eachObj.optionName)
          .join(",");
        url += `frequencies=${frequency}&`;
      }
      if (createdBy && createdBy.length > 0) {
        url += `createdBy=${encodeURIComponent(createdBy)}&`;
        console.log("Sending createdBy filter:", createdBy);
      }
      if (actionType && actionType.length > 0) {
        url += `actionType=${actionType}&`;
        console.log("Sending actionType filter:", actionType);
      }
      if (recentFilter) {
        url += `recentFilter=${recentFilter}&`;
      }
      if (jobStatusType) {
        //  const jobStatus= jobStatusType===act
        url += `jobStatus=${jobStatusType}`;
      }

      // Remove trailing '&' if exists
      if (url.endsWith("&")) {
        url = url.slice(0, -1);
      }

      const response = await axiosInstance.get(url);
      dispatch(
        fetchDataSuccess({
          type: "jobsFilterOptions",
          data: response.data.data,
        })
      );
      return response;
    } catch (error) {
      dispatch(fetchDataFailure(error.message || "Failed to fetch jobs"));
      throw error;
    }
  };

export const getScheduleDescriptions = () => async (dispatch) => {
  dispatch(fetchDataStart());
  const url = get.getScheduleDescriptions;
  try {
    const response = await axiosInstance.get(url);
    let responseData = dispatch(fetchDataSuccess(response?.data?.data));
    return responseData;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch data"));
    throw error;
  }
};

// Add a new job
export const addJob = (jobData) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axiosInstance.post(post.createJob, jobData);
    dispatch(addJobSuccess(response.data));
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to add job"));
    throw error;
  }
};

// Get hosts list

export const getHosts = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = get.getHosts;
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    } else if (query && typeof query === "string") {
      url += `${query}`;
    }

    const response = await axiosInstance.get(url);
    dispatch(fetchDataSuccess({ type: "hosts", data: response.data.data }));
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch hosts"));
    throw error;
  }
};
// Get hosts list

export const getSapFactHosts = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = get.getSapFactHosts;
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    } else if (query && typeof query === "string") {
      url += `${query}`;
    }

    const response = await axiosInstance.get(url);
    dispatch(fetchDataSuccess({ type: "hosts", data: response.data.data }));
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch hosts"));
    throw error;
  }
};

// Get categories
export const getCategories = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = query ? `${get.getCategories}${query}` : get.getCategories;
    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({ type: "categories", data: response.data.data })
    );
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch categories"));
    throw error;
  }
};
// Get categories
export const getCategoriesFilterOptions = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = query
      ? `${get.getCategoriesFilterOptions}${query}`
      : get.getCategoriesFilterOptions;
    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({ type: "categories", data: response.data.data })
    );
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch categories"));
    throw error;
  }
};

export const fetchApprovalFlowConfigs = (query) => async (dispatch) => {
  console.log("query", new URLSearchParams(query).toString());
  let queryData = new URLSearchParams(query).toString();
  dispatch(fetchDataStart());
  try {
    const response = await axiosInstance.get(
      `${get.getApprovalFlowConfigs}?${queryData}`
    );
    console.log("approvalConfig response", response);
    dispatch(
      fetchDataSuccess({ type: "approvalConfig", data: response.data.data })
    );
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch categories"));
    throw error;
  }
};

// Get IAM Groups
export const getIAMGroups = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.getIAMGroups
    );
    console.log("getIAMGroups response", response);
    dispatch(fetchDataSuccess({ type: "IAMGroups", data: response.data.data }));
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch IAM Groups"));
    throw error;
  }
};

export const handleApprovalFlowConfig = (configData) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let response;

    if (configData._id) {
      // Update existing approval flow config
      response = await axiosInstance.post(
        Config.apiEndpoints.approvals.post.createUpdateApprovalFlowConfig,
        configData
      );
    } else {
      // Create new approval flow config
      response = await axiosInstance.post(
        Config.apiEndpoints.approvals.post.createUpdateApprovalFlowConfig,
        configData
      );
    }

    if (response.data && response.data.success) {
      // After successful creation/update, fetch the updated list
      dispatch(fetchApprovalFlowConfigs(""));
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Failed to save approval flow configuration"
      );
    }
  } catch (error) {
    console.error("Error handling approval flow config:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      fetchDataFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to save approval flow configuration"
      )
    );
    throw error;
  }
};

// Get tags
export const getTags = (searchText) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = searchText ? `${get.getTags}?tagName=${searchText}` : get.getTags;
    const response = await axiosInstance.get(url);
    dispatch(fetchDataSuccess({ type: "tags", data: response.data.data }));
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch tags"));
    throw error;
  }
};

// Get host details
export const getHostDetail =
  (jobId, currentPage, itemsPerPage, status) => async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      let url = `${get.getHostDetail}?`;

      if (jobId) {
        url += `jobId=${jobId}&`;
      }

      if (currentPage) {
        url += `pageNo=${currentPage}&`;
      }

      if (itemsPerPage) {
        url += `pageSize=${itemsPerPage}&`;
      }
      if (status && status !== "All") {
        url += `status=${status}&`;
      }

      // Remove trailing '&' if exists
      if (url.endsWith("&")) {
        url = url.slice(0, -1);
      }

      const response = await axiosInstance.get(url);
      dispatch(
        fetchDataSuccess({ type: "jobDetail", data: response.data.data })
      );
      return response;
    } catch (error) {
      dispatch(
        fetchDataFailure(error.message || "Failed to fetch host details")
      );
      throw error;
    }
  };

// Get Sap Facts Filter Options
export const getSapFactsFilterOptions = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = get.getHostFilterOptions;
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    } else if (query && typeof query === "string") {
      url += `${query}`;
    }
    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({
        type: "sapFactsFilterOptions",
        data: response.data.data,
      })
    );
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(
        error.message || "Failed to fetch sap facts filter options"
      )
    );
    throw error;
  }
};

// Get targets
export const getTargets = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = query ? `${get.getTargets}${query}` : get.getTargets;
    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({ type: "targets", data: response.data.targets })
    );
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch targets"));
    throw error;
  }
};

// Get frequencies
export const getFrequency = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axiosInstance.get(get.getFrequencies);
    dispatch(
      fetchDataSuccess({ type: "frequencies", data: response.data.data })
    );
    return response;
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch frequencies"));
    throw error;
  }
};

// Delete a job
export const deleteJob = (jobId) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    if (jobId) {
      const response = await axiosInstance.post(del.deleteJob, {
        jobID: jobId,
      });
      dispatch(deleteJobSuccess(jobId));
      return response;
    }
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to delete job"));
    throw error;
  }
};

// Get jobs by tags
export const getJobsByTags =
  (
    tagsViewSearch,
    tagsViewSort,
    tagsViewTagsSelected,
    currentPage,
    itemsPerPage
  ) =>
  async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      let url = `${get.getJobsByTags}?`;

      if (tagsViewSearch) {
        url += `searchJob=${tagsViewSearch}&`;
      }

      if (tagsViewSort === "tagsdes") {
        url += `sortByTags=-1&`;
      } else if (tagsViewSort === "tagsasc") {
        url += `sortByTags=1&`;
      }

      if (currentPage && itemsPerPage) {
        url += `pageNo=${currentPage}&pageSize=${itemsPerPage}&`;
      }

      if (tagsViewTagsSelected && tagsViewTagsSelected?.length > 0) {
        const tags = tagsViewTagsSelected.join(",");
        url += `tags=${tags}&`;
      }

      // Remove trailing '&' if exists
      if (url.endsWith("&")) {
        url = url.slice(0, -1);
      }

      const response = await axiosInstance.get(url);
      dispatch(fetchDataSuccess({ type: "jobs", data: response.data.data }));
      return response;
    } catch (error) {
      dispatch(
        fetchDataFailure(error.message || "Failed to fetch jobs by tags")
      );
      throw error;
    }
  };

// Validate cron expression
export const validateCronExpression =
  (frequency, cronExp, jobStartDate, jobEndDate) => async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      if (frequency && cronExp) {
        const response = await axiosInstance.post(post.validateCronExpression, {
          frequency: frequency,
          cronExp: cronExp,
          jobStartDate: Date?.parse(jobStartDate),
          jobEndDate: Date?.parse(jobEndDate),
        });
        return response;
      }
    } catch (error) {
      dispatch(
        fetchDataFailure(error.message || "Failed to validate cron expression")
      );
      throw error;
    }
  };

// Get job by ID
export const getJobById = (jobId) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    if (jobId) {
      const response = await axiosInstance.get(
        `${get.getSingleJob}?jobId=${jobId}`
      );
      dispatch(
        fetchDataSuccess({ type: "jobDetail", data: response.data.data })
      );
      return response;
    }
  } catch (error) {
    dispatch(fetchDataFailure(error.message || "Failed to fetch job details"));
    throw error;
  }
};

export const getCommandCategory = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url;
    if (query) {
      url = `${Config.apiEndpoints.jobs.get.getCommandCategory}${query}`;
    } else {
      url = Config.apiEndpoints.jobs.get.getCommandCategory;
    }

    const response = await axiosInstance.get(url);

    dispatch(
      fetchDataSuccess({
        type: "commandCategories",
        data: response.data.data || response.data,
      })
    );

    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(error.message || "Failed to fetch command categories")
    );
    throw error;
  }
};

export const getLogFilters = (jobId) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const url = Config.apiEndpoints.jobs.get.getLogFilters;
    const response = await axiosInstance.get(`${url}?jobId=${jobId}`);
    if (response.data && response.data.flag === "success") {
      dispatch(
        fetchDataSuccess({
          type: "logFilters",
          data: {
            hostnames: response.data.hostnames || [],
            runAs: response.data.runAs || [],
            categoryName: response.data.categoryName || [],
            command: response.data.command || [],
            tags: response.data.tags || [],
            jobTags: response.data.jobTags || [],
            runId: response.data.runId || [],
          },
        })
      );
      return response;
    } else {
      throw new Error(response.data?.message || "Failed to fetch log filters");
    }
  } catch (error) {
    console.error("Error fetching log filters:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    dispatch(
      fetchDataFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch log filters"
      )
    );
    throw error;
  }
};

export const getDistinctOsTypes = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const url = Config.apiEndpoints.jobs.get.getDistinctOsTypes;
    const response = await axiosInstance.get(url);

    if (response.data && response.data.success) {
      dispatch(
        fetchDataSuccess({
          type: "osTypes",
          data: response.data.data || [],
        })
      );
      return response;
    } else {
      throw new Error(response.data?.message || "Failed to fetch OS types");
    }
  } catch (error) {
    console.error("Error fetching OS types:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    dispatch(
      fetchDataFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch OS types"
      )
    );
    throw error;
  }
};

// Get configuration
export const getConfig = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.appConfig
    );
    dispatch(
      fetchDataSuccess({
        type: "configSetting",
        data: response.data.data || response.data,
      })
    );
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(error.message || "Failed to fetch configuration")
    );
    throw error;
  }
};

// Update configuration
export const updateConfig = (configData) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const { _id, ...restData } = configData;
    const response = await axiosInstance.put(
      Config.apiEndpoints.jobs.put.appConfig,
      {
        _id,
        ...restData,
      }
    );
    dispatch(fetchDataSuccess(response.data));
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(error.message || "Failed to update configuration")
    );
    throw error;
  }
};

export const getInternalJobs =
  (pageNo = 1, pageSize = 10, searchText = "") =>
  async (dispatch) => {
    dispatch(fetchInternalJobsStart());
    try {
      let url = `${Config.apiEndpoints.jobs.get.internalJobs}?pageNo=${pageNo}&pageSize=${pageSize}`;

      if (searchText) {
        url += `&jobName=${encodeURIComponent(searchText)}`;
      }

      const response = await axiosInstance.get(url);

      if (response.data && response.data.success) {
        dispatch(fetchInternalJobsSuccess(response.data.data));

        return {
          data: response.data.data,
          pagination: {
            totalCount: response.data.totalCount || 0,
            totalPage:
              response.data.pagination?.totalPage ||
              Math.ceil((response.data.totalCount || 0) / pageSize),
            currentPage: pageNo,
            pageSize: pageSize,
          },
        };
      } else {
        throw new Error(response.data?.message || "Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching internal jobs:", error);
      dispatch(
        fetchInternalJobsFailure(
          error.message || "Failed to fetch internal jobs"
        )
      );
      throw error;
    }
  };

export const handleInternalJob = (jobData) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const { internalJobId } = jobData;
    let response;

    if (internalJobId) {
      response = await axiosInstance.put(
        Config.apiEndpoints.jobs.put.internalJobs,
        jobData
      );
    } else {
      response = await axiosInstance.post(
        Config.apiEndpoints.jobs.post.internalJobs,
        jobData
      );
    }

    if (response.data && response.data.success) {
      dispatch(getInternalJobs());
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to save internal job");
    }
  } catch (error) {
    console.error("Error handling internal job:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      fetchDataFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to save internal job"
      )
    );
    throw error;
  }
};

export const deleteInternalJobs = async (internalJobId) => {
  try {
    if (internalJobId) {
      const response = await axiosInstance.delete(
        `${Config.apiEndpoints.jobs.del.deleteInternalJobs}`,
        { data: { internalJobId } }
      );
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const deleteAgentJob = async (jobName) => {
  try {
    if (jobName) {
      const response = await axiosInstance.delete(
        `${Config.apiEndpoints.jobs.del.deleteAgentJob}`,
        { data: { jobName } }
      );
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const deleteApprovalConfig = async (configId) => {
  try {
    if (configId) {
      const response = await axiosInstance.delete(
        `${Config.apiEndpoints.approvals.del.deleteApprovalConfig}`,
        { data: { configId } }
      );
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const executeAdhocJob = async (jobID) => {
  try {
    const response = await axiosInstance.post(post.executeAdhocJob, { jobID });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const getJobFilterValues = async () => {
  try {
    const response = await axiosInstance.get(get.getFilterValue);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const getJobDetailsByIdApi = async (id) => {
  try {
    const response = await axiosInstance.get(get.getSingleJob, {
      params: {
        jobId: id,
      },
    });
    return response.data;
  } catch (err) {
    console.log("Error fetching job details:", err);
  }
};

export const getRequestStatusList =
  (pageNo = 1, pageSize = 10, status, moduleType, recentFilter = "") =>
  async (dispatch) => {
    dispatch(fetchRequestStatusStart());
    try {
      let url = `${Config.apiEndpoints.approvals.get.requestStatusList}?pageNo=${pageNo}&pageSize=${pageSize}`;

      if (status) {
        url += `&status=${status}`;
      }
      if (moduleType) {
        url += `&moduleType=${moduleType}`;
      }
      if (recentFilter) {
        url += `&recentFilter=${recentFilter}`;
      }

      const response = await axiosInstance.get(url);
      console.log("response status", response);
      dispatch(
        fetchDataSuccess({
          type: "approvalStatus",
          data: response.data.data,
          pagination: response.data.pagination || {
            currentPage: parseInt(pageNo),
            pageSize: parseInt(pageSize),
            totalRecords: response.data.pagination?.totalRecords || 0,
            totalPages:
              response.data.pagination?.totalPages ||
              Math.ceil(
                (response.data.pagination?.totalRecords || 0) / pageSize
              ),
            hasNextPage:
              response.data.pagination?.hasNextPage ||
              parseInt(pageNo) <
                Math.ceil(
                  (response.data.pagination?.totalRecords || 0) / pageSize
                ),
            hasPreviousPage:
              response.data.pagination?.hasPreviousPage || parseInt(pageNo) > 1,
          },
        })
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching request status list:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      dispatch(
        fetchRequestStatusFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch request status list"
        )
      );
      // throw error;
    }
  };

export const getApprovalRequests =
  (
    pageNo = 1,
    pageSize = 10,
    status,
    moduleType,
    showDiff = false,
    recentFilter = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch(fetchApprovalRequestsStart());
      let url = `${Config.apiEndpoints.approvals.get.approvalRequests}?pageNo=${pageNo}&pageSize=${pageSize}`;

      if (status) {
        url += `&status=${status}`;
      }
      if (moduleType) {
        url += `&moduleType=${moduleType}`;
      }
      if (showDiff) {
        url += `&showDiff=true`;
      }
      if (recentFilter) {
        url += `&recentFilter=${recentFilter}`;
      }
      const response = await axiosInstance.get(url);

      dispatch(
        fetchDataSuccess({
          type: "approvalRequest",
          data: response.data.data.map((flow, index) => ({
            ...flow,
            id: flow._id || `flow-${index}`,
            index: index,
          })),
          pagination: response.data.pagination || {
            currentPage: parseInt(pageNo),
            pageSize: parseInt(pageSize),
            totalRecords: response.data.totalCount || 0,
            totalPages: Math.ceil((response.data.totalCount || 0) / pageSize),
            hasNextPage:
              parseInt(pageNo) <
              Math.ceil((response.data.totalCount || 0) / pageSize),
            hasPreviousPage: parseInt(pageNo) > 1,
          },
        })
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching approval requests:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      dispatch(
        fetchApprovalRequestsFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch approval requests"
        )
      );
      // throw error;
    }
  };

export const handleApproveRejectRequest = (requestData) => async (dispatch) => {
  dispatch(approveRejectRequestStart());
  try {
    const { requestId, action, rejectionReason } = requestData;

    const response = await axiosInstance.post(
      Config.apiEndpoints.approvals.post.approveRejectRequest,
      { requestId, action, rejectionReason }
    );

    if (response.data && response.data.success) {
      dispatch(
        approveRejectRequestSuccess({
          requestId,
          action,
          rejectionReason,
          username: response.data.username || "system",
        })
      );

      // Refresh the approval requests list after processing
      // You can modify these parameters as needed
      dispatch(getApprovalRequests());

      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Failed to process approval request"
      );
    }
  } catch (error) {
    console.error("Error handling approval/rejection:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      approveRejectRequestFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to process approval request"
      )
    );
    throw error;
  }
};

export const handleBulkApproveReject = (requestData) => async (dispatch) => {
  dispatch(bulkActionStart());
  try {
    const response = await axiosInstance.post(
      Config.apiEndpoints.approvals.post.bulkApproveReject,
      requestData
    );

    if (response.data && response.data.success) {
      dispatch(bulkActionSuccess());
      dispatch(getApprovalRequests());
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Failed to process bulk action"
      );
    }
  } catch (error) {
    console.error("Error in bulk approve/reject:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      bulkActionFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to process bulk approve/reject"
      )
    );
    throw error;
  }
};

export const getUserConfigurations = () => async (dispatch) => {
  dispatch(fetchUserConfigurationsStart());
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.userConfiguration
    );

    dispatch(
      fetchDataSuccess({
        type: "userConfigurations",
        data: response.data.data || response.data,
      })
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user configurations:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      fetchUserConfigurationsFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user configurations"
      )
    );
    throw error;
  }
};

export const saveUserConfigurations = (configurations) => async (dispatch) => {
  dispatch(saveUserConfigStart());
  try {
    const response = await axiosInstance.post(
      Config.apiEndpoints.jobs.post.userConfiguration,
      { userList: configurations }
    );

    if (response.data && response.data.success) {
      dispatch(saveUserConfigSuccess(response.data.data || configurations));
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Failed to save configurations"
      );
    }
  } catch (error) {
    console.error("Error saving user configurations:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      saveUserConfigFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to save configurations"
      )
    );
    throw error;
  }
};

export const deleteUserConfiguration = async (userConfigId) => {
  try {
    if (userConfigId) {
      const response = await axiosInstance.delete(
        `${Config.apiEndpoints.jobs.del.deleteUserConfiguration}?id=${userConfigId}`
      );
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const handleJobAction = async (jobID, jobRunning, jobName) => {
  try {
    const response = await axiosInstance.post(post.handlejobRunning, {
      jobID,
      jobRunning,
      jobName,
    });
    return response.data;
  } catch (err) {
    console.error("API Error in handleJobAction", err);
    throw err;
  }
};

export const createCMDBSchedule =
  (requestData = {}) =>
  async (dispatch) => {
    dispatch(fetchDataStart());
    try {
      const { jobName, tableName } = requestData;

      const payload = {
        jobName,
        tableName,
      };

      const response = await axiosInstance.post(
        Config.apiEndpoints.jobs.post.createCMDBSchedule,
        payload
      );

      dispatch(
        fetchDataSuccess({
          type: "createCMDBSchedule",
          data: response.data.data,
        })
      );

      dispatch(getCMDBSchedules());

      return response;
    } catch (error) {
      dispatch(
        fetchDataFailure(
          error?.response?.data?.message ||
            error.message ||
            "Failed to create CMDB schedule"
        )
      );
      throw error;
    }
  };

export const getCMDBSchedules = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = get.getCMDBSchedules;
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    } else if (query && typeof query === "string") {
      url += `${query}`;
    }

    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({ type: "cmdbSchedules", data: response.data.data })
    );
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(error.message || "Failed to fetch CMDB schedules")
    );
    throw error;
  }
};

export const triggerCMDBSchedule = (tableName) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axiosInstance.get(
      `${get.triggerCMDBSchedule}?tableName=${tableName}`
    );
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(error.message || "Failed to trigger CMDB schedule")
    );
    throw error;
  }
};

export const getSystemPublishOptions = async () => {
  try {
    const response = await axiosInstance.get(`${get.getScheduleOptions}`);
    return response.data;
  } catch (err) {
    console.log("Error fetching system publish options:", err);
    throw err;
  }
};

export const getCMDBSchedulesLogs = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = get.getCMDBSchedulesLogs;
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    } else if (query && typeof query === "string") {
      url += `${query}`;
    }

    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({ type: "cmdbSchedulesLogs", data: response.data.data })
    );
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(error.message || "Failed to fetch CMDB schedules Logs")
    );
    throw error;
  }
};

export const getCMDBSchedulesLogsFilter = (query) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let url = get.getCMDBSchedulesLogsFilter;
    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    } else if (query && typeof query === "string") {
      url += `${query}`;
    }

    const response = await axiosInstance.get(url);
    dispatch(
      fetchDataSuccess({
        type: "cmdbSchedulesLogsFilter",
        data: response.data.data,
      })
    );
    return response;
  } catch (error) {
    dispatch(
      fetchDataFailure(
        error.message || "Failed to fetch CMDB schedules Logs Filter"
      )
    );
    throw error;
  }
};

export const getPublishAsSystemConfiguration = () => async (dispatch) => {
  dispatch(fetchPublishAsSytemConfigurationsStart());
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.publishAsSystemConfiguration
    );

    dispatch(
      fetchDataSuccess({
        type: "publishAsSystemConfigurations",
        data: response.data.data || response.data,
      })
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user configurations:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      fetchUserConfigurationsFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user configurations"
      )
    );
    throw error;
  }
};

export const savePublishAsSystemConfigurations =
  (configurations) => async (dispatch) => {
    dispatch(savePublishAsSystemStart());
    try {
      const response = await axiosInstance.post(
        Config.apiEndpoints.jobs.post.publishAsSystemConfiguration,
        { userList: configurations }
      );

      if (response.data && response.data.success) {
        dispatch(
          savePublishAsSystemSuccess(response.data.data || configurations)
        );
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to save configurations"
        );
      }
    } catch (error) {
      console.error("Error saving user configurations:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      dispatch(
        saveUserConfigFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to save configurations"
        )
      );
      throw error;
    }
  };

export const deletePublishAsSystem = async (publishAsSystemConfigId) => {
  try {
    if (publishAsSystemConfigId) {
      const response = await axiosInstance.delete(
        `${Config.apiEndpoints.jobs.del.deletePublishAsSystem}?id=${publishAsSystemConfigId}`
      );
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const syncSAPFactsCloumns = async () => {
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.syncSAPFactsCloumns
    );
    console.log("syncSAPFactsCloumns response => ", response);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getSapFactsColumns = () => async (dispatch) => {
  dispatch(fetchSapFactsColumnsConfigRequest());
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.getSapFactsColumns
    );
    console.log("getSapFactsColumns response => ", response);
    dispatch(
      fetchSapFactsColumnsConfigSuccess({
        type: "sapFactsColumnsConfig",
        data: response.data.data || response.data,
      })
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching SAP Facts columns config:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      fetchSapFactsColumnsConfigFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch SAP Facts columns config"
      )
    );
    throw error;
  }
};

export const updateSapFactsColumns = async (payload) => {
  try {
    const response = await axiosInstance.put(
      Config.apiEndpoints.jobs.put.updateSapFactsColumns,
      payload
    );
    console.log("updateSapFactsColumns response => ", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCmdbConfiguration = () => async (dispatch) => {
  dispatch(fetchCmdbConfigurationsStart());
  try {
    const response = await axiosInstance.get(
      Config.apiEndpoints.jobs.get.cmdbConfiguration
    );

    dispatch(
      fetchDataSuccess({
        type: "cmdbConfigurations",
        data: response.data.data || response.data,
      })
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user configurations:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      fetchUserConfigurationsFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user configurations"
      )
    );
    throw error;
  }
};

export const saveCmdbConfigurations = (configurations) => async (dispatch) => {
  dispatch(saveCmdbConfigurationStart());
  try {
    const response = await axiosInstance.post(
      Config.apiEndpoints.jobs.post.cmdbConfiguration,
      { userList: configurations }
    );

    if (response.data && response.data.success) {
      dispatch(
        saveCmdbConfigurationSuccess(response.data.data || configurations)
      );
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Failed to save configurations"
      );
    }
  } catch (error) {
    console.error("Error saving user configurations:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    dispatch(
      saveUserConfigFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to save configurations"
      )
    );
    throw error;
  }
};

export const deleteCMDBConfiguration = async (cmdbConfigurationConfigId) => {
  try {
    if (cmdbConfigurationConfigId) {
      const response = await axiosInstance.delete(
        `${Config.apiEndpoints.jobs.del.deleteCMDBConfiguration}?id=${cmdbConfigurationConfigId}`
      );
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const getCmdbConfigurationOptions = async () => {
  try {
    const response = await axiosInstance.get(
      `${get.getCmdbConfigurationOptions}`
    );
    return response.data;
  } catch (err) {
    console.log("Error fetching system publish options:", err);
    throw err;
  }
};

export const exportSAPFactsData = createAsyncThunk(
  "jobs/exportSAPFactsData",
  async (exportParams, thunkAPI) => {
    try {
      console.log("Exporting SAP Facts data with params:", exportParams);

      const response = await axiosInstance.post(
        `${post.handleExportSapFacts}`,
        exportParams
      );

      console.log("Export API response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error exporting SAP Facts data:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
