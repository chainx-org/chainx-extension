
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { useRedux, useOutsideClick } from '../shared'
import ClipboardJS from 'clipboard'
import { getCurrentChainxAccount, getAllAccounts } from '../messaging'
// @ts-ignore
import Icon from '../components/Icon'
import "./index.scss"

function Home(props: any) {
  const ref = useRef<HTMLInputElement>(null)
  const [showAccountAction, setShowAccountAction] = useState(false)
  const [{currentAccount}, setCurrentAccount] = useRedux('currentAccount', { address: '', name: ''})
  const [{accounts}, setAccounts] = useRedux('accounts')
  const [copySuccess, setCopySuccess] = useState('')

  useEffect(() => {
    setCopyEvent()
    getAccountStatus()
  }, [])

  useOutsideClick(ref, () => {
    setShowAccountAction(false)
  })

  async function getAccountStatus() {
    getCurrentAccount()
    getAccounts()
  }

  async function getCurrentAccount() {
    const result =  await getCurrentChainxAccount()
    setCurrentAccount({ currentAccount: result })
  }

  async function getAccounts() {
    const result = await getAllAccounts()
    setAccounts({ accounts: result })
  }

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.copy')
    clipboard.on('success', function() {
      setCopySuccess('Copied!')
    })
  }

  async function operateAccount(type: string) {
    if (currentAccount.address) {
      props.history.push({ pathname: '/enterPassword', query: 
        { 
          address: currentAccount.address,
          type: type
        }})
    }
    setShowAccountAction(false)
  }

  return (
    <>
      { 
        currentAccount ? 
        <div className="container-account">
          <div className="account-title">
            <span className="name">{currentAccount.name}</span>
            <div ref={ref} className="arrow"  onClick={() => {
              setShowAccountAction(!showAccountAction)
            }}
            >
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
          >
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
          }>导入账户</button>import useOutsideClick from '../shared/useClickOutside';

        </div>
      }
    </>
  )
}

export default Home