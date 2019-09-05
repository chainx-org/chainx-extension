import * as React from "react";
import { createAccount } from '../messaging';
import { useState } from "react";

export default function Popup() {
  const [text, setText] = useState("test");
  const mnemonic = 'bird ensure file media winner flock vague hand village decrease stuff design';

  async function test() {
    const result = await createAccount('hello', 'password', mnemonic);
    setText("success")
    console.log(result);
  }

  return (
    <>
      <button onClick={test}>{text}</button>
      <div>hello world</div>
    </>
  )
}
