import { setShowAccountMenu, setShowNodeMenu, showNodeMenuSelector } from '../../store/reducers/statusSlice';
import { getDelayClass } from './utils';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutsideClick } from '../../shared';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { currentMainNetNodeSelector, currentTestNetNodeSelector } from '@chainx/extension-ui/store/reducers/nodeSlice';

export default function() {
  const refNodeList = useRef(null);
  const dispatch = useDispatch();
  const showNodeMenu = useSelector(showNodeMenuSelector);

  const isTestNet = useSelector(isTestNetSelector);
  const currentNode = useSelector(
    isTestNet ? currentTestNetNodeSelector : currentMainNetNodeSelector
  );
  useOutsideClick(refNodeList, () => {
    dispatch(setShowNodeMenu(false));
  });

  console.log('currentNode', currentNode)

  return (
    <div
      ref={refNodeList}
      className="current-node"
      onClick={() => {
        dispatch(setShowNodeMenu(!showNodeMenu));
        dispatch(setShowAccountMenu(false));
      }}
    >
      <span
        className={'dot ' + getDelayClass(currentNode.delay) + '-bg'}
      />
      <span>{currentNode && currentNode.name}</span>
    </div>
  );
}
