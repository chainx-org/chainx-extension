import React, { useState, useEffect } from 'react'
import { signMessage, getCurrentChainxAccount } from '../../messaging'
import { useRedux } from '../../shared'
import ErrorMessage from '../../components/ErrorMessage';
import './requestSign.scss'

function RequestSign(props: any) {
  const [sig, setSig] = useState('')
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [{currentAccount}, setCurrentAccount] = useRedux('currentAccount', { address: '', name: ''})

  useEffect(() => {
    getCurrentAccount()
  }, [])

  const getCurrentAccount = async () => {
    const result =  await getCurrentChainxAccount()
    setCurrentAccount({ currentAccount: result })
  }

  const check = () => {
    if (!pass) {
      setErrMsg('password is required')
      return false
    }
    return true
  }

  const sign = async () => {
    if (!currentAccount.address) {
      setErrMsg(`Error: address is not exist`)
    }
    if (!check()) {
      return
    }
    try {
      const result = await signMessage(currentAccount.address, 'message', pass)
      console.log('sign message ', result)
      setErrMsg('')
      setSig(result)
    } catch (e) {
      setErrMsg(`Error: ${e.message}`)
    }
  }
  return (
    <div className="container request-sign">
      <div className="detail">
        <div className="detail-item">
          <span>操作</span>
          <span>转账</span>
        </div>
        <div className="detail-item">
          <span>转账数量</span>
          <span>1.00000000 PCX</span>
        </div>
        <div className="detail-item">
          <span>接收人地址</span>
          <span>5PqyfFXGWKi75d5cKAqpkdbmWtVANYcMEbXCHLbpwDYiT1Ec</span>
        </div>
      </div>
      <div className="submit-area">
        <div className="title">
          <span>输入密码</span>
        </div>
        <input
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyPress={event => {
            if (event.key === "Enter") {
              sign()
            }
          }}
          className="input"
          type="password"
          placeholder='密码'
        />
        <div className="button-area margin-top-40">
          <button className="button button-white-half" onClick={() => {
            props.history.push('/')
            window.close()
          }}>取消</button>
          <button className="button button-yellow-half" onClick={() => {
            sign()
          }}>签名</button>
        </div>
        <span className="result">sign result: {sig}</span>
        <ErrorMessage msg={errMsg} />
      </div>
    </div>
  )
}

export default RequestSign