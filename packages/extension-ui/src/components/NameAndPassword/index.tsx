import React, { useState, useEffect } from 'react';
import { Account } from 'chainx.js';
import { createAccount } from '../../messaging';
import ErrorMessage from '../ErrorMessage';
import WarningMessage from '../WarningMessage';
import { PasswordInput, TextInput } from '@chainx/ui';
import styled from 'styled-components';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SubTitle, Title } from '@chainx/extension-ui/components/styled';
import {
  accountsSelector,
  refreshAccount
} from '@chainx/extension-ui/store/reducers/accountSlice';
import { useHistory } from 'react-router';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

function NameAndPassword(props) {
  const { secret } = props;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const accounts = useSelector(accountsSelector);
  const isTestNet = useSelector(isTestNetSelector);
  Account.setNet(isTestNet ? 'testnet' : 'mainnet');
  const [sameAccount, setSameAccount] = useState(null);

  useEffect(() => {
    try {
      const account = Account.from(secret);
      const address = account.address();
      const same = (accounts || []).find(
        account => account.address === address
      );
      setSameAccount(same);
    } catch (e) {
      setErrMsg('Invalid private key or mnemonic');
    }
  }, [secret]);

  const dispatch = useDispatch();

  const check = () => {
    try {
      Account.from(secret);
    } catch (e) {
      setErrMsg('Invalid private key or mnemonic');
      return false;
    }

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

  const history = useHistory();

  const create = () => {
    if (!check()) {
      return;
    }

    const account = Account.from(secret);
    const keystore = account.encrypt(password);

    createAccount(name, account.address(), keystore, isTestNet)
      .then(_ => {
        dispatch(refreshAccount(isTestNet));
        history.push('/');
      })
      .catch(err => {
        setErrMsg(err.message);
      });
  };

  return (
    <Wrapper>
      <Title>Name and password setting</Title>
      <SubTitle>
        Password contains at lease 8 characters, and at least one upper,lower
        and number case character.
      </SubTitle>
      <TextInput
        showClear={false}
        style={{ flex: 'unset' }}
        type="text"
        value={name}
        onChange={value => setName(value)}
        placeholder="Name(12 characters max)"
      />
      <PasswordInput
        style={{ flex: 'unset', marginTop: 16 }}
        value={password}
        onChange={value => setPassword(value)}
        placeholder="Password"
      />
      <PasswordInput
        style={{ flex: 'unset', marginTop: 16 }}
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
          msg={`Account ${sameAccount &&
          // @ts-ignore
          sameAccount.name} has same address, and it will be overwritten by this account.`}
        />
      )}
    </Wrapper>
  );
}

export default NameAndPassword;
