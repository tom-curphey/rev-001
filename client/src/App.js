import React from 'react';
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

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <section className="app">
          <DeviceMenu />
          <div className="kalindi">
            <DeviceSubMenu />
            <div id="screen">
              <MainMenu />
              <main id="main">
                <Route exact path="/" component={Home} />
                <Switch>
                  <Route
                    exact
                    path="/register"
                    component={Register}
                  />
                  <Route exact path="/login" component={Login} />
                </Switch>
              </main>
            </div>
          </div>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
