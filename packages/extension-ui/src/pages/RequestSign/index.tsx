import React, { useEffect, useState } from 'react';
import { rejectSign, signTransaction } from '../../messaging';
import { getCurrentGas, getSignRequest, useRedux } from '../../shared';
import { parseData } from '../../shared/extensionExtrinsic';
import ErrorMessage from '../../components/ErrorMessage';
import './requestSign.scss';
import { DefaultButton, PrimaryButton, Slider } from '@chainx/ui';
import { setLoading } from '../../store/reducers/statusSlice';
import { fetchIntentions } from '../../store/reducers/intentionSlice';
import { fetchFee, fetchTradePairs } from '../../store/reducers/tradeSlice';
import { useDispatch } from 'react-redux';
import Transfer from './Transfer';
import CommonTx from './CommonTx';
import Trade from './Trade';
import AssetsProcess from './AssetsProcess';
import Staking from './Staking';

function RequestSign(props: any) {
  const dispatch = useDispatch();
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [currentGas, setCurrentGas] = useState(0);
  const [acceleration, setAcceleration] = useState(1);
  const [txPanel, setTxPanel] = useState(null);
  const [{ isTestNet }] = useRedux('isTestNet');
  const [{ currentAccount }] = useRedux('currentAccount', {
    address: '',
    name: ''
  });

  const {
    match: {
      params: { id }
    },
    location: { query }
  } = props;

  if (!query) {
    return <></>;
  }

  const { address } = query;
  useEffect(() => {
    parseQuery(isTestNet);
  }, [isTestNet]);

  const check = () => {
    if (!pass) {
      setErrMsg('password is required');
      return false;
    }
    return true;
  };

  const fetchRelevantInfo = isTestNet => {
    if (query.module === 'xStaking') {
      dispatch(fetchIntentions(isTestNet));
    }
    if (query.module === 'xSpot') {
      dispatch(fetchTradePairs(isTestNet));
    }
    if (query.module === 'xAssetsProcess') {
      dispatch(fetchFee(isTestNet));
    }
  };
  const parseQuery = isTestNet => {
    // const hex = '0xe90281ff3f53e37c21e24df9cacc2ec69d010d144fe4dace6b2f087f466ade8b6b72278fc116af6b699bdeb55d265d7fa1828111106f1bac0814ab2432765e029b31976e3991300d94d4a5ec8411cd49f5a61fda0cbd9aeed39501cbe1913e51f55b910e0000040803ff7684c16db0c321ee15a297e20bab33279632dd7e288c6d66f16d73e185a4f9fc0c504358010000000000000094756e6973776170313536393733353332303134323832322e36303438363133363738323639'
    if (!query.module) {
      const [method, args] = parseData(query.data);
      query.method = method;
      query.args = args;
      let module = '';
      if (
        ['nominate', 'renominate', 'unnominate', 'unfreeze', 'claim'].includes(
          method
        )
      ) {
        module = 'xStaking';
      } else if (['withdraw', 'revokeWithdraw'].includes(method)) {
        module = 'xAssetsProcess';
      } else if (['putOrder', 'cancelOrder'].includes(method)) {
        module = 'xSpot';
      } else if (['transfer'].includes(method)) {
        module = 'xAssets';
      }
      query.module = module;
    }

    updateTxPanel();
    getCurrentGas(isTestNet, query, setErrMsg, setCurrentGas);
    fetchRelevantInfo(isTestNet);
  };

  const updateTxPanel = () => {
    let _txPanel;
    if (query.module === 'xAssets' && query.method === 'transfer') {
      _txPanel = <Transfer query={query} />;
    } else if (query.module === 'xSpot') {
      _txPanel = <Trade query={query} />;
    } else if (query.module === 'xAssetsProcess') {
      _txPanel = <AssetsProcess query={query} />;
    } else if (query.module === 'xStaking') {
      _txPanel = <Staking query={query} />;
    } else {
      _txPanel = <CommonTx query={query} />;
    }
    setTxPanel(_txPanel);
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
      props.history.push('/');
    } catch (e) {
      console.log(e);
      // window.close()
    }
  };

  const getCurrentGasText = () => {
    return (acceleration * currentGas) / 10 ** 8 + ' PCX';
  };

  // xStaking
  // 投票，切换投票，赎回，解冻，提息
  // nominate, renominate, unnominate, unfreeze, claim
  // 切换投票页面不一样
  // this.api.tx.xStaking.nominate(target, value, memo);
  // this.api.tx.xStaking.renominate(from, to, value, memo);
  // this.api.tx.xStaking.unnominate(target, value, memo);
  // this.api.tx.xStaking.unfreeze(target, revocationIndex);
  // this.api.tx.xStaking.claim(target);

  // xAssetsProcess(Asset.js)
  // 提现，取消提现
  // withdraw, revokeWithdraw
  // this.api.tx.xAssetsProcess.withdraw(token, value, addr, ext);
  // this.api.tx.xAssetsProcess.revokeWithdraw(id);

  // xSpot(Trade.js)
  // 挂单，撤单
  // putOrder, cancelOrder
  // this.api.tx.xSpot.putOrder(pairid, ordertype, direction, amount, price);
  // this.api.tx.xSpot.cancelOrder(pairid, index);

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
      <div className="tx-panel">{txPanel}</div>
      <div className="adjust-gas">
        <div className="adjust-gas-desc">
          <div>
            <span>Fee</span>
            <span className="yellow">{getCurrentGasText()}</span>
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
