import Icon from '@chainx/extension-ui/components/Icon';
import { setChainxCurrentAccount } from '@chainx/extension-ui/messaging';
import DotInCenterStr from '@chainx/extension-ui/components/DotInCenterStr';
import ReactTooltip from 'react-tooltip';
import React, { useEffect, useState } from 'react';
import ClipboardJS from 'clipboard';
import { setShowAccountMenu, setShowImportMenu } from '@chainx/extension-ui/store/reducers/statusSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import {
  accountsSelector,
  currentAccountSelector,
  fetchCurrentChainXAccount
} from '@chainx/extension-ui/store/reducers/accountSlice';

export default function({ history }) {
  const currentAccount = useSelector(currentAccountSelector);
  const accounts = useSelector(accountsSelector);
  const isTestNet = useSelector(isTestNetSelector);
  const [copyText, setCopyText] = useState('Copy');
  const dispatch = useDispatch();

  useEffect(() => {
    const clipboard = new ClipboardJS('.account-copy');
    clipboard.on('success', function() {
      setCopyText('Copied!');
    });
  }, []);

  return (
    <div className="account-area">
      <div className="action">
        <div
          onClick={() => {
            dispatch(setShowAccountMenu(false));
            dispatch(setShowImportMenu(true))
          }}
        >
          <Icon name="Putin" className="account-area-icon" />
          <span>Import</span>
        </div>
        <div
          onClick={() => {
            dispatch(setShowAccountMenu(false));
            history.push('/createAccount');
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
                  await setChainxCurrentAccount(
                    item.address,
                    isTestNet
                  ).then(d => console.log(d));
                  dispatch(fetchCurrentChainXAccount(isTestNet));
                  dispatch(setShowAccountMenu(false));
                  history.push('/');
                }}
              >
                <div className="account-item-active-flag" />
                <div className="account-item-detail">
                  <span className="name">{item.name}</span>
                  <div className="address">
                    <DotInCenterStr value={item.address} />
                    <button
                      className="account-copy"
                      data-clipboard-text={item.address}
                      onClick={e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                      }}
                      data-tip
                      data-for="copy-address-tooltip"
                    >
                      <Icon className="copy-icon" name="copy" />
                    </button>
                    <ReactTooltip
                      id="copy-address-tooltip"
                      effect="solid"
                      globalEventOff="click"
                      className="extension-tooltip"
                      afterHide={() => setCopyText('Copy')}
                    >
                      <span>{copyText}</span>
                    </ReactTooltip>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}
