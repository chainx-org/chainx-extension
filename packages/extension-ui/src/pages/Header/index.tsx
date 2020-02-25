import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { setChainx, sleep, updateNodeStatus, useOutsideClick, useRedux } from '../../shared';
import { setChainxNode, setNetwork } from '../../messaging';
import { NodeInfo } from '@chainx/extension-ui/types';
import {
  setInitLoading,
  setShowNodeMenu,
  showAccountMenuSelector,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice';
// @ts-ignore
import logo from '../../assets/extension_logo.svg';
// @ts-ignore
import testNetImg from '../../assets/testnet.svg';
// @ts-ignore
import './header.scss';
import AccountsPanel from '@chainx/extension-ui/pages/Header/AccountsPanel';
import NodesPanel from "@chainx/extension-ui/pages/Header/NodesPanel";
import AccountPanelSwitch from "@chainx/extension-ui/pages/Header/AccountPanelSwitch";
import NodesPanelSwitch from "@chainx/extension-ui/pages/Header/NodesPanelSwitch";
import SignHeader from "@chainx/extension-ui/pages/Header/SignHeader";

function Header(props: any) {
  const refNodeList = useRef<HTMLInputElement>(null);
  const [{ isTestNet }, setIsTestNet] = useRedux('isTestNet');
  const [{}, setCurrentNode] = useRedux<NodeInfo>('currentNode', {
    name: '',
    url: '',
    delay: ''
  });
  const [{}, setNodeList] = useRedux<NodeInfo[]>('nodeList', []);
  const [{ delayList }, setDelayList] = useRedux('delayList', []);
  const [{ testDelayList }, setTestDelayList] = useRedux('testDelayList', []);
  const [{}, setCurrentDelay] = useRedux('currentDelay', 0);
  const [{}, setCurrentTestDelay] = useRedux(
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

  function switchNet() {
    setNetwork(!isTestNet);
    setIsTestNet({ isTestNet: !isTestNet });
    dispatch(setShowNodeMenu(false));
    props.history.push('/');
  }

  const nowInSignPage = props.history.location.pathname.includes('requestSign')

  return (
    <div className="header">
      <div className="container container-header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
          {isTestNet && (
            <img className="testnet" src={testNetImg} alt="testNetImg" />
          )}
        </Link>
        {nowInSignPage ? (
          <SignHeader history={props.history} />) : (
          <div className="right">
            <NodesPanelSwitch />
            <AccountPanelSwitch />
          </div>
        )}
        <NodesPanel history={props.history} setNode={setNode} switchNet={switchNet} />
        {showAccountMenu && !showNodeMenu ? (
          <AccountsPanel history={props.history} />
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(Header);
