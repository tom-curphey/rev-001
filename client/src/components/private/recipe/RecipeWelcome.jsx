import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const RecipeWelcome = ({ selectedVenue }) => {
  return (
    <Fragment>
      <h1>Welcome {selectedVenue && selectedVenue.displayName}</h1>
      <p>Where would you you like to start?</p>
      <ul>
        <li>
          <p>img</p>
          <p>+ Add Recipe</p>
          <p>Calculate & Project Recipe Profits</p>
        </li>
        <li>
          <p>img</p>
          <p>+ Add Recipe</p>
          <p>Calculate & Project Recipe Profits</p>
        </li>
        <li>
          <p>img</p>
          <p>+ Add Recipe</p>
          <p>Calculate & Project Recipe Profits</p>
        </li>
      </ul>
    </Fragment>
  );
};

RecipeWelcome.propTypes = {
  venues: PropTypes.object.isRequired
};

const mapState = state => ({
  selectedVenue: state.venues.selectedVenue
});

export default connect(mapState)(RecipeWelcome);
