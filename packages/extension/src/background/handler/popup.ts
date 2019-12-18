import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_REMOVE,
  CHAINX_ACCOUNT_SELECT,
  CHAINX_NODE_ALL,
  CHAINX_NODE_CREATE,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_REMOVE,
  CHAINX_NODE_SELECT,
  CHAINX_SETTINGS_GET,
  CHAINX_SETTINGS_SET_NETWORK
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
  setNetwork
} from './common';

export default function handlePopup({
  message,
  request
}: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
    case CHAINX_ACCOUNT_ALL:
      return getAllChainxAccount(request.isTestNet);
    case CHAINX_ACCOUNT_REMOVE:
      return removeChainxAccount(request.address, request.isTestNet);
    case CHAINX_ACCOUNT_SELECT:
      return setChainxCurrentAccount(request.address, request.isTestNet);
    case CHAINX_NODE_CREATE:
      return createChainxNode(request);
    case CHAINX_NODE_ALL:
      return getAllChainxNodes(request.isTestNet);
    case CHAINX_ACCOUNT_CURRENT:
      return getCurrentChainxAccount(request.isTestNet);
    case CHAINX_NODE_SELECT:
      return setChainxCurrentNode(request, request.isTestNet);
    case CHAINX_NODE_CURRENT:
      return getChainxCurrentNode(request.isTestNet);
    case CHAINX_NODE_REMOVE:
      return removeChainxNode(request, request.isTestNet);
    case CHAINX_SETTINGS_GET:
      return getSettings();
    case CHAINX_SETTINGS_SET_NETWORK:
      return setNetwork(request.isTestNet);
  }

  return Promise.resolve();
}
