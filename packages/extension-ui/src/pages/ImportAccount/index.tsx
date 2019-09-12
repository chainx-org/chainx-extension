import React from 'react'
import { useState } from 'react'
import './ImportAccount.scss'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'

function ImportAccount(props: any) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [pk, setPk] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [mnemonicList, setMnemonicList] = useState(new Array(12).fill(''))

  const titleList = [['导入助记词', '导入私钥'], ['密码', '密码']]
  const subTitleList = [['按顺序输入助记词', '输入你的账户私钥'], ['', '']]
  const buttonTextList = ['下一步', '完成']

  const checkStep1 = () => {
    console.log(currentStep, currentTabIndex, 'check step1', pk, mnemonicList)
    if (currentTabIndex === 0) {
      if (mnemonicList.some(item => item === '')) {
        setErrMsg('Mnemonic is not correct')
        return
      }
    } else if (currentTabIndex === 1) {
      console.log('check step1 ', pk)
      if (!pk) {
        setErrMsg('Private key is not correct')
        return
      }
    }
    
    setErrMsg('')
    setCurrentStep(s => s+1)
  }

  return (
    <div className="container import-account">
      <div className="import-account-title">
        <div className="import-account-title-select">
          <span>{titleList[currentStep][currentTabIndex]}</span>
          {
            currentStep === 0 ?
            <span className="second-choice" onClick={() => {
              setErrMsg('')
              setCurrentTabIndex(1-currentTabIndex)
            }}>{titleList[currentStep][1-currentTabIndex]}</span>
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
                    onChange={e => {
                      mnemonicList.splice(index, 1, e.target.value)
                      setMnemonicList(Array.from(mnemonicList))
                    }}
                  />
                ))
              }
            </div>
            :
            <div className="import-private-key">
              <textarea
                value={pk}
                onChange={e => setPk(e.target.value)}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    checkStep1()
                  }
                }}
              />
            </div>
            : null
          }
          {
            currentStep === 1 && 
            <NameAndPassword
              type={currentTabIndex === 0 ? 'mnemonic' : 'pk'}
              secret={currentTabIndex === 0 ? mnemonicList.join(' ') : pk}
              onSuccess={function () { props.history.push('/') }}
            />
          }
        </div>
        {
          currentStep === 0 &&
          <button className="button button-yellow margin-top-40"
            onClick={() => {
              if (currentStep < 1) {
                checkStep1()
              }
            }}
          >{buttonTextList[currentStep]}</button>
        }
        {
          errMsg ? <ErrorMessage msg={errMsg} /> : null
        }
      </div>
    </div>
  )
}

export default ImportAccount
