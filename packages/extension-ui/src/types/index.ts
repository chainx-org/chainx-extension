export interface AccountInfo {
  name: string,
  address: string
}

export interface SignTransactionRequest {
  address: string,
  module: string,
  method: string,
  args: Array<any>
}