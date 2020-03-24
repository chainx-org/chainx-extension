import { instances } from '@chainx/extension-ui/shared/chainxInstances';

let chainx = null;

export const setChainx = async nodeUrl => {
  chainx = instances.get(nodeUrl);
  if (!chainx) {
    throw new Error(`Not found chainx instance for ${nodeUrl}`);
  }

  // @ts-ignore
  await chainx.isRpcReady();
  return chainx;
};

export const getChainx = () => {
  return chainx;
};

export const replaceBTC = token => {
  return token === 'BTC' ? 'X-BTC' : token;
};

export const sleep = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};
