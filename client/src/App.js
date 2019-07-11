import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Home from './components/public/Home';
import Signin from './components/public/auth/Signin';
import Welcome from './components/layout/menu/Welcome';
import ForgotPassword from './components/public/auth/ForgotPassword';
import ResetPassword from './components/public/auth/ResetPassword';
import PrivateRoute from './utils/PrivateRoute';
import Register from './components/public/auth/Register';
import Recipe from './components/private/recipe/Recipe';
import Ingredient from './components/private/ingredient/Ingredient';
import AccountSettings from './components/private/profile/AccountSettings';
import OnboardingVenue from './components/private/onboarding/OnboardingVenue';
import NewFeature from './components/public/NewFeature';
import Test from './utils/Test';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './components/public/auth/authActions';
import { loadProfile } from './components/private/profile/profileActions';
import { loadVenues } from './components/private/venue/venueActions';
import { loadRecipes } from './components/private/recipe/recipeActions';
import setAuthToken from './utils/setAuthToken';
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
      store.dispatch(loadVenues());
      store.dispatch(loadRecipes());
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
          <Route exact path="/signin" component={Signin} />

          <Route
            exact
            path="/forgot-password"
            component={ForgotPassword}
          />
          <Route
            exact
            path="/reset-password/:id/:tempToken"
            component={ResetPassword}
          />
          <Route exact path="/test" component={Test} />
          <PrivateRoute
            exact
            path="/onboarding"
            component={OnboardingVenue}
          />
          <PrivateRoute exact path="/welcome" component={Welcome} />
          <PrivateRoute
            exact
            path="/menu-items"
            component={NewFeature}
          />
          <PrivateRoute exact path="/recipes" component={Recipe} />
          <PrivateRoute
            exact
            path="/ingredients"
            component={Ingredient}
          />
          <PrivateRoute
            exact
            path="/packaging"
            component={NewFeature}
          />
          <PrivateRoute
            exact
            path="/account/:account_section"
            component={AccountSettings}
          />
          <PrivateRoute
            exact
            path="/account/:account_section/:venue_action"
            component={AccountSettings}
          />
          <PrivateRoute
            exact
            path="/account/:account_section/:venue_action/:venue_name"
            component={AccountSettings}
          />
          <PrivateRoute
            exact
            path="/menu-items"
            component={NewFeature}
          />
          <PrivateRoute
            exact
            path="/integrations"
            component={NewFeature}
          />
          <PrivateRoute
            exact
            path="/performance"
            component={NewFeature}
          />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
