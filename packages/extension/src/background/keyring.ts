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

  async _addAccount(account: Account, password: string): Promise<any> {
    const nameExist = this.accounts.findIndex(item => item.name === name) >= 0;
    if (nameExist) {
      return Promise.reject({ message: "name already exist" });
    }

    const addressExist = this.accounts.findIndex(item => item.address === account.address) >= 0;
    if (addressExist) {
      return Promise.reject({ message: "address already exist" });
    }

    const keyStore = account.encrypt(password);

    const item: StoreItem = {
      address: account.address(),
      keyStore
    };

    await store.set(`${ACCOUNT_PREFIX}${name}`, item, (): void => {
      this.accounts.push({ name, ...item });
    })

    await new Promise(async (resolve, reject) => {
      try {
        await store.set(CURRENT_ACCOUNT_KEY, account.address, async () => {
          await this.loadAll();
          resolve()
        })
      } catch (e) {
        reject();
      }
    })

    return this.currentAccount;
  }

  async addFromPrivateKey(name: string, privateKey: string, password: string): Promise<any> {
    const account = Account.from(privateKey);
    return this._addAccount(account, password);
  }

  async addFromMnemonic(name: string, mnemonic: string, password: string): Promise<any> {
    const account = Account.from(mnemonic);
    return this._addAccount(account, password);
  }

  getCurrentAccount() {
    return this.currentAccount;
  }

  async setCurrentAccount(address: string): Promise<any> {
    const account = this.accounts.find(item => item.address === address);
    if (!account) {
      return Promise.reject({ message: "address not exist" });
    }

    return await store.set(CURRENT_ACCOUNT_KEY, address, () => {
      this.currentAccount = account;
    });
  }

  async removeAccount(address: string): Promise<any> {
    const target = this.accounts.find(item => item.address === address);
    if (!target) {
      return Promise.reject({ message: "address not exist" });
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

    await store.get(CURRENT_ACCOUNT_KEY, account => {
      if (!account) {
        this.currentAccount = this.accounts[0] || null;
        return;
      }

      const target = this.accounts.find(item => item.address === account.address);
      if (!target) {
        this.currentAccount = this.accounts[0];
      } else {
        this.currentAccount = target;
      }
    })
  }

  signMessage(address: string, message: string, password: string) {
    const account = this.accounts.find(account => account.address === address);
    if (!account) {
      throw 'invalid account';
    }

    const signer = Account.fromKeyStore(account.keyStore, password);
    return signer.sign(message);
  }
}

const keyring = new Keyring();

export default keyring;
