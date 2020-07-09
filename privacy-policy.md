# ChainX extension
ChainX extension manages ChainX accounts outside of dapps. It can be used to
- Create and manage ChainX accounts
- Manager ChainX nodes
- Inject ChainX accounts to dapps
- Sign and send transaction for a specific ChainX account

## Privacy Policy
We respect your privacy. ChainX extension doesn’t track your behavior,  transfer your data to third parties, and collect any of your data.

###  What personal data does ChainX extension process?
There are two ways you can create ChainX account with this extension.
1. Generate inside.
	You generate a new mnemonic and ChainX extension will store the corresponding encrypted keystore information in the browser storage.
2. Import.
	You can import your ChainX account with the correct mnemonic or private key inputted.

In either of the above two ways, ChainX extension does not store your mnemonic or private key, but store the encrypted keystore instead.

When you need to sign transactions, we recover the account with the password you input, and sign the target transaction. The account and private key will stay in memory for a very short time.

### What data does ChainX extension transfer?
None. The extension operates and store all the necessary data locally on your computer.

If you enabled settings syncing in your browser, all extension settings will be synced with your browser’s settings store. Please consult the browser’s privacy policy for more information.

