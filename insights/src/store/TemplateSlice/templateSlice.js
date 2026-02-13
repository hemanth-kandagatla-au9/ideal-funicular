import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosInstance } from "../../services/configurations/configService";
import { toast } from "react-toastify";

const initialState = {
  templateData: [],
  loading: false,
  error: null,
  templateTags: [],
};

const handleApiError = (error, thunkAPI) => {
  console.error("API Error:", error.response?.data || error.message);
  return thunkAPI.rejectWithValue({
    message: error.response?.data?.message || error.message,
    status: error.response?.status,
    data: error.response?.data,
  });
};

export const getTemplateDetails = createAsyncThunk(
  "templateSlice/getTemplateDetails",
  async (payload, thunkAPI) => {
    console.log("payload => ", payload);
    try {
      const url = `/market-execution/getMarketPlaceTemplate?templateId=${payload.templateId}&version=${payload.version}&isRestore=true&search=${payload.search}&templateType=${payload.templateType}&tags=${payload.tags}&createdBy=${payload.createdBy}&sort=${payload.sort}&status=${payload.status}&recentFilter=${payload.recentFilter}`;

      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getTemplateTags = createAsyncThunk(
  "templateSlice/getTemplateTags",
  async (searchText, thunkAPI) => {
    try {
      const baseUrl = "/market-execution/getTemplateTags";
      const url = searchText ? `${baseUrl}?tagName=${searchText}` : baseUrl;

      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const AddTemplateDetails = createAsyncThunk(
  "templateSlice/AddTemplateDetails",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosInstance.post(
        "/market-execution/createMarketPlaceTemplate",
        data
      );
      return response.data;
    } catch (err) {
      return handleApiError(err, thunkAPI);
    }
  }
);

export const DeleteTemplate = createAsyncThunk(
  "templateSlice/DeleteTemplateDetails",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosInstance.delete(
        `/market-execution/deleteMarketPlaceTemplate?templateId=${data.templateId}`
      );
      return response.data;
    } catch (err) {
      console.error("API error:", err.response);
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: err.message,
          status: err.response?.status,
        }
      );
    }
  }
);

export const EditTemplate = createAsyncThunk(
  "templateSlice/EditTemplateDetails",
  async (data, thunkAPI) => {
    try {
      const { templateVersion, ...payload } = data;

      const response = await AxiosInstance.put(
        `/market-execution/updateMarketPlaceTemplate?templateId=${data.templateId}&version=${templateVersion}`,
        payload
      );

      return response.data;
    } catch (err) {
      return handleApiError(err, thunkAPI);
    }
  }
);

export const getAllTemplateVersions = createAsyncThunk(
  "templateSlice/getAllTemplateVersions",
  async (templateId, thunkAPI) => {
    try {
      console.log("Fetching all template versions for:", templateId);
      const response = await AxiosInstance.get(
        `/market-execution/getAllTemplateVersions?templateId=${templateId}&allVersions=true`
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching template versions:", err);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// export const restoreTemplateVersion = createAsyncThunk(
//   "templateSlice/restoreTemplateVersion",
//   async ({ id, templateId, templateVersion }, thunkAPI) => {
//     try {
//       const response = await AxiosInstance.put(
//         "/market-execution/restoreTemplateVersion?restore=true",
//         { id, templateId, templateVersion }
//       );
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

export const restoreTemplateVersion = createAsyncThunk(
  "templateSlice/restoreTemplateVersion",
  async ({ id, templateId, templateVersion }, thunkAPI) => {
    try {
      const response = await AxiosInstance.put(
        `/market-execution/updateMarketPlaceTemplate?templateId=${templateId}&version=${templateVersion}&restore=true`,
        { id, templateId, templateVersion, isRestore: true }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getTemplateScheduleDetails = createAsyncThunk(
  "templates/getTemplateScheduleDetails",
  async (templateId, { rejectWithValue }) => {
    try {
      console.log("Fetching template schedule details for:", templateId);
      const response = await AxiosInstance.get(
        `/market-execution/getTemplateScheduleDetails?templateId=${templateId}&scheduleDetails=true`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching template schedule details:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const templateSlice = createSlice({
  name: "templateSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTemplateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.templateData = action.payload;
      })
      .addCase(getTemplateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTemplateTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateTags.fulfilled, (state, action) => {
        state.loading = false;
        state.templateTags = action.payload;
      })
      .addCase(getTemplateTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tags";
      })
      .addCase(AddTemplateDetails.fulfilled, (state, action) => {
        // toast.success("Template Created Successfully");
      })
      .addCase(AddTemplateDetails.rejected, (state, action) => {
        // toast.error("Failed to create template");
      })
      .addCase(DeleteTemplate.fulfilled, (state, action) => {
        // toast.success("Template Deleted Successfully");
      })
      .addCase(DeleteTemplate.rejected, (state, action) => {
        // toast.error("Failed to delete template")
      })
      .addCase(EditTemplate.fulfilled, (state, action) => {
        // toast.success("Template Updated Successfully");
      })
      .addCase(EditTemplate.rejected, (state, action) => {
        toast.error("Failed to Update the template");
      })
      .addCase(getTemplateScheduleDetails.pending, (state) => {
        // state.templateScheduleDetails.loading = true;
        // state.templateScheduleDetails.error = null;
      })
      .addCase(getTemplateScheduleDetails.fulfilled, (state, action) => {
        // state.templateScheduleDetails.loading = false;
        // state.templateScheduleDetails.data = action.payload.data;
        // state.templateScheduleDetails.error = null;
      })
      .addCase(getTemplateScheduleDetails.rejected, (state, action) => {
        // state.templateScheduleDetails.loading = false;
        // state.templateScheduleDetails.error = action.payload?.message || "Failed to fetch schedule details";
        // state.templateScheduleDetails.data = null;
      });
  },
});

export default templateSlice.reducer;
