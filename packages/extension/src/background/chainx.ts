// @ts-ignore
import Chainx from 'chainx.js';

const { Extrinsic } = require('@chainx/types');

let chainx: any;

export async function setChainx(nodeUrl: string): Promise<any> {
  chainx = new Chainx(nodeUrl);
  await chainx.isRpcReady();

  return chainx;
}

export function getChainx() {
  return chainx;
}

export function sendExtrinsicAndResponse(
  { id, message, request: { hex } },
  port
) {
  const ex = new Extrinsic(hex);
  const hash = ex.hash.toHex();
  const chainx = getChainx();

  chainx.api.rpc.author.submitAndWatchExtrinsic(ex, async (err, status) => {
    if (err) {
      port.postMessage({
        id: id,
        message: message,
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
        const allEvents = await chainx.api.query.system.events.at(blockHash);
        index = extrinsics.map(ext => ext.hash.toHex()).indexOf(hash);
        if (index !== -1) {
          events = allEvents.filter(
            ({ phase }) =>
              phase.type === 'ApplyExtrinsic' && phase.value.eqn(index)
          );
          // @ts-ignore
          result = events.length
            ? // @ts-ignore
              events[events.length - 1].event.data.method
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
        id: id,
        message: message,
        response: { err: null, status: stat }
      });
    } catch (e) {
      port.postMessage({
        id: id,
        message: message,
        response: { err: e, status: null }
      });
      return;
    }
  });
}
