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
import { PrimaryButton, DefaultButton } from '@chainx/ui';
import { setLoading } from '../../store/reducers/statusSlice';
import { useDispatch } from 'react-redux';
import Transfer from './Transfer';
import CommonTx from './CommonTx';

function RequestSign(props: any) {
  const dispatch = useDispatch();
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [{ isTestNet }] = useRedux('isTestNet');
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

  const { module, method } = query;

  useEffect(() => {
    getCurrentAccount();
  }, []);

  const getCurrentAccount = async () => {
    const result = await getCurrentChainxAccount(isTestNet);
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

    dispatch(setLoading(true));
    const node = await getCurrentChainxNode(isTestNet);
    const chainx = await setChainx(node.url);

    const { id, address, module, method, args } = query;

    const call = chainx.api.tx[module][method];

    if (!call) {
      setErrMsg('Invalid method');
    }

    if (currentAccount.address !== address) {
      setErrMsg('Invalid address');
    }

    if (method === 'putCode') {
      args[1] = Uint8Array.from(Object.values(args[1]))
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
      setErrMsg('');
      dispatch(setLoading(false));
    } catch (e) {
      dispatch(setLoading(false));
      setErrMsg(`Error: ${e.message}`);
    }
  };

  const removeCurrentSign = async () => {
    try {
      await rejectSign(id);
    } catch (e) {
      console.log(e);
      // window.close()
    }
  };

  let txPanel: any = null;
  if (module === 'xAssets' && method === 'transfer') {
    txPanel = <Transfer query={query} />;
  } else {
    txPanel = <CommonTx query={query} />;
  }

  return (
    <div className="container request-sign">
      {txPanel}
      <div className="submit-area">
        <div className="title">
          <span>Input password</span>
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
          placeholder="Password"
        />
        <ErrorMessage msg={errMsg} />
        <div className="button-area margin-top-40">
          <DefaultButton size="large" onClick={() => removeCurrentSign()}>
            Cancel
          </DefaultButton>
          <PrimaryButton size="large" onClick={() => sign()}>
            Sign
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default RequestSign;
