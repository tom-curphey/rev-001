import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthMenu from '../../layout/menu/AuthMenu';

const Recipes = ({ profile, isAuthenticated }) => {
  if (isAuthenticated === null || isAuthenticated === false) {
    return <Redirect to="/signin" />;
  }

  if (profile) {
    // console.log('profile', profile);
    if (profile.profile !== null && profile.loading === false) {
      if (profile.profile.venues.length === 0) {
        // console.log('Redirect', profile.profile.venues);
        return <Redirect to="/onboarding" />;
      }
    }
  }

  return (
    <AuthMenu>
      <div>Recipes</div>
    </AuthMenu>
  );
};

const mapState = state => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapState)(Recipes);
