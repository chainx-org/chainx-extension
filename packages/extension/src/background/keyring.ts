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

  async addFromMnemonic(name: string, mnemonic: string, password: string): Promise<any> {
    const account = Account.from(mnemonic);

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

    const result = await store.set(`${ACCOUNT_PREFIX}${name}`, item, (): void => {
      this.accounts.push({ name, ...item });
    })

    return result;
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

  async loadAll(): Promise<any> {
    await store.all((key, item) => {
      if (key.startsWith(ACCOUNT_PREFIX)) {
        this.accounts.push({ name: key.slice(ACCOUNT_PREFIX.length), ...item });
      }
    })

    if (this.accounts.length <= 0) {
      return
    }

    await store.get(CURRENT_ACCOUNT_KEY, account => {
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
