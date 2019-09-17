import React, { useState } from 'react'
import { addChainxNode } from '../../messaging'
import ErrorMessage from '../../components/ErrorMessage'
import './addNode.scss'

function AddNode(props: any) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const check = () => {
    if (!name || !url) {
      setErrMsg('name and url are required')
      return false
    }
    return true
  }

  const enter = async () => {
    if (!check()) {
      return 
    }
    const result = await addChainxNode(name, url)
    console.log(result)
  }

  return (
    <div className="add-node">
      <span className="title">添加节点</span>
      <input className="input" type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="名称（12字符以内）" />
      <span className="node-url">节点地址（提供核心资产数据）</span>
      <input className="input" type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyPress={event => {
          if (event.key === "Enter") {
            enter()
          }
        }}
        placeholder="wss://w1.chainx.org/ws" />
      <button className="button button-yellow margin-top-40"
        onClick={() => enter()}
      >Confirm</button>
      {
        errMsg ? <ErrorMessage msg={errMsg} /> : null
      }
    </div>
  )
}

export default AddNode