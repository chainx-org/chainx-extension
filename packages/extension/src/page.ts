import {
  CHAINX_TRANSACTION_CALL_REQUEST,
  CHAINX_TRANSACTION_SIGN_REQUEST,
  CHAINX_ACCOUNT_CURRENT_CHANGE
} from '@chainx/extension-defaults';

const accountChangeListeners: Array<any> = [];

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
      console.log('will trigger account change callback, data:', data);
      // TODO: trigger account change callback
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

async function enable(): Promise<any> {
  return await sendMessage('chainx.accounts.current');
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

function listenAccountChange(listener) {
  accountChangeListeners.push(listener);
}

// @ts-ignore
window.chainxProvider = {
  enable,
  sign,
  call,
  listenAccountChange
};
