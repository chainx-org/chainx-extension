import React, { useState } from 'react';
import { Account } from 'chainx.js';
import { useDispatch, useSelector } from 'react-redux';
import PasswordInput from '../components/PasswordInput';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import {
  currentAccountSelector,
  removeAndRefreshAccount
} from '@chainx/extension-ui/store/reducers/accountSlice';

function RemoveAccount(props) {
  const [errMsg, setErrMsg] = useState('');
  const isTestNet = useSelector(isTestNetSelector);
  const dispatch = useDispatch();
  const currentAccount = useSelector(currentAccountSelector);

  function _removeAccount(address, password, keystore) {
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet');
      Account.fromKeyStore(keystore, password);
      dispatch(removeAndRefreshAccount(address, isTestNet));
      props.history.push('/');
    } catch (error) {
      setErrMsg(error.message);
    }
  }

  const enter = function(pass) {
    if (!pass || !currentAccount) {
      return;
    }

    const address = currentAccount.address;
    const keystore = currentAccount.keystore;
    _removeAccount(address, pass, keystore);
  };

  return <PasswordInput enter={enter} errMsg={errMsg} />;
}

export default RemoveAccount;
