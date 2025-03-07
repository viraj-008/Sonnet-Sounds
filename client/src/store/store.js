import { configureStore } from '@reduxjs/toolkit';
import songReducer from '../slices/Songslice.js'
import AuthReducer from '../slices/AuthSlice.js';

const store = configureStore({
  reducer: {
    song: songReducer,
    auth:AuthReducer ,
  },
});

export default store;
