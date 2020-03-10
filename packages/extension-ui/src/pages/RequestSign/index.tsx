import React, { useCallback, useEffect, useState } from 'react';
import { rejectSign, signTransaction } from '../../messaging';
import { getCurrentGas, getSignRequest, useRedux } from '../../shared';
import ErrorMessage from '../../components/ErrorMessage';
import { DefaultButton, PasswordInput, PrimaryButton } from '@chainx/ui';
import {
  setLoading,
  setShowAccountMenu,
  setShowNodeMenu
} from '../../store/reducers/statusSlice';
import { fetchFee } from '../../store/reducers/tradeSlice';
import { useDispatch, useSelector } from 'react-redux';
import Transfer from './Transfer';
import CommonTx from './CommonTx';
import Trade from './Trade';
import AssetsProcess from './AssetsProcess';
import Staking from './Staking';
import {
  isPseduClaimSelector,
  isStakingClaimSelector,
  toSignMethodNameSelector,
  toSignSelector
} from '@chainx/extension-ui/store/reducers/txSlice';
import {
  stakingMethodNames,
  tradeMethodNames,
  xAssetsProcessCalls
} from '@chainx/extension-ui/pages/RequestSign/constants';
import PseduClaim from '@chainx/extension-ui/pages/RequestSign/PseduClaim';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { ButtonLine, TxDetail } from './components/styled';
import Fee from './Fee';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
`;

function RequestSign(props: any) {
  const dispatch = useDispatch();
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [currentGas, setCurrentGas] = useState(0);
  const [acceleration, setAcceleration] = useState(1);
  const [txPanel, setTxPanel] = useState(null);
  const isTestNet = useSelector(isTestNetSelector);
  const [{ currentAccount }] = useRedux('currentAccount', {
    address: '',
    name: ''
  });

  const toSignMethodName = useSelector(toSignMethodNameSelector);
  const isStakingClaim = useSelector(isStakingClaimSelector);
  const isPseduClaim = useSelector(isPseduClaimSelector);

  useEffect(() => {
    dispatch(setShowAccountMenu(false));
    dispatch(setShowNodeMenu(false));
  }, [dispatch]);

  const toSign = useSelector(toSignSelector);

  if (!toSign) {
    return <></>;
  }

  useEffect(() => {
    const fee = getCurrentGas(toSign.data, setErrMsg, acceleration);
    setCurrentGas(fee);
  }, [acceleration, toSign.data, setErrMsg]);

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

  const parseQuery = isTestNet => {
    updateTxPanel();
    try {
      if (xAssetsProcessCalls.includes(toSignMethodName)) {
        dispatch(fetchFee(isTestNet));
      }
    } catch (error) {
      console.log('parse error ', error);
      props.history.push('/nodeError');
    }
  };

  const updateTxPanel = useCallback(() => {
    if (toSignMethodName === 'transfer') {
      // @ts-ignore
      return setTxPanel(<Transfer />);
    } else if (xAssetsProcessCalls.includes(toSignMethodName)) {
      // @ts-ignore
      return setTxPanel(<AssetsProcess />);
    } else if (
      stakingMethodNames.includes(toSignMethodName) ||
      isStakingClaim
    ) {
      // @ts-ignore
      return setTxPanel(<Staking />);
    } else if (isPseduClaim) {
      // @ts-ignore
      return setTxPanel(<PseduClaim />);
    } else if (tradeMethodNames.includes(toSignMethodName)) {
      // @ts-ignore
      setTxPanel(<Trade />);
    } else {
      // @ts-ignore
      setTxPanel(<CommonTx />);
    }
  }, [toSignMethodName, dispatch, isPseduClaim, isStakingClaim]);

  const sign = async () => {
    setErrMsg('');
    if (!currentAccount || !currentAccount.address) {
      setErrMsg(`Error: address is not exist`);
      return;
    }
    if (!check()) {
      return;
    }

    if (currentAccount.address !== toSign.address) {
      setErrMsg('Invalid address');
      return;
    }

    dispatch(setLoading(true));
    try {
      const request = await getSignRequest(isTestNet, pass, acceleration);
      await signTransaction(request);
      setErrMsg('');
      dispatch(setLoading(false));
      props.history.push('/');
    } catch (e) {
      dispatch(setLoading(false));
      setErrMsg(`Error: ${e.message}`);
    }
  };

  window.onbeforeunload = function() {
    removeCurrentSign();
  };

  const removeCurrentSign = async () => {
    try {
      await rejectSign(toSign.id);
    } catch (e) {
      console.log(e);
      // window.close()
    } finally {
      props.history.push('/');
    }
  };

  return (
    <Wrapper>
      <TxDetail>{txPanel}</TxDetail>
      <Fee
        currentGas={currentGas}
        acceleration={acceleration}
        setAcceleration={setAcceleration}
      />
      <div>
        <PasswordInput
          value={pass}
          onChange={value => {
            setErrMsg('');
            setPass(value);
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              sign();
            }
          }}
          className="fixed-width"
          placeholder="Password"
        />
        <ErrorMessage msg={errMsg} />
        <ButtonLine>
          <DefaultButton size="large" onClick={() => removeCurrentSign()}>
            Cancel
          </DefaultButton>
          <PrimaryButton size="large" onClick={() => sign()}>
            Sign
          </PrimaryButton>
        </ButtonLine>
      </div>
    </Wrapper>
  );
}

export default RequestSign;
