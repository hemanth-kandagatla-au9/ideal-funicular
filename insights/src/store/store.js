import { configureStore } from '@reduxjs/toolkit'
import serviceReducer from './slice'
import jobsReducer from './JobSlice/jobsSlice';
import reportReducer from './ReportSlice/ReportSlice';
import templateSlice from './TemplateSlice/templateSlice'
export const store = configureStore({
  reducer: {
    services: serviceReducer,
    jobs: jobsReducer,
    reports: reportReducer,
    templates:templateSlice
  },
})

store.subscribe(() => {
  // console.log("store---",store)
});