import React from 'react';
import toPrecision from '../../shared/toPrecision';
import { pcxPrecision } from '../../shared/constants';

export default function(props) {
  const { query } = props;

  return (
    <div className="detail">
      <div className="detail-item">
        <span>Operation</span>
        <span>{query.method}</span>
      </div>
      <div className="detail-item">
        <span>Amount</span>
        <span>
          {toPrecision(query.args[2], pcxPrecision)} {query.args[1]}
        </span>
      </div>
      <div className="detail-item">
        <span>Dest</span>
        <span>{query.args[0]}</span>
      </div>
      <div className="detail-item">
        <span>Memo</span>
        <span>{query.args[3]}</span>
      </div>
    </div>
  );
}
