export interface AccountInfo {
  name: string;
  address: string;
  keystore: Object;
}

export interface SignTransactionRequest {
  id: string;
  hex: string; // 签名后交易原文
}

export interface NodeInfo {
  name: string;
  url: string;
  delay: string;
}
