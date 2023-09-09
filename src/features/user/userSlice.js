import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import customFetch,{checkForUnauthorizedResponse} from '../../utils/axios';
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '../../utils/localStorage';
import { clearAllJobsState } from '../allJobs/allJobsSlice'
import { clearValues } from '../job/jobSlice'

const initialState ={
    isLoading: false,
    isSidebarOpen: false,
    user: getUserFromLocalStorage(),
}
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async(user, thunkAPI)=>{
    try {
        const resp = await customFetch.post('/auth/register',user)
       return resp.data
    } catch (error) {
     return thunkAPI.rejectWithValue(error.response.data.msg);
    }
    }
);
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.post('/auth/login', user)
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)
export const updateUser = createAsyncThunk('user/updateUser',
 async(user, thunkAPI)=>{
 try {
   const resp = await customFetch.patch('/auth/updateUser', user
  //  {
  //    headers: {
  //      authorization: `Bearer ${thunkAPI.getState().user.user.token} `,
  //    },
  //  }  // we don't need this because we using interceptor in customFetch
   )
   return resp.data
 } catch (error) {
  
    return checkForUnauthorizedResponse(error, thunkAPI)
 }
})

export const clearStore = createAsyncThunk('user/clearStore',
async(message, thunkAPI)=>{
  try {
    //logout user
    thunkAPI.dispatch(logoutUser(message));
    // clear jobs value
    thunkAPI.dispatch(clearAllJobsState());
    //clear job input values
    thunkAPI.dispatch(clearValues());
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
}
)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    logoutUser: (state, { payload }) => {
      state.user = null
      state.isSidebarOpen = false
      removeUserFromLocalStorage()
      if (payload) {
        toast.success(payload)
      }
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      // in the payload we going to get whatever( resp.data)
      //   we returning from registerUser axios
      const { user } = payload
      state.isLoading = false
      state.user = user
      addUserToLocalStorage(user)
      toast.success(`Hello There ${user.name}`)
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false
      toast.error(payload)
    },

    [loginUser.pending]: (state) => {
      state.isLoading = true
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      // in the payload we going to get whatever( resp.data)
      //   we returning from loginUser axios
      const { user } = payload
      state.isLoading = false
      state.user = user
      addUserToLocalStorage(user)
      toast.success(`Welcome back  ${user.name}`)
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false
      toast.error(payload)
    },
    [updateUser.pending]: (state) => {
      state.isLoading = true
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      const { user } = payload
      state.isLoading = false
      state.user = user
      addUserToLocalStorage(user)
      toast.success(`User updated!`)
    },
    [updateUser.rejected]: (state, { payload }) => {
      state.isLoading = false
      toast.error(payload)
    },
    [clearStore.rejected]: () => {
      toast.error('There was an error')
    },
  },
})
export const { toggleSidebar, logoutUser } = userSlice.actions
export default userSlice.reducer;