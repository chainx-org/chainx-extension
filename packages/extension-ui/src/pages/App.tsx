import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import Home from './Home/Home';
import Header from './Header';
import CreateAccount from './CreateAccount';
import ImportAccount from './ImportAccount';
import RequestSign from './RequestSign';
import ShowPrivateKey from './ShowPrivateKey/index';
import EnterPassword from './EnterPassword';
import NodeAction from './NodeAction';
import NodeError from './NodeAction/NodeError';
import { setChainx, sleep } from '../shared';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import spinner from '../assets/loading.gif';
import './index.scss';
import { setInitLoading } from '../store/reducers/statusSlice';
import initNodes from '@chainx/extension-ui/shared/nodeUtils';
import {
  fetchNetwork,
  isTestNetSelector
} from '../store/reducers/networkSlice';
import {
  fetchToSign,
  toSignSelector
} from '@chainx/extension-ui/store/reducers/txSlice';
import { currentNodeSelector } from '@chainx/extension-ui/store/reducers/nodeSlice';
import { refreshAccount } from '@chainx/extension-ui/store/reducers/accountSlice';
import { fetchIntentions } from '@chainx/extension-ui/store/reducers/intentionSlice';
import { fetchTradePairs } from '@chainx/extension-ui/store/reducers/tradeSlice';
import { fetchAssetsInfo } from '@chainx/extension-ui/store/reducers/assetSlice';
import RemoveAccount from '@chainx/extension-ui/pages/RemoveAccount';
import { getChainx } from '@chainx/extension-ui/shared/chainx';

export default function App() {
  let redirectUrl: any = '/';

  const dispatch = useDispatch();
  // @ts-ignore
  const loading = useSelector(state => state.status.loading);
  // @ts-ignore
  const initLoading = useSelector(state => state.status.initLoading);
  const state = useSelector(state => state);
  const { url: currentNodeUrl } = useSelector(currentNodeSelector) || {};
  const isTestNet = useSelector(isTestNetSelector);

  if (process.env.NODE_ENV === 'development') {
    console.log('state', state);
  }

  const history = useHistory();
  const toSign = useSelector(toSignSelector);
  const chainx = getChainx();

  useEffect(() => {
    try {
      if (toSign) {
        history.push({
          pathname: '/requestSign'
        });
      }
    } catch (error) {
      console.log('sign request error occurs ', error);
    }
  }, [toSign, history]);

  useEffect(() => {
    dispatch(fetchNetwork());
  }, [dispatch]);

  useEffect(() => {
    initNodes()
      .then(() => {
        console.log('APP Init ChainX nodes');
      })
      .catch(() => console.log('Fail to init ChainX nodes'));

    dispatch(refreshAccount(isTestNet));
  }, [isTestNet]);

  useEffect(() => {
    if (chainx) {
      // @ts-ignore
      chainx.isRpcReady().then(() => {
        dispatch(fetchToSign());
        dispatch(fetchIntentions());
        dispatch(fetchTradePairs(isTestNet));
        dispatch(fetchAssetsInfo());
      });
    }
  }, [isTestNet, chainx]);

  useEffect(() => {
    if (!currentNodeUrl) {
      return;
    }

    Promise.race([setChainx(currentNodeUrl), sleep(5000)])
      .then(chainx => {
        if (!chainx) {
          history.push('/nodeError');
        } else {
          history.push('/redirect');
        }
      })
      .catch(e => {
        console.log(`set Chainx catch error: ${e}`);
        history.push('/nodeError');
      })
      .finally(() => {
        dispatch(setInitLoading(false));
      });
  }, [currentNodeUrl, dispatch]);

  return (
    <React.Fragment>
      <Header props />
      {(loading || initLoading) && (
        <div className="spinner">
          <img src={spinner} alt="spinner" />
        </div>
      )}
      {!initLoading && (
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/createAccount" component={CreateAccount} />
            <Route path="/importAccount" component={ImportAccount} />
            <Route path="/requestSign" component={RequestSign} />
            <Route path="/showPrivateKey" component={ShowPrivateKey} />
            <Route path="/removeAccount" component={RemoveAccount} />
            <Route path="/enterPassword" component={EnterPassword} />
            <Route path="/addNode" component={NodeAction} />
            <Route path="/nodeError" component={NodeError} />
            <Redirect to={redirectUrl} />
          </Switch>
        </div>
      )}
    </React.Fragment>
  );
}
