import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAccountAssets,
  normalizedAssetsSelector
} from '../../store/reducers/assetSlice';
import styled from 'styled-components';
// @ts-ignore
import dotLogo from '../../assets/svg/DOT.svg';
// @ts-ignore
import btcLogo from '../../assets/svg/X-BTC.svg';
// @ts-ignore
import lbtcLogo from '../../assets/svg/L-BTC.svg';
// @ts-ignore
import pcxLogo from '../../assets/svg/PCX.svg';
import { token } from '../../constants';
import toPrecision, { localString } from '../../shared/toPrecision';
import { replaceBTC } from '../../shared/chainx';
import { fetchAssetLoadingSelector } from '../../store/reducers/statusSlice';
import MiniLoading from '../../components/MiniLoading';
import { currentAddressSelector } from '@chainx/extension-ui/store/reducers/accountSlice';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`;

const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid #dce0e2;
    span {
      font-weight: bold;
      font-size: 14px;
      color: #3f3f3f;
      text-align: right;
      line-height: 20px;
    }
  }
`;

export default function() {
  const assets = useSelector(normalizedAssetsSelector);
  const loading = useSelector(fetchAssetLoadingSelector);
  const dispatch = useDispatch();
  const address = useSelector(currentAddressSelector);

  useEffect(() => {
    dispatch(fetchAccountAssets(address, true));

    const intervalId = setInterval(() => {
      dispatch(fetchAccountAssets(address));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, address]);

  if (loading) {
    return (
      <LoadingWrapper>
        <MiniLoading />
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper>
      {assets.map(({ name, precision, details }) => {
        const value = Object.values(details).reduce(
          // @ts-ignore
          (result, v) => result + v,
          0
        );

        return (
          <li key={name}>
            <AssetIcon name={name} />
            <span>
              {localString(toPrecision(value, precision))} {replaceBTC(name)}
            </span>
          </li>
        );
      })}
    </Wrapper>
  );
}

function AssetIcon({ name }) {
  let logo = pcxLogo;
  if (token.XBTC === name) {
    logo = btcLogo;
  } else if (token.LBTC === name) {
    logo = lbtcLogo;
  } else if (token.SDOT === name) {
    logo = dotLogo;
  }

  return <img src={logo} alt="asset icon" width="32" height="32" />;
}
