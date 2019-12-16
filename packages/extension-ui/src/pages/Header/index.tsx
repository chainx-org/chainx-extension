import React, { useEffect, useRef, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  updateNodeStatus,
  useRedux,
  useOutsideClick,
  isCurrentNodeInit
} from '../../shared';
import {
  setChainxCurrentAccount,
  setChainxNode,
  setNetwork
} from '../../messaging';
import { NodeInfo } from '@chainx/extension-ui/types';
import Icon from '../../components/Icon';
import DotInCenterStr from '../../components/DotInCenterStr';
// @ts-ignore
import logo from '../../assets/extension_logo.svg';
// @ts-ignore
import testNetImg from '../../assets/testnet.svg';
// @ts-ignore
import switchImg from '../../assets/switch.svg';
import './header.scss';

function Header(props: any) {
  const refNodeList = useRef<HTMLInputElement>(null);
  const refAccountList = useRef<HTMLInputElement>(null);
  const [showNodeListArea, setShowNodeListArea] = useState(false);
  const [showAccountArea, setShowAccountArea] = useState(false);
  const [{ currentAccount }, setCurrentAccount] = useRedux('currentAccount');
  const [{ accounts }] = useRedux('accounts');
  const [{ isTestNet }, setIsTestNet] = useRedux('isTestNet');
  const [{ currentNode }, setCurrentNode] = useRedux<NodeInfo>('currentNode', {
    name: '',
    url: '',
    delay: ''
  });
  const [{ nodeList }, setNodeList] = useRedux<NodeInfo[]>('nodeList', []);
  const [{ delayList }, setDelayList] = useRedux('delayList', []);
  const [{ testDelayList }, setTestDelayList] = useRedux('testDelayList', []);
  const [{ currentDelay }, setCurrentDelay] = useRedux('currentDelay', 0);
  const [{ currentTestDelay }, setCurrentTestDelay] = useRedux(
    'currentTestDelay',
    0
  );

  console.log(props)

  useEffect(() => {
    updateNodeStatus(
      setCurrentNode,
      isTestNet ? setCurrentTestDelay : setCurrentDelay,
      setNodeList,
      isTestNet ? testDelayList : delayList,
      isTestNet ? setTestDelayList : setDelayList,
      isTestNet
    );
  }, [isTestNet]);

  useOutsideClick(refNodeList, () => {
    setShowNodeListArea(false);
  });

  useOutsideClick(refAccountList, () => {
    setShowAccountArea(false);
  });

  function getCurrentDelay(_isTestNet) {
    if (_isTestNet) {
      return currentTestDelay;
    } else {
      return currentDelay;
    }
  }

  function getDelayList(_isTestNet) {
    if (_isTestNet) {
      return testDelayList;
    } else {
      return delayList;
    }
  }

  async function setNode(url: string) {
    await setChainxNode(url, isTestNet);
    updateNodeStatus(
      setCurrentNode,
      isTestNet ? setCurrentTestDelay : setCurrentDelay,
      setNodeList,
      isTestNet ? testDelayList : delayList,
      isTestNet ? setTestDelayList : setDelayList,
      isTestNet
    );
    setShowNodeListArea(false);
  }

  function getDelayClass(delay: Number | string): string {
    if (delay === 'timeout') {
      return 'red';
    } else if (delay > 300) {
      return 'yellow';
    } else if (delay <= 300) {
      return 'green';
    } else {
      return 'green';
    }
  }

  function getDelayText(delay: Number | string) {
    return delay ? (delay === 'timeout' ? 'timeout' : delay + ' ms') : '';
  }

  function switchNet() {
    setNetwork(!isTestNet);
    setIsTestNet({ isTestNet: !isTestNet });
    setShowNodeListArea(false);
    props.history.push('/');
  }

  return (
    <div className="header">
      <div className="container container-header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
          {isTestNet && (
            <img className="testnet" src={testNetImg} alt="testNetImg" />
          )}
        </Link>
        {props.history.location.pathname.includes('requestSign') ? (
          <div className="center-title">
            <span>{(props.history.location.query && props.history.location.query.method) || 'Sign Request'}</span>
          </div>
        ) : (
          <div className="right">
            <div
              ref={refNodeList}
              className="current-node"
              onClick={() => {
                setShowNodeListArea(!showNodeListArea);
                setShowAccountArea(false);
              }}
            >
              <span
                className={
                  'dot ' + getDelayClass(getCurrentDelay(isTestNet)) + '-bg'
                }
              />
              <span>{currentNode && currentNode.name}</span>
            </div>
            <div
              ref={refAccountList}
              className="setting"
              onClick={() => {
                setShowAccountArea(!showAccountArea);
                setShowNodeListArea(false);
              }}
            >
              <Icon name="Menu" className="setting-icon" />
            </div>
          </div>
        )}
        {
          <div className={(showNodeListArea ? '' : 'hide ') + 'node-list-area'}>
            <div className="node-list">
              {currentNode &&
                (nodeList || []).map((item, index) => (
                  <div
                    className={
                      item.name === currentNode.name
                        ? 'node-item active'
                        : 'node-item'
                    }
                    key={item.name}
                    onClick={() => {
                      setNode(item.url);
                    }}
                  >
                    <div className="node-item-active-flag" />
                    <div className="node-item-detail">
                      <div className="node-item-detail-url">
                        <span className="url">
                          {item.url.split('//')[1] || item.url}
                        </span>
                        <div
                          className={
                            isCurrentNodeInit(item, isTestNet)
                              ? 'node-item-detail-edit'
                              : 'node-item-detail-edit custom'
                          }
                          onClick={e => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            setShowNodeListArea(false);
                            const query = {
                              nodeInfo: item,
                              type: 'remove'
                            };
                            props.history.push({
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
                            getDelayList(isTestNet) &&
                              getDelayList(isTestNet)[index]
                          )
                        }
                      >
                        {getDelayText(
                          getDelayList(isTestNet) &&
                            getDelayList(isTestNet)[index]
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div
              className="add-node node-action-item"
              onClick={() => {
                props.history.push('/addNode');
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
              <img
                className="node-action-item-img"
                src={switchImg}
                alt="switchImg"
              />
              <span>Switch to {isTestNet ? 'Mainnet' : 'Testnet'}</span>
            </div>
          </div>
        }
        {showAccountArea && !showNodeListArea ? (
          <div className="account-area">
            <div className="action">
              <div
                onClick={() => {
                  setShowAccountArea(false);
                  props.history.push('/importAccount');
                }}
              >
                <Icon name="Putin" className="account-area-icon" />
                <span>Import</span>
              </div>
              <div
                onClick={() => {
                  setShowAccountArea(false);
                  props.history.push('/createAccount');
                }}
              >
                <Icon name="Add" className="account-area-icon" />
                <span>New</span>
              </div>
            </div>
            {accounts.length > 0 ? (
              <div className="accounts">
                {accounts.length > 0 &&
                  accounts.map(item => (
                    <div
                      className={
                        item.address === currentAccount.address
                          ? 'account-item active'
                          : 'account-item'
                      }
                      key={item.name}
                      onClick={async () => {
                        setChainxCurrentAccount(
                          item.address,
                          isTestNet
                        ).then(d => console.log(d));
                        await setCurrentAccount({ currentAccount: item });
                        setShowAccountArea(false);
                        props.history.push('/');
                      }}
                    >
                      <div className="account-item-active-flag" />
                      <div className="account-item-detail">
                        <span className="name">{item.name}</span>
                        <DotInCenterStr value={item.address} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(Header);
