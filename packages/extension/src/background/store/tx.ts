import store from './store';
import { ChainxSignRequest } from "../handler/types";

const CURRENT_TO_SIGN_TX = 'tx_current_to_sign';

class Transaction {
  toSign: ChainxSignRequest | null;

  constructor() {
    this.toSign = null;
  }

  async setToSign(request: ChainxSignRequest): Promise<any> {
    if (this.toSign) {
      return Promise.reject({ message: "sign transaction busy" });
    }

    await store.set(CURRENT_TO_SIGN_TX, request, () => {
      this.toSign = request;
    })
  }
}

const tx = new Transaction();
export default tx;