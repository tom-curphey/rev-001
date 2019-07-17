import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { setSelectedVenue } from '../../private/venue/venueActions';
import icon from '../../../images/recipeRevenueIcon.png';
import { Link } from 'react-router-dom';
import { logout } from '../../public/auth/authActions';
import userIcon from '../../../images/user.svg';
import exitIcon from '../../../images/exit.svg';
import { isEmpty } from '../../../utils/utils';
import Spinner from '../Spinner';

const MainVenueMenu = ({
  venues,
  setSelectedVenue,
  history,
  profile,
  logout
}) => {
  // if (isEmpty(venues.venues)) {
  //   return <Redirect to="/onboarding" />;
  // }

  const closeVenueMenu = e => {
    document.getElementById('venueMenu').style.display = 'none';
  };

  const changeSelectedVenue = e => {
    const selectedVenue = venues.venues.filter(venue => {
      return venue._id === e.target.id;
    });
    setSelectedVenue(selectedVenue[0]);
    closeVenueMenu();
  };

  const handleLogout = () => {
    logout();
  };

  let venueList;
  // console.log('venue', venues);

  if (!venues.loading && !isEmpty(venues.selectedVenue)) {
    if (
      venues &&
      venues.venues !== null &&
      !isEmpty(venues.venues[0])
    ) {
      const { selectedVenue } = venues;
      venueList = venues.venues.map(function(venue, i) {
        if (
          selectedVenue !== null &&
          venue.displayName === selectedVenue.displayName
        ) {
          return (
            <li className="selected" key={i}>
              <span>{venue.displayName}</span> <span>L</span>
            </li>
          );
        } else {
          return (
            <li
              key={i}
              id={venue._id}
              onClick={e => changeSelectedVenue(e)}
            >
              {venue.displayName}
            </li>
          );
        }
      });
    }
  }

  return (
    <nav id="venueMenu" className="mainVenueMenu">
      <ul className="venueMenuHeader">
        <li>
          <img src={icon} alt="Recipe Revenue Icon" />
        </li>
        <li>Recipe Revenue Account</li>
        <li onClick={closeVenueMenu}>X</li>
      </ul>
      <ul className="venueMenuList">{venueList}</ul>
      <ul className="addVenueLink">
        <li className="actionLink">Create a new venue +</li>
      </ul>
      <hr />
      <ul className="accountAddress">
        <li>
          You are signed in as{' '}
          <span>{profile && profile.user.email}</span>
        </li>
      </ul>
      <ul className="actionLinks">
        <li>
          <Link to="/account/profile">
            <div>
              <img
                src={userIcon}
                alt="User icon to represent profile link"
              />
            </div>
            <span className="actionLink">Account Settings</span>
          </Link>
        </li>
        <li onClick={handleLogout}>
          <div>
            <img
              src={exitIcon}
              alt="Exit icon to represent the logout link"
            />
          </div>
          <span className="actionLink">Sign out</span>
        </li>
      </ul>
      <hr />
      <ul className="terms">
        <li>Terms - Privacy</li>
      </ul>
    </nav>
  );
};

const actions = {
  setSelectedVenue,
  logout
};

const mapState = state => ({
  venues: state.venues,
  profile: state.profile.profile
});

MainVenueMenu.propTypes = {
  venues: PropTypes.object,
  setSelectedVenue: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(MainVenueMenu));
