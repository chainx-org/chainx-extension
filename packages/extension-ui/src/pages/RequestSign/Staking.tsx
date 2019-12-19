import React from 'react';
import { useSelector } from 'react-redux';
import { intentionsSelector } from '../../store/reducers/intentionSlice';
import toPrecision from '../../shared/toPrecision';
import { pcxPrecision } from '../../shared/constants';

export default function(props) {
  const { query } = props;
  const intentions = useSelector(intentionsSelector);

  return (
    <div className="detail">
      {query.args.length > 2 ? (
        <>
          <div className="detail-amount">
            <span>Amount</span>
            <span>
              {toPrecision(query.args.slice(-2, -1), pcxPrecision)} PCX
            </span>
          </div>
          {query.method === 'renominate' && (
            <div className="detail-item">
              <span>From node</span>
              <span>{intentions && intentions[query.args[0]]}</span>
            </div>
          )}
          <div className="detail-item">
            <span>Dest node</span>
            <span>{intentions && intentions[query.args.slice(-3, -2)]}</span>
          </div>
          <div className="detail-item">
            <span>Memo</span>
            <span>{query.args.slice(-1)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="detail-item">
            <span>Node</span>
            <span>{intentions && intentions[query.args[0]]}</span>
          </div>
          {query.method === 'unfreeze' && (
            <div className="detail-item">
              <span>Id</span>
              <span>{query.args[1]}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
