import { CHAINX_ACCOUNT_CREATE } from "./constants";
import { ChainxAccountCreateRequest } from './types';
import keyring from './keyring';

// @ts-ignore
import { PORT_POPUP } from '@chainx/extension-defaults';

export interface MessageRequest {
  id: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
}

// @ts-ignore
async function createChainxAccount({ name, mnemonic, password }: ChainxAccountCreateRequest) {
  console.log(name, mnemonic, password);
  await keyring.addFromMnemonic(name, mnemonic, password);

  return true;
}

function handlePopup({ id, message, request }: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
  }

  return Promise.resolve()
}

async function handleContent({ id, message, request }: MessageRequest) {
  console.log(`id: ${id}, message: ${message}, request: ${request}`);

  return true;
}

export default function (request: MessageRequest, port: chrome.runtime.Port): Promise<any> {
  console.log('handle in background', port.name);
  console.log(port.name === PORT_POPUP);

  if (port.name === PORT_POPUP) {
    return handlePopup(request);
  } else {
    return handleContent(request);
  }
}
