import { getCurrentChainxAccount } from '../messaging';
import { getChainx } from './chainx';
import { SubmittableExtrinsic } from 'chainx.js';
import { store } from '../store';
import { toSignSelector } from '@chainx/extension-ui/store/reducers/txSlice';

export const getSignRequest = async (isTestNet, query, pass, acceleration) => {
  const state = store.getState();
  const chainx = getChainx();
  const currentAccount = await getCurrentChainxAccount(isTestNet);

  const { id, data } = toSignSelector(state);

  const extrinsic = new SubmittableExtrinsic(chainx.api, data);
  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass);
  const nonce = await chainx.api.query.system.accountNonce(account.publicKey());
  const signedExtrinsic = extrinsic.sign(account, {
    nonce: nonce.toNumber(),
    acceleration: acceleration,
    blockHash: chainx.api.genesisHash
  });
  const hex = signedExtrinsic.toHex();
  return {
    id,
    hex: hex
  };
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
