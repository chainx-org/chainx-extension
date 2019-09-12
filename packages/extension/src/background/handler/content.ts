import { ChainxSignRequest, MessageRequest } from "./types";
// @ts-ignore
import { CHAINX_TRANSACTION_SIGN } from "@chainx/extension-defaults";
import { getChainx } from "../chainx";
import { getChainxAccountByAddress, getCurrentChainxAccount } from "./common";
// @ts-ignore
import Account from '@chainx/account';
// @ts-ignore
import { CHAINX_ACCOUNT_CURRENT } from "@chainx/extension-defaults";

export default async function handleContent({ id, message, request }: MessageRequest) {
  console.log('handle request from content script:', `id: ${id}, message: ${message}, request: ${request}`);
  if (message === CHAINX_TRANSACTION_SIGN) {
    return signTransaction(request);
  } else if (message === CHAINX_ACCOUNT_CURRENT) {
    return getCurrentChainxAccount();
  }

  return true;
}

async function signTransaction({ address, password, module, method, args }: ChainxSignRequest) {
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

  const account = Account.fromKeyStore(item.keyStore, password);

  const submittable = call(args);
  const nonce = await submittable.getNonce(account.publicKey());
  // @ts-ignore
  submittable.sign(account, { nonce });
  return submittable.toHex();
}
