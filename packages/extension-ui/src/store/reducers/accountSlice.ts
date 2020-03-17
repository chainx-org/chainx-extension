import { createSlice } from '@reduxjs/toolkit';
import {
  getAllAccounts,
  getCurrentChainxAccount
} from '@chainx/extension-ui/messaging';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
    currentAccount: null
  },
  reducers: {
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
    setCurrentAccount(state, action) {
      state.currentAccount = action.payload;
    }
  }
});

export const { setAccounts, setCurrentAccount } = accountSlice.actions;

export const fetchAllAccounts = isTestNet => async dispatch => {
  const accounts = await getAllAccounts(isTestNet);
  dispatch(setAccounts(accounts));
};

export const fetchCurrentChainXAccount = isTestNet => async dispatch => {
  const account = await getCurrentChainxAccount(isTestNet);
  dispatch(setCurrentAccount(account));
};

export const accountsSelector = state => state.account.accounts;
export const currentAccountSelector = state => state.account.currentAccount;

export default accountSlice.reducer;
