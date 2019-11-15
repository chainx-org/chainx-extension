import { KeyStore } from '../store/keyring';

export function simpleAccount(account: null | KeyStore) {
  if (!account) {
    return null;
  }

  return {
    name: account.name,
    address: account.address
  };
}
