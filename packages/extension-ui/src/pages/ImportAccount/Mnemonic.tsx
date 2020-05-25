import React, { useState } from 'react';
import './importAccount.scss';
import {
  Container,
  Title,
  SubTitle,
  ButtonLine
} from '../../components/styled';
import { PrimaryButton } from '@chainx/ui';
import NameAndPassword from '@chainx/extension-ui/components/NameAndPassword';
import { Account } from 'chainx.js';
import ErrorMessage from '../../components/ErrorMessage';
import styled from 'styled-components';

const MnemonicWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const WordItem = styled.input`
  font-weight: 600;
  text-align: center;
  margin-top: 16px;
  width: 30%;
  height: 40px;
  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 20px;
  color: #3f3f3f;
  caret-color: #f6c94a;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function ImportMnemonic() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mnemonicList, setMnemonicList] = useState(new Array(12).fill(''));
  const [errMsg, setErrMsg] = useState('');

  const checkStep1 = () => {
    if (
      mnemonicList.some(item => (item || '').trim() === '') ||
      !Account.isMnemonicValid(
        mnemonicList.map(m => (m || '').trim()).join(' ')
      )
    ) {
      setErrMsg('Invalid mnemonic');
      return;
    }

    setErrMsg('');
    setCurrentStep(s => s + 1);
  };

  if (currentStep === 1) {
    return (
      <NameAndPassword
        type={'mnemonic'}
        secret={mnemonicList.map(m => (m || '').trim()).join(' ')}
      />
    );
  }

  return (
    <Container>
      <Title>Mnemonic</Title>
      <SubTitle>Input mnemonic words</SubTitle>
      <MnemonicWrapper>
        {mnemonicList.map((item, index) => (
          <WordItem
            key={index}
            value={mnemonicList[index]}
            onChange={e => {
              mnemonicList.splice(index, 1, e.target.value);
              setMnemonicList(Array.from(mnemonicList));
            }}
          />
        ))}
      </MnemonicWrapper>
      <ButtonLine>
        <PrimaryButton
          style={{ minWidth: 200 }}
          size="large"
          onClick={() => {
            checkStep1();
          }}
        >
          Next
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </Container>
  );
}
