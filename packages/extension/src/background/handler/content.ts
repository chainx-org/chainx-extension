import { ChainxSignRequest, MessageRequest } from "./types";
import { getChainx } from "../chainx";
import { getChainxAccountByAddress, getCurrentChainxAccount } from "./common";
import { tx } from "../store";
import notificationManager from '../notification-manager';
// @ts-ignore
import { CHAINX_ACCOUNT_CURRENT, CHAINX_TRANSACTION_SIGN_REQUEST } from "@chainx/extension-defaults";

export const handlers = {};

export default async function handleContent({ id, message, request }: MessageRequest) {
  if (message === CHAINX_TRANSACTION_SIGN_REQUEST) {
    return requestSignTransaction({ id, ...request });
  } else if (message === CHAINX_ACCOUNT_CURRENT) {
    return getCurrentChainxAccount();
  }

  return true;
}

async function requestSignTransaction({ id, address, module, method, args }: ChainxSignRequest) {
  const chainx = getChainx();
  if (!chainx.api.tx[module]) {
    return Promise.reject({ message: "Invalid module" });
  }
  if (!chainx.api.tx[module][method]) {
    return Promise.reject({ message: "Invalid method" });
  }

  const item = getChainxAccountByAddress(address);
  if (!item) {
    return Promise.reject({ message: "Invalid address" });
  }

  if (tx.toSign) {
    return Promise.reject({ message: "Sign transaction busy" });
  }
  tx.setToSign({ id, address, module, method, args });

  notificationManager.showPopup();

  return new Promise((resolve, reject): void => {
    handlers[id] = { resolve, reject };
  });
}
