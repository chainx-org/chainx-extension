import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick, useRedux } from '../shared';
import ClipboardJS from 'clipboard';
import {
  getAllAccounts,
  getCurrentChainxAccount,
  getToSign
} from '../messaging';
import Icon from '../components/Icon';
import './index.scss';

function Home(props: any) {
  const ref = useRef<HTMLInputElement>(null);
  const [showAccountAction, setShowAccountAction] = useState(false);
  const [{ currentAccount }, setCurrentAccount] = useRedux('currentAccount', {
    address: '',
    name: '',
    keystore: {}
  });
  const [{}, setAccounts] = useRedux('accounts');
  const [{ isTestNet }] = useRedux('isTestNet');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    setCopyEvent();
    getAccountStatus();
    getUnapprovedTxs();
  }, [isTestNet]);

  useOutsideClick(ref, () => {
    setShowAccountAction(false);
  });

  async function getUnapprovedTxs() {
    try {
      const toSign = await getToSign();
      if (toSign) {
        props.history.push({
          // @ts-ignore
          pathname: '/requestSign/' + toSign.id,
          query: toSign
        });
      }
    } catch (error) {
      console.log('sign request error occurs ', error);
    }
  }

  async function getAccountStatus() {
    getCurrentAccount();
    getAccounts();
  }

  async function getCurrentAccount() {
    const result = await getCurrentChainxAccount(isTestNet);
    setCurrentAccount({ currentAccount: result });
  }

  async function getAccounts() {
    const result = await getAllAccounts(isTestNet);
    setAccounts({ accounts: result });
  }

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function() {
      setCopySuccess('Copied!');
      setTimeout(() => {
        setCopySuccess('');
      }, 2000);
    });
  }

  async function operateAccount(type: string) {
    if (currentAccount.address) {
      props.history.push({
        pathname: '/enterPassword',
        query: {
          address: currentAccount.address,
          keystore: currentAccount.keystore,
          type: type
        }
      });
    }
    setShowAccountAction(false);
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
                setShowAccountAction(!showAccountAction);
              }}
            >
              <Icon className="arrow-icon" name="Arrowdown" />
            </div>
            {showAccountAction ? (
              <div className="account-action">
                <span onClick={() => operateAccount('export')}>
                  Export PrivateKey
                </span>
                <span onClick={() => operateAccount('remove')}>
                  Forget Account
                </span>
              </div>
            ) : null}
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
        <div className="container container-column container-no-account">
          <button
            className="button button-white button-new-account"
            onClick={() => props.history.push('/createAccount')}
          >
            New Account
          </button>
          <button
            className="button button-white button-import-account"
            onClick={() => props.history.push('/importAccount')}
          >
            Import Account
          </button>
        </div>
      )}
    </>
  );
}

export default Home;
