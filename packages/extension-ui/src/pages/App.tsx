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
import { useRedux } from '../shared';
import { getSettings } from '../messaging/index';
// @ts-ignore
import spinner from '../assets/loading.gif';
import './index.scss';
import { useSelector } from 'react-redux';

export default function App() {
  let redirectUrl: any = '/';

  const [{}, setIsTestNet] = useRedux('isTestNet', false);
  const loading = useSelector(state => state.status.loading);
  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = async () => {
    const settings = await getSettings();
    console.log('get settings ', settings);
    setIsTestNet({ isTestNet: settings.isTestNet });
  };

  return (
    <Router>
      <React.Fragment>
        <Header props />
        {loading && (
          <div className="spinner">
            <img src={spinner} alt="spinner" />
          </div>
        )}
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/createAccount" component={CreateAccount} />
            <Route path="/importAccount" component={ImportAccount} />
            <Route path="/requestSign/:id?" component={RequestSign} />
            <Route path="/showPrivateKey" component={ShowPrivateKey} />
            <Route path="/enterPassword" component={EnterPassword} />
            <Route path="/addNode" component={NodeAction} />
            <Redirect to={redirectUrl} />
          </Switch>
        </div>
      </React.Fragment>
    </Router>
  );
}
