import handleContent from './content';
import handlePopup from './popup';
import handleNotification, { setIdPort } from './notification';
import { MessageRequest } from './types';
import {
  CHAINX_TRANSACTION_SIGN_AND_SEND,
  PORT_CONTENT,
  PORT_NOTIFICATION,
  PORT_POPUP
} from '@chainx/extension-defaults';
import { getChainx } from '../chainx';
import { settings, tx } from '../store';
import notificationManager from '../notification-manager';
import { getChainxAccountByAddress } from './common';
import { codes } from './error';

export default function(
  request: MessageRequest,
  port: chrome.runtime.Port
): Promise<any> {
  if (port.name === PORT_POPUP) {
    return handlePopup(request);
  } else if (port.name === PORT_CONTENT) {
    return handleContent(request);
  } else if (port.name === PORT_NOTIFICATION) {
    return handleNotification(request);
  }

  return Promise.reject({ message: 'invalid port' });
}

export function handleWithListen(
  { id, message, request }: MessageRequest,
  port: chrome.runtime.Port
): void {
  if (port.name !== PORT_CONTENT) {
    return;
  }

  if (message !== CHAINX_TRANSACTION_SIGN_AND_SEND) {
    return;
  }

  const { address, module, method, args } = request;

  const item = getChainxAccountByAddress(address);
  if (!item) {
    return port.postMessage({
      id,
      message,
      response: {
        err: {
          code: codes.INVALID_ADDRESS,
          msg: 'Invalid address'
        },
        status: null
      }
    });
  }

  const chainx = getChainx();
  if (!chainx.api.tx[module]) {
    return port.postMessage({
      id,
      message,
      response: {
        err: {
          code: codes.INVALID_MODULE,
          msg: 'Invalid module'
        },
        status: null
      }
    });
  }
  if (!chainx.api.tx[module][method]) {
    return port.postMessage({
      id,
      message,
      response: { err: 'Invalid method', status: null }
    });
  }
  if (tx.toSign) {
    return port.postMessage({
      id,
      message,
      response: {
        err: {
          code: codes.SIGN_BUSY,
          msg: 'Sign transaction busy'
        },
        status: null
      }
    });
  }
  setIdPort(id, port);
  tx.setToSign({
    id,
    address,
    module,
    method,
    args,
    needBroadcast: true,
    isTestNet: settings.settings.isTestNet
  });

  notificationManager.showPopup();
}
