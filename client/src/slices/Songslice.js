import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: null, 
  audioUrl:'',
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    setSongStatus(state, action) {
      state.status = action.payload;
    },
    setSongUrl(state, action) {
      state.audioUrl = action.payload;
    },
  },
});

export const { setSongStatus, setSongUrl } = songSlice.actions;

export default songSlice.reducer;
