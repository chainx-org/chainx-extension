import extension from 'extensionizer';
import {
  CHAINX_TRANSACTION_GET_TO_SIGN,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_TRANSACTION_SIGN_REJECT,
  PORT_NOTIFICATION
  // @ts-ignore
} from '@chainx/extension-defaults';
import {
  handlers,
  messageHandler
} from '@chainx/extension-ui/messaging/common';
import { SignTransactionRequest } from '@chainx/extension-ui/types';

const port = extension.runtime.connect({ name: PORT_NOTIFICATION });
port.onMessage.addListener(messageHandler);

let idCounter = 0;

export function sendMessage(message: string, request: any = {}) {
  return new Promise(
    (resolve, reject): void => {
      const id = `chainx.notification.${Date.now()}.${++idCounter}`;

      handlers[id] = { resolve, reject };

      port.postMessage({ id, message, request });
    }
  );
}

export async function signTransaction(request: SignTransactionRequest) {
  return sendMessage(CHAINX_TRANSACTION_SIGN, request);
}

export async function getToSign() {
  return sendMessage(CHAINX_TRANSACTION_GET_TO_SIGN);
}

export async function rejectSign(id: string) {
  return sendMessage(CHAINX_TRANSACTION_SIGN_REJECT, { id });
}
