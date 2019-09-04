import * as React from "react";
import { createAccount } from '../messaging';

export default function Popup() {
  const mnemonic = 'bird ensure file media winner flock vague hand village decrease stuff design';

  async function test() {
    const result = await createAccount('hello', 'password', mnemonic);
    console.log(result);
  }

  return (
    <>
      <button onClick={test}>test</button>
      <div>hello world</div>
    </>
  )
}
