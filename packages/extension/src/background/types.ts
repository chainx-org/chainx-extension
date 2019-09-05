export interface ChainxAccountCreateRequest {
  name: string,
  password: string,
  mnemonic: string
}

export interface AccountInfo {
  name: string,
  address: string
}

export interface ChainxSignMessageRequest {
  address: string,
  message: string,
  password: string
}
