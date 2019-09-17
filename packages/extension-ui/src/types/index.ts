export interface AccountInfo {
  name: string;
  address: string;
}

export interface SignTransactionRequest {
  id: string;
  address: string; // 用于确定是那个账户的请求
  module: 'xAssets' | 'xStaking';
  method: string;
  args: Array<any>;
  password: string;
}

export interface NodeInfo {
  name: string;
  url: string;
}
