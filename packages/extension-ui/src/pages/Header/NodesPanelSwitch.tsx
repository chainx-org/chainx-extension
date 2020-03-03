import {
  setShowAccountMenu,
  setShowNodeMenu,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice';
import { getDelayClass } from './utils';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutsideClick, useRedux } from '../../shared';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import {
  currentMainNetNodeSelector,
  currentTestNetNodeSelector
} from '@chainx/extension-ui/store/reducers/nodeSlice';

export default function() {
  const refNodeList = useRef(null);
  const dispatch = useDispatch();
  const showNodeMenu = useSelector(showNodeMenuSelector);

  const [{ currentTestDelay }] = useRedux('currentTestDelay', 0);
  const [{ currentDelay }] = useRedux('currentDelay', 0);
  const isTestNet = useSelector(isTestNetSelector);
  const currentNode = useSelector(
    isTestNet ? currentTestNetNodeSelector : currentMainNetNodeSelector
  );
  useOutsideClick(refNodeList, () => {
    dispatch(setShowNodeMenu(false));
  });

  function getCurrentDelay(_isTestNet) {
    if (_isTestNet) {
      return currentTestDelay;
    } else {
      return currentDelay;
    }
  }

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
        className={'dot ' + getDelayClass(getCurrentDelay(isTestNet)) + '-bg'}
      />
      <span>{currentNode && currentNode.name}</span>
    </div>
  );
}