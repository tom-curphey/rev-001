import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import MainMenu from './components/layout/menu/MainMenu';
import DeviceMenu from './components/layout/menu/DeviceMenu';
import DeviceSubMenu from './components/layout/menu/DeviceSubMenu';
import Home from './components/public/Home';
import Login from './components/public/auth/Login';
import Register from './components/public/auth/Register';
import Recipes from './components/private/recipe/Recipes';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './components/public/auth/authActions';
import setAuthToken from './components/utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // This will continue running..
  // Adding [] will cause the lop to stop
  // It tells react that the hook doesn't rely on props or state
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

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
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/recipes" component={Recipes} />
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
