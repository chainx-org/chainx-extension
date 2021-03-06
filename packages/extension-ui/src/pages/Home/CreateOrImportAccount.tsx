// @ts-ignore
import logo from '../../assets/extension_logo.svg';
import React from 'react';
import styled from 'styled-components';
import { WhiteButton } from '@chainx/ui';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { setShowImportMenu } from '../../store/reducers/statusSlice';

const Wrapper = styled.div`
  padding: 60px 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default React.memo(function() {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <img src={logo} alt="logo" width="90" height="90" />
      <WhiteButton
        size="fullWidth"
        style={{ marginTop: 40 }}
        onClick={() => history.push('/createAccount')}
      >
        New Account
      </WhiteButton>
      <WhiteButton
        size="fullWidth"
        style={{ marginTop: 16 }}
        onClick={() => dispatch(setShowImportMenu(true))}
      >
        Import Account
      </WhiteButton>
    </Wrapper>
  );
});
