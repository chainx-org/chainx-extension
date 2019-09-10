
import React, { useEffect } from 'react'
import { useState } from "react"
import { signMessage } from '../../messaging'
import { AccountInfo } from '@chainx/extension-ui/types'
import './requestSign.scss'

function RequestSign(props: any) {
  const [sig, setSig] = useState('')

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
      <div className="submit">
        <div className="title">
          <span>输入密码</span>
        </div>
        <input />
        <div className="button-area">
          <button>取消</button>
          <button>签名</button>
        </div>
      </div>
    </div>
  )
}

export default RequestSign