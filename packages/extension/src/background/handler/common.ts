import {
  AccountInfo,
  ChainxAccountCreateRequest,
  ChainxNode,
  ChainxSignMessageRequest,
  SignTransactionRequest
} from '../types';
import keyring, { KeyStore } from '../store/keyring';
import { u8aToHex } from '@chainx/util';
import nodes from '../store/nodes';
import {
  CHAINX_ACCOUNT_CURRENT_CHANGE,
  CHAINX_NODE_CURRENT_CHANGE
} from '@chainx/extension-defaults';
import { sendToContent } from '../message';

export async function createChainxAccount(
  request: ChainxAccountCreateRequest
): Promise<AccountInfo | null> {
  if (keyring.accounts.find(account => account.address === request.address)) {
    await keyring.removeAccount(request.address);
  }
  return await keyring.addAccount(request);
}

export async function setChainxCurrentAccount(
  address: string
): Promise<AccountInfo | null> {
  const preAccount = keyring.getCurrentAccount();
  const currentAccount = await keyring.setCurrentAccount(address);
  if (!preAccount || preAccount.address !== address) {
    sendToContent(CHAINX_ACCOUNT_CURRENT_CHANGE, {
      from: preAccount || null,
      to: currentAccount
    });
  }

  return currentAccount;
}

export async function getCurrentChainxAccount(): Promise<AccountInfo | null> {
  return keyring.getCurrentAccount();
}

export function removeChainxAccount(address: string): Promise<any> {
  return keyring.removeAccount(address);
}

export async function getAllChainxAccount(): Promise<AccountInfo[]> {
  return keyring.accounts;
}

export function getChainxAccountByAddress(address: string): KeyStore | null {
  return keyring.accounts.find(item => item.address === address) || null;
}

export async function signChainxMessage({
  address,
  message,
  password
}: ChainxSignMessageRequest): Promise<string> {
  const signResult = await keyring.signMessage(address, message, password);
  return u8aToHex(signResult);
}

export async function signTransaction(
  request: SignTransactionRequest
): Promise<any> {
  const targetAccount = keyring.accounts.find(
    account => account.address === request.address
  );
  if (!targetAccount) {
    return Promise.reject({ message: 'Account not exist' });
  }

  // TODO: sign transaction and return the signed raw tx
  return Promise.resolve(request);
}

export async function createChainxNode({
  name,
  url
}: ChainxNode): Promise<ChainxNode> {
  return await nodes.addNode(name, url);
}

export async function getAllChainxNodes(): Promise<ChainxNode[]> {
  return nodes.nodes;
}

export async function setChainxCurrentNode({ url }: { url: string }) {
  const pre = await nodes.getCurrentNode();
  await nodes.setCurrentNode(url);
  const now = await nodes.getCurrentNode();
  sendToContent(CHAINX_NODE_CURRENT_CHANGE, { from: pre, to: now });
}

export async function getChainxCurrentNode() {
  return nodes.getCurrentNode();
}

export async function removeChainxNode({ url }: { url: string }) {
  return nodes.removeNode(url);
}
