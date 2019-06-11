import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../public/auth/authActions';
import PropTypes from 'prop-types';
import Alert from '../../layout/alert/Alert';

const MainMenu = ({ auth: { isAuthenticated, loading }, logout }) => {
  const userLinks = (
    <Fragment>
      <nav className="venueButton">
        <div>Icon</div>
        <div>By Kalindi</div>
        <div>></div>
      </nav>
      <nav className="menu">
        <Link className="menuItem" to="recipes">
          <i />
          <span>Recipes</span>
        </Link>
        <Link className="menuItem" to="#!">
          <i />
          <span>Ingredients</span>
        </Link>
        <Link className="menuItem" to="#!">
          <i />
          <span>Packaging</span>
        </Link>
      </nav>
      <nav className="subMenu">
        <Link className="menuItem" to="#!">
          Settings
        </Link>
        <Link className="menuItem" to="#!">
          Ask For Help
        </Link>
        <Link className="menuItem" to="/onboarding">
          Onboarding
        </Link>
        <span onClick={logout}>Logout</span>
      </nav>
    </Fragment>
  );

  const publicLinks = (
    <Fragment>
      <nav className="venueButton">
        <div>Icon</div>
        <div>By Kalindi</div>
        <div>></div>
      </nav>
      <nav className="menu">
        <Link className="menuItem" to="/register">
          <i />
          <span>Register</span>
        </Link>
        <Link className="menuItem" to="/signin">
          <i />
          <span>Sign in</span>
        </Link>
        <Link className="menuItem" to="#!">
          <i />
          <span>Pricing</span>
        </Link>
      </nav>
      <nav className="subMenu">
        <Link className="menuItem" to="/settings">
          Terms & Conditions
        </Link>
      </nav>
      <Alert />
    </Fragment>
  );

  return (
    <section className="mainMenu">
      {!loading && (
        <Fragment>
          {isAuthenticated ? userLinks : publicLinks}
        </Fragment>
      )}
    </section>
  );
};

MainMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const actions = { logout };

const mapState = state => ({
  auth: state.auth
});

export default connect(
  mapState,
  actions
)(MainMenu);
