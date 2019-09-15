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
  state = {
    selectedRecipe: {
      confirmed: false
    },
    isNew: false,
    showRecipeResults: false
  };
  componentDidMount = () => {
    const {
      selectedRecipe,
      profile,
      isAuthenticated
    } = this.props.recipe;

    this.setState(prevState => ({
      ...prevState,
      selectedRecipe: selectedRecipe
    }));

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

  componentDidUpdate = (prevProps, prevState) => {
    const { selectedRecipe } = this.props.recipe;
    if (prevProps.recipe.selectedRecipe !== selectedRecipe) {
      this.setState(prevState => ({
        ...prevState,
        selectedRecipe: selectedRecipe
      }));
    }

    if (
      !isEmpty(prevState.selectedRecipe) &&
      !isEmpty(this.state.selectedRecipe)
    ) {
      console.log('HIT**>', prevState);
      console.log('HIT**>', this.state);
      if (
        prevState.selectedRecipe.confirmed !==
        this.state.selectedRecipe.confirmed
      ) {
        alert('Confirm Recipe On Calculate changed');
        console.log('Show Recipe Results');
        this.setState(prevState => ({
          ...prevState,
          showRecipeResults: true
        }));
      }
    }

    // console.log(
    //   'prev-showRecipeResults',
    //   prevState.showRecipeResults
    // );
    // console.log(
    //   'props-showRecipeResults',
    //   this.state.showRecipeResults
    // );

    // if (
    //   prevState.showRecipeResults !== this.state.showRecipeResults
    // ) {
    //   console.log('displayRecipeResults');
    //   if (this.state.showRecipeResults === true) {

    //   }
    // }
  };

  componentWillUnmount() {
    if (!isEmpty(this.props.ingredient.selectedIngredient)) {
      this.props.removeSelectedIngredient();
    }
  }

  handleCalculateRecipe = () => {
    const { selectedRecipe } = this.state;
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
    if (
      !isEmpty(selectedRecipe.ingredients) &&
      selectedRecipe.ingredients.length === 1
    ) {
      const iCheck = selectedRecipe.ingredients.filter(i => {
        return i.ingredient === '__isNew__';
      });
      if (!isEmpty(iCheck)) {
        console.log('No Description');
        errors.recipeIngredients =
          'Please add an ingredient before calculating recipe cost';
      }
    }

    if (!isEmpty(errors)) {
      this.props.setErrors(errors);
    } else {
      console.log('All good', selectedRecipe);
      selectedRecipe.confirmed = true;
      this.props.addOrEditRecipe(selectedRecipe);

      this.scrollToResults();
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

  scrollToResults = () => {
    setTimeout(() => {
      document
        .getElementById('recipeResults')
        .scrollIntoView({ behavior: 'smooth' });
    }, 1000);
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
            {/* <AccordionBoxWithOpenHeader
              headerText="Venue Details + Edit form for operating costs"
              id="venueAccordion"
            >
              <div>Edit the venue</div>
            </AccordionBoxWithOpenHeader> */}
            {/* {!isEmpty(recipe.selectedRecipe) &&
              recipe.selectedRecipe.confirmed && (
                <RecipeIngredients />
              )} */}
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
