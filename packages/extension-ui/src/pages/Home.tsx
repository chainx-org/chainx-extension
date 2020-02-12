import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick, useRedux } from '../shared';
import { useDispatch, useSelector } from 'react-redux';
import { setHomeLoading } from '../store/reducers/statusSlice';
import ClipboardJS from 'clipboard';
import { getAllAccounts, getCurrentChainxAccount } from '../messaging';
import Icon from '../components/Icon';
import './index.scss';
// @ts-ignore
import logo from '../assets/extension_logo.svg';
import { fetchToSign, toSignSelector } from '../store/reducers/txSlice';
import { fetchIntentions } from '@chainx/extension-ui/store/reducers/intentionSlice';
import { fetchTradePairs } from '@chainx/extension-ui/store/reducers/tradeSlice';

function Home(props: any) {
  const ref = useRef<HTMLInputElement>(null);
  const [showAccountAction, setShowAccountAction] = useState(false);
  const [{ currentAccount }, setCurrentAccount] = useRedux('currentAccount', {
    address: '',
    name: '',
    keystore: {}
  });
  const dispatch = useDispatch();
  const homeLoading = useSelector(state => state.status.homeLoading);
  const [{}, setAccounts] = useRedux('accounts');
  const [{ isTestNet }] = useRedux('isTestNet');
  const [copySuccess, setCopySuccess] = useState('');
  const toSign = useSelector(toSignSelector);

  useEffect(() => {
    setCopyEvent();
    dispatch(fetchToSign());
    dispatch(fetchIntentions());
    dispatch(fetchTradePairs(isTestNet));
    getAccountInfo().then(() => console.log('Finished to get accounts info'));
  }, [isTestNet]);

  useOutsideClick(ref, () => {
    setShowAccountAction(false);
  });

  useEffect(() => {
    if (toSign) {
      props.history.push({
        // @ts-ignore
        pathname: '/requestSign/' + toSign.id,
        query: toSign
      });
    }
  }, [toSign]);

  async function getAccountInfo() {
    await getCurrentAccount();
    await getAccounts();
    dispatch(setHomeLoading(false));
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

  if (homeLoading) {
    return <></>;
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
          <div className="home-logo">
            <img src={logo} alt="logo" />
          </div>
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
