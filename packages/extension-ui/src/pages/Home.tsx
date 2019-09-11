
import React, { useEffect } from "react"
import { useState } from "react"
import ClipboardJS from 'clipboard'
import { exportChainxAccountPrivateKey, signMessage, getCurrentChainxAccount, removeChainxAccount } from '../messaging'
import { AccountInfo } from "@chainx/extension-ui/types"
// @ts-ignore
import Icon from '../components/Icon'
import "./index.scss"

function Home(props: any) {
  const [showAccountAction, setShowAccountAction] = useState(false)
  const [showPasswordPage, setShowPasswordPage] = useState(false)
  const [pass, setPass] = useState('')
  const [currentAccount, setCurrentAccount] = useState<AccountInfo>({ address: '', name: ''})
  const [copySuccess, setCopySuccess] = useState('')

  useEffect(() => {
    setCopyEvent()
    getCurrentAccount()
  }, [])

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.copy')
    clipboard.on('success', function() {
      setCopySuccess('Copied!')
    })
  }

  async function getCurrentAccount() {
    const result =  await getCurrentChainxAccount()
    setCurrentAccount(result)
  }

  async function exportPk(address: string, password: string) {
    const result = await exportChainxAccountPrivateKey(address, password)
    props.history.push({ pathname: '/showPrivateKey', query: { pk: result}})
  }

  async function removeAccount(address: string, password: string) {
    const result = await removeChainxAccount(currentAccount.address, password)
    getCurrentAccount()
    console.log('remove account result', currentAccount.address, result)
  }

  async function operateAccount(type: string) {
    if (!pass && currentAccount.address) {
      if (type === 'export') {
        exportPk(currentAccount.address, '1q2w3e4r')
      } else if (type === 'remove') {
        removeAccount(currentAccount.address, '1q2w3e4r')
      }
    }
    setShowPasswordPage(false)
  }

  return (
    <>
      { showPasswordPage ?
        <div className="container container-column">
          
          <input className="input" />
          <button className="button button-yellow">确定</button>
        </div>
        :
        currentAccount ? 
        <div className="container-account">
          <div className="account-title">
            <span className="name">{currentAccount.name}</span>
            <div className="arrow"  onClick={() => setShowAccountAction(!showAccountAction)}>
              <Icon className="arrow-icon" name="Arrowdown" />
            </div>
            {
              showAccountAction ?
              <div className="account-action">
                <span onClick={() => operateAccount('export')}>Export PrivateKey</span>
                <span onClick={() => operateAccount('remove')}>Forget Account</span>
              </div>
              : null
            }
          </div>
          <div className="account-address">
            <span>{currentAccount.address}</span>
          </div> 
          <button className="copy"
            data-clipboard-text={currentAccount.address}
            onClick={() => copy()}>
            <Icon className="copy-icon" name="copy" />
            <span className="copy-text">Copy</span>
          </button>
          <span>{copySuccess}</span>
        </div>
        :
        <div className="container container-column container-no-account">
          <button className="button button-white button-new-account" onClick={() =>
            props.history.push('/createAccount')
          }>新增账户
          </button>
          <button className="button button-white button-import-account" onClick={() => 
            props.history.push('/importAccount')
          }>导入账户</button>
        </div>
      }
    </>
  )
}

export default Home