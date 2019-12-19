import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false,
    initLoading: true
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInitLoading: (state, action) => {
      state.initLoading = action.payload;
    }
  }
});

export const { setLoading, setInitLoading } = statusSlice.actions;

export default statusSlice.reducer;
