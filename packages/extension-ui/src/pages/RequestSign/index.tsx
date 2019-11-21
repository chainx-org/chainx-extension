import React, { useState, useEffect } from 'react';
import {
  signTransaction,
  rejectSign,
  getCurrentChainxAccount
} from '../../messaging';
import { useRedux, getCurrentGas, getSignRequest } from '../../shared';
import ErrorMessage from '../../components/ErrorMessage';
import './requestSign.scss';
import { PrimaryButton, DefaultButton, Slider } from '@chainx/ui';
import { setLoading } from '../../store/reducers/statusSlice';
import { useDispatch } from 'react-redux';
import Transfer from './Transfer';
import CommonTx from './CommonTx';

function RequestSign(props: any) {
  const dispatch = useDispatch();
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [currentGas, setCurrentGas] = useState(0);
  const [acceleration, setAcceleration] = useState(1);
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

  const { address, module, method } = query;

  useEffect(() => {
    getCurrentAccount();
    getCurrentGas(isTestNet, query, setErrMsg, setCurrentGas);
  }, [isTestNet]);

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
      return;
    }
    if (!check()) {
      return;
    }
    if (currentAccount.address !== address) {
      setErrMsg('Invalid address');
      return;
    }

    dispatch(setLoading(true));
    try {
      const request = await getSignRequest(
        isTestNet,
        query,
        pass,
        acceleration
      );
      await signTransaction(request);
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

  const getCurrentGasText = () => {
    return (acceleration * currentGas) / 10 ** 8 + ' PCX';
  };

  let txPanel: any = null;
  if (module === 'xAssets' && method === 'transfer') {
    txPanel = <Transfer query={query} />;
  } else {
    txPanel = <CommonTx query={query} />;
  }

  const marks = [
    {
      value: 1,
      label: '1x'
    },
    {
      value: 10,
      label: '10x'
    }
  ];

  return (
    <div className="container request-sign">
      {txPanel}
      <div className="adjust-gas">
        <div className="adjust-gas-desc">
          <div>
            <span>Fee</span>
            <span>{getCurrentGasText()}</span>
          </div>
          <span>More fee, faster speed</span>
        </div>
        <Slider
          defaultValue={acceleration}
          onChange={v => setAcceleration(v)}
          // getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={10}
        />
      </div>
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
