import {
  CHAINX_TRANSACTION_CALL_REQUEST,
  CHAINX_TRANSACTION_SIGN_REQUEST,
  CHAINX_ACCOUNT_CURRENT_CHANGE,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_CURRENT_CHANGE,
  CHAINX_TRANSACTION_SEND
} from '@chainx/extension-defaults';

const accountChangeListeners: Array<any> = [];
const nodeChangeListeners: Array<any> = [];
const callbackHandlers: Object = {};

window.addEventListener(
  'message',
  ({ source, data }): void => {
    // only allow messages from our window, by the inject
    if (source !== window || data.origin !== 'content') {
      return;
    }

    if (data.message === CHAINX_ACCOUNT_CURRENT_CHANGE) {
      for (let listener of accountChangeListeners) {
        listener(data.info);
      }
      return;
    }

    if (data.message === CHAINX_NODE_CURRENT_CHANGE) {
      for (let listener of nodeChangeListeners) {
        listener(data.info);
      }
      return;
    }

    if (data.message === CHAINX_TRANSACTION_SEND) {
      const callback = callbackHandlers[data.id];
      if (!callback) {
        console.error('Not found callback', data);
        return;
      }

      callback(data.response);
      if (data.response.status && data.response.status.status === 'Finalized') {
        delete callbackHandlers[data.id];
      }
      return;
    }

    const handler = handlers[data.id];
    if (!handler) {
      console.error(`Uknown response: ${JSON.stringify(data)}`);
      return;
    }

    if (data.error) {
      handler.reject(new Error(data.error));
    } else {
      handler.resolve(data.response);
    }
  }
);

const handlers: any = {};
let idCounter = 0;

function sendMessage(message: any, request: any = null): Promise<any> {
  return new Promise(
    (resolve, reject): void => {
      const id = `chainx.page.${Date.now()}.${++idCounter}`;

      handlers[id] = { resolve, reject };

      window.postMessage({ id, message, origin: 'page', request }, '*');
    }
  );
}

function sendMessageWithCallback(
  message: string,
  request: any = null,
  callback: Function
) {
  const id = `chainx.page.${Date.now()}.${++idCounter}`;
  callbackHandlers[id] = callback;

  window.postMessage({ id, message, origin: 'page', request }, '*');
}

async function enable(): Promise<any> {
  return await sendMessage(CHAINX_ACCOUNT_CURRENT);
}

async function getCurrentNode(): Promise<any> {
  return await sendMessage(CHAINX_NODE_CURRENT);
}

async function sign(address: string): Promise<any> {
  return await sendMessage(CHAINX_TRANSACTION_SIGN_REQUEST, {
    address,
    module: 'xAssets',
    method: 'transfer',
    args: [
      '5PqoAuvnFAdPMYysQ6aMZKeN5fS8kN3pwuUKpkyFaKCp4HwC',
      'PCX',
      1000,
      'memo'
    ]
  });
}

async function call(
  address: string,
  module: string,
  method: string,
  args: Array<any>
) {
  return await sendMessage(CHAINX_TRANSACTION_CALL_REQUEST, {
    address,
    module,
    method,
    args
  });
}

function sendExtrinsic(hex: string, callback: Function): void {
  sendMessageWithCallback(CHAINX_TRANSACTION_SEND, { hex }, callback);
}

function listenAccountChange(listener) {
  accountChangeListeners.push(listener);
}

function listenNodeChange(listener) {
  nodeChangeListeners.push(listener);
}

// @ts-ignore
window.chainxProvider = {
  enable,
  sign,
  call,
  listenAccountChange,
  listenNodeChange,
  getCurrentNode,
  sendExtrinsic
};
