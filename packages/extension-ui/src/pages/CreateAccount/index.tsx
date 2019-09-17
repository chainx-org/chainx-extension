import React from 'react';
import { useState } from 'react';
// @ts-ignore
import { Account } from 'chainx.js';
// @ts-ignore
import shuffle from 'lodash.shuffle';
import './createAccount.scss';
import StaticWarning from '../../components/StaticWarning';
import ErrorMessage from '../../components/ErrorMessage';
import NameAndPassword from '../../components/NameAndPassword';

function CreateAccount(props: any) {
  const titleList = ['新增账户', '备份助记词', '验证助记词', '设置标签和密码'];
  const subTitleList = [
    '',
    '按顺序记下你的助记词，下一步中需要用到',
    '按备份顺序点击下方助记词',
    '密码包含至少 8 个字符、大写与小写字母、至少一个数字'
  ];
  const buttonTextList = ['开始', '下一步', '下一步', '完成'];

  const [currentStep, setCurrentStep] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const [mnemonic] = useState(Account.newMnemonic());
  const mnemonicList = mnemonic.split(' ');
  const [shuffleMnemonicList] = useState(shuffle(mnemonicList));
  const [validateMnemonicList, setValidateMnemonicList] = useState(
    new Array(12).fill('')
  );
  const mnemonicWords = mnemonicList.map((item: string, index: number) => ({
    value: item,
    index: index
  }));

  const clearErrMsg = async () => {
    setErrMsg('');
    return true;
  };

  const checkMnemonic = () => {
    if (mnemonic === validateMnemonicList.join(' ')) {
      clearErrMsg();
      return true;
    }
    setErrMsg('Mnemonic not correct');
    return false;
  };

  return (
    <div className="container create-account">
      <div className="create-account-title">
        <span>{titleList[currentStep]}</span>
        <span className="create-account-sub-title">
          {subTitleList[currentStep]}
        </span>
      </div>
      <div className="create-account-body">
        <div className="create-account-body-content">
          {currentStep === 0 && <StaticWarning title="备份助记词" />}
          {currentStep === 1 &&
            mnemonicWords.map((item: any) => (
              <div className="word-item" key={item.index}>
                {item.value}
              </div>
            ))}
          {currentStep === 2 &&
            shuffleMnemonicList.map((item: any, index: number) => (
              <div
                className={
                  'word-item word-item-click ' +
                  (validateMnemonicList.indexOf(item) > -1
                    ? 'word-item-selected'
                    : '')
                }
                key={index}
                onClick={() => {
                  let replaceWord = item;
                  let wordIndex = validateMnemonicList.indexOf('');
                  if (validateMnemonicList.includes(item)) {
                    wordIndex = validateMnemonicList.indexOf(item);
                    replaceWord = '';
                  }
                  validateMnemonicList.splice(wordIndex, 1, replaceWord);
                  setValidateMnemonicList(Array.from(validateMnemonicList));
                }}
              >
                {item}
              </div>
            ))}
          {currentStep === 3 && (
            <NameAndPassword
              type="mnemonic"
              secret={mnemonic}
              onSuccess={function() {
                props.history.push('/');
              }}
            />
          )}
        </div>
        {currentStep < 2 && (
          <button
            className="button button-yellow margin-top-40"
            onClick={() => {
              if (currentStep < 2) {
                setCurrentStep(s => s + 1);
              }
            }}
          >
            {buttonTextList[currentStep]}
          </button>
        )}
        {currentStep === 2 && (
          <div className="container-spacebetween margin-top-40">
            <button
              className="button button-white-half"
              onClick={() => clearErrMsg() && setCurrentStep(s => s - 1)}
            >
              上一步
            </button>
            <button
              className="button button-yellow-half"
              onClick={() => checkMnemonic() && setCurrentStep(s => s + 1)}
            >
              下一步
            </button>
          </div>
        )}
        {currentStep > 1 ? errMsg ? <ErrorMessage msg={errMsg} /> : null : null}
      </div>
      {currentStep === 2 && (
        <div className="validate-mnemonic-area">
          <div className="validate-mnemonic-area-container">
            {validateMnemonicList.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateAccount;
