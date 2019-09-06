import extension from "extensionizer";

// @ts-ignore
import { PORT_POPUP } from '@chainx/extension-defaults';
import { AccountInfo, SignTransactionRequest } from "@chainx/extension-ui/types";

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const port = extension.runtime.connect({ name: PORT_POPUP });
let idCounter = 0;
const handlers: Handlers = {};

// setup a listener for messages, any incoming resolves the promise
port.onMessage.addListener((data): void => {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Uknown response: ${JSON.stringify(data)}`);
    return;
  }

  if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendMessage(message: string, request: any = {}, subscriber?: (data: any) => void): Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = `chainx.${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    port.postMessage({ id, message, request });
  });
}

export async function createAccount(name: string, password: string, mnemonic: string): Promise<boolean> {
  return sendMessage('chainx.accounts.create', { name, password, mnemonic });
}

export async function getAllAccounts(): Promise<AccountInfo[]> {
  return sendMessage('chainx.accounts.all');
}

export async function signMessage(address: string, message: string, password: string) {
  return sendMessage('chainx.accounts.sign.message', { address, message, password });
}

export async function signTransaction(request: SignTransactionRequest) {
  return sendMessage('chainx.transaction.sign', request);
}
