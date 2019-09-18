// @ts-ignore
import { Account } from 'chainx.js';
// @ts-ignore
import store from './store';
import { ChainxAccountCreateRequest } from '../types';

export interface KeyStore {
  name: string;
  address: string;
  keystore: object;
}

interface StoreItem {
  address: string;
  keystore: object;
}

export const ACCOUNT_PREFIX = 'account_';
export const CURRENT_ACCOUNT_KEY = 'current_account_key';

class Keyring {
  accounts: KeyStore[];
  currentAccount: KeyStore | null;

  constructor() {
    this.accounts = [];
    this.currentAccount = null;
  }

  async addAccount(request: ChainxAccountCreateRequest) {
    const item: StoreItem = {
      address: request.address,
      keystore: request.keystore
    };

    await store.set(`${ACCOUNT_PREFIX}${name}`, item, (): void => {
      this.accounts.push({ name, ...item });
    });

    await store.set(CURRENT_ACCOUNT_KEY, request.address);
    await this.loadAll();
    return this.currentAccount;
  }

  async exportPrivateKey(address: string, password: string): Promise<string> {
    const account = this.accounts.find(item => item.address === address);
    if (!account) {
      return Promise.reject({ message: 'address not exist' });
    }

    const chainxAccount = Account.fromKeyStore(account.keystore, password);
    return chainxAccount.privateKey();
  }

  getCurrentAccount() {
    return this.currentAccount;
  }

  async setCurrentAccount(address: string): Promise<KeyStore | null> {
    const account = this.accounts.find(item => item.address === address);
    if (!account) {
      return Promise.reject({ message: 'address not exist' });
    }

    await store.set(CURRENT_ACCOUNT_KEY, address, () => {
      this.currentAccount = account;
    });

    return this.currentAccount;
  }

  async removeAccount(address: string): Promise<any> {
    const target = this.accounts.find(item => item.address === address);
    if (!target) {
      return Promise.reject({ message: 'address not exist' });
    }

    await store.remove(`${ACCOUNT_PREFIX}${target.name}`);
    if (this.currentAccount && this.currentAccount.address === address) {
      await store.remove(CURRENT_ACCOUNT_KEY);
    }
    await this.loadAll();
  }

  async loadAll(): Promise<any> {
    this.accounts = [];
    this.currentAccount = null;

    await store.all((key, item) => {
      if (key.startsWith(ACCOUNT_PREFIX)) {
        this.accounts.push({ name: key.slice(ACCOUNT_PREFIX.length), ...item });
      }
    });

    if (this.accounts.length <= 0) {
      return;
    }

    await store.get(CURRENT_ACCOUNT_KEY, address => {
      if (!address) {
        this.currentAccount = this.accounts[0] || null;
        return;
      }

      const target = this.accounts.find(item => item.address === address);
      this.currentAccount = target || this.accounts[0];
    });
  }

  async signMessage(
    address: string,
    message: string,
    password: string
  ): Promise<any> {
    const account = this.accounts.find(account => account.address === address);
    if (!account) {
      return Promise.reject({ message: 'invalid account' });
    }

    const signer = Account.fromKeyStore(account.keystore, password);
    return signer.sign(message);
  }
}

const keyring = new Keyring();

export default keyring;
