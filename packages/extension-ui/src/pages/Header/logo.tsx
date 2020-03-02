import { Link } from 'react-router-dom';
// @ts-ignore
import logo from '../../assets/extension_logo.svg';
// @ts-ignore
import testNetImg from '../../assets/testnet.svg';
import React from 'react';
import { useRedux } from '@chainx/extension-ui/shared';

export default function() {
  const [{ isTestNet }] = useRedux('isTestNet');

  return (
    <Link to="/">
      <img className="logo" src={logo} alt="logo" />
      {isTestNet && (
        <img className="testnet" src={testNetImg} alt="testNetImg" />
      )}
    </Link>
  );
}
