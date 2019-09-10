import React from 'react'
import { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getAllAccounts, setChainxCurrentAccount } from '../../messaging'
import { AccountInfo } from "@chainx/extension-ui/types"
import Icon from '../../components/Icon'
import DotInCenterStr from '../../components/DotInCenterStr'
import logo from "../../assets/logo.jpg"
import "./header.scss";

function Header(props: any) {
  const [showNodeListArea, setShowNodeListArea] = useState(false)
  const [showAccountArea, setShowAccountArea] = useState(false)
  const [accounts, setAccounts] = useState<AccountInfo[]>([])

  useEffect(() => {
    getAccounts()
  }, [])

  async function getAccounts() {
    const result = await getAllAccounts()
    console.log(result)
    setAccounts(result)
  }

  return (
    <div className="header">
      <div className="container container-header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        {
          props.history.location.pathname.indexOf('sign') > -1 ?
          <div className="center-title">
            <span>请求签名</span>
          </div>
          :
          <div className="right">
            <Link to='/requestSign'>Sign</Link>
            <div className="current-node" onClick={() => {
              setShowNodeListArea(!showNodeListArea)
              setShowAccountArea(false)
            }}>
              <span>HashQuark</span>
            </div>
            <div className="setting" onClick={() => {
              setShowAccountArea(!showAccountArea)
              setShowNodeListArea(false)
            }}>
              <Icon name="Menu" className="setting-icon" />
            </div>
          </div>
        }
        {
          showNodeListArea && !showAccountArea ? (
          <div className="node-list-area">
            <div className="node-list">
              <div className="node-item">xixi</div>
            </div>
            <div className="divide-1">
            </div>
            <div className="auto-select">
            <span>自动切换最优节点</span>
            </div>
            <div className="add-node">
              <span>添加节点</span>
            </div>
          </div>) : null
        }
        {
          showAccountArea && !showNodeListArea ? (
          <div className="account-area">
            <div className="action">
              <div onClick={() => {
                setShowAccountArea(false)
                props.history.push('/importAccount')
              }}>
                <Icon name="Putin" className="account-area-icon" />
                <span>
                  导入账户
                </span>
              </div>
              <div onClick={() => {
                setShowAccountArea(false)
                props.history.push('/createAccount')
              }}>
                <Icon name="Add" className="account-area-icon" />
                <span>
                  新建账户
                </span>
              </div>
            </div>
            <div className="accounts">
              {
                accounts.map(item => (
                  <div className="account-item" key={item.name}
                    onClick={() => {
                      setChainxCurrentAccount(item.address).then(d => console.log(d))
                      setShowAccountArea(false)
                      props.history.push('/')
                    }}
                  >
                    <span className="name">{item.name}</span>
                    <DotInCenterStr value={item.address} />
                  </div>
                ))
              }
            </div>
          </div>) : null
        }
      </div>
    </div>
  )
}

export default withRouter(Header)