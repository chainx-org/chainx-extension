import {
  AccountInfo,
  ChainxAccountCreateRequest,
  ChainxSignMessageRequest,
  SignTransactionRequest,
  ChainxNode
} from "../types";
import keyring from "../keyring";
// @ts-ignore
import { u8aToHex } from '@chainx/util';

export async function createChainxAccount({ name, mnemonic, password }: ChainxAccountCreateRequest) {
  return await keyring.addFromMnemonic(name, mnemonic, password);
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

export async function crateChainxNode({ name, url }: ChainxNode) {

}
