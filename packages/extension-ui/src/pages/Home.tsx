
import React, { useEffect } from "react"
import { useState } from "react"
import { exportChainxAccountPrivateKey, signMessage, getCurrentChainxAccount, removeChainxAccount } from '../messaging'
import { AccountInfo } from "@chainx/extension-ui/types"
// @ts-ignore
import logo from "../assets/logo.jpg"
import "./index.scss"

function Home(props: any) {
  const [sig, setSig] = useState('')
  const [currentAccount, setCurrentAccount] = useState<AccountInfo>({ address: '', name: ''})
  const [pk, setPk] = useState('')

  useEffect(() => {
    getCurrentAccount()
  }, [])

  async function getCurrentAccount() {
    const result =  await getCurrentChainxAccount()
    setCurrentAccount(result)
  }

  async function exportPk() {
    const result = await exportChainxAccountPrivateKey(currentAccount.address, 'password')
    console.log(result)
    setPk(result)
  }

  async function removeAccount() {
    const result = await removeChainxAccount(currentAccount.address)
    console.log('remove account result', currentAccount.address, result)
  }

  async function testSign() {
    const sig = await signMessage(currentAccount.address, 'message', 'password')
    setSig(sig);
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
          <span>Private Key: {pk}</span>
          <button className="export" onClick={() => exportPk()}>
            Export Private Key
          </button>
        </div>
        :
        <div className="container container-content">
          <button className="button button-white button-new-account" onClick={() =>
            props.history.push('/createAccount')
          }>新增账户
          </button>
          <button className="button button-white button-import-account" onClick={() => 
            props.history.push('/importAccount')
          }>导入账户</button>

          <br />
          <button onClick={testSign}>test sign</button>
          <span>{sig}</span>
        </div>
      }
    </>
  )
}

export default Home