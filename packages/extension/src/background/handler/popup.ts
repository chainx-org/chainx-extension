import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_SIGN_MESSAGE,
  CHAINX_TRANSACTION_SIGN,
  CHAINX_NODE_CREATE, CHAINX_NODE_ALL
} from "../constants";
import { MessageRequest } from "./types";
import {
  createChainxAccount,
  createChainxNode,
  getAllChainxAccount, getAllChainxNodes,
  signChainxMessage,
  signTransaction
} from './common';

export default function handlePopup({ message, request }: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
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
  }

  return Promise.resolve()
}
