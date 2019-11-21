import {
  signTransaction,
  rejectSign,
  getCurrentChainxAccount,
  getCurrentChainxNode
} from '../messaging';
import { setChainx } from '@chainx/extension/src/background/chainx';

export const getCurrentGas = async (
  isTestNet,
  query,
  acceleration,
  setErrMsg,
  setCurrentGas
) => {
  const node = await getCurrentChainxNode(isTestNet);
  const chainx = await setChainx(node.url);
  const _currentAccount = await getCurrentChainxAccount(isTestNet);

  const { address, module, method, args } = query;

  const call = chainx.api.tx[module][method];

  if (!call) {
    setErrMsg('Invalid method');
    return;
  }

  if (_currentAccount.address !== address) {
    setErrMsg('Invalid address');
    return;
  }

  if (method === 'putCode') {
    args[1] = Uint8Array.from(Object.values(args[1]));
  }

  const submittable = call(...args);
  const _currentGas = submittable.getFeeSync(
    _currentAccount.address,
    acceleration
  );

  setCurrentGas(_currentGas);
};
