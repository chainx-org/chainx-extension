import { Link } from 'react-router-dom';
// @ts-ignore
import logo from '../../assets/extension_logo.svg';
// @ts-ignore
import testNetImg from '../../assets/testnet.svg';
import React from 'react';
import { useSelector } from 'react-redux';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';

export default function() {
  const isTestNet = useSelector(isTestNetSelector);

  return (
    <Link to="/">
      <img className="logo" src={logo} alt="logo" />
      {isTestNet && (
        <img className="testnet" src={testNetImg} alt="testNetImg" />
      )}
    </Link>
  );
}
