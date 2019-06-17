import React, { Fragment } from 'react';
import { connect } from 'react-redux';

function Venues({ venues, loading }) {
  let venuesList = '';

  console.log('venues', venues);

  if (venues.venues !== null) {
    venuesList = venues.venues.map((venue, i) => {
      return (
        <li key={i}>
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

const mapState = state => ({
  venues: state.venues
});

export default connect(mapState)(Venues);
