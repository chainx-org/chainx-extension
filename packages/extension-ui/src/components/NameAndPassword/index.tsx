import React, { useState } from 'react';
import { Account } from 'chainx.js';
import { createAccount } from '../../messaging';
import ErrorMessage from '../ErrorMessage';
import WarningMessage from '../WarningMessage';
import { useRedux } from '../../shared';
import { PasswordInput, TextInput } from '@chainx/ui';
import styled from 'styled-components';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { useSelector } from 'react-redux';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

function NameAndPassword(props) {
  const { secret, onSuccess } = props;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [{ accounts }] = useRedux('accounts');
  const isTestNet = useSelector(isTestNetSelector);
  Account.setNet(isTestNet ? 'testnet' : 'mainnet');
  const account = Account.from(secret);
  const address = account.address();
  const sameAccount = (accounts || []).find(
    account => account.address === address
  );

  const check = () => {
    if (!name || !password || !confirmation) {
      setErrMsg('name and password are required');
      return false;
    }
    if (password.length < 8) {
      setErrMsg('password length must great than 8');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setErrMsg('password must include lower and upper characters');
      return false;
    }
    if (password !== confirmation) {
      setErrMsg('password is not match');
      return false;
    }
    if ((accounts || []).find(a => a.name === name)) {
      setErrMsg('name already exist');
      return false;
    }
    return true;
  };

  const create = () => {
    if (!check()) {
      return;
    }

    const keystore = account.encrypt(password);

    createAccount(name, account.address(), keystore, isTestNet)
      .then(_ => {
        onSuccess();
      })
      .catch(err => {
        setErrMsg(err.message);
      });
  };

  return (
    <Wrap>
      <TextInput
        showClear={false}
        className="fixed-width"
        type="text"
        value={name}
        onChange={value => setName(value)}
        placeholder="Name(12 characters max)"
      />
      <PasswordInput
        className="fixed-width"
        value={password}
        onChange={value => setPassword(value)}
        placeholder="Password"
      />
      <PasswordInput
        className="fixed-width"
        value={confirmation}
        onChange={value => setConfirmation(value)}
        placeholder="Password confirmation"
        onKeyPress={event => {
          if (event.key === 'Enter') {
            create();
          }
        }}
      />

      <button
        className="button button-yellow margin-top-40"
        onClick={() => {
          create();
        }}
      >
        OK
      </button>
      {errMsg && <ErrorMessage msg={errMsg} />}
      {sameAccount && (
        <WarningMessage
          msg={`Account ${sameAccount.name} has same address, and it will be overwritten by this account.`}
        />
      )}
    </Wrap>
  );
}

export default NameAndPassword;
