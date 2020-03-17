import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import ClipboardJS from 'clipboard';
import Icon from '../../components/Icon';
import '../index.scss';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import CreateOrImportAccount from '@chainx/extension-ui/pages/Home/CreateOrImportAccount';
import { currentAccountSelector } from '@chainx/extension-ui/store/reducers/accountSlice';
import {
  setShowAccountAction,
  showAccountActionSelector
} from '@chainx/extension-ui/store/reducers/statusSlice';
import AccountActionPanel from '@chainx/extension-ui/pages/Home/AccountActionPanel';

function Home(props: any) {
  const ref = useRef<HTMLInputElement>(null);
  const showAccountAction = useSelector(showAccountActionSelector);
  const currentAccount = useSelector(currentAccountSelector);
  const isTestNet = useSelector(isTestNetSelector);
  const [copySuccess, setCopySuccess] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setCopyEvent();
  }, [isTestNet]);

  useOutsideClick(ref, () => {
    dispatch(setShowAccountAction(false));
  });

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function() {
      setCopySuccess('Copied!');
      setTimeout(() => {
        setCopySuccess('');
      }, 2000);
    });
  }

  return (
    <>
      {currentAccount ? (
        <div className="container-account">
          <div className="account-title">
            <span className="name">{currentAccount.name}</span>
            <div
              ref={ref}
              className="arrow"
              onClick={() => {
                dispatch(setShowAccountAction(true));
              }}
            >
              <Icon className="arrow-icon" name="Arrowdown" />
            </div>
            {showAccountAction && <AccountActionPanel />}
          </div>
          <div className="account-address">
            <span>{currentAccount.address}</span>
          </div>
          <button className="copy" data-clipboard-text={currentAccount.address}>
            <Icon className="copy-icon" name="copy" />
            <span className="copy-text">Copy</span>
          </button>
          <span>{copySuccess}</span>
        </div>
      ) : (
        <CreateOrImportAccount />
      )}
    </>
  );
}

export default Home;
