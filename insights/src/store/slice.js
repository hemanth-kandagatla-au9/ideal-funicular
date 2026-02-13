import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs:[],
}

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    getJobsData:(state,action)=>{
        state.jobs = action.payload
    }   
  },
})

export const { getJobsData } = servicesSlice.actions

export default servicesSlice.reducer