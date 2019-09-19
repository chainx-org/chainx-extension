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
    name: ''
  });
  const [{}, setAccounts] = useRedux('accounts');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    setCopyEvent();
    getAccountStatus();
    getUnapprovedTxs();
  }, []);

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
    const result = await getCurrentChainxAccount();
    console.log(result);
    setCurrentAccount({ currentAccount: result });
  }

  async function getAccounts() {
    const result = await getAllAccounts();
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
            新增账户
          </button>
          <button
            className="button button-white button-import-account"
            onClick={() => props.history.push('/importAccount')}
          >
            导入账户
          </button>
        </div>
      )}
    </>
  );
}

export default Home;
