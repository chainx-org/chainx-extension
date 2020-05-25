import React, { useState } from 'react';
import { PrimaryButton, TextInput } from '@chainx/ui';
import {
  ButtonLine,
  Container,
  SubTitle,
  Title
} from '../../components/styled';
import NameAndPassword from '../../components/NameAndPassword';
import ErrorMessage from '../../components/ErrorMessage';

export default function ImportPrivateKey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [pk, setPk] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const checkStep1 = () => {
    if (!pk) {
      setErrMsg('Private key is not correct');
      return;
    }

    setErrMsg('');
    setCurrentStep(s => s + 1);
  };

  if (currentStep === 1) {
    return <NameAndPassword type={'pk'} secret={pk.trim()} />;
  }

  return (
    <Container>
      <Title>Private Key</Title>
      <SubTitle>Input private key</SubTitle>
      <TextInput
        value={pk}
        onChange={value => setPk(value)}
        multiline={true}
        rows={4}
        style={{ flex: 'unset' }}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            checkStep1();
          }
        }}
      />
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
