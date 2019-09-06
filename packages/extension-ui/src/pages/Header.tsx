import React from "react";
import { useState } from "react";
import logo from "../assets/logo.jpg";
import "./index.scss";

function Header(props: any) {
  const [showNodeList, setShowNodeList] = useState(false);

  return (
    <div className="header">
      <div className="container container-header">
        <img className="logo" src={logo} alt="logo" />
        <div className="right">
          <div className="current-node">
            <span>HashQuark</span>
          </div>
          <div className="setting" onClick={() =>
            setShowNodeList(!showNodeList)
          }><span>设置</span></div>
        </div>
          
      </div>
      {
        showNodeList ? (
        <div className="node-list-area">

        </div>) : null
      }
      
    </div>
  )
}

export default Header