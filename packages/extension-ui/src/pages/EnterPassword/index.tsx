import React from 'react';
import { useState } from 'react';
import { Account } from 'chainx.js';
import './enterPassword.scss';
import {
  exportChainxAccountPrivateKey,
  removeChainxAccount
} from '../../messaging';
import ErrorMessage from '../../components/ErrorMessage';

function EnterPassword(props: any) {
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');

  async function exportPk(keystore: Object, password: string) {
    try {
      const pk = Account.fromKeyStore(keystore, password).privateKey()
      props.history.push({
        pathname: '/showPrivateKey',
        query: { pk: pk }
      });
    } catch (error) {
      setErrMsg(error.message);
      console.log('export error', error.message);
    }
  }

  async function removeAccount(address: string) {
    try {
      await removeChainxAccount(address);
      props.history.push('/');
    } catch (error) {
      setErrMsg(error.message);
      console.log('export error', error.message);
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
        removeAccount(address);
      }
    }
  };

  return (
    <div className="enter-password">
      <span className="title">输入密码</span>
      <input
        className="input"
        type="password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            enter();
          }
        }}
        placeholder="密码"
      />
      <button
        className="button button-yellow margin-top-40"
        onClick={() => enter()}
      >
        Confirm
      </button>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  );
}

export default EnterPassword;
