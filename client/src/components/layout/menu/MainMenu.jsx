import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { logout } from '../../public/auth/authActions';
import PropTypes from 'prop-types';
import Alert from '../../layout/alert/Alert';
import MainVenueMenu from './MainVenueMenu';
import icon from '../../../images/recipeRevenueIcon.png';
import Spinner from '../Spinner';
import chefhat from '../../../images/chef.svg';
import apple from '../../../images/apple.svg';
import packaging from '../../../images/packaging.svg';
import menuIcon from '../../../images/menuIcon.svg';
import { isEmpty } from '../../../utils/utils';

const MainMenu = ({
  auth: { isAuthenticated, loading },
  logout,
  venues,
  history
}) => {
  if (!venues.loading & isEmpty(venues.venues)) {
    console.log('Check venues', venues);
    // return <Redirect to="/onboarding" />;
  }

  const openVenueMenu = e => {
    document.getElementById('venueMenu').style.display = 'block';
  };

  let venueName = <Spinner width="20px" />;
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
        <Link className="menuItem" to="/menu-items">
          <div>
            <img
              src={menuIcon}
              alt="Menu icon for menu items link"
              className="largeIcon"
            />
          </div>
          <span>Menu Items</span>
        </Link>
        <Link className="menuItem" to="/recipes">
          <div>
            <img
              src={chefhat}
              alt="Heart to indicate the preferred supplier"
            />
          </div>
          <span>Recipes</span>
        </Link>
        <Link className="menuItem" to="/ingredients">
          <div>
            <img
              src={apple}
              alt="Heart to indicate the preferred supplier"
            />
          </div>
          <span>Ingredients</span>
        </Link>
        <Link className="menuItem" to="/packaging">
          <div>
            <img
              src={packaging}
              alt="Heart to indicate the preferred supplier"
            />
          </div>
          <span>Packaging</span>
        </Link>
      </nav>
      <nav className="subMenu">
        <Link className="menuItem" to="/performance">
          Venue Performance
        </Link>
        <Link className="menuItem" to="/account/profile">
          Account Settings
        </Link>
        <Link className="menuItem" to="/integrations">
          Integrations
        </Link>
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
          <div className="helpButton">
            <Link to="/need-help">Ask For Help</Link>
          </div>
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
