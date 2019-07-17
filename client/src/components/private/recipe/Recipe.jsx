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
import { addOrEditRecipe } from './recipeActions';

class Recipe extends Component {
  componentDidMount = () => {
    console.log('Recipe Page Loaded', this.props.venues);

    const { profile, isAuthenticated } = this.props;
    if (isAuthenticated === null || isAuthenticated === false) {
      return <Redirect to="/signin" />;
    }

    if (profile) {
      console.log('profile', profile);
      if (profile.profile !== null && profile.loading === false) {
        if (profile.profile.venues.length === 0) {
          console.log('Redirect', profile);
          // return this.props.history.push('/onboarding');
        }
      }
    }
  };

  handleSaveRecipe = () => {
    const { selectedRecipe } = this.props.recipe;

    if (selectedRecipe !== null) {
      console.log('SR', selectedRecipe);

      this.props.addOrEditRecipe(selectedRecipe);
    } else {
      console.log('Direct user to select a recipe');
    }
  };

  render() {
    const { recipes, selectedRecipe, loading } = this.props.recipe;

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
                // <h1>{selectedRecipe.displayName}</h1>
                !isEmpty(selectedRecipe.displayName) ? (
                  // click name to edit recipe name
                  <h1>{selectedRecipe.displayName}</h1>
                ) : (
                  <h1>Add New Recipe</h1>
                )
              ) : (
                <h1>Add New Recipe</h1>
              )}
              <div className="twoButtons">
                <Button
                  onClick={this.handleSaveRecipe}
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
              id="venueAccordion"
            >
              <div>Edit the venue</div>
            </AccordionBoxWithOpenHeader>

            <RecipeDetails />
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
  venues: PropTypes.object.isRequired,
  addOrEditRecipe: PropTypes.func.isRequired
};

const actions = {
  addOrEditRecipe
};

const mapState = state => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  venues: state.venues,
  recipe: state.recipe
});

export default connect(
  mapState,
  actions
)(withRouter(Recipe));
