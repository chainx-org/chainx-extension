import extension from "extensionizer";

// @ts-ignore
import { PORT_POPUP } from '@chainx/extension-defaults';

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

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendMessage (message: string, request: any = {}, subscriber?: (data: any) => void): Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = `chainx.${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    port.postMessage({ id, message, request });
  });
}

export async function createAccount (name: string, password: string, mnemonic: string): Promise<boolean> {
  return sendMessage('chainx.accounts.create', { name, password, mnemonic });
}
