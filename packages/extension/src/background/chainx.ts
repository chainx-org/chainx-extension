import Chainx, { SubmittableExtrinsic } from 'chainx.js';
import { codes } from './handler/error';

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
  const chainx = getChainx();
  const submittable = new SubmittableExtrinsic(chainx.api, hex);
  submittable.send(async (err, status) => {
    if (!port.postMessage) {
      console.error('port disconnected');
      return;
    }

    port.postMessage({
      id: id,
      message: message,
      response: {
        err: err ? { code: codes.UNKNOWN, msg: err.message } : null,
        status
      }
    });
  });
}
