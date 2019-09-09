// @ts-ignore
import Chainx from 'chainx.js';

let chainx;

export default async function setChainx(nodeUrl: string): Promise<any> {
  chainx = new Chainx(nodeUrl);
  await chainx.isRpcReady();

  return chainx;
}
