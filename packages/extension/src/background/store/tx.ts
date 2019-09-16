import { ChainxSignRequest } from "../handler/types";

class Transaction {
  toSign: ChainxSignRequest | null;

  constructor() {
    this.toSign = null;
  }

  setToSign(request: ChainxSignRequest) {
    this.toSign = request;
    return this.toSign;
  }
}

const tx = new Transaction();
export default tx;