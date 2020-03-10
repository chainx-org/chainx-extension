import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import Home from './Home';
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
import { getCurrentChainxNode } from '../messaging';
import { getSettings } from '../messaging/index';
// @ts-ignore
import spinner from '../assets/loading.gif';
import './index.scss';
import { setInitLoading } from '../store/reducers/statusSlice';
import initNodes from '@chainx/extension-ui/shared/nodeUtils';
import { setIsTestNet as setStoreIsTestNet } from '../store/reducers/networkSlice';
import { toSignSelector } from '@chainx/extension-ui/store/reducers/txSlice';

export default function App() {
  let redirectUrl: any = '/';

  const dispatch = useDispatch();
  // @ts-ignore
  const loading = useSelector(state => state.status.loading);
  // @ts-ignore
  const initLoading = useSelector(state => state.status.initLoading);
  // @ts-ignore
  const homeLoading = useSelector(state => state.status.homeLoading);
  const state = useSelector(state => state);

  if (process.env.NODE_ENV === 'development') {
    console.log('state', state);
  }

  const history = useHistory();
  const toSign = useSelector(toSignSelector);

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
    getSetting();
  }, []);

  useEffect(() => {
    initNodes()
      .then(() => {
        console.log('Init ChainX nodes');
      })
      .catch(() => console.log('Fail to init ChainX nodes'));
  }, []);

  const getSetting = async () => {
    const settings = await getSettings();
    dispatch(setStoreIsTestNet(settings.isTestNet));
    const node = await getCurrentChainxNode(settings.isTestNet);
    Promise.race([setChainx(node.url), sleep(5000)])
      .catch(e => {
        console.log(`set Chainx catch error: ${e}`);
      })
      .finally(() => {
        dispatch(setInitLoading(false));
      });
  };

  return (
    <React.Fragment>
      <Header props />
      {(loading || initLoading || homeLoading) && (
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
