import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { sleep, useOutsideClick } from '../../shared';
import { setChainxNode, setNetwork } from '../../messaging';
import {
  setInitLoading,
  setShowNodeMenu,
  showAccountMenuSelector,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice';
// @ts-ignore
import './header.scss';
import AccountsPanel from '@chainx/extension-ui/pages/Header/AccountsPanel';
import NodesPanel from '@chainx/extension-ui/pages/Header/NodesPanel';
import AccountPanelSwitch from '@chainx/extension-ui/pages/Header/AccountPanelSwitch';
import NodesPanelSwitch from '@chainx/extension-ui/pages/Header/NodesPanelSwitch';
import SignHeader from '@chainx/extension-ui/pages/Header/SignHeader';
import Logo from './Logo';
import {
  isTestNetSelector,
  setIsTestNet as setStoreIsTestNet
} from '../../store/reducers/networkSlice';
import initNodes, { updateDelay } from '@chainx/extension-ui/shared/nodeUtils';

function Header(props: any) {
  const refNodeList = useRef<HTMLInputElement>(null);
  const isTestNet = useSelector(isTestNetSelector);
  const dispatch = useDispatch();
  const showAccountMenu = useSelector(showAccountMenuSelector);
  const showNodeMenu = useSelector(showNodeMenuSelector);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateDelay()
        .then(() => console.log('Delay info updated'))
        .catch(() => console.log('Failed to update delay info'));
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useOutsideClick(refNodeList, () => {
    dispatch(setShowNodeMenu(false));
  });

  async function setNode(url: string) {
    dispatch(setInitLoading(true));

    // TODO: 目前background和ui保存了两个ChainX实例，后边考虑下如何优化
    await Promise.race([setChainxNode(url, isTestNet), sleep(2000)]);
    initNodes()
      .then(() => {
        console.log('Init ChainX nodes');
      })
      .catch(() => console.log('Fail to init ChainX nodes'));
    dispatch(setShowNodeMenu(false));
  }

  async function switchNet() {
    dispatch(setInitLoading(true));

    await setNetwork(!isTestNet);
    dispatch(setStoreIsTestNet(!isTestNet));
    dispatch(setShowNodeMenu(false));
    props.history.push('/');
  }

  const nowInSignPage = props.history.location.pathname.includes('requestSign');

  return (
    <div className="header">
      <div className="container container-header">
        <Logo />
        {nowInSignPage ? (
          <SignHeader history={props.history} />
        ) : (
          <div className="right">
            <NodesPanelSwitch />
            <AccountPanelSwitch />
          </div>
        )}
        <NodesPanel
          history={props.history}
          setNode={setNode}
          switchNet={switchNet}
        />
        {showAccountMenu && !showNodeMenu ? (
          <AccountsPanel history={props.history} />
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(Header);
