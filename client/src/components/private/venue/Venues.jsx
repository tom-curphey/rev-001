import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setSelectedVenue } from './venueActions';
import PropTypes from 'prop-types';

function Venues({ venues, loading, history, setSelectedVenue }) {
  let venuesList = '';

  const selectVenue = e => {
    const selectedVenue = venues.venues.filter(
      venue => venue._id === e.target.parentNode.id
    );

    setSelectedVenue(selectedVenue[0]);
    history.push(`/account/venues/edit/${selectedVenue[0].urlName}`);
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

  return (
    <Fragment>
      <section className="settings venues">
        <h1>Venues</h1>
        <ul>
          <li className="header">
            <div />
            <div>Name</div>
            <div>Recipes</div>
            <div>ROI</div>
          </li>
          {venuesList}
        </ul>
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
