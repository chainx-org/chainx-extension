import React from 'react';
import { useSelector } from 'react-redux';
import { toSignExtrinsicSelector } from '../../store/reducers/txSlice';

export default function({ history }) {
  const extrinsic = useSelector(toSignExtrinsicSelector);
  const methodName = extrinsic && extrinsic.methodName;

  return (
    <div className="center-title">
      <span>
        {(methodName || '').replace(/([A-Z])/g, ' $1').toLowerCase() ||
          'Sign Request'}
      </span>
    </div>
  );
}
