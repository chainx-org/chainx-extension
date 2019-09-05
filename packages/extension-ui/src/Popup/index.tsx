import * as React from "react";
import { createAccount, getAllAccounts } from '../messaging';
import { useState } from "react";
import { AccountInfo } from "@chainx/extension-ui/types";

export default function Popup() {
  const [text, setText] = useState("test");
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const mnemonic = 'bird ensure file media winner flock vague hand village decrease stuff design';

  async function test() {
    await createAccount('hello', 'password', mnemonic);
    setText("success")
  }

  async function getAccounts() {
    const result = await getAllAccounts();
    setAccounts(result);
  }

  return (
    <>
      <button onClick={test}>{text}</button>
      <div>hello world</div>

      <hr />

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

    </>
  )
}
