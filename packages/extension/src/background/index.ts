import extension from 'extensionizer';
import handle, { handleWithListen } from './handler';
import { keyring, nodes, settings } from './store';
import { sendExtrinsicAndResponse, setChainx } from './chainx';
import { registerPort, unRegisterPort } from './message';
import {
  CHAINX_TRANSACTION_SEND,
  CHAINX_TRANSACTION_SIGN_AND_SEND
} from '@chainx/extension-defaults/index';

const initSettingsPromise = settings.loadSettings();

const initPromise = new Promise((resolve, reject) => {
  extension.runtime.onInstalled.addListener(event => {
    if (event.reason === 'install') {
      nodes
        .initNodes()
        .then(() => {
          console.log('Finish to init nodes.');
          resolve();
        })
        .catch(() => {
          console.error('Fail to init nodes.');
          reject();
        });
    }
  });

  setTimeout(resolve, 500);
});

// listen to all messages and handle appropriately
extension.runtime.onConnect.addListener((port): void => {
  registerPort(port);
  // message and disconnect handlers
  port.onMessage.addListener((data): void => {
    if (data.message === CHAINX_TRANSACTION_SEND) {
      return sendExtrinsicAndResponse(data, port);
    }

    if (data.message === CHAINX_TRANSACTION_SIGN_AND_SEND) {
      return handleWithListen(data, port);
    }

    const promise = handle(data, port);

    promise
      .then(response => {
        port.postMessage({ id: data.id, response });
      })
      .catch((error): void => {
        port.postMessage({ id: data.id, error: error.message });
      });
  });

  port.onDisconnect.addListener((): void => {
    console.log(`Disconnected from ${port.name}`);
    unRegisterPort(port);
  });
});

(async function init() {
  await initSettingsPromise;
  await initPromise;

  Promise.all([keyring.loadAll(), nodes.loadAll()])
    .then(async () => {
      if (nodes.currentNode) {
        await setChainx(nodes.currentNode.url);
      }
      console.log('initialization completed');
    })
    .catch((error): void => {
      console.error('initialization failed', error);
    });
})();
