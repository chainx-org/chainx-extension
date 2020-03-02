import Nodes from '@chainx/extension-ui/pages/Header/Nodes';
import Icon from '@chainx/extension-ui/components/Icon';
// @ts-ignore
import switchImg from '../../assets/switch.svg';
import React from 'react';
import { useRedux } from '@chainx/extension-ui/shared';
import { NodeInfo } from '@chainx/extension-ui/types';
import { showNodeMenuSelector } from '@chainx/extension-ui/store/reducers/statusSlice';
import { useSelector } from 'react-redux';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';

export default function({ history, setNode, switchNet }) {
  const isTestNet = useSelector(isTestNetSelector);
  const [{ currentNode }] = useRedux<NodeInfo>('currentNode');
  const showNodeMenu = useSelector(showNodeMenuSelector);

  return (
    <div className={(showNodeMenu ? '' : 'hide ') + 'node-list-area'}>
      <div className="node-list">
        {currentNode && <Nodes history={history} setNode={setNode} />}
      </div>
      <div
        className="add-node node-action-item"
        onClick={() => {
          history.push('/addNode');
        }}
      >
        <Icon name="Add" className="add-node-icon node-action-item-img" />
        <span>Add node</span>
      </div>
      <div
        className="switch-net node-action-item"
        onClick={() => {
          switchNet();
        }}
      >
        <img className="node-action-item-img" src={switchImg} alt="switchImg" />
        <span>Switch to {isTestNet ? 'Mainnet' : 'Testnet'}</span>
      </div>
    </div>
  );
}
