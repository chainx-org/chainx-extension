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

  addFromMnemonic(name: string, mnemonic: string, password: string): Promise<any> {
    return new Promise(((resolve, reject) => {
      const exist = this.accounts.findIndex(account => account.address === name) >= 0;
      if (exist) {
        reject("already exist");
        return
      }

      const account = Account.from(mnemonic);
      const keyStore = account.encrypt(password);

      const item: StoreItem = {
        address: account.address(),
        keyStore
      };

      store.set(name, item, (): void => {
        this.accounts.push({ name, ...item });
        resolve()
      })
    }))
  }

  loadAll(): Promise<any> {
    return store.all((name, item) => {
      this.accounts.push({ name, ...item });
    })
  }
}

const keyring = new Keyring();

export default keyring;
