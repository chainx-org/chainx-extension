import React from 'react'
import { useState } from 'react'
import './enterPassword.scss'
import { exportChainxAccountPrivateKey, removeChainxAccount } from '../../messaging'

function EnterPassword(props: any) {
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')

  async function exportPk(address: string, password: string) {
    try {
      const result = await exportChainxAccountPrivateKey(address, password)
      props.history.push({ pathname: '/showPrivateKey', query: { pk: result}})
    } catch (error) {
      setErrMsg(error.message)
      console.log('export error', error.message)
    }
  }

  async function removeAccount(address: string, password: string) {
    try {
      await removeChainxAccount(address, password)
      props.history.push('/')
    } catch (error) {
      setErrMsg(error.message)
      console.log('export error', error.message)
    }
  }

  const enter = async function() {
    if (pass) {
      const address = props.location.query.address
      const type = props.location.query.type
      if (type === 'export') {
        exportPk(address, pass)
      } else if (type === 'remove') {
        removeAccount(address, pass)
      }
    }
  }

  return (
    <div className="enter-password">
      <span className="title">输入密码</span>
      <input className="input" type="password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        onKeyPress={event => {
          if (event.key === "Enter") {
            enter()
          }
        }}
        placeholder="密码" />
      {
        errMsg ? <span className="error-message">{errMsg}</span> : null
      }
      <button className="button button-yellow margin-top-40"
        onClick={() => enter()}
      >Confirm</button>
    </div>
  )
}

export default EnterPassword