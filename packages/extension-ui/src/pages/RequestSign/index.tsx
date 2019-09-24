import React, { useState, useEffect } from 'react';
import {
  signTransaction,
  rejectSign,
  getCurrentChainxAccount,
  getCurrentChainxNode
} from '../../messaging';
import { setChainx } from '@chainx/extension/src/background/chainx';
import { SignTransactionRequest } from '@chainx/extension-ui/types';
import { useRedux } from '../../shared';
import ErrorMessage from '../../components/ErrorMessage';
import './requestSign.scss';

function RequestSign(props: any) {
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [{ currentAccount }, setCurrentAccount] = useRedux('currentAccount', {
    address: '',
    name: ''
  });

  const {
    match: {
      params: { id }
    },
    location: { query }
  } = props;

  useEffect(() => {
    getCurrentAccount();
  }, []);

  const getCurrentAccount = async () => {
    const result = await getCurrentChainxAccount();
    setCurrentAccount({ currentAccount: result });
  };

  const check = () => {
    if (!pass) {
      setErrMsg('password is required');
      return false;
    }
    return true;
  };

  const sign = async () => {
    setErrMsg('');
    if (!currentAccount || !currentAccount.address) {
      setErrMsg(`Error: address is not exist`);
    }
    if (!check()) {
      return;
    }

    const node = await getCurrentChainxNode();
    const chainx = await setChainx(node.url);

    const { id, address, module, method, args } = query;

    const call = chainx.api.tx[module][method];

    if (!call) {
      setErrMsg('Invalid method');
    }

    if (currentAccount.address !== address) {
      setErrMsg('Invalid address');
    }

    try {
      const account = chainx.account.fromKeyStore(
        currentAccount.keystore,
        pass
      );
      const submittable = call(...args);
      const nonce = await submittable.getNonce(account.publicKey());
      submittable.sign(account, { nonce: nonce.toNumber() });
      const hex = submittable.toHex();
      const request: SignTransactionRequest = {
        id: id,
        hex: hex
      };
      const result = await signTransaction(request);
      console.log('sign message ', result);
      setErrMsg('');
    } catch (e) {
      setErrMsg(`Error: ${e.message}`);
    }
  };

  const removeCurrentSign = async () => {
    try {
      console.log('remove sign id: ', id);
      await rejectSign(id);
    } catch (e) {
      console.log(e);
      // window.close()
    }
  };

  return (
    <div className="container request-sign">
      <div className="detail">
        <div className="detail-item">
          <span>操作</span>
          <span>{query.method}</span>
        </div>
        <div className="detail-item">
          <span>转账数量</span>
          <span>{query.args[2]} PCX</span>
        </div>
        <div className="detail-item">
          <span>接收人地址</span>
          <span>{query.args[0]}</span>
        </div>
      </div>
      <div className="submit-area">
        <div className="title">
          <span>输入密码</span>
        </div>
        <input
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              sign();
            }
          }}
          className="input"
          type="password"
          placeholder="密码"
        />
        <ErrorMessage msg={errMsg} />
        <div className="button-area margin-top-40">
          <button
            className="button button-white-half"
            onClick={() => {
              removeCurrentSign();
            }}
          >
            取消
          </button>
          <button
            className="button button-yellow-half"
            onClick={() => {
              sign();
            }}
          >
            签名
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestSign;
