// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';

// listen to all messages and handle appropriately
extension.runtime.onConnect.addListener((port): void => {
  // message and disconnect handlers
  console.log('background: on connect');
  console.log(port);
  port.onMessage.addListener((data): void => {
    console.log('msg in background:', data);

    port.postMessage({ hello: "hello from background", data });
  });
  // port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});
