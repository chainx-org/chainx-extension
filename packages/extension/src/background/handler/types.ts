export interface MessageRequest {
  id: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
}

export interface ChainxCallRequest {
  id: string;
  address: string; // 用于确定是那个账户的请求
  data: string; // 待签名的raw hex
  needBroadcast: boolean; // 是否要求发送上链
  isTestNet: boolean;
}
