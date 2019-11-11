import extension from 'extensionizer';
import { Account } from 'chainx.js';
import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_REMOVE,
  CHAINX_ACCOUNT_SELECT,
  CHAINX_ACCOUNT_SIGN_MESSAGE,
  CHAINX_NODE_ALL,
  CHAINX_NODE_CREATE,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_REMOVE,
  CHAINX_NODE_SELECT,
  PORT_POPUP
} from '@chainx/extension-defaults';
import {
  handlers,
  messageHandler
} from '@chainx/extension-ui/messaging/common';
import { AccountInfo } from '@chainx/extension-ui/types';

const port = extension.runtime.connect({ name: PORT_POPUP });
port.onMessage.addListener(messageHandler);

let idCounter = 0;

export function sendMessage(message: string, request: any = {}): Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = `chainx.popup.${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject };

    port.postMessage({ id, message, request });
  });
}

export async function signMessage(
  address: string,
  message: string,
  password: string
) {
  return sendMessage(CHAINX_ACCOUNT_SIGN_MESSAGE, {
    address,
    message,
    password
  });
}

export async function createAccount(
  name: string,
  address: string,
  keystore: object
): Promise<boolean> {
  return sendMessage(CHAINX_ACCOUNT_CREATE, { name, address, keystore });
}

export async function createAccountFromPrivateKey(
  name: string,
  password: string,
  privateKey: string
) {
  const account = Account.from(privateKey);
  const keystore = account.encrypt(password);

  return sendMessage(CHAINX_ACCOUNT_CREATE, {
    name,
    address: account.address(),
    keystore
  });
}

export async function getAllAccounts(): Promise<AccountInfo[]> {
  return sendMessage(CHAINX_ACCOUNT_ALL);
}

export async function removeChainxAccount(address: string) {
  return sendMessage(CHAINX_ACCOUNT_REMOVE, { address });
}

export async function setChainxCurrentAccount(address: string) {
  return sendMessage(CHAINX_ACCOUNT_SELECT, { address });
}

export async function getCurrentChainxAccount() {
  return sendMessage(CHAINX_ACCOUNT_CURRENT);
}

export async function createChainxNode(name: string, url: string) {
  return sendMessage(CHAINX_NODE_CREATE, { name, url });
}

export async function getAllChainxNodes() {
  return sendMessage(CHAINX_NODE_ALL);
}

export async function setChainxNode(url: string) {
  return sendMessage(CHAINX_NODE_SELECT, { url });
}

export async function addChainxNode(name: string, url: string) {
  return sendMessage(CHAINX_NODE_CREATE, { name, url });
}

export async function getCurrentChainxNode() {
  return sendMessage(CHAINX_NODE_CURRENT);
}

export async function removeChainxNode(name: string, url: string) {
  return sendMessage(CHAINX_NODE_REMOVE, { name, url });
}
