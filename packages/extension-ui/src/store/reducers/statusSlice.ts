import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false,
    initLoading: true,
    showAccountMenu: false,
    showNodeMenu: false,
    showAccountAction: false,
    fetchAssetLoading: false,
    showImportMenu: false,
    importedKeystore: null
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
    },
    setShowAccountAction: (state, action) => {
      state.showAccountAction = action.payload;
    },
    setFetchAssetLoading: (state, { payload }) => {
      state.fetchAssetLoading = payload;
    },
    setShowImportMenu: (state, { payload }) => {
      state.showImportMenu = payload;
    },
    setImportedKeystore(state, { payload }) {
      state.importedKeystore = payload;
    }
  }
});

export const {
  setLoading,
  setInitLoading,
  setShowAccountMenu,
  setShowNodeMenu,
  setShowAccountAction,
  setFetchAssetLoading,
  setShowImportMenu,
  setImportedKeystore
} = statusSlice.actions;

export default statusSlice.reducer;
export const showAccountMenuSelector = state => state.status.showAccountMenu;
export const showNodeMenuSelector = state => state.status.showNodeMenu;
export const showAccountActionSelector = state =>
  state.status.showAccountAction;
export const fetchAssetLoadingSelector = state =>
  state.status.fetchAssetLoading;
export const showImportMenuSelector = state => state.status.showImportMenu;
export const importedKeystoreSelector = state => state.status.importedKeystore;
