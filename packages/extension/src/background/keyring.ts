// @ts-ignore
import Account from '@chainx/account';
// @ts-ignore
import store from './store';

export interface KeyStore {
  name: string,
  address: string,
  keyStore: object
}

interface StoreItem {
  address: string,
  keyStore: object
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

  async _addAccount(name: string, account: Account, password: string): Promise<any> {
    const nameExist = this.accounts.findIndex(item => item.name === name) >= 0;
    if (nameExist) {
      return Promise.reject({ message: "name already exist" });
    }

    const address = account.address();
    const addressExist = this.accounts.findIndex(item => item.address === address) >= 0;
    if (addressExist) {
      return Promise.reject({ message: "address already exist" });
    }

    const keyStore = account.encrypt(password);

    const item: StoreItem = {
      address,
      keyStore
    };

    await store.set(`${ACCOUNT_PREFIX}${name}`, item, (): void => {
      this.accounts.push({ name, ...item });
    })
    await store.set(CURRENT_ACCOUNT_KEY, address);
    await this.loadAll();

    return this.currentAccount;
  }

  async addFromPrivateKey(name: string, privateKey: string, password: string): Promise<any> {
    const account = Account.from(privateKey);
    return this._addAccount(name, account, password);
  }

  async addFromMnemonic(name: string, mnemonic: string, password: string): Promise<any> {
    const account = Account.from(mnemonic);
    return this._addAccount(name, account, password);
  }

  async exportPrivateKey(address: string, password: string): Promise<string> {
    const account = this.accounts.find(item => item.address === address);
    if (!account) {
      return Promise.reject({ message: "address not exist" });
    }

    const chainxAccount = Account.fromKeyStore(account.keyStore, password);
    return chainxAccount.privateKey();
  }

  getCurrentAccount() {
    return this.currentAccount;
  }

  async setCurrentAccount(address: string): Promise<KeyStore | null> {
    const account = this.accounts.find(item => item.address === address);
    if (!account) {
      return Promise.reject({ message: "address not exist" });
    }

    await store.set(CURRENT_ACCOUNT_KEY, address, () => {
      this.currentAccount = account;
    });

    return this.currentAccount;
  }

  async removeAccount(address: string, password: string): Promise<any> {
    const target = this.accounts.find(item => item.address === address);
    if (!target) {
      return { message: "address not exist" };
    }

    try {
      Account.fromKeyStore(target.keyStore, password);
    } catch (e) {
      return { message: "Invalid password" };
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
    })

    if (this.accounts.length <= 0) {
      return
    }

    await store.get(CURRENT_ACCOUNT_KEY, address => {
      if (!address) {
        this.currentAccount = this.accounts[0] || null;
        return;
      }

      const target = this.accounts.find(item => item.address === address);
      this.currentAccount = target || this.accounts[0];
    })
  }

  async signMessage(address: string, message: string, password: string): Promise<any> {
    const account = this.accounts.find(account => account.address === address);
    if (!account) {
      return Promise.reject({ message: "invalid account" });
    }

    const signer = Account.fromKeyStore(account.keyStore, password);
    return signer.sign(message);
  }
}

const keyring = new Keyring();

export default keyring;
