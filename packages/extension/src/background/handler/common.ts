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
  CHAINX_NODE_CURRENT_CHANGE,
  CHAINX_SETTINGS_NETWORK_CHANGE
} from '@chainx/extension-defaults';
import { sendToContent } from '../message';
import { settings, tx } from '../store';
import { setChainx } from '../chainx';
import { simpleAccount } from './utils';

export async function createChainxAccount(
  request: ChainxAccountCreateRequest
): Promise<AccountInfo | null> {
  const accounts = request.isTestNet
    ? keyring.testNetAccounts
    : keyring.accounts;

  if (accounts.find(account => account.address === request.address)) {
    await keyring.removeAccount(request.address, request.isTestNet);
  }

  const preAccount = keyring.getCurrentAccount(request.isTestNet);
  const nowAccount = await keyring.addAccount(request);
  if (!nowAccount) {
    throw new Error('fail to create account');
  }

  if (!preAccount || preAccount.address !== nowAccount.address) {
    sendToContent(CHAINX_ACCOUNT_CURRENT_CHANGE, {
      from: simpleAccount(preAccount),
      to: simpleAccount(nowAccount)
    });
  }

  return nowAccount;
}

export async function setChainxCurrentAccount(
  address: string,
  isTestNet: boolean = false
): Promise<AccountInfo | null> {
  const preAccount = keyring.getCurrentAccount(isTestNet);
  const currentAccount = await keyring.setCurrentAccount(address, isTestNet);
  if (!preAccount || preAccount.address !== address) {
    sendToContent(CHAINX_ACCOUNT_CURRENT_CHANGE, {
      from: simpleAccount(preAccount),
      to: simpleAccount(currentAccount)
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
  // @ts-ignore
  const accounts = settings.settings.isTestNet
    ? keyring.testNetAccounts
    : keyring.accounts;
  return accounts.find(item => item.address === address) || null;
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
  const pre = nodes.getCurrentNode(isTestNet);
  const now = await nodes.addNode(name, url, isTestNet);
  await setChainx(url);
  sendToContent(CHAINX_NODE_CURRENT_CHANGE, { from: pre, to: now });
  return now;
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
  const pre = nodes.getCurrentNode(isTestNet);
  await nodes.setCurrentNode(url, isTestNet);
  const now = nodes.getCurrentNode(isTestNet);
  await setChainx(url);
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

export async function setNetwork(isTestNet: boolean = false) {
  // @ts-ignore
  const pre = (settings.settings && settings.settings.isTestNet) || null;
  if (pre === isTestNet) {
    return;
  }

  // @ts-ignore
  await settings.saveSettings({
    // @ts-ignore
    version: settings.settings.version,
    isTestNet
  });

  if (isTestNet && nodes.currentTestNetNode) {
    await setChainx(nodes.currentTestNetNode.url);
  } else if (!isTestNet && nodes.currentNode) {
    await setChainx(nodes.currentNode.url);
  }

  sendToContent(CHAINX_SETTINGS_NETWORK_CHANGE, {
    from: pre ? 'testnet' : 'mainnet',
    to: isTestNet ? 'testnet' : 'mainnet'
  });
  // 切换网络后，清空待签交易
  tx.setToSign(null);
  return;
}
