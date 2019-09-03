export default class Account {
  address: string;
  keystore: object;

  constructor(address: string, keystore: object) {
    this.address = address;
    this.keystore = keystore;
  }
}
