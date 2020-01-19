import { getCurrentChainxAccount } from '../messaging';
import { getChainx } from './chainx';
import { compactAddLength } from '@chainx/util';
import { SubmittableExtrinsic } from 'chainx.js';

const getSubmittable = (query, chainx) => {
  const { module, method, args } = query;
  const call = chainx.api.tx[module][method];
  if (!call) {
    throw new Error('Invalid method');
  }
  if (method === 'putCode') {
    args[0] = args[0].toString();
    args[1] = compactAddLength(args[1]);
  }
  return call(...args);
};

export const getSignRequest = async (isTestNet, query, pass, acceleration) => {
  const chainx = getChainx();
  const currentAccount = await getCurrentChainxAccount(isTestNet);

  const submittable = getSubmittable(query, chainx);
  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass);
  const nonce = await submittable.getNonce(account.publicKey());
  submittable.sign(account, {
    nonce: nonce.toNumber(),
    acceleration: acceleration
  });
  const hex = submittable.toHex();
  const request = {
    id: query.id,
    hex: hex
  };
  return request;
};

export const getCurrentGas = (hex, setErrMsg, acceleration) => {
  const chainx = getChainx();
  try {
    const submittable = new SubmittableExtrinsic(chainx.api, hex);
    return submittable.getFeeSync({ acceleration });
  } catch (e) {
    setErrMsg('Invalid transaction to sign');
  }
};
