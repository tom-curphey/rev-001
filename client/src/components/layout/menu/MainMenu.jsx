import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { logout } from '../../public/auth/authActions';
import PropTypes from 'prop-types';
import Alert from '../../layout/alert/Alert';
import MainVenueMenu from './MainVenueMenu';
import icon from '../../../images/recipeRevenueIcon.png';

const MainMenu = ({
  auth: { isAuthenticated, loading },
  logout,
  venues,
  history
}) => {
  const openVenueMenu = e => {
    document.getElementById('venueMenu').style.display = 'block';
  };

  const handleLogout = () => {
    logout();
    history.push('/signin');
  };

  let venueName = '-';
  if (venues && venues.selectedVenue !== null) {
    venueName = venues.selectedVenue.displayName;
  }

  const userLinks = (
    <Fragment>
      <MainVenueMenu />

      <nav className="venueButton" onClick={openVenueMenu}>
        <div>
          <img src={icon} alt="Recipe Revenue Icon" />
        </div>
        <div>{venueName}</div>
        <div>></div>
      </nav>
      <nav className="menu">
        <Link className="menuItem" to="/recipes">
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
        <Link className="menuItem" to="/account/profile">
          Account Settings
        </Link>
        <Link className="menuItem" to="#!">
          Ask For Help
        </Link>
        <span onClick={handleLogout}>Logout</span>
      </nav>
      <Alert />
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
      <div>Alert</div>
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
  auth: state.auth,
  venues: state.venues
});

export default connect(
  mapState,
  actions
)(withRouter(MainMenu));
