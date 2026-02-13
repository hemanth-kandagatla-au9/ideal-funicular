import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  config: [],
  error: null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    fetchConfigStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchConfigSuccess(state, action) {
      state.loading = false;
      state.config = action.payload.data;
    },
    fetchConfigFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateConfigSuccess(state, action) {
      state.loading = false;
      state.config = action.payload;
    },
  },
});

export const {
  fetchConfigStart,
  fetchConfigSuccess,
  fetchConfigFailure,
  updateConfigSuccess,
} = configSlice.actions;

export default configSlice.reducer;