import { createSlice } from '@reduxjs/toolkit';

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    isTestNet: false
  },
  reducers: {
    setIsTestNet(state, action) {
      state.isTestNet = action.payload;
    }
  }
});

export const { setIsTestNet } = networkSlice.actions;
export const isTestNetSelector = state => state.network.isTestNet;

export default networkSlice.reducer;
