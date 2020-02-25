import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  setChainx,
  sleep,
  updateNodeStatus,
  useOutsideClick,
  useRedux
} from '../../shared';
import { setChainxNode, setNetwork } from '../../messaging';
import { NodeInfo } from '@chainx/extension-ui/types';
import Icon from '../../components/Icon';
import {
  setInitLoading,
  setShowAccountMenu,
  setShowNodeMenu,
  showAccountMenuSelector,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice';
// @ts-ignore
import logo from '../../assets/extension_logo.svg';
// @ts-ignore
import testNetImg from '../../assets/testnet.svg';
// @ts-ignore
import switchImg from '../../assets/switch.svg';
import './header.scss';
import AccountsPanel from '@chainx/extension-ui/pages/Header/AccountsPanel';
import Nodes from '@chainx/extension-ui/pages/Header/Nodes';

function Header(props: any) {
  const refNodeList = useRef<HTMLInputElement>(null);
  const refAccountList = useRef<HTMLInputElement>(null);
  const [{ isTestNet }, setIsTestNet] = useRedux('isTestNet');
  const [{ currentNode }, setCurrentNode] = useRedux<NodeInfo>('currentNode', {
    name: '',
    url: '',
    delay: ''
  });
  const [{}, setNodeList] = useRedux<NodeInfo[]>('nodeList', []);
  const [{ delayList }, setDelayList] = useRedux('delayList', []);
  const [{ testDelayList }, setTestDelayList] = useRedux('testDelayList', []);
  const [{ currentDelay }, setCurrentDelay] = useRedux('currentDelay', 0);
  const [{ currentTestDelay }, setCurrentTestDelay] = useRedux(
    'currentTestDelay',
    0
  );
  const dispatch = useDispatch();
  const showAccountMenu = useSelector(showAccountMenuSelector);
  const showNodeMenu = useSelector(showNodeMenuSelector);

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
    dispatch(setShowNodeMenu(false));
  });

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false));
  });

  function getCurrentDelay(_isTestNet) {
    if (_isTestNet) {
      return currentTestDelay;
    } else {
      return currentDelay;
    }
  }

  async function setNode(url: string) {
    dispatch(setInitLoading(true));
    await Promise.race([setChainxNode(url, isTestNet), sleep(2000)]);
    updateNodeStatus(
      setCurrentNode,
      isTestNet ? setCurrentTestDelay : setCurrentDelay,
      setNodeList,
      isTestNet ? testDelayList : delayList,
      isTestNet ? setTestDelayList : setDelayList,
      isTestNet
    );
    dispatch(setShowNodeMenu(false));

    Promise.race([setChainx(url), sleep(5000)])
      .then(chainx => {
        if (!chainx) {
          props.history.push('/nodeError');
        } else {
          props.history.push('/redirect');
        }
      })
      .catch(e => {
        console.log('switch node error ', e);
        props.history.push('/nodeError');
      })
      .finally(() => {
        dispatch(setInitLoading(false));
      });
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

  function switchNet() {
    setNetwork(!isTestNet);
    setIsTestNet({ isTestNet: !isTestNet });
    dispatch(setShowNodeMenu(false));
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
            <span>
              {(
                (props.history.location.query &&
                  props.history.location.query.method) ||
                ''
              )
                .replace(/([A-Z])/g, ' ' + '$1')
                .toLowerCase() || 'Sign Request'}
            </span>
          </div>
        ) : (
          <div className="right">
            <div
              ref={refNodeList}
              className="current-node"
              onClick={() => {
                dispatch(setShowNodeMenu(!showNodeMenu));
                dispatch(setShowAccountMenu(false));
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
                dispatch(setShowAccountMenu(!showAccountMenu));
                dispatch(setShowNodeMenu(false));
              }}
            >
              <Icon name="Menu" className="setting-icon" />
            </div>
          </div>
        )}
        {
          <div className={(showNodeMenu ? '' : 'hide ') + 'node-list-area'}>
            <div className="node-list">
              {currentNode && (
                <Nodes history={props.history} setNode={setNode} />
              )}
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
        {showAccountMenu && !showNodeMenu ? (
          <AccountsPanel history={props.history} />
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(Header);
