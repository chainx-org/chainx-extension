// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';
import handle from './handler';
import keyring from './keyring';
import nodes from './nodes';

// listen to all messages and handle appropriately
extension.runtime.onConnect.addListener((port): void => {
  // message and disconnect handlers
  port.onMessage.addListener((data): void => {
    const promise = handle(data, port);

    promise.then(response => {
      port.postMessage({ id: data.id, response });
    }).catch((error): void => {
      port.postMessage({ id: data.id, error: error.message });
    })
  });

  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});

Promise.all([keyring.loadAll(), nodes.initNodeAndLoadAll()]).then((): void => {
  console.log('initialization completed');
}).catch((error): void => {
  console.error('initialization failed', error);
})
