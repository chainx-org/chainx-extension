import React, { useState } from 'react';
import { Account } from 'chainx.js';
import './enterPassword.scss';
import { removeChainxAccount } from '../../messaging';
import ErrorMessage from '../../components/ErrorMessage';
import { PasswordInput } from '@chainx/ui';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { useSelector } from 'react-redux';
import { ButtonLine, InputWrapper, Title } from '../../components/styled';
import { PrimaryButton } from '@chainx/ui';

function EnterPassword(props: any) {
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const isTestNet = useSelector(isTestNetSelector);

  async function exportPk(keystore: Object, password: string) {
    try {
      const pk = Account.fromKeyStore(keystore, password).privateKey();
      props.history.push({
        pathname: '/showPrivateKey',
        query: { pk: pk }
      });
    } catch (error) {
      setErrMsg(error.message);
    }
  }

  async function removeAccount(
    address: string,
    password: string,
    keystore: Object
  ) {
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet');
      Account.fromKeyStore(keystore, password);
      await removeChainxAccount(address, isTestNet);
      props.history.push('/');
    } catch (error) {
      setErrMsg(error.message);
    }
  }

  const enter = async function() {
    if (pass) {
      const address = props.location.query.address;
      const keystore = props.location.query.keystore;
      const type = props.location.query.type;
      if (type === 'export') {
        exportPk(keystore, pass);
      } else if (type === 'remove') {
        removeAccount(address, pass, keystore);
      }
    }
  };

  return (
    <div className="enter-password">
      <Title>Input password</Title>
      <InputWrapper>
        <PasswordInput
          className="fixed-width"
          value={pass}
          onChange={setPass}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              enter();
            }
          }}
          placeholder="Password"
        />
      </InputWrapper>
      <ButtonLine>
        <PrimaryButton size="large" onClick={() => enter()}>
          Confirm
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  );
}

export default EnterPassword;
