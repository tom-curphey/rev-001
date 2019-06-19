import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setSelectedVenue } from './venueActions';
import Spinner from '../../../utils/Spinner';
import { getNewVenueData } from '../../../utils/utils';
import PropTypes from 'prop-types';

function Venues({ venues, history, setSelectedVenue }) {
  let venuesList = '';

  const selectVenue = e => {
    const selectedVenue = venues.venues.filter(
      venue => venue._id === e.target.parentNode.id
    );

    setSelectedVenue(selectedVenue[0]);
    history.push(`/account/venues/edit/${selectedVenue[0].urlName}`);
  };

  const handleAddVenue = () => {
    const venueData = getNewVenueData();
    setSelectedVenue(venueData);

    history.push(`/account/venues/add`);
  };

  if (venues.venues !== null) {
    venuesList = venues.venues.map((venue, i) => {
      return (
        <li key={i} onClick={e => selectVenue(e)} id={venue._id}>
          <div />
          <div>{venue.displayName}</div>
          <div>-</div>
          <div>-</div>
        </li>
      );
    });
  }

  let venuesContent;
  console.log('LOading: ', venues.loading);

  if (venues.loading) {
    venuesContent = (
      <div style={{ marginTop: '200px' }}>
        <Spinner width="30px" />
      </div>
    );
  } else {
    venuesContent = (
      <ul>
        <li className="header">
          <div />
          <div>Name</div>
          <div>Recipes</div>
          <div>ROI</div>
        </li>
        {venuesList}
      </ul>
    );
  }

  return (
    <Fragment>
      <section className="settings venues">
        <div className="titleAndButtons">
          <h1>Venues</h1>
          <ul>
            <li onClick={handleAddVenue}> + Add Venue</li>
          </ul>
        </div>
        {venuesContent}
      </section>
    </Fragment>
  );
}

Venues.propTypes = {
  setSelectedVenue: PropTypes.func.isRequired
};

const actions = {
  setSelectedVenue
};

const mapState = state => ({
  venues: state.venues
});

export default connect(
  mapState,
  actions
)(withRouter(Venues));
