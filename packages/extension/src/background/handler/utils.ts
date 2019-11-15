import { KeyStore } from '../store/keyring';
import { AccountInfo } from '../types';

export function simpleAccount(account: null | KeyStore | AccountInfo) {
  if (!account) {
    return null;
  }

  return {
    name: account.name,
    address: account.address
  };
}
