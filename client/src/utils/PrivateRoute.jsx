import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  component: Component,
  auth,
  profile,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !auth.isAuthenticated &&
      !auth.loading &&
      !profile.isAuthenticated &&
      !profile.loading ? (
        <Redirect to="/signin" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapState = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapState)(PrivateRoute);
