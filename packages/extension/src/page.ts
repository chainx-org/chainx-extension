import {
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_CURRENT_CHANGE,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_CURRENT_CHANGE,
  CHAINX_SETTINGS_GET,
  CHAINX_SETTINGS_NETWORK_CHANGE,
  CHAINX_TRANSACTION_CALL_REQUEST,
  CHAINX_TRANSACTION_SEND,
  CHAINX_TRANSACTION_SIGN_AND_SEND,
  CHAINX_ORIGIN_PAGE,
  CHAINX_ORIGIN_CONTENT
} from '@chainx/extension-defaults';

const accountChangeListeners: Array<any> = [];
const nodeChangeListeners: Array<any> = [];
const networkChangeListeners: Array<any> = [];
const callbackHandlers: Object = {};

window.addEventListener('message', ({ source, data }): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== CHAINX_ORIGIN_CONTENT) {
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

  if (data.message === CHAINX_SETTINGS_NETWORK_CHANGE) {
    for (let listener of networkChangeListeners) {
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

  if (data.message === CHAINX_TRANSACTION_SIGN_AND_SEND) {
    const callback = callbackHandlers[data.id];
    if (!callback) {
      console.error('Not found callback', data);
      return;
    }

    callback(data.response);
    if (
      (data.response.status && data.response.status.status === 'Finalized') ||
      data.reject
    ) {
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
});

const handlers: any = {};
let idCounter = 0;

function sendMessage(message: any, request: any = null): Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = `chainx.page.${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject };

    window.postMessage(
      { id, message, origin: CHAINX_ORIGIN_PAGE, request },
      '*'
    );
  });
}

function sendMessageWithCallback(
  message: string,
  request: any = null,
  callback: Function
) {
  const id = `chainx.page.${Date.now()}.${++idCounter}`;
  callbackHandlers[id] = callback;

  window.postMessage({ id, message, origin: CHAINX_ORIGIN_PAGE, request }, '*');
}

async function enable(): Promise<any> {
  const account = await sendMessage(CHAINX_ACCOUNT_CURRENT);
  if (!account) {
    return account;
  }

  return {
    name: account.name,
    address: account.address
  };
}

async function getSettings(): Promise<any> {
  return await sendMessage(CHAINX_SETTINGS_GET);
}

async function getNetwork(): Promise<string> {
  const settings = await sendMessage(CHAINX_SETTINGS_GET);
  return settings.isTestNet ? 'testnet' : 'mainnet';
}

async function getCurrentNode(): Promise<any> {
  return await sendMessage(CHAINX_NODE_CURRENT);
}

async function call(address: string, data: string) {
  return await sendMessage(CHAINX_TRANSACTION_CALL_REQUEST, {
    address,
    data
  });
}

function sendExtrinsic(hex: string, callback: Function): void {
  sendMessageWithCallback(CHAINX_TRANSACTION_SEND, { hex }, callback);
}

function listenAccountChange(listener) {
  accountChangeListeners.push(listener);
}

function removeAccountChangeListener(listener) {
  const index = accountChangeListeners.findIndex(l => l === listener);
  accountChangeListeners.splice(index, 1);
}

function listenNodeChange(listener) {
  nodeChangeListeners.push(listener);
}

function removeNodeChangeListener(listener) {
  const index = nodeChangeListeners.findIndex(l => l === listener);
  nodeChangeListeners.splice(index, 1);
}

function listenNetworkChange(listener) {
  networkChangeListeners.push(listener);
}

function removeNetworkChangeListener(listener) {
  const index = networkChangeListeners.findIndex(l => l === listener);
  networkChangeListeners.splice(index, 1);
}

function callAndSend(address: string, data: string, callback: Function): void {
  sendMessageWithCallback(
    CHAINX_TRANSACTION_SIGN_AND_SEND,
    {
      address,
      data
    },
    callback
  );
}

// @ts-ignore
window.chainxProvider = {
  enable,
  signExtrinsic: call,
  signAndSendExtrinsic: callAndSend,
  listenAccountChange,
  removeAccountChangeListener,
  listenNodeChange,
  removeNodeChangeListener,
  listenNetworkChange,
  removeNetworkChangeListener,
  getCurrentNode,
  sendExtrinsic,
  getSettings,
  getNetwork
};
