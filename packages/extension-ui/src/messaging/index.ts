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
  signMessage
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
  signMessage,
  getAllAccounts,
  createAccount,
  createAccountFromPrivateKey,
  signTransaction,
  getToSign,
  rejectSign
};
