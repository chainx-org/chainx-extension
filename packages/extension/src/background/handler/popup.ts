import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_SIGN_MESSAGE,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_NODE_CREATE,
  CHAINX_NODE_ALL,
  CHAINX_ACCOUNT_SELECT,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_REMOVE,
  CHAINX_ACCOUNT_CREATE_FROM_PRIVATE
} from "../constants";
import { MessageRequest } from "./types";
import {
  createChainxAccount, createChainxAccountFromPrivateKey,
  createChainxNode,
  getAllChainxAccount, getAllChainxNodes, getCurrentChainxAccount, removeChainxAccount, setChainxCurrentAccount,
  signChainxMessage,
  signTransaction
} from './common';

export default function handlePopup({ message, request }: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
    case CHAINX_ACCOUNT_CREATE_FROM_PRIVATE:
      return createChainxAccountFromPrivateKey(request);
    case CHAINX_ACCOUNT_ALL:
      return getAllChainxAccount();
    case CHAINX_ACCOUNT_SIGN_MESSAGE:
      return signChainxMessage(request);
    case CHAINX_TRANSACTION_SIGN:
      return signTransaction(request);
    case CHAINX_NODE_CREATE:
      return createChainxNode(request);
    case CHAINX_NODE_ALL:
      return getAllChainxNodes();
    case CHAINX_ACCOUNT_SELECT:
      return setChainxCurrentAccount(request);
    case CHAINX_ACCOUNT_CURRENT:
      return getCurrentChainxAccount();
    case CHAINX_ACCOUNT_REMOVE:
      return removeChainxAccount(request);
  }

  return Promise.resolve()
}
