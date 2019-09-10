import {
  AccountInfo, ChainxAccountCreateFromPrivateKeyRequest,
  ChainxAccountCreateRequest,
  ChainxNode,
  ChainxSignMessageRequest,
  SignTransactionRequest
} from "../types";
import keyring from "../keyring";
// @ts-ignore
import { u8aToHex } from '@chainx/util';
import nodes from '../nodes';

export async function createChainxAccount({ name, mnemonic, password }: ChainxAccountCreateRequest): Promise<AccountInfo> {
  const account = await keyring.addFromMnemonic(name, mnemonic, password);
  return {
    name: account.name,
    address: account.address
  };
}

export async function createChainxAccountFromPrivateKey({ name, privateKey, password }: ChainxAccountCreateFromPrivateKeyRequest) {
  const account = await keyring.addFromPrivateKey(name, privateKey, password);
  return {
    name: account.name,
    address: account.address
  };
}

export async function setChainxCurrentAccount({ address }: { address: string }): Promise<AccountInfo | null> {
  const current = await keyring.setCurrentAccount(address);
  if (current) {
    return {
      name: current.name,
      address: current.address
    }
  }

  return current;
}

export async function exportPrivateKey({ address, password }: { address: string, password: string }): Promise<string> {
  return await keyring.exportPrivateKey(address, password);
}

export async function getCurrentChainxAccount(): Promise<AccountInfo | null> {
  const account = keyring.getCurrentAccount();
  if (!account) {
    return null;
  }

  return {
    name: account.name,
    address: account.address
  };
}

export function removeChainxAccount({ address }: { address: string }): Promise<any> {
  return keyring.removeAccount(address);
}

export async function getAllChainxAccount(): Promise<AccountInfo[]> {
  return keyring.accounts.map(account => ({
    name: account.name,
    address: account.address
  }));
}

export async function signChainxMessage({ address, message, password }: ChainxSignMessageRequest) {
  return u8aToHex(keyring.signMessage(address, message, password));
}

export async function signTransaction(request: SignTransactionRequest): Promise<any> {
  const targetAccount = keyring.accounts.find(account => account.address === request.address)
  if (!targetAccount) {
    return Promise.reject({ message: 'Account not exist' });
  }

  // TODO: sign transaction and return the signed raw tx
  return Promise.resolve(request);
}

export async function createChainxNode({ name, url }: ChainxNode): Promise<ChainxNode> {
  return await nodes.addNode(name, url);
}

export async function getAllChainxNodes(): Promise<ChainxNode[]> {
  return nodes.nodes;
}

export async function setChainxCurrentNode({ url }: { url: string }) {
  return nodes.setCurrentNode(url);
}

export async function getChainxCurrentNode() {
  return nodes.getCurrentNode();
}

export async function removeChainxNode({ url }: { url: string }) {
  return nodes.removeNode(url);
}
