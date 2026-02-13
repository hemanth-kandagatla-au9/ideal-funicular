import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../services/configurations/configService";

const initialState = {
  codeSnippetData: [],
  loading: false,
  error: null,
};

export const getPythonSnippet = createAsyncThunk(
  "codeSnippetSlice/getPythonSnippet",
  async (payload, thunkAPI) => {
    try {
      const response = await AxiosInstance.get("/code-snippet/python");
      return response.data;
    } catch (err) {
      console.error("Error fetching python snippet:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getBashSnippet = createAsyncThunk(
  "codeSnippetSlice/getBashSnippet",
  async (payload, thunkAPI) => {
    try {
      const response = await AxiosInstance.get("/code-snippet/bash");
      return response.data;
    } catch (err) {
      console.error("Error fetching python snippet:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getPowershellSnippet = createAsyncThunk(
  "codeSnippetSlice/getPowershellSnippet",
  async (payload, thunkAPI) => {
    try {
      const response = await AxiosInstance.get("/code-snippet/powershell");
      return response.data;
    } catch (err) {
      console.error("Error fetching powershell snippet:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const codeSnippetSlice = createSlice({
  name: "codeSnippetSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPythonSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPythonSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.templateData = action.payload;
      })
      .addCase(getPythonSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBashSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBashSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.templateData = action.payload;
      })
      .addCase(getBashSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default codeSnippetSlice.reducer;
