import React, { useState } from 'react';
import { Account } from 'chainx.js';
import { createAccount } from '../../messaging';
import ErrorMessage from '../ErrorMessage';
import WarningMessage from '../WarningMessage';
import './index.scss';
import { useRedux } from '../../shared';

function NameAndPassword(props) {
  const { secret, onSuccess } = props;
  const [obj, setObj] = useState({ name: '', pass: '', repass: '' });
  const [errMsg, setErrMsg] = useState('');
  const [{ accounts }] = useRedux('accounts');
  console.log('accounts', accounts);
  const account = Account.from(secret);
  const address = account.address();
  console.log(address);
  const sameAccount = (accounts || []).find(
    account => account.address === address
  );
  console.log('sameAccount', sameAccount);

  const check = () => {
    if (!obj.name || !obj.pass || !obj.repass) {
      setErrMsg('name and password are required');
      return false;
    }
    if (obj.pass !== obj.repass) {
      console.log('in not match');
      setErrMsg('password is not match');
      return false;
    }
    return true;
  };

  const create = async () => {
    if (!check()) {
      return;
    }

    const keystore = account.encrypt(obj.pass);

    console.log('account name ', obj.name);
    createAccount(obj.name, account.address(), keystore)
      .then(_ => {
        onSuccess();
      })
      .catch(err => {
        setErrMsg(err.message);
      });
  };

  return (
    <>
      <input
        className="input"
        type="text"
        required
        value={obj.name}
        onChange={e => setObj({ ...obj, ['name']: e.target.value })}
        placeholder="标签（12字符以内）"
      />
      <input
        className="input"
        type="password"
        value={obj.pass}
        onChange={e => setObj({ ...obj, ['pass']: e.target.value })}
        placeholder="密码"
      />
      <input
        className="input"
        type="password"
        value={obj.repass}
        onChange={e => setObj({ ...obj, ['repass']: e.target.value })}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            create();
          }
        }}
        placeholder="确认密码"
      />
      <button
        className="button button-yellow margin-top-40"
        onClick={() => {
          create();
        }}
      >
        完成
      </button>
      {errMsg && <ErrorMessage msg={errMsg} />}
      {sameAccount && (
        <WarningMessage
          msg={`Account ${sameAccount.name} has same address, and it will be overwritten by this account.`}
        />
      )}
    </>
  );
}

export default NameAndPassword;
