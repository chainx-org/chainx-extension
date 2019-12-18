import { codes } from './error';

const { Extrinsic } = require('@chainx/types');
import { ChainxCallRequest, MessageRequest } from './types';
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
  CHAINX_SETTINGS_GET,
  CHAINX_TRANSACTION_CALL_REQUEST
} from '@chainx/extension-defaults';
import { simpleAccount } from './utils';

export const handlers = {};

export default async function handleContent({
  id,
  message,
  request
}: MessageRequest) {
  const isTestNet = (settings.settings && settings.settings.isTestNet) || false;
  if (message === CHAINX_ACCOUNT_CURRENT) {
    const account = await getCurrentChainxAccount(isTestNet);
    return simpleAccount(account);
  } else if (message === CHAINX_TRANSACTION_CALL_REQUEST) {
    return requestSignTransaction({ id, ...request });
  } else if (message === CHAINX_NODE_CURRENT) {
    return await getChainxCurrentNode(isTestNet);
  } else if (message === CHAINX_SETTINGS_GET) {
    return await getSettings();
  }

  return true;
}

async function requestSignTransaction({
  id,
  address,
  data
}: ChainxCallRequest) {
  const item = getChainxAccountByAddress(address);
  if (!item) {
    throw {
      code: codes.INVALID_ADDRESS,
      message: 'Invalid address'
    };
  }

  if (tx.toSign) {
    throw { code: codes.SIGN_BUSY, message: 'Sign transaction busy' };
  }

  if (!settings.settings) {
    throw { code: codes.INVALID_NETWORK, message: 'Invalid network' };
  }

  try {
    new Extrinsic(data);
  } catch (e) {
    throw {
      code: codes.INVALID_SIGN_DATA,
      message: 'Invalid data'
    };
  }

  tx.setToSign({
    id,
    address,
    data,
    needBroadcast: false,
    isTestNet: settings.settings.isTestNet
  });

  notificationManager.showPopup();

  return new Promise((resolve, reject): void => {
    handlers[id] = { resolve, reject };
  });
}
