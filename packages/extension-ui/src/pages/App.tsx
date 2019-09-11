import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { Redirect, Route, Switch } from "react-router"
import Home from './Home'
import Header from './Header'
import CreateAccount from './CreateAccount'
import ImportAccount from './ImportAccount'
import RequestSign from './RequestSign'
import ShowPrivateKey from './ShowPrivateKey/index'
import "./index.scss"

export default function App() {
  return (
    <Router>
      <React.Fragment>
        <Header props />
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/createAccount" component={CreateAccount} />
            <Route path="/importAccount" component={ImportAccount} />
            <Route path="/requestSign" component={RequestSign} />
            <Route path="/showPrivateKey" component={ShowPrivateKey} />
            <Redirect to="/" />
          </Switch>
        </div>
      </React.Fragment>
    </Router>
  );
}
