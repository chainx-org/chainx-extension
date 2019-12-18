import {
  addChainxNode,
  createAccount,
  createAccountFromPrivateKey,
  createChainxNode,
  getAllAccounts,
  getAllChainxNodes,
  getCurrentChainxAccount,
  getCurrentChainxNode,
  removeChainxAccount,
  removeChainxNode,
  setChainxCurrentAccount,
  setChainxNode,
  setNetwork,
  getSettings
} from './popup';

import { getToSign, rejectSign, signTransaction } from './notification';

export {
  getAllChainxNodes,
  setChainxCurrentAccount,
  getCurrentChainxAccount,
  removeChainxAccount,
  setChainxNode,
  addChainxNode,
  getCurrentChainxNode,
  removeChainxNode,
  createChainxNode,
  getAllAccounts,
  createAccount,
  createAccountFromPrivateKey,
  signTransaction,
  getToSign,
  rejectSign,
  setNetwork,
  getSettings
};
