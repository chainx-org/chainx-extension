import { ChainxSignRequest, MessageRequest } from "./types";
// @ts-ignore
import { CHAINX_TRANSACTION_SIGN } from "@chainx/extension-defaults";
import { getChainx } from "../chainx";
import { getChainxAccountByAddress, getCurrentChainxAccount } from "./common";
import { Account } from 'chainx.js';
// @ts-ignore
import { CHAINX_ACCOUNT_CURRENT } from "@chainx/extension-defaults";
import { tx } from "../store";

export default async function handleContent({ id, message, request }: MessageRequest) {
  if (message === CHAINX_TRANSACTION_SIGN) {
    return signTransaction({ id, ...request });
  } else if (message === CHAINX_ACCOUNT_CURRENT) {
    return getCurrentChainxAccount();
  }

  return true;
}

async function signTransaction({ id, address, module, method, args }: ChainxSignRequest) {
  const chainx = getChainx();
  const chainxModule = chainx.api.tx[module];
  if (!chainxModule) {
    return Promise.reject({ message: "Invalid module" });
  }
  const call = chainx.api.tx[module][method];
  if (!call) {
    return Promise.reject({ message: "Invalid method" });
  }

  const item = getChainxAccountByAddress(address);
  if (!item) {
    return Promise.reject({ message: "Invalid address" });
  }

  if (tx.toSign) {
    return Promise.reject({ message: "sign transaction busy" });
  }
  tx.setToSign({ id, address, module, method, args });

  // TODO: open window and type password to confirm sign.
  return mockSign(item, call, args, 'a');
}

async function mockSign(item, call, args, password) {
  const account = Account.fromKeyStore(item.keyStore, password);

  const submittable = call(...args);
  const nonce = await submittable.getNonce(account.publicKey());

  submittable.sign(account, { nonce: nonce.toNumber() });
  return submittable.toHex();
}
