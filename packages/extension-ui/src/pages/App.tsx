import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router';
import Home from './Home';
import Header from './Header';
import CreateAccount from './CreateAccount';
import ImportAccount from './ImportAccount';
import RequestSign from './RequestSign';
import ShowPrivateKey from './ShowPrivateKey/index';
import EnterPassword from './EnterPassword';
import NodeAction from './NodeAction';
import NodeError from './NodeAction/NodeError';
import { useRedux, setChainx, sleep } from '../shared';
import { useDispatch } from 'react-redux';
import { getCurrentChainxNode } from '../messaging';
import { getSettings } from '../messaging/index';
// @ts-ignore
import spinner from '../assets/loading.gif';
import './index.scss';
import { useSelector } from 'react-redux';
import { setInitLoading } from '../store/reducers/statusSlice';

export default function App() {
  let redirectUrl: any = '/';

  const dispatch = useDispatch();
  const [{}, setIsTestNet] = useRedux('isTestNet', false);
  const loading = useSelector(state => state.status.loading);
  const initLoading = useSelector(state => state.status.initLoading);
  const homeLoading = useSelector(state => state.status.homeLoading);
  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = async () => {
    const settings = await getSettings();
    setIsTestNet({ isTestNet: settings.isTestNet });
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
    <Router>
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
              <Route path="/requestSign/:id?" component={RequestSign} />
              <Route path="/showPrivateKey" component={ShowPrivateKey} />
              <Route path="/enterPassword" component={EnterPassword} />
              <Route path="/addNode" component={NodeAction} />
              <Route path="/nodeError" component={NodeError} />
              <Redirect to={redirectUrl} />
            </Switch>
          </div>
        )}
      </React.Fragment>
    </Router>
  );
}
