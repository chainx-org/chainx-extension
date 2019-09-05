// @ts-ignore
import Account from '@chainx/account';

// @ts-ignore
import store from './store';

interface KeyStore {
  name: string,
  address: string,
  keyStore: object
}

interface StoreItem {
  address: string,
  keyStore: object
}

class Keyring {
  accounts: KeyStore[];

  constructor() {
    this.accounts = [];
  }

  async addFromMnemonic(name: string, mnemonic: string, password: string): Promise<any> {
    const exist = this.accounts.findIndex(account => account.address === name) >= 0;
    if (exist) {
      return Promise.reject("already exist");
    }

    const account = Account.from(mnemonic);
    const keyStore = account.encrypt(password);

    const item: StoreItem = {
      address: account.address(),
      keyStore
    };

    const result = await store.set(name, item, (): void => {
      this.accounts.push({ name, ...item });
    })

    return result;
  }

  loadAll(): Promise<any> {
    return store.all((name, item) => {
      this.accounts.push({ name, ...item });
    })
  }
}

const keyring = new Keyring();

export default keyring;
