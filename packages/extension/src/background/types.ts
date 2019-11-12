export interface ChainxAccountCreateRequest {
  name: string;
  address: string;
  keystore: object;
  isTestNet: boolean;
}

export interface AccountInfo {
  name: string;
  address: string;
  keystore: object;
}

export interface ChainxSignMessageRequest {
  address: string;
  message: string;
  password: string;
  isTestNet: boolean;
}

export interface SignTransactionRequest {
  address: string;
  module: string;
  method: string;
  args: Array<any>;
}

export interface ChainxNode {
  name: string;
  url: string;
  isTestNet: boolean;
}

export interface Popup {
  id: Number;
  type: string;
}
