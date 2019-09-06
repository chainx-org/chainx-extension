import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_SIGN_MESSAGE,
  CHAINX_TRANSACTION_SIGN
} from "../constants";
import { MessageRequest } from "./types";
import { createChainxAccount, getAllChainxAccount, signChainxMessage, signTransaction } from './common';

export default function handlePopup({ id, message, request }: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
    case CHAINX_ACCOUNT_ALL:
      return getAllChainxAccount();
    case CHAINX_ACCOUNT_SIGN_MESSAGE:
      return signChainxMessage(request);
    case CHAINX_TRANSACTION_SIGN:
      return signTransaction();
  }

  return Promise.resolve()
}
