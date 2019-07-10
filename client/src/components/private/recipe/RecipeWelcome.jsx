import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import chicpeaRecipe from '../../../images/chicpeaRecipe.svg';
import ingredientBasket from '../../../images/ingredientBasket.svg';
import venueSetup from '../../../images/venueSetup.svg';
import { Link } from 'react-router-dom';

const RecipeWelcome = ({ selectedVenue }) => {
  return (
    <Fragment>
      <h1>Welcome {selectedVenue && selectedVenue.displayName}</h1>
      <p>Where would you you like to start?</p>
      <div className="welcomeMenu">
        <Link to="!#">
          <img
            src={chicpeaRecipe}
            alt="Chic pea dish as icon to add a recipe"
          />
          <h2>+ Add Recipe</h2>
          <p>
            Calculate & Project <br />
            Recipe Profits
          </p>
        </Link>
        <Link to="/ingredients">
          <img
            src={ingredientBasket}
            alt="Personal holing an ingredient basket as an icon to organise ingredients"
          />
          <h2>Organise Ingredient Suppliers</h2>
          <p>Update ingredient prices & compare the market</p>
        </Link>
        <Link to="/account/venues">
          <img
            src={venueSetup}
            alt="Man standing at a bar as an icon to complete venue setup"
          />
          <h2>Complete Venue Setup</h2>
          <p>Improve calculator accuracy by adding venue costs</p>
        </Link>
      </div>
    </Fragment>
  );
};

RecipeWelcome.propTypes = {
  venues: PropTypes.object
};

const mapState = state => ({
  selectedVenue: state.venues.selectedVenue
});

export default connect(mapState)(RecipeWelcome);
