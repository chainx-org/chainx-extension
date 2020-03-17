import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false,
    initLoading: true,
    showAccountMenu: false,
    showNodeMenu: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInitLoading: (state, action) => {
      state.initLoading = action.payload;
    },
    setShowAccountMenu: (state, action) => {
      state.showAccountMenu = action.payload;
    },
    setShowNodeMenu: (state, action) => {
      state.showNodeMenu = action.payload;
    }
  }
});

export const {
  setLoading,
  setInitLoading,
  setShowAccountMenu,
  setShowNodeMenu
} = statusSlice.actions;

export default statusSlice.reducer;
export const showAccountMenuSelector = state => state.status.showAccountMenu;
export const showNodeMenuSelector = state => state.status.showNodeMenu;
