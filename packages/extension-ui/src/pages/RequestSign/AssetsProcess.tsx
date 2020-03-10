import React, { useEffect } from 'react';
import toPrecision from '../../shared/toPrecision';
import { useDispatch, useSelector } from 'react-redux';
import { feeSelector, fetchFee } from '../../store/reducers/tradeSlice';
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { pcxPrecisionSelector } from '@chainx/extension-ui/store/reducers/assetSlice';
import DetailItem from './components/DetailItem';
import DetailAmount from './components/DetailAmount';

export default function() {
  const fee = useSelector(feeSelector);
  const dispatch = useDispatch();
  const isTestNet = useSelector(isTestNetSelector);
  const pcxPrecision = useSelector(pcxPrecisionSelector);

  useEffect(() => {
    dispatch(fetchFee(isTestNet));
  }, [dispatch]);

  const methodName = useSelector(toSignMethodNameSelector);
  const args = useSelector(toSignArgsSelector);

  return (
    <>
      {methodName === 'withdraw' && (
        <>
          <DetailAmount
            value={toPrecision(args[1], pcxPrecision)}
            token={args[0]}
          />
          <DetailItem
            label="Fee"
            value={`${toPrecision(fee, pcxPrecision)} ${args[0]}`}
          />
          <DetailItem label="Memo" value={args[3]} />
        </>
      )}
      {methodName === 'revokeWithdraw' && (
        <DetailItem label="Id" value={args[0]} />
      )}
    </>
  );
}
