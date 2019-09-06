export interface AccountInfo {
  name: string,
  address: string
}

export interface SignTransactionRequest {
  address: string,
  method: string,
  args: Array<any>
}
