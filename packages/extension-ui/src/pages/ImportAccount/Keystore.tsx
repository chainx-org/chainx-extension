import { useHistory } from 'react-router';
import {
  ButtonLine,
  Container,
  InputWrapper,
  Title
} from '../../components/styled';
import React, { useEffect, useState } from 'react';
import { PasswordInput, PrimaryButton, TextInput } from '@chainx/ui';
import { useSelector, useDispatch } from 'react-redux';
import { importedKeystoreSelector } from '../../store/reducers/statusSlice';
import { isKeystoreV1 } from '../../utils';
import ErrorMessage from '../../components/ErrorMessage';
import { isTestNetSelector } from '../../store/reducers/networkSlice';
import KeyStore from '@chainx/keystore';
import { Account } from 'chainx.js';
import { createAccount } from '@chainx/extension-ui/messaging';
import { refreshAccount } from '@chainx/extension-ui/store/reducers/accountSlice';

export default function ImportKeystore() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const dispatch = useDispatch();
  const isTestNet = useSelector(isTestNetSelector);
  const keystore = useSelector(importedKeystoreSelector);
  const [isV1, setIsV1] = useState(false);

  useEffect(() => {
    setIsV1(isKeystoreV1(keystore));
  }, [keystore]);

  const encoded = isV1 ? keystore.encoded : keystore;

  const checkAndImport = () => {
    let account;
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet');
      account = Account.from(KeyStore.decrypt(encoded, password));
    } catch (e) {
      setErrMsg('Invalid password or keystore');
      return;
    }

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
    <Container>
      <Title>Import from keystore</Title>

      <InputWrapper>
        {!isV1 && (
          <TextInput
            showClear={false}
            style={{ width: '100%' }}
            type="text"
            value={name}
            onChange={value => setName(value)}
            placeholder="Name(12 characters max)"
          />
        )}
        <PasswordInput
          style={{ width: '100%', marginTop: 12 }}
          value={password}
          onChange={value => setPassword(value)}
          placeholder="Password"
        />
      </InputWrapper>

      <ButtonLine>
        <PrimaryButton
          style={{ minWidth: 200 }}
          size="large"
          onClick={checkAndImport}
        >
          OK
        </PrimaryButton>
      </ButtonLine>
      {errMsg && <ErrorMessage msg={errMsg} />}
    </Container>
  );
}
