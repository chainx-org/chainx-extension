// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';
import handle from './handler';
import { keyring, nodes } from './store';
import { setChainx } from './chainx';
import { registerPort, unRegisterPort } from './message';
import { CHAINX_TRANSACTION_SEND } from '@chainx/extension-defaults/index';
import { getChainx } from './chainx';

const { Extrinsic } = require('@chainx/types');

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
        if (data.message === CHAINX_TRANSACTION_SEND) {
          const ex = new Extrinsic(data.request.hex);
          const hash = ex.hash.toHex();
          const chainx = getChainx();
          chainx.api.rpc.author.submitAndWatchExtrinsic(
            ex,
            async (err, status) => {
              if (err) {
                port.postMessage({
                  id: data.id,
                  message: data.message,
                  response: { err, status: null }
                });
                return;
              }

              try {
                let events = null;
                let result = null;
                let index = null;
                let blockHash = null;
                let broadcast = null;
                if (status.type === 'Broadcast') {
                  broadcast = status.value && status.value.toJSON();
                }
                if (status.type === 'Finalized') {
                  blockHash = status.value;
                  const {
                    block: { extrinsics }
                  } = await chainx.api.rpc.chain.getBlock(blockHash);
                  const allEvents = await chainx.api.query.system.events.at(
                    blockHash
                  );
                  index = extrinsics.map(ext => ext.hash.toHex()).indexOf(hash);
                  if (index !== -1) {
                    events = allEvents.filter(
                      ({ phase }) =>
                        phase.type === 'ApplyExtrinsic' &&
                        phase.value.eqn(index)
                    );
                    // @ts-ignore
                    result = events.length
                      ? events[events.length - 1].event.data.method
                      : '';
                  }
                }

                const stat = {
                  result,
                  index,
                  events:
                    events &&
                    // @ts-ignore
                    events.map(event => {
                      const o = event.toJSON();
                      o.method = event.event.data.method;
                      return o;
                    }),
                  txHash: hash,
                  // @ts-ignore
                  blockHash: blockHash && blockHash.toJSON(),
                  broadcast: broadcast,
                  status: status.type
                };

                port.postMessage({
                  id: data.id,
                  message: data.message,
                  response: { err: null, status: stat }
                });
              } catch (e) {
                port.postMessage({
                  id: data.id,
                  message: data.message,
                  response: { err: e, status: null }
                });
                return;
              }
            }
          );

          return;
        }

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
      (): void => {
        console.log(`Disconnected from ${port.name}`);
        unRegisterPort(port);
      }
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
