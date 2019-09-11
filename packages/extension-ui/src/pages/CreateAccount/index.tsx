import React from 'react'
import { useState } from 'react'
// @ts-ignore
import Account from '@chainx/account'
import { createAccount } from '../../messaging'
// @ts-ignore
import shuffle from 'lodash.shuffle'
import './createAccount.scss'
import StaticWarning from '../../components/StaticWarning/index';

function CreateAccount(props: any) {
  
  const titleList = ['新增账户', '备份助记词', '验证助记词', '设置标签和密码']
  const subTitleList = ['', '按顺序记下你的助记词，下一步中需要用到', '按备份顺序点击下方助记词', '密码包含至少 8 个字符、大写与小写字母、至少一个数字']
  const buttonTextList = ['开始', '下一步', '下一步', '完成']
  
  const [currentStep, setCurrentStep] = useState(0)
  const [obj, setObj] = useState({name: '', pass: '', repass: ''})
  const [errMsg, setErrMsg] = useState('')
  const [mnemonic] = useState(Account.newMnemonic())
  const mnemonicList = mnemonic.split(' ')
  const [shuffleMnemonicList] = useState(shuffle(mnemonicList))
  const mnemonicWords = mnemonicList.map((item: string, index: number) => ({ value: item, index: index }))
  console.log(mnemonic)
  const create = async() => {
    createAccount(obj.name, obj.pass, mnemonic).then(_ => {
      props.history.push('/')
    }).catch(err => {
      setErrMsg(err.message)
    })
  }

  return (
    <div className="container create-account">
      <div className="create-account-title">
        <span>{titleList[currentStep]}</span>
        <span className="create-account-sub-title">{subTitleList[currentStep]}</span>
      </div>
      <div className="create-account-body">
        <div className="create-account-body-content">
          {
            currentStep === 0 && 
            <StaticWarning title='备份助记词' />
          }
          {
            currentStep === 1 && 
            mnemonicWords.map((item: any) => (
              <div className="word-item" key={item.index}>
                {item.value}
              </div>
            ))
          }
          {
            currentStep === 2 && 
            shuffleMnemonicList.map((item: any, index: number) => (
              <div className="word-item word-item-click" key={index}>
                {item}
              </div>
            ))
          }
          {
            currentStep === 3 && 
            <>
              <input className="input" type="text"
                required
                value={obj.name}
                onChange={e => setObj({...obj, ['name']: e.target.value})}
                placeholder="标签（12字符以内）" />
              <input className="input" type="password"
                value={obj.pass}
                onChange={e => setObj({...obj, ['pass']: e.target.value})}
                placeholder="密码" />
              <input className="input" type="password"
                value={obj.repass}
                onChange={e => setObj({...obj, ['repass']: e.target.value})}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    create()
                  }
                }}
                placeholder="确认密码" />
            </>
          }
        </div>
        {
          errMsg ? <span className="error-message">{errMsg}</span> : null
        }
        {
          currentStep === 2 ?
          <div className="container-spacebetween margin-top-40">
            <button className="button button-white-half" onClick={() => setCurrentStep(s => s-1)}>上一步</button>
            <button className="button button-yellow-half" onClick={() => setCurrentStep(s => s+1)}>下一步</button>
          </div>
          :
          <button className="button button-yellow margin-top-40"
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(currentStep+1)
              }
              if (currentStep === 3) {
                create()
              }
            }}
          >{buttonTextList[currentStep]}</button>
        }
      </div>
    </div>
  )
}

export default CreateAccount