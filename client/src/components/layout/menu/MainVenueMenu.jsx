import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setSelectedVenue } from '../../private/venue/venueActions';
import icon from '../../../images/recipeRevenueIcon.png';

const MainVenueMenu = ({ venues, setSelectedVenue }) => {
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

  let venueList;
  if (venues && venues.venues !== null) {
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
          You are signed in as <span>mail@bykalindi.com</span>
        </li>
      </ul>
      <ul className="actionLinks">
        <li>
          <span>x</span>
          <span className="actionLink">Manage your profile</span>
        </li>
        <li>
          <span>x</span>
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
  setSelectedVenue
};

const mapState = state => ({
  venues: state.venues
});

MainVenueMenu.propTypes = {
  venues: PropTypes.object,
  setSelectedVenue: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(MainVenueMenu);
