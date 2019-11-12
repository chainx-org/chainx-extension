import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_REMOVE,
  CHAINX_ACCOUNT_SELECT,
  CHAINX_ACCOUNT_SIGN_MESSAGE,
  CHAINX_NODE_ALL,
  CHAINX_NODE_CREATE,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_REMOVE,
  CHAINX_NODE_SELECT,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_SETTINGS_GET
} from '@chainx/extension-defaults';
import { MessageRequest } from './types';
import {
  createChainxAccount,
  createChainxNode,
  getAllChainxAccount,
  getAllChainxNodes,
  getChainxCurrentNode,
  getCurrentChainxAccount,
  getSettings,
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
    case CHAINX_ACCOUNT_ALL:
      return getAllChainxAccount();
    case CHAINX_ACCOUNT_REMOVE:
      return removeChainxAccount(request.address);
    case CHAINX_ACCOUNT_SELECT:
      return setChainxCurrentAccount(request.address);
    case CHAINX_ACCOUNT_SIGN_MESSAGE:
      return signChainxMessage(request);
    case CHAINX_TRANSACTION_SIGN:
      return signTransaction(request);
    case CHAINX_NODE_CREATE:
      return createChainxNode(request);
    case CHAINX_NODE_ALL:
      return getAllChainxNodes();
    case CHAINX_ACCOUNT_CURRENT:
      return getCurrentChainxAccount();
    case CHAINX_NODE_SELECT:
      return setChainxCurrentNode(request);
    case CHAINX_NODE_CURRENT:
      return getChainxCurrentNode();
    case CHAINX_NODE_REMOVE:
      return removeChainxNode(request);
    case CHAINX_SETTINGS_GET:
      return getSettings();
  }

  return Promise.resolve();
}
