import { createSlice } from '@reduxjs/toolkit';
import { getSettings } from '@chainx/extension-ui/messaging';

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

export const fetchNetwork = () => async dispatch => {
  const settings = await getSettings();
  dispatch(setIsTestNet(settings.isTestNet));
};

export const { setIsTestNet } = networkSlice.actions;
export const isTestNetSelector = state => state.network.isTestNet;

export default networkSlice.reducer;
