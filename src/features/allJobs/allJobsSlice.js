import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import customFetch from "../../utils/axios"
import { toast } from "react-toastify"




const initialFilterState ={
    search:'',
    searchStatus:'all',
    searchType:'all',
    sort:'latest',
    sortOptions:['latest','oldest', 'a-z','z-a'],

}
const initialState={
    
    isLoading:false,
    jobs:[],
    totalJobs: 0,
    numOfPages:1,
    page:1, 
    stats:{},
    monthlyApplication:[],
    ...initialFilterState,

}
const allJobsSlice = createSlice({
    name :'allJobs',
    initialState
})
export default allJobsSlice.reducer
