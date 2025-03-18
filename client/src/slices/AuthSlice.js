import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem("token") || "";

const initialState = {
  status: token ? "authenticated" : null, 
  token:token,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus(state, action) {
      state.status = action.payload;
    },
    setAuthToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    removeToken(state) {
      localStorage.removeItem("token");
      return { ...state, token: "" };  // Ensure a new state object is returned
    },
  },
});

export const { setAuthStatus,  setAuthToken, removeToken } = AuthSlice.actions;
const AuthReducer = AuthSlice.reducer

export default AuthReducer;