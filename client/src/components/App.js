import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import '../main.scss'
import {CssBaseline} from '@material-ui/core';
import Admin from '../pages/admin/index';
import Client from '../pages/client/index';

require('dotenv').config();

class App extends Component {

  render() {
    return (
      <div className="page">
        <CssBaseline/>
        <Router>
          <Switch>
            <Route path="/admin" component={Admin}/>
            <Route path="/" component={Client}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
