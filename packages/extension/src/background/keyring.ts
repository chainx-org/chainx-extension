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
