import React, { useState } from 'react'
import { signMessage } from '../../messaging'
import './requestSign.scss'

function RequestSign(props: any) {
  const [sig, setSig] = useState('')
  const [pass, setPass] = useState('')

  const sign = async () => {
    const result = await signMessage('5QNKsFw5FYBUst68sHuW6CiMKY3FkJ6sLhof4Qw2xhRuRmxn', 'message', pass)
    console.log('sign message ', result)
    setSig(result)
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
          <button className="button button-white-half" onClick={() => props.history.push('/')}>取消</button>
          <button className="button button-yellow-half" onClick={() => {
            sign()
          }}>签名</button>
        </div>
        <span>sign result: {sig}</span>
      </div>
    </div>
  )
}

export default RequestSign