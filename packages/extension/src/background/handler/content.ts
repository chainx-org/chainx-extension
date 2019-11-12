import { ChainxCallRequest, MessageRequest } from './types';
import { getChainx } from '../chainx';
import {
  getChainxAccountByAddress,
  getChainxCurrentNode,
  getCurrentChainxAccount,
  getSettings
} from './common';
import { settings, tx } from '../store';
import notificationManager from '../notification-manager';
import {
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_NODE_CURRENT,
  CHAINX_TRANSACTION_CALL_REQUEST,
  CHAINX_SETTINGS_GET
} from '@chainx/extension-defaults';

export const handlers = {};

export default async function handleContent({
  id,
  message,
  request
}: MessageRequest) {
  if (message === CHAINX_ACCOUNT_CURRENT) {
    return getCurrentChainxAccount(settings.settings.isTestNet);
  } else if (message === CHAINX_TRANSACTION_CALL_REQUEST) {
    return requestSignTransaction({ id, ...request });
  } else if (message === CHAINX_NODE_CURRENT) {
    return await getChainxCurrentNode();
  } else if (message === CHAINX_SETTINGS_GET) {
    return await getSettings();
  }

  return true;
}

async function requestSignTransaction({
  id,
  address,
  module,
  method,
  args
}: ChainxCallRequest) {
  const chainx = getChainx();
  if (!chainx.api.tx[module]) {
    return Promise.reject({ message: 'Invalid module' });
  }
  if (!chainx.api.tx[module][method]) {
    return Promise.reject({ message: 'Invalid method' });
  }

  const item = getChainxAccountByAddress(address);
  if (!item) {
    return Promise.reject({ message: 'Invalid address' });
  }

  if (tx.toSign) {
    return Promise.reject({ message: 'Sign transaction busy' });
  }
  tx.setToSign({
    id,
    address,
    module,
    method,
    args,
    needBroadcast: false,
    isTestNet: settings.settings.isTestNet
  });

  notificationManager.showPopup();

  return new Promise((resolve, reject): void => {
    handlers[id] = { resolve, reject };
  });
}
