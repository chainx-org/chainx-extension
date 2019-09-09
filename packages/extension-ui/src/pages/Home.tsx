
import React, { useEffect } from "react"
import { useState } from "react"
import { getAllAccounts, signMessage, getCurrentChainxAccount, removeChainxAccount } from '../messaging'
import { AccountInfo } from "@chainx/extension-ui/types"
// @ts-ignore
import logo from "../assets/logo.jpg"
import "./index.scss"

function Home(props: any) {
  const [sig, setSig] = useState('')
  const [accounts, setAccounts] = useState<AccountInfo[]>([])
  const [currentAccount, setCurrentAccount] = useState<AccountInfo>({ address: '', name: ''})

  useEffect(() => {
    getCurrentAccount()
    getAccounts()
  }, [])

  async function getCurrentAccount() {
    const result =  await getCurrentChainxAccount()
    console.log('current account', result)
    setCurrentAccount(result)
  }

  async function getAccounts() {
    const result = await getAllAccounts()
    setAccounts(result)
    if (!currentAccount.address) {
      setCurrentAccount(result[0])
    }
  }

  async function removeAccount() {
    const result = await removeChainxAccount(currentAccount.address)
    console.log('remove account result', currentAccount.address, result)
  }

  async function testSign() {
    if (accounts.length > 0) {
      const sig = await signMessage(currentAccount.address, 'message', 'password')
      setSig(sig);
    }
  }

  return (
    <>
      {
        currentAccount ? 
        <div className="container-account">
          <div className="account-title">
            {currentAccount.name}
          </div>
          <div className="account-address">
            <span>{currentAccount.address}</span>
          </div>
          <div className="copy" onClick={() => removeAccount()}>
            Remove Account
          </div>
        </div>
        :
        <div className="container container-content">
          <button className="new-account" onClick={() =>
            props.history.push('/createAccount')
          }>新增账户
          </button>
          <button className="import-account" onClick={() => 
            props.history.push('/importAccount')
          }>导入账户</button>

          <br />
          {
            accounts.map(account => {
              return (
                <div key={account.address}>
                  <div>
                    <span>name:</span>
                    <span>{account.name}</span>
                  </div>
                  <div>
                    <span>address:</span>
                    <span>{account.address}</span>
                  </div>
                </div>
              )
            })
          }

          <button onClick={testSign}>test sign</button>
          <span>{sig}</span>
        </div>
      }
    </>
  )
}

export default Home