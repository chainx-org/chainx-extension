import {
  setShowAccountMenu,
  setShowNodeMenu,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutsideClick } from '../../shared';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import {
  currentMainNetNodeSelector,
  currentTestNetNodeSelector
} from '@chainx/extension-ui/store/reducers/nodeSlice';
import styled from 'styled-components';

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin-right: 6px;
  background-color: ${props =>
    // @ts-ignore
    props.delay === 'timeout'
      ? '#DE071C'
      : 
      // @ts-ignore
      props.delay > 300
      ? '#ECB417'
      : '#2CAA84'};
`;

export default function() {
  const refNodeList = useRef(null);
  const dispatch = useDispatch();
  const showNodeMenu = useSelector(showNodeMenuSelector);

  const isTestNet = useSelector(isTestNetSelector);
  const currentNode =
    useSelector(
      isTestNet ? currentTestNetNodeSelector : currentMainNetNodeSelector
    ) || {};
  useOutsideClick(refNodeList, () => {
    dispatch(setShowNodeMenu(false));
  });

  return (
    <div
      ref={refNodeList}
      className="current-node"
      onClick={() => {
        dispatch(setShowNodeMenu(!showNodeMenu));
        dispatch(setShowAccountMenu(false));
      }}
    >
      {
        // @ts-ignore
        <Dot delay={currentNode.delay} />
      }
      <span>{currentNode && currentNode.name}</span>
    </div>
  );
}
