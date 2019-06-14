import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { logout } from '../../public/auth/authActions';
import PropTypes from 'prop-types';

const DeviceSubMenu = ({ logout, auth, history }) => {
  const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginRight = '0';
  };
  const handleLogout = () => {
    logout();
    history.push('/signin');
  };
  const authLinks = (
    <Fragment>
      <span className="closebtn" onClick={closeNav}>
        &times;
      </span>
      <Link to="/recipes">Recipes</Link>
      <Link to="!#">Ingredients</Link>
      <Link to="!#">Packaging</Link>
      <Link to="/onboarding">Onboarding</Link>
      <span className="link" onClick={handleLogout}>
        Logout
      </span>
    </Fragment>
  );

  const publicLinks = (
    <Fragment>
      <span className="closebtn" onClick={closeNav}>
        &times;
      </span>
      <Link to="/signin">Sign in</Link>
      <Link to="/register">Register</Link>
      <Link to="/pricing">Pricing</Link>
    </Fragment>
  );

  return (
    <div id="mySidenav" className="sidenav">
      {auth && !auth.loading && (
        <Fragment>
          {auth.isAuthenticated ? authLinks : publicLinks}
        </Fragment>
      )}
    </div>
  );
};

const actions = {
  logout
};

DeviceSubMenu.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapState = state => ({
  auth: state.auth
});

export default connect(
  mapState,
  actions
)(withRouter(DeviceSubMenu));
