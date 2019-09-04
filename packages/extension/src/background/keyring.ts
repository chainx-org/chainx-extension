// @ts-ignore
import Account from '@chainx/account';

// @ts-ignore
import store from './store';

interface KeyStore {
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
      console.log(store);

      // @ts-ignore
      store.set(name, keyStore, (): void => {
        this.accounts.push({ address: name, keyStore });
        resolve()
      })
    }))
  }
}

export default new Keyring();
