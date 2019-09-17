import { ChainxSignRequest, MessageRequest } from './types';
import { Account } from 'chainx.js';
import {
  CHAINX_TRANSACTION_GET_TO_SIGN,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_TRANSACTION_SIGN_REJECT
  // @ts-ignore
} from '@chainx/extension-defaults';
import { tx } from '../store';
import { handlers } from './content';
import { getChainxAccountByAddress } from './common';
import { getChainx } from '../chainx';
import notificationManager from '../notification-manager';

export default function handleNotification({
  message,
  request
}: MessageRequest): Promise<any> {
  if (message === CHAINX_TRANSACTION_SIGN) {
    return signTransaction(request, request.password);
  } else if (message === CHAINX_TRANSACTION_GET_TO_SIGN) {
    return Promise.resolve(tx.toSign);
  } else if (message === CHAINX_TRANSACTION_SIGN_REJECT) {
    return rejectSignTransaction(request);
  }

  return Promise.resolve();
}

export async function rejectSignTransaction({ id }: ChainxSignRequest) {
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

  handler['reject']({ message: 'Reject the sign request' });
  tx.setToSign(null);
  notificationManager.closePopup();
  return;
}

async function signTransaction(request: ChainxSignRequest, password: string) {
  const handler = handlers[request.id];
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

  const { id, address, module, method, args } = request;

  if (id !== tx.toSign.id) {
    return Promise.reject({ message: 'Invalid request' });
  }

  const chainx = getChainx();
  if (!chainx.api.tx[module]) {
    return Promise.reject({ message: 'Invalid module' });
  }
  const call = chainx.api.tx[module][method];
  if (!call) {
    return Promise.reject({ message: 'Invalid method' });
  }

  const item = getChainxAccountByAddress(address);
  if (!item) {
    return Promise.reject({ message: 'Invalid address' });
  }

  const account = Account.fromKeyStore(item.keyStore, password);
  const submittable = call(...args);
  const nonce = await submittable.getNonce(account.publicKey());
  submittable.sign(account, { nonce: nonce.toNumber() });

  const hex = submittable.toHex();
  handler['resolve'](hex);
  tx.setToSign(null);
  notificationManager.closePopup();
  return hex;
}
