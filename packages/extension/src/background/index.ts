// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';
import handle from './handler';
import { keyring, nodes } from './store';
import { setChainx } from './chainx';
import { registerPort } from './message';

const promise = new Promise((resolve, reject) => {
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
extension.runtime.onConnect.addListener(
  (port): void => {
    registerPort(port);
    // message and disconnect handlers
    port.onMessage.addListener(
      (data): void => {
        const promise = handle(data, port);

        promise
          .then(response => {
            port.postMessage({ id: data.id, response });
          })
          .catch(
            (error): void => {
              port.postMessage({ id: data.id, error: error.message });
            }
          );
      }
    );

    port.onDisconnect.addListener(
      (): void => console.log(`Disconnected from ${port.name}`)
    );
  }
);

promise.then(() => {
  Promise.all([keyring.loadAll(), nodes.loadAll()])
    .then(async () => {
      if (nodes.currentNode) {
        await setChainx(nodes.currentNode.url);
      }
      console.log('initialization completed');
    })
    .catch(
      (error): void => {
        console.error('initialization failed', error);
      }
    );
});
