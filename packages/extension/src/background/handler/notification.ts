import { ChainxCallRequest, MessageRequest } from './types';
import {
  CHAINX_TRANSACTION_GET_TO_SIGN,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_TRANSACTION_SIGN_AND_SEND,
  CHAINX_TRANSACTION_SIGN_REJECT,
  CHAINX_SETTINGS_GET
} from '@chainx/extension-defaults';
import { tx } from '../store';
import { handlers } from './content';
import notificationManager from '../notification-manager';
import { sendExtrinsicAndResponse } from '../chainx';
import { getSettings } from './common';

export default function handleNotification({
  message,
  request
}: MessageRequest): Promise<any> {
  if (message === CHAINX_TRANSACTION_SIGN) {
    return signTransaction(request);
  } else if (message === CHAINX_TRANSACTION_GET_TO_SIGN) {
    return Promise.resolve(tx.toSign);
  } else if (message === CHAINX_TRANSACTION_SIGN_REJECT) {
    return rejectSignTransaction(request);
  } else if (message === CHAINX_SETTINGS_GET) {
    return getSettings();
  }

  return Promise.resolve();
}

export async function rejectSignTransaction({ id }: ChainxCallRequest) {
  if (tx.toSign && tx.toSign.needBroadcast) {
    const port = getAndRemovePort(id);
    if (!port) {
      console.error(`Find no port for sign and send request ${id}`);
      tx.setToSign(null);
      notificationManager.closePopup();
      return;
    }

    try {
      port.postMessage({
        id: id,
        message: CHAINX_TRANSACTION_SIGN_AND_SEND,
        response: { err: null, status: null, reject: true }
      });
    } finally {
      tx.setToSign(null);
      notificationManager.closePopup();
    }

    return;
  }

  const handler = handlers[id];
  if (!tx.toSign) {
    if (handler) {
      handler['reject']({ message: 'Fail to sign' });
      return;
    } else {
      return Promise.reject({ message: 'Invalid request' });
    }
  }

  if (!handler) {
    tx.setToSign(null);
    return Promise.reject({ message: 'No handler for request' });
  }

  if (id !== tx.toSign.id) {
    tx.setToSign(null);
    return Promise.reject({ message: 'Invalid request' });
  }

  handler['reject']({ message: 'Reject the sign request' });
  tx.setToSign(null);
  notificationManager.closePopup();
  return;
}

async function signTransaction({ id, hex }) {
  console.log(id, hex);
  debugger;
  if (tx.toSign && tx.toSign.needBroadcast) {
    return broadcastAndResponse(id, hex);
  }

  const handler = handlers[id];
  if (!tx.toSign) {
    if (handler) {
      handler['reject']({ message: 'Fail to sign' });
      return;
    } else {
      return Promise.reject({ message: 'Invalid request' });
    }
  }

  if (!handler) {
    return Promise.reject({ message: 'No handler for request' });
  }

  if (id !== tx.toSign.id) {
    return Promise.reject({ message: 'Invalid request' });
  }

  handler['resolve'](hex);
  tx.setToSign(null);
  notificationManager.closePopup();
  return hex;
}

const idPortMap = {};

export function setIdPort(id, port) {
  idPortMap[id] = port;
}

export function getAndRemovePort(id) {
  if (idPortMap.hasOwnProperty(id)) {
    const value = idPortMap[id];
    delete idPortMap[id];
    return value;
  }

  return null;
}

function broadcastAndResponse(id, hex) {
  const port = getAndRemovePort(id);
  if (!port) {
    console.error(`Find no port for sign and send request ${id}`);
    return;
  }
  debugger;
  sendExtrinsicAndResponse(
    { id, message: CHAINX_TRANSACTION_SIGN_AND_SEND, request: { hex } },
    port
  );
  tx.setToSign(null);
  notificationManager.closePopup();
}
