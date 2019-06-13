import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import icon from '../../../images/recipeRevenueIcon.png';

class MainVenueMenu extends Component {

  closeVenueMenu = e => {
    document.getElementById('venueMenu').style.display = 'none';
  };

  render() {
    return (
      <nav id="venueMenu" className="mainVenueMenu">
        <ul className="venueMenuHeader">
          <li>
            <img src={icon} alt="Recipe Revenue Icon" />
          </li>
          <li>Recipe Revenue Account</li>
          <li onClick={this.closeVenueMenu}>X</li>
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
  }
}

export default MainVenueMenu







import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import icon from '../../../images/recipeRevenueIcon.png';

const MainVenueMenu = ({ venues }) => {
  const closeVenueMenu = e => {
    document.getElementById('venueMenu').style.display = 'none';
  };

  let venueList;
  if (venues && venues.venues !== null && venues.venues.length >= 1) {
    const selectedVenue = venues.selectedVenue;
    console.log('selectedVenue', selectedVenue);

    venueList = venues.venues.map(function(venue, i) {
      console.log('test', venue.displayName);
      if (venue.displayName === selectedVenue.displayName) {
        return (
          <li className="selected" key={i}>
            {venue.displayName}
          </li>
        );
      } else {
        return <li key={i}>{venue.displayName}</li>;
      }
    });
  }

  console.log('venueList', venueList);

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

const mapState = state => ({
  venues: state.venues
});

MainVenueMenu.propTypes = {
  venues: PropTypes.object
};

export default connect(mapState)(MainVenueMenu);
