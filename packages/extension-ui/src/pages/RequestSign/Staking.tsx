import React from 'react';
import { useSelector } from 'react-redux';
import { intentionAccountNameMapSelector } from '../../store/reducers/intentionSlice';
import toPrecision from '../../shared/toPrecision';
import { getChainx } from '../../shared/chainx';
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice';
import { nominateMethodNames } from './constants';
import DetailItem from './components/DetailItem';
import DetailAmount from './components/DetailAmount';
import { pcxPrecisionSelector } from '@chainx/extension-ui/store/reducers/assetSlice';

export default function() {
  const intentionAccountNameMap = useSelector(intentionAccountNameMapSelector);
  const chainx = getChainx();

  const methodName = useSelector(toSignMethodNameSelector);
  const isNominateMethod = nominateMethodNames.includes(methodName);
  const args = useSelector(toSignArgsSelector);
  const pcxPrecision = useSelector(pcxPrecisionSelector);

  if (methodName === 'register') {
    return <DetailItem label="Name" value={args[0]} />
  }

  const getPublicKey = address => {
    if (methodName && args && address) {
      // @ts-ignore
      return chainx.account.decodeAddress(address);
    }
  };

  const nominateMethodElement = (
    <>
      <DetailAmount
        value={toPrecision(args.slice(-2, -1), pcxPrecision)}
        token="PCX"
      />
      {methodName === 'renominate' && (
        <DetailItem
          label="From node"
          value={intentionAccountNameMap[getPublicKey(args[0])]}
        />
      )}
      <DetailItem
        label="Dest node"
        value={intentionAccountNameMap[getPublicKey(args.slice(-3, -2)[0])]}
      />
      <DetailItem label="Memo" value={args.slice(-1)} />
    </>
  );

  const registerElement = <DetailItem label="Name" value={args[0]} />;

  const unfreezeElement = (
    <>
      <DetailItem
        label="Node"
        value={intentionAccountNameMap[getPublicKey(args[0])]}
      />
      <DetailItem label="Id" value={args[1]} />
    </>
  );

  // default ui. 现在claim在用这个
  let element = (
    <>
      <DetailItem
        label="Node"
        value={intentionAccountNameMap[getPublicKey(args[0])]}
      />
    </>
  );

  if (isNominateMethod) {
    element = nominateMethodElement;
  } else if (methodName === 'register') {
    element = registerElement;
  } else if (methodName === 'unfreeze') {
    element = unfreezeElement;
  }

  return element;
}
