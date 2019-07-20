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
import {
  addOrEditRecipe,
  updateReduxSelectedRecipe
} from './recipeActions';
import TextInput from '../../layout/input/TextInput';

class Recipe extends Component {
  state = {
    selectedRecipe: null,
    displayRecipeNameForm: false,
    updated: false
  };

  componentDidMount = () => {
    // console.log('Recipe Page Loaded', this.props.venues);

    const { profile, isAuthenticated, recipe } = this.props;
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

    if (!isEmpty(recipe.selectedRecipe)) {
      this.setState({
        selectedRecipe: recipe.selectedRecipe
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { recipe } = this.props;
    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      if (!isEmpty(recipe.selectedRecipe)) {
        this.setState({
          selectedRecipe: recipe.selectedRecipe
        });
      }
    }
  };

  displayRecipeNameForm = () => {
    this.setState({
      displayRecipeNameForm: true
    });
  };

  editRecipeName = e => {
    // console.log('e.t', e.target.value);
    e.persist();
    this.setState(prevState => ({
      selectedRecipe: {
        ...prevState.selectedRecipe,
        displayName: e.target.value
      }
    }));
  };

  updateReduxSelectedRecipeName = () => {
    this.props.updateReduxSelectedRecipe(this.state.selectedRecipe);
    this.setState({ displayRecipeNameForm: false });
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
    // const { recipes, selectedRecipe, loading } = this.props.recipe;
    const { recipe, errors } = this.props;
    const { displayRecipeNameForm, selectedRecipe } = this.state;

    console.log('SR', recipe);

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
            <div className="recipeHeader">
              {recipe.selectedRecipe !== null ? (
                // click name to edit recipe name
                // <h1>{selectedRecipe.displayName}</h1>
                !isEmpty(recipe.selectedRecipe.displayName) ? (
                  // click name to edit recipe name
                  <div
                    className="recipeName"
                    onClick={this.displayRecipeNameForm}
                  >
                    {displayRecipeNameForm ? (
                      <form
                        onBlur={this.updateReduxSelectedRecipeName}
                      >
                        <TextInput
                          value={selectedRecipe.displayName}
                          name="recipeName"
                          onChange={this.editRecipeName}
                          type="text"
                          autoFocus={true}
                          error={
                            errors.displayName && errors.displayName
                          }
                        />
                      </form>
                    ) : (
                      <h1 onClick={this.getRecipeNameForm}>
                        {selectedRecipe && selectedRecipe.displayName}
                      </h1>
                    )}
                  </div>
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
  addOrEditRecipe,
  updateReduxSelectedRecipe
};

const mapState = state => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  venues: state.venues,
  recipe: state.recipe,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(withRouter(Recipe));
