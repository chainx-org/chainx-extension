
import * as React from "react";
import { useState } from "react";
import { createAccount, getAllAccounts, signMessage } from '../messaging';
import { AccountInfo } from "@chainx/extension-ui/types";
// @ts-ignore
import logo from "../assets/logo.jpg";
import "./index.scss";

function Home(props: any) {

  const [text, setText] = useState("test");
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const mnemonic = 'bird ensure file media winner flock vague hand village decrease stuff design';
  const [sig, setSig] = useState('');

  async function test() {
    try {
      await createAccount('hello', 'password', mnemonic);
      setText("success");
    } catch (e) {
      setText("fail");
    }
  }

  async function getAccounts() {
    const result = await getAllAccounts();
    setAccounts(result);
  }

  async function testSign() {
    if (accounts.length > 0) {
      const sig = await signMessage(accounts[0].address, 'message', 'password');
      setSig(sig);
    }
  }

  getAccounts()

  return (
    <>
      {
        accounts[0] ? 
        <div className="container-account">
          <div className="account-title">
            {accounts[0].name}
          </div>
          <div className="account-address">
            <span>{accounts[0].address}</span>
          </div>
          <div className="copy">
            复制地址
          </div>
        </div>
        :
        <div className="container container-content">
          <button className="new-account" onClick={() =>
            props.history.push('/createAccount')
          }>新增账户
          </button>
          <button className="import-account" onClick={() => 
            props.history.push('/importAccount')
          }>导入账户</button>

          <br />
          <button onClick={test}>{text}</button>
          <div>hello world</div>
          <button onClick={getAccounts}>get accounts</button>
          {
            accounts.map(account => {
              return (
                <div key={account.address}>
                  <div>
                    <span>name:</span>
                    <span>{account.name}</span>
                  </div>
                  <div>
                    <span>address:</span>
                    <span>{account.address}</span>
                  </div>
                </div>
              )
            })
          }

          <button onClick={testSign}>test sign</button>
          <span>{sig}</span>
        </div>
      }
    </>
  )
}

export default Home