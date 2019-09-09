import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import logo from "../../assets/logo.jpg";
import "./header.scss";

function Header(props: any) {
  const [showNodeListArea, setShowNodeListArea] = useState(false);
  const [showAccountArea, setShowAccountArea] = useState(false);

  return (
    <div className="header">
      <div className="container container-header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        <div className="right">
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
          
      </div>
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
            <div>
              <Link to="importAccount">
                <Icon name="Putin" className="account-area-icon" />
                <span>
                  导入账户
                </span>
              </Link>
            </div>
            <div>
              <Link to="newAccount">
                <Icon name="Add" className="account-area-icon" />
                <span>
                  新建账户
                </span>
              </Link>
            </div>
          </div>
          <div className="accounts">

          </div>
        </div>) : null
      }
    </div>
  )
}

export default Header