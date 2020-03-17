import React from 'react';
import { useSelector } from 'react-redux';
import '../index.scss';
import CreateOrImportAccount from '@chainx/extension-ui/pages/Home/CreateOrImportAccount';
import { currentAccountSelector } from '@chainx/extension-ui/store/reducers/accountSlice';
import CurrentAccount from '@chainx/extension-ui/pages/Home/CurrentAccount';
import Assets from '@chainx/extension-ui/pages/Home/Assets';

function Home() {
  const currentAccount = useSelector(currentAccountSelector);

  return (
    <>
      {currentAccount ? (
        <>
          <CurrentAccount />
          <Assets />
        </>
      ) : (
        <CreateOrImportAccount />
      )}
    </>
  );
}

export default Home;
