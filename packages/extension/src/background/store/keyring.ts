import { Account } from 'chainx.js';
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
export const TESTNET_ACCOUNT_PREFIX = 'testnet_account_';
export const CURRENT_ACCOUNT_KEY = 'current_account_key';
export const CURRENT_TESTNET_ACCOUNT_KEY = 'current_testnet_account_key';

class Keyring {
  accounts: KeyStore[];
  testNetAccounts: KeyStore[];
  currentAccount: KeyStore | null;
  currentTestNetAccount: KeyStore | null;

  constructor() {
    this.accounts = [];
    this.currentAccount = null;

    this.testNetAccounts = [];
    this.currentTestNetAccount = null;
  }

  async addAccount(
    request: ChainxAccountCreateRequest,
    isTestNet: boolean = false
  ) {
    const item: StoreItem = {
      address: request.address,
      keystore: request.keystore
    };

    const prefix = isTestNet ? TESTNET_ACCOUNT_PREFIX : ACCOUNT_PREFIX;

    await store.set(`${prefix}${request.name}`, item, (): void => {
      const account = { name: request.name, ...item };

      if (isTestNet) {
        this.testNetAccounts.push(account);
      } else {
        this.accounts.push(account);
      }
    });

    const key = isTestNet ? CURRENT_TESTNET_ACCOUNT_KEY : CURRENT_ACCOUNT_KEY;
    await store.set(key, request.address);
    await this.loadAll();
    return isTestNet ? this.currentTestNetAccount : this.currentAccount;
  }

  getCurrentAccount(isTestNet: boolean = false) {
    return isTestNet ? this.currentTestNetAccount : this.currentAccount;
  }

  async setCurrentAccount(
    address: string,
    isTestNet: boolean = false
  ): Promise<KeyStore | null> {
    const accounts = isTestNet ? this.testNetAccounts : this.accounts;
    const key = isTestNet ? CURRENT_TESTNET_ACCOUNT_KEY : CURRENT_ACCOUNT_KEY;

    const account = accounts.find(item => item.address === address);
    if (!account) {
      return Promise.reject({ message: 'address not exist' });
    }

    await store.set(key, address, () => {
      if (isTestNet) {
        this.currentTestNetAccount = account;
      } else {
        this.currentAccount = account;
      }
    });

    return isTestNet ? this.currentTestNetAccount : this.currentAccount;
  }

  async removeAccount(
    address: string,
    isTestNet: boolean = false
  ): Promise<any> {
    const accounts = isTestNet ? this.testNetAccounts : this.accounts;
    const prefix = isTestNet ? TESTNET_ACCOUNT_PREFIX : ACCOUNT_PREFIX;

    const target = accounts.find(item => item.address === address);
    if (!target) {
      return Promise.reject({ message: 'address not exist' });
    }

    await store.remove(`${prefix}${target.name}`);
    if (
      !isTestNet &&
      this.currentAccount &&
      this.currentAccount.address === address
    ) {
      await store.remove(CURRENT_ACCOUNT_KEY);
    }
    if (
      isTestNet &&
      this.currentTestNetAccount &&
      this.currentTestNetAccount.address === address
    ) {
      await store.remove(CURRENT_TESTNET_ACCOUNT_KEY);
    }
    await this.loadAll();
  }

  async loadAll(): Promise<any> {
    this.accounts = [];
    this.currentAccount = null;
    this.testNetAccounts = [];
    this.currentTestNetAccount = null;

    await store.all((key, item) => {
      if (key.startsWith(ACCOUNT_PREFIX)) {
        this.accounts.push({ name: key.slice(ACCOUNT_PREFIX.length), ...item });
      }

      if (key.startsWith(TESTNET_ACCOUNT_PREFIX)) {
        this.accounts.push({
          name: key.slice(TESTNET_ACCOUNT_PREFIX.length),
          ...item
        });
      }
    });

    await store.get(CURRENT_ACCOUNT_KEY, address => {
      if (!address) {
        this.currentAccount = this.accounts[0] || null;
        return;
      }

      const target = this.accounts.find(item => item.address === address);
      this.currentAccount = target || this.accounts[0];
    });

    await store.get(CURRENT_TESTNET_ACCOUNT_KEY, address => {
      if (!address) {
        this.currentTestNetAccount = this.testNetAccounts[0] || null;
        return;
      }

      const target = this.testNetAccounts.find(
        item => item.address === address
      );
      this.currentTestNetAccount = target || this.testNetAccounts[0];
    });
  }

  async signMessage(
    address: string,
    message: string,
    password: string,
    isTestNet: boolean = false
  ): Promise<any> {
    const accounts = isTestNet ? this.testNetAccounts : this.accounts;
    const account = accounts.find(account => account.address === address);
    if (!account) {
      return Promise.reject({ message: 'invalid account' });
    }

    Account.setNet(isTestNet ? 'testnet' : 'mainnet');
    const signer = Account.fromKeyStore(account.keystore, password);
    return signer.sign(message);
  }
}

const keyring = new Keyring();

export default keyring;
