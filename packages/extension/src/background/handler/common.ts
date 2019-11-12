import {
  AccountInfo,
  ChainxAccountCreateRequest,
  ChainxNode,
  ChainxSignMessageRequest
} from '../types';
import keyring, { KeyStore } from '../store/keyring';
import { u8aToHex } from '@chainx/util';
import nodes from '../store/nodes';
import {
  CHAINX_ACCOUNT_CURRENT_CHANGE,
  CHAINX_NODE_CURRENT_CHANGE
} from '@chainx/extension-defaults';
import { sendToContent } from '../message';
import { settings } from '../store';

export async function createChainxAccount(
  request: ChainxAccountCreateRequest
): Promise<AccountInfo | null> {
  const accounts = request.isTestNet
    ? keyring.testNetAccounts
    : keyring.accounts;

  if (accounts.find(account => account.address === request.address)) {
    await keyring.removeAccount(request.address, request.isTestNet);
  }

  return await keyring.addAccount(request);
}

export async function setChainxCurrentAccount(
  address: string,
  isTestNet: boolean = false
): Promise<AccountInfo | null> {
  const preAccount = keyring.getCurrentAccount(isTestNet);
  const currentAccount = await keyring.setCurrentAccount(address, isTestNet);
  if (!preAccount || preAccount.address !== address) {
    sendToContent(CHAINX_ACCOUNT_CURRENT_CHANGE, {
      from: preAccount || null,
      to: currentAccount
    });
  }

  return currentAccount;
}

export async function getCurrentChainxAccount(
  isTestNet: boolean = false
): Promise<AccountInfo | null> {
  return keyring.getCurrentAccount(isTestNet);
}

export function removeChainxAccount(
  address: string,
  isTestNet: boolean = false
): Promise<any> {
  return keyring.removeAccount(address, isTestNet);
}

export async function getAllChainxAccount(
  isTestNet: boolean = false
): Promise<AccountInfo[]> {
  return isTestNet ? keyring.testNetAccounts : keyring.accounts;
}

export function getChainxAccountByAddress(address: string): KeyStore | null {
  return keyring.accounts.find(item => item.address === address) || null;
}

export async function signChainxMessage({
  address,
  message,
  password,
  isTestNet
}: ChainxSignMessageRequest): Promise<string> {
  const signResult = await keyring.signMessage(
    address,
    message,
    password,
    isTestNet
  );
  return u8aToHex(signResult);
}

export async function createChainxNode({
  name,
  url,
  isTestNet
}: ChainxNode): Promise<ChainxNode> {
  return await nodes.addNode(name, url, isTestNet);
}

export async function getAllChainxNodes(
  isTestNet: boolean = false
): Promise<ChainxNode[]> {
  return isTestNet ? nodes.testNetNodes : nodes.nodes;
}

export async function setChainxCurrentNode(
  { url }: { url: string },
  isTestNet: boolean = false
) {
  const pre = await nodes.getCurrentNode(isTestNet);
  await nodes.setCurrentNode(url, isTestNet);
  const now = await nodes.getCurrentNode(isTestNet);
  sendToContent(CHAINX_NODE_CURRENT_CHANGE, { from: pre, to: now });
}

export async function getChainxCurrentNode(isTestNet: boolean = false) {
  return nodes.getCurrentNode(isTestNet);
}

export async function removeChainxNode(
  { url }: { url: string },
  isTestNet: boolean = false
) {
  return nodes.removeNode(url, isTestNet);
}

export async function getSettings() {
  return settings.settings;
}
