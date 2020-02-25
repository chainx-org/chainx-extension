import { isCurrentNodeInit, useRedux } from '@chainx/extension-ui/shared';
import Icon from '@chainx/extension-ui/components/Icon';
import React from 'react';
import { NodeInfo } from '@chainx/extension-ui/types';
import {
  getDelayClass,
  getDelayText
} from '@chainx/extension-ui/pages/Header/utils';
import { setShowNodeMenu } from '@chainx/extension-ui/store/reducers/statusSlice';
import { useDispatch } from 'react-redux';

export default function({ history, setNode }) {
  const [{ nodeList }] = useRedux<NodeInfo[]>('nodeList', []);
  const [{ currentNode }] = useRedux<NodeInfo>('currentNode', {
    name: '',
    url: '',
    delay: ''
  });
  const [{ isTestNet }] = useRedux('isTestNet');
  const [{ testDelayList }] = useRedux('testDelayList', []);
  const [{ delayList }] = useRedux('delayList', []);
  const dispatch = useDispatch();

  function getDelayList(_isTestNet) {
    if (_isTestNet) {
      return testDelayList;
    } else {
      return delayList;
    }
  }

  return (nodeList || []).map((item, index) => (
    <div
      className={
        item.name === currentNode.name ? 'node-item active' : 'node-item'
      }
      key={item.name}
      onClick={() => {
        setNode(item.url);
      }}
    >
      <div className="node-item-active-flag" />
      <div className="node-item-detail">
        <div className="node-item-detail-url">
          <span className="url">{item.url.split('//')[1] || item.url}</span>
          <div
            className={
              isCurrentNodeInit(item, isTestNet)
                ? 'node-item-detail-edit'
                : 'node-item-detail-edit custom'
            }
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              dispatch(setShowNodeMenu(false));
              const query = {
                nodeInfo: item,
                type: 'remove'
              };
              history.push({
                pathname: '/addNode',
                query: query
              });
            }}
          >
            <Icon name="Edit" />
          </div>
        </div>
        <span
          className={
            'delay ' +
            getDelayClass(
              getDelayList(isTestNet) && getDelayList(isTestNet)[index]
            )
          }
        >
          {getDelayText(
            getDelayList(isTestNet) && getDelayList(isTestNet)[index]
          )}
        </span>
      </div>
    </div>
  ));
}
