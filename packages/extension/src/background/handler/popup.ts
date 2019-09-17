import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_SIGN_MESSAGE,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_NODE_CREATE,
  CHAINX_NODE_ALL,
  CHAINX_ACCOUNT_SELECT,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_REMOVE,
  CHAINX_ACCOUNT_CREATE_FROM_PRIVATE,
  CHAINX_ACCOUNT_EXPORT_PRIVATE,
  CHAINX_NODE_SELECT,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_REMOVE
} from '@chainx/extension-defaults';
import { MessageRequest } from './types';
import {
  createChainxAccount,
  createChainxAccountFromPrivateKey,
  createChainxNode,
  exportPrivateKey,
  getAllChainxAccount,
  getAllChainxNodes,
  getChainxCurrentNode,
  getCurrentChainxAccount,
  removeChainxAccount,
  removeChainxNode,
  setChainxCurrentAccount,
  setChainxCurrentNode,
  signChainxMessage,
  signTransaction
} from './common';

export default function handlePopup({
  message,
  request
}: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
    case CHAINX_ACCOUNT_CREATE_FROM_PRIVATE:
      return createChainxAccountFromPrivateKey(request);
    case CHAINX_ACCOUNT_ALL:
      return getAllChainxAccount();
    case CHAINX_ACCOUNT_SIGN_MESSAGE:
      return signChainxMessage(request);
    case CHAINX_TRANSACTION_SIGN:
      return signTransaction(request);
    case CHAINX_NODE_CREATE:
      return createChainxNode(request);
    case CHAINX_NODE_ALL:
      return getAllChainxNodes();
    case CHAINX_ACCOUNT_SELECT:
      return setChainxCurrentAccount(request);
    case CHAINX_ACCOUNT_CURRENT:
      return getCurrentChainxAccount();
    case CHAINX_ACCOUNT_REMOVE:
      return removeChainxAccount(request);
    case CHAINX_ACCOUNT_EXPORT_PRIVATE:
      return exportPrivateKey(request);
    case CHAINX_NODE_SELECT:
      return setChainxCurrentNode(request);
    case CHAINX_NODE_CURRENT:
      return getChainxCurrentNode();
    case CHAINX_NODE_REMOVE:
      return removeChainxNode(request);
  }

  return Promise.resolve();
}
