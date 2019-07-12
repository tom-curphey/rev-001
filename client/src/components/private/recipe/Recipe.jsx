import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import Button from '../../layout/menu/Button';
import { isEmpty } from '../../../utils/utils';
import AccordionBox from '../../layout/AccordionBox';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import RecipeDetails from './RecipeDetails';

class Recipe extends Component {
  state = {
    isVenueOpen: false,
    isRecipeDetailsOpen: false,
    isRecipeResultsOpen: false,
    isRecipeIngredientsOpen: false
  };

  componentDidMount = () => {
    const { profile, isAuthenticated } = this.props;
    if (isAuthenticated === null || isAuthenticated === false) {
      return <Redirect to="/signin" />;
    }

    if (profile) {
      // console.log('profile', profile);
      if (profile.profile !== null && profile.loading === false) {
        if (profile.profile.venues.length === 0) {
          // console.log('Redirect', profile.profile.venues);
          return <Redirect to="/onboarding" />;
        }
      }
    }
  };

  render() {
    const { recipes, selectedRecipe, loading } = this.props.recipe;
    const {
      isVenueOpen,
      isRecipeDetailsOpen,
      isRecipeResultsOpen,
      isRecipeIngredientsOpen
    } = this.state;

    let content;
    if (loading) {
      content = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (selectedRecipe === null && isEmpty(recipes)) {
        return <Redirect to="/welcome" />;
      } else {
        content = (
          <Fragment>
            <div className="recipeHeader">
              {selectedRecipe !== null ? (
                // click name to edit recipe name
                <h1>{selectedRecipe.displayName}</h1>
              ) : (
                <h1>Add Recipe</h1>
              )}
              <div className="twoButtons">
                <Button
                  buttonTitle="Save Recipe"
                  buttonColour="orange"
                />
                <Button
                  buttonTitle="Calculate Revenue"
                  buttonColour="green"
                />
              </div>
            </div>
            <AccordionBoxWithOpenHeader
              headerText="Venue Details + Edit form for operating costs"
              onClick="handleAccordianClick"
            >
              <div>Edit the venue</div>
            </AccordionBoxWithOpenHeader>
            <AccordionBox
              isOpen={true}
              headerText="Recipe Details + Edit form for name, serves, weekly sales and recipe process"
              onClick="handleAccordianClick"
            >
              <RecipeDetails />
            </AccordionBox>
          </Fragment>
        );
      }
    }

    return (
      <AuthMenu>
        <section className="recipe">{content}</section>
      </AuthMenu>
    );
  }
}

Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  venues: PropTypes.object.isRequired
};

// const actions = {
//   loadVenues
// };

const mapState = state => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  venues: state.venues,
  recipe: state.recipe
});

export default connect(mapState)(withRouter(Recipe));
