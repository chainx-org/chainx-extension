import React from "react";
// @ts-ignore
import Account from "@chainx/account";

function CreateAccount() {
  const mnemonic = Account.newMnemonic();
  console.log(mnemonic);

  return (
    <div className="create-account">
      <span>CreateAccount</span>
    </div>
  )
}

export default CreateAccount