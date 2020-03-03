import { getCurrentChainxAccount } from '../messaging';
import { getChainx } from './chainx';
import { SubmittableExtrinsic } from 'chainx.js';
import { store } from '../store';
import { toSignSelector } from '@chainx/extension-ui/store/reducers/txSlice';

export const getSignRequest = async (isTestNet, pass, acceleration) => {
  const state = store.getState();
  const chainx = getChainx();
  const currentAccount = await getCurrentChainxAccount(isTestNet);

  const { id, data } = toSignSelector(state);
  // @ts-ignore
  const extrinsic = new SubmittableExtrinsic(chainx.api, data);
  // @ts-ignore
  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass);
  // @ts-ignore
  const nonce = await chainx.api.query.system.accountNonce(account.publicKey());
  const signedExtrinsic = extrinsic.sign(account, {
    nonce: nonce.toNumber(),
    acceleration: acceleration,
    // @ts-ignore
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
    // @ts-ignore
    const submittable = new SubmittableExtrinsic(chainx.api, hex);
    return submittable.getFeeSync({ acceleration });
  } catch (e) {
    setErrMsg('Invalid transaction to sign');
  }
};
