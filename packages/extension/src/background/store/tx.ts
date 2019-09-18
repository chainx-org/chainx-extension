import { ChainxCallRequest } from '../handler/types';

class Transaction {
  toSign: ChainxCallRequest | null;

  constructor() {
    this.toSign = null;
  }

  setToSign(request: ChainxCallRequest | null) {
    this.toSign = request;
    return this.toSign;
  }
}

const tx = new Transaction();
export default tx;
