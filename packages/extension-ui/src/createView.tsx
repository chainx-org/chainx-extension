import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './pages/App';
import { getNodes } from '@chainx/extension-ui/shared/nodeUtils';
import {
  getAllAccounts,
  getCurrentChainxAccount,
  getSettings
} from '@chainx/extension-ui/messaging';
import { setIsTestNet } from '@chainx/extension-ui/store/reducers/networkSlice';
import {
  setAccounts,
  setCurrentAccount
} from '@chainx/extension-ui/store/reducers/accountSlice';

export default async function createView(
  rootId: string = 'root'
): Promise<void> {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  const settings = await getSettings();
  store.dispatch(setIsTestNet(settings.isTestNet));

  const accounts = await getAllAccounts(settings.isTestNet);
  store.dispatch(setAccounts(accounts));

  const account = await getCurrentChainxAccount(settings.isTestNet);
  store.dispatch(setCurrentAccount(account));

  await getNodes();

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    rootElement
  );
}
