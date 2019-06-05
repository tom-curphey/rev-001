import React, { Component, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import MainMenu from './components/layout/MainMenu';
import DeviceMenu from './components/layout/DeviceMenu';
import Home from './components/public/Home';
import Login from './components/public/Login';
import Register from './components/public/Register';

const App = () => (
  <Router>
    <Fragment>
      <MainMenu />
      <DeviceMenu />
      <main>
        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </main>
    </Fragment>
  </Router>
);

export default App;
