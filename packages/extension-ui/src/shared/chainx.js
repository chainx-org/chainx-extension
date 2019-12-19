import Chainx from 'chainx.js'

let chainx = null

export const setChainx = async nodeUrl => {
  chainx = new Chainx(nodeUrl);
  await chainx.isRpcReady();
  return chainx;
}

export const getChainx = () => {
  return chainx;
}
