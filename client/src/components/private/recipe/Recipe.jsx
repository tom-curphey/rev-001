import React, { Component, Fragment } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';
import RecipeHeader from './RecipeHeader';
import RecipeResults from './RecipeResults';
import RecipeIngredients from './RecipeIngredients';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import RecipeDetails from './RecipeDetails';
import Button from '../../layout/menu/Button';
import { removeSelectedIngredient } from '../ingredient/ingredientActions';
import { setErrors } from '../../../redux/errorActions';
import { addOrEditRecipe } from './recipeActions';

class Recipe extends Component {
  componentDidMount = () => {
    // console.log('Recipe Page Loaded', this.props.venues);

    const { profile, isAuthenticated } = this.props;
    if (isAuthenticated === null || isAuthenticated === false) {
      return <Redirect to="/signin" />;
    }

    if (profile) {
      if (profile.profile !== null && profile.loading === false) {
        if (profile.profile.venues.length === 0) {
          console.log('Redirect? DO YOU NEED THIS?', profile);
          // return this.props.history.push('/onboarding');
        }
      }
    }
  };

  componentWillUnmount() {
    if (!isEmpty(this.props.ingredient.selectedIngredient)) {
      this.props.removeSelectedIngredient();
    }
  }

  handleCalculateRecipe = () => {
    const { selectedRecipe } = this.props.recipe;
    console.log('Header Recipe', selectedRecipe);
    let errors = {};

    if (isEmpty(selectedRecipe.serves))
      errors.serves = 'Please enter total recipe serves';
    if (isEmpty(selectedRecipe.salePricePerServe))
      errors.salePricePerServe =
        'Please enter the sales price per serve';
    if (isEmpty(selectedRecipe.expectedSales))
      errors.expectedSales =
        'Please enter the expected weekly sales per serve';
    if (isEmpty(selectedRecipe.ingredients))
      errors.recipeIngredients =
        'All recipes need atleast 1 ingredient to be calculated..';

    if (!isEmpty(errors)) {
      this.props.setErrors(errors);
    } else {
      console.log('All good');
      selectedRecipe.confirmed = true;
      this.props.addOrEditRecipe(selectedRecipe);
    }
  };

  updateSelectedRecipeIngredient = updatedItem => {
    const { selectedRecipe } = this.state;
    const recipeData = { ...selectedRecipe };

    let updatedIngredients = recipeData.ingredients.map(item => {
      if (item.order === updatedItem.order) {
        item = updatedItem;
      }
      return item;
    });

    recipeData.ingredients = updatedIngredients;
    this.setState({ updated: true, selectedRecipe: recipeData });
  };

  render() {
    const { recipe } = this.props;

    let content;
    if (recipe.loading) {
      content = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (isEmpty(recipe.selectedRecipe) && isEmpty(recipe.recipes)) {
        return <Redirect to="/welcome" />;
      } else {
        content = (
          <Fragment>
            <RecipeHeader />
            <AccordionBoxWithOpenHeader
              headerText="Venue Details + Edit form for operating costs"
              id="venueAccordion"
            >
              <div>Edit the venue</div>
            </AccordionBoxWithOpenHeader>
            {!isEmpty(recipe.selectedRecipe) &&
              recipe.selectedRecipe.confirmed && (
                <RecipeIngredients />
              )}
            <RecipeDetails />
            {!isEmpty(recipe.selectedRecipe) &&
              recipe.selectedRecipe.confirmed && <RecipeResults />}
            {!isEmpty(recipe.selectedRecipe) &&
              !recipe.selectedRecipe.confirmed && (
                <Button
                  onClick={this.handleCalculateRecipe}
                  buttonTitle="Calculate Revenue"
                  buttonColour="green"
                  buttonClass="center"
                />
              )}
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
  ingredient: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  setErrors: PropTypes.func.isRequired,
  removeSelectedIngredient: PropTypes.func.isRequired
  // venues: PropTypes.object.isRequired
};

const actions = {
  setErrors,
  addOrEditRecipe,
  removeSelectedIngredient
};

const mapState = state => ({
  recipe: state.recipe,
  ingredient: state.ingredient,
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapState,
  actions
)(withRouter(Recipe));
