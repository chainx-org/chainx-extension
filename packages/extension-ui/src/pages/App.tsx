import React from "react"; import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import Setting from './Setting';
import Home from './Home';
import Header from './Header';
import CreateAccount from './CreateAccount';
import ImportAccount from "./ImportAccount";
import "./index.scss";

export default function App() {
  return (
    <Router>
      <React.Fragment>
        <Header />
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/createAccount" component={CreateAccount} />
            <Route path="/importAccount" component={ImportAccount} />
            <Route path="/setting" component={Setting} />
            <Redirect to="/" />
          </Switch>
        </div>
      </React.Fragment>
    </Router>
  );
}
