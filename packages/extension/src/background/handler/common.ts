import {
  AccountInfo,
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

export async function setChainxCurrentAccount({ address }: { address: string }) {
  return await keyring.setCurrentAccount(address);
}

export async function getCurrentChainxAccount(): Promise<AccountInfo | null> {
  const account = keyring.getCurrentAccount();
  if (!account) {
    return account;
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

export async function createChainxNode({ name, url }: ChainxNode): Promise<any> {
  return await nodes.addNode(name, url);
}

export async function getAllChainxNodes(): Promise<ChainxNode[]> {
  return nodes.nodes;
}
