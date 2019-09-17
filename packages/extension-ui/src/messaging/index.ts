import {
  getAllChainxNodes,
  setChainxCurrentAccount,
  getCurrentChainxAccount,
  removeChainxAccount,
  setChainxNode,
  addChainxNode,
  getCurrentChainxNode,
  removeChainxNode,
  createChainxNode,
  signMessage,
  exportChainxAccountPrivateKey,
  getAllAccounts,
  createAccount,
  createAccountFromPrivateKey
} from './popup';

import { signTransaction, getToSign, rejectSign } from './notification';

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
  signMessage,
  exportChainxAccountPrivateKey,
  getAllAccounts,
  createAccount,
  createAccountFromPrivateKey,
  signTransaction,
  getToSign,
  rejectSign
};
