export interface MessageRequest {
  id: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
}

export interface ChainxSignRequest {
  address: string, // 用于确定是那个账户的请求
  password: string, // 用于签名
  module: 'xAssets' | 'xStaking',
  method: string,
  args: Array<any>
}
