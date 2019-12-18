import extension from 'extensionizer';
import { Account } from 'chainx.js';
import {
  CHAINX_ACCOUNT_ALL,
  CHAINX_ACCOUNT_CREATE,
  CHAINX_ACCOUNT_CURRENT,
  CHAINX_ACCOUNT_REMOVE,
  CHAINX_ACCOUNT_SELECT,
  CHAINX_NODE_ALL,
  CHAINX_NODE_CREATE,
  CHAINX_NODE_CURRENT,
  CHAINX_NODE_REMOVE,
  CHAINX_NODE_SELECT,
  CHAINX_SETTINGS_GET,
  CHAINX_SETTINGS_SET_NETWORK,
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

export async function createAccount(
  name: string,
  address: string,
  keystore: object,
  isTestNet: boolean = false
): Promise<boolean> {
  return sendMessage(CHAINX_ACCOUNT_CREATE, {
    name,
    address,
    keystore,
    isTestNet
  });
}

export async function createAccountFromPrivateKey(
  name: string,
  password: string,
  privateKey: string,
  isTestNet: boolean = false
) {
  Account.setNet(isTestNet ? 'testnet' : 'mainnet');
  const account = Account.from(privateKey);
  const keystore = account.encrypt(password);

  return sendMessage(CHAINX_ACCOUNT_CREATE, {
    name,
    address: account.address(),
    keystore,
    isTestNet
  });
}

export async function getAllAccounts(
  isTestNet: boolean = false
): Promise<AccountInfo[]> {
  return sendMessage(CHAINX_ACCOUNT_ALL, { isTestNet });
}

export async function removeChainxAccount(
  address: string,
  isTestNet: boolean = false
) {
  return sendMessage(CHAINX_ACCOUNT_REMOVE, { address, isTestNet });
}

export async function setChainxCurrentAccount(
  address: string,
  isTestNet: boolean = false
) {
  return sendMessage(CHAINX_ACCOUNT_SELECT, { address, isTestNet });
}

export async function getCurrentChainxAccount(isTestNet: boolean = false) {
  return sendMessage(CHAINX_ACCOUNT_CURRENT, { isTestNet });
}

export async function createChainxNode(
  name: string,
  url: string,
  isTestNet: boolean = false
) {
  return sendMessage(CHAINX_NODE_CREATE, { name, url, isTestNet });
}

export async function getAllChainxNodes(isTestNet: boolean = false) {
  return sendMessage(CHAINX_NODE_ALL, { isTestNet });
}

export async function setChainxNode(url: string, isTestNet: boolean = false) {
  return sendMessage(CHAINX_NODE_SELECT, { url, isTestNet });
}

export async function addChainxNode(
  name: string,
  url: string,
  isTestNet: boolean = false
) {
  return sendMessage(CHAINX_NODE_CREATE, { name, url, isTestNet });
}

export async function getCurrentChainxNode(isTestNet: boolean = false) {
  return sendMessage(CHAINX_NODE_CURRENT, { isTestNet });
}

export async function removeChainxNode(
  name: string,
  url: string,
  isTestNet: boolean = false
) {
  return sendMessage(CHAINX_NODE_REMOVE, { name, url, isTestNet });
}

export async function setNetwork(isTestNet: boolean = false) {
  return sendMessage(CHAINX_SETTINGS_SET_NETWORK, { isTestNet });
}

export async function getSettings() {
  return sendMessage(CHAINX_SETTINGS_GET);
}
