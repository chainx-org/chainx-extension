import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { setHomeLoading } from '../../store/reducers/statusSlice';
import ClipboardJS from 'clipboard';
import Icon from '../../components/Icon';
import '../index.scss';
import { fetchToSign } from '../../store/reducers/txSlice';
import { fetchIntentions } from '@chainx/extension-ui/store/reducers/intentionSlice';
import { fetchTradePairs } from '@chainx/extension-ui/store/reducers/tradeSlice';
import { fetchAssetsInfo } from '@chainx/extension-ui/store/reducers/assetSlice';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import CreateOrImportAccount from '@chainx/extension-ui/pages/Home/CreateOrImportAccount';
import {
  currentAccountSelector,
  fetchAllAccounts,
  fetchCurrentChainXAccount
} from '@chainx/extension-ui/store/reducers/accountSlice';

function Home(props: any) {
  const ref = useRef<HTMLInputElement>(null);
  const [showAccountAction, setShowAccountAction] = useState(false);
  const currentAccount = useSelector(currentAccountSelector);
  const dispatch = useDispatch();
  // @ts-ignore
  const homeLoading = useSelector(state => state.status.homeLoading);
  const isTestNet = useSelector(isTestNetSelector);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    setCopyEvent();
    dispatch(fetchToSign());
    dispatch(fetchIntentions());
    dispatch(fetchTradePairs(isTestNet));
    dispatch(fetchAssetsInfo());
    getAccountInfo().then(() => console.log('Finished to get accounts info'));
  }, [isTestNet]);

  useOutsideClick(ref, () => {
    setShowAccountAction(false);
  });

  async function getAccountInfo() {
    dispatch(setHomeLoading(true));
    try {
      await dispatch(fetchCurrentChainXAccount(isTestNet));
      await dispatch(fetchAllAccounts(isTestNet));
    } finally {
      dispatch(setHomeLoading(false));
    }
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
        // @ts-ignore
        <CreateOrImportAccount history={props.history} />
      )}
    </>
  );
}

export default Home;
