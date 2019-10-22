import React from "react";

export default function (props) {
  const { query } = props;

  return <div className="detail">
    <div className="detail-item">
      <span>操作</span>
      <span>{query.method}</span>
    </div>
    <div className="detail-item">
      <span>转账数量</span>
      <span>{query.args[2]} PCX</span>
    </div>
    <div className="detail-item">
      <span>接收人地址</span>
      <span>{query.args[0]}</span>
    </div>
  </div>
}