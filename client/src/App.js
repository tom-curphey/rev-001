import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import MainMenu from './components/layout/MainMenu';
import DeviceMenu from './components/layout/DeviceMenu';
import DeviceSubMenu from './components/layout/DeviceSubMenu';
import Home from './components/public/Home';
import Login from './components/public/Login';
import Register from './components/public/Register';

const App = () => {
  return (
    <Router>
      <section className="app">
        <DeviceMenu />
        <div>
          <DeviceSubMenu />
          <div id="screen">
            <MainMenu />
            <main id="main">
              <Route exact path="/" component={Home} />
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </main>
          </div>
        </div>
      </section>
    </Router>
  );
};

export default App;
