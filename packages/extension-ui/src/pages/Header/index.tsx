import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useRedux, useOutsideClick } from '../../shared'
import { setChainxCurrentAccount,
         setChainxNode,
         removeChainxNode,
         getCurrentChainxNode,
         getAllChainxNodes } from '../../messaging'
import { NodeInfo } from "@chainx/extension-ui/types"
import Icon from '../../components/Icon'
import DotInCenterStr from '../../components/DotInCenterStr'
// @ts-ignore
import logo from "../../assets/logo.jpg"
import "./header.scss";

function Header(props: any) {
  const refNodeList = useRef<HTMLInputElement>(null)
  const refAccountList = useRef<HTMLInputElement>(null)
  const [showNodeListArea, setShowNodeListArea] = useState(false)
  const [showAccountArea, setShowAccountArea] = useState(false)
  const [{currentAccount}, setCurrentAccount] = useRedux('currentAccount')
  const [{accounts}] = useRedux('accounts')
  const [currentNode, setCurrentNode] = useState<NodeInfo>({ name: '', url: '' })
  const [nodeList, setNodeList] = useState<NodeInfo[]>([])

  useEffect(() => {
    getNodeStatus()
  }, [])

  useOutsideClick(refNodeList, () => {
    setShowNodeListArea(false)
  })

  useOutsideClick(refAccountList, () => {
    setShowAccountArea(false)
  })

  async function getNodeStatus() {
    const currentNodeResult = await getCurrentChainxNode()
    const nodeListResult = await getAllChainxNodes()
    setCurrentNode(currentNodeResult)
    setNodeList(nodeListResult)
  }

  async function setNode(url: string) {
    await setChainxNode(url)
    await getNodeStatus()
    setShowNodeListArea(false)
  }

  return (
    <div className="header">
      <div className="container container-header">
        {
          props.location.pathname.indexOf('requestSign') > -1 ?
          <div><img className="logo" src={logo} alt="logo" /></div> :
          <Link to='/'>
            <img className="logo" src={logo} alt="logo" />
          </Link>
        }
        {
          props.history.location.pathname.indexOf('requestSign') > -1 ?
          <div className="center-title">
            <span>请求签名</span>
          </div>
          :
          <div className="right">
            <div onClick={() => 
              chrome.windows.create({
                url: 'notification.html', 
                type: 'popup', 
                width: 360, 
                height: 620,
                left: 460 || Math.round(window.screenX + (window.outerWidth / 2) - 180)
              })
            }>Sign</div>
            <div ref={refNodeList} className="current-node" onClick={() => {
              setShowNodeListArea(!showNodeListArea)
              setShowAccountArea(false)
            }}>
              <span className="dot"></span>
              <span>{currentNode.name}</span>
            </div>
            <div ref={refAccountList} className="setting" onClick={() => {
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
              {
                nodeList.map(item => (
                  <div className={item.name === currentNode.name ? 'node-item active' : 'node-item'}
                    key={item.name}
                    onClick={() => {
                      setNode(item.url)
                    }}
                  >
                    <div className="node-item-active-flag">
                    </div>
                    <div className="node-item-detail">
                      <span className="url">{item.url.slice(6)}</span>
                      <span className="delay">44ms</span>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="add-node">
              <Icon name="Add" className="add-node-icon" />
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
            {
              accounts.length > 0 ?
              <div className="accounts">
                {
                  accounts.length > 0 && accounts.map(item => (
                    <div className={item.address === currentAccount.address ? 'account-item active' : 'account-item'} key={item.name}
                      onClick={async () => {
                        setChainxCurrentAccount(item.address).then(d => console.log(d))
                        await setCurrentAccount({ currentAccount: item })
                        setShowAccountArea(false)
                        props.history.push('/')  
                      }}
                    >
                      <div className="account-item-active-flag">
                      </div>
                      <div className="account-item-detail">
                        <span className="name">{item.name}</span>
                        <DotInCenterStr value={item.address} />
                      </div>
                    </div>
                  ))
                }
              </div>
              :
              null
            }
          </div>) : null
        }
      </div>
    </div>
  )
}

export default withRouter(Header)