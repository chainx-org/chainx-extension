import { ChainxSignRequest, MessageRequest } from "./types";
import { Account } from "chainx.js";
// @ts-ignore
import {
  CHAINX_TRANSACTION_GET_TO_SIGN,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_TRANSACTION_SIGN_REQUEST
} from "@chainx/extension-defaults/src";
import { tx } from "../store";
import { handlers } from "./content";
import { getChainxAccountByAddress } from "./common";
import { getChainx } from "../chainx";

export default function handleNotification({ message, request }: MessageRequest): Promise<any> {
  if (message === CHAINX_TRANSACTION_SIGN) {
    return signTransaction(request, request.password);
  } else if (message === CHAINX_TRANSACTION_GET_TO_SIGN) {
    return Promise.resolve(tx.toSign);
  }

  return Promise.resolve();
}

async function signTransaction(request: ChainxSignRequest, password: string) {
  const handler = handlers[request.id];
  if (!tx.toSign) {
    if (handler) {
      handler['reject']({ message: "Fail to sign" });
      return
    } else {
      return Promise.reject({ message: "Invalid request" });
    }
  }

  if (!handler) {
    return Promise.reject({ message: "No handler for request" });
  }

  const { id, address, module, method, args } = request;

  if (id !== tx.toSign.id) {
    return Promise.reject({ message: "Invalid request" });
  }

  const chainx = getChainx();
  if (!chainx.api.tx[module]) {
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
  const submittable = call(...args);
  const nonce = await submittable.getNonce(account.publicKey());
  submittable.sign(account, { nonce: nonce.toNumber() });

  const hex = submittable.toHex();
  handler['resolve'](hex);
  return hex;
}