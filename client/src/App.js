import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import PrivateRoute from './components/utils/PrivateRoute';
import MainMenu from './components/layout/menu/MainMenu';
import DeviceMenu from './components/layout/menu/DeviceMenu';
import DeviceSubMenu from './components/layout/menu/DeviceSubMenu';
import Home from './components/public/Home';
import Login from './components/public/auth/Login';
import Register from './components/public/auth/Register';
import Recipes from './components/private/recipe/Recipes';
import OnboardingVenue from './components/private/onboarding/OnboardingVenue';
import OnboardingVenueNew from './components/private/onboarding/OnboardingVenueNew';
import Test from './components/utils/Test';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './components/public/auth/authActions';
import { loadProfile } from './components/private/profile/profileActions';
import setAuthToken from './components/utils/setAuthToken';
import { AUTH_ERROR } from './redux/types';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // This will continue running..
  // Adding [] will cause the lop to stop
  // It tells react that the hook doesn't rely on props or state
  useEffect(() => {
    if (localStorage.token) {
      store.dispatch(loadUser());
      store.dispatch(loadProfile());
    } else {
      store.dispatch({
        type: AUTH_ERROR
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/test" component={Test} />
          <PrivateRoute
            exact
            path="/onboarding"
            component={OnboardingVenue}
          />
          <PrivateRoute exact path="/recipes" component={Recipes} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
