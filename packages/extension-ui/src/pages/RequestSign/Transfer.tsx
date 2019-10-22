import React from 'react';
import toPrecision from '../../shared/toPrecision';
import { pcxPrecision } from '../../shared/constants';

export default function(props) {
  const { query } = props;

  return (
    <div className="detail">
      <div className="detail-item">
        <span>操作</span>
        <span>{query.method}</span>
      </div>
      <div className="detail-item">
        <span>转账数量</span>
        <span>
          {toPrecision(query.args[2], pcxPrecision)} {query.args[1]}
        </span>
      </div>
      <div className="detail-item">
        <span>接收人地址</span>
        <span>{query.args[0]}</span>
      </div>
      <div className="detail-item">
        <span>备注</span>
        <span>{query.args[3]}</span>
      </div>
    </div>
  );
}
