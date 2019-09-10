import React from 'react'
import { useState } from 'react'
import { createAccount, createAccountFromPrivateKey } from '../../messaging'
import './ImportAccount.scss'

function ImportAccount(props: any) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [errMsg, setErrMsg] = useState('')
  const [mnemonicList, setMnemonicList] = useState(new Array(12).fill(''))

  const titleList = [['导入助记词', '导入私钥'], ['密码', '密码']]
  const subTitleList = [['按顺序输入助记词', '输入你的账户私钥'], ['', '']]
  const buttonTextList = ['下一步', '完成']

  return (
    <div className="container import-account">
      <div className="import-account-title">
        <div className="import-account-title-select">
          <span>{titleList[currentStep][currentTabIndex]}</span>
          {
            currentStep === 0 ?
            <span className="second-choice" onClick={() => setCurrentTabIndex(1-currentTabIndex)}>{titleList[currentStep][1-currentTabIndex]}</span>
            : null
          }
        </div>
        <span className="import-account-sub-title">{subTitleList[currentStep][currentTabIndex]}</span>
      </div>
      <div className="import-account-body">
        <div className="import-account-body-content">
          {
            currentStep === 0 ?
            currentTabIndex === 0 ? 
            <div className="import-mnemonic">
              {
                mnemonicList.map((item, index) => (
                  <input className="word-item" key={index} 
                    value={mnemonicList[index]}
                    onChange={value => {
                      mnemonicList.splice(index, 1, value)
                      setMnemonicList(mnemonicList)
                    }}
                  />
                ))
              }
            </div>
            :
            <div className="import-private-key">
              <textarea />
            </div>
            : null
          }
          {
            currentStep === 1 && 
            <>
              <input className="input" type="password" name="password" placeholder="密码" />
            </>
          }
        </div>
        {
          errMsg ? <span className="error-message">{errMsg}</span> : null
        }
        <button className="button button-yellow margin-top-40"
          onClick={() => {
            if (currentStep < 1) {
              setCurrentStep(currentStep+1)
            }
            const pk = ''
            if (currentStep === 1) {
              const name = 'pk'
              const pass = 'password'
              console.log(name, pass, mnemonicList)
              if (currentTabIndex === 1) {
                createAccountFromPrivateKey(name, pk, pass).then(data => {
                  console.log('import pk', data)
                  props.history.push('/')
                }).catch(err => {
                  setErrMsg(err.message)
                })
              } else if (currentTabIndex === 0) {
                createAccount(name, pass, mnemonicList.join(' ')).then(_ => {
                  props.history.push('/')
                }).catch(err => {
                  setErrMsg(err.message)
                })
              }
            }
          }}
        >{buttonTextList[currentStep]}</button>
      </div>
    </div>
  )
}

export default ImportAccount
