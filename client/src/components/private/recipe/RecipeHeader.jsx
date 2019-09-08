import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from '../../../utils/utils';
import {
  addOrEditRecipe,
  updateReduxSelectedRecipe
} from './recipeActions';
import { setErrors } from '../../../redux/errorActions';
import TextInput from '../../layout/input/TextInput';
import Button from '../../layout/menu/Button';

class RecipeHeader extends Component {
  state = {
    selectedRecipe: null,
    displayRecipeNameForm: false,
    updated: false
  };

  componentDidMount = () => {
    const { selectedRecipe } = this.props.recipe;
    if (!isEmpty(selectedRecipe)) {
      this.setState({
        selectedRecipe: selectedRecipe
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { selectedRecipe } = this.props.recipe;
    // console.log('recipe', recipe);
    if (prevProps.recipe.selectedRecipe !== selectedRecipe) {
      if (!isEmpty(selectedRecipe)) {
        this.setState({
          selectedRecipe: selectedRecipe
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
        displayName: e.target.value,
        urlName: e.target.value
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase()
      }
    }));
  };

  updateReduxSelectedRecipeName = () => {
    console.log('checking2', this.state.selectedRecipe);
    this.props.updateReduxSelectedRecipe(this.state.selectedRecipe);
    this.setState({ displayRecipeNameForm: false });
  };

  handleSaveRecipe = () => {
    const { selectedRecipe } = this.props.recipe;

    console.log('Header Recipe', selectedRecipe);
    let errors = {};
    if (!isEmpty(selectedRecipe)) {
      if (isEmpty(selectedRecipe.displayName))
        errors.recipeDisplayName = 'Please enter recipe name above';

      if (!isEmpty(selectedRecipe.processTime)) {
        const ptCheck = selectedRecipe.processTime.filter(pt => {
          return isEmpty(pt.description);
        });
        if (!isEmpty(ptCheck)) {
          console.log('No Description');
          errors.recipeDisplayName =
            'Please compete all recipe descriptions';
        }
      }

      if (!isEmpty(errors)) {
        this.props.setErrors(errors);
      } else {
        this.props.addOrEditRecipe(selectedRecipe);
      }
    } else {
      console.log('Direct user to select a recipe');
      errors.recipeDisplayName = 'Please select a recipe';
      if (!isEmpty(errors)) {
        this.props.setErrors(errors);
      }
    }
  };

  handleCalculateRecipe = () => {
    const { selectedRecipe } = this.state;
    let errors = {};
    if (!isEmpty(selectedRecipe)) {
      let errors = {};
      console.log(
        'selectedRecipe.displayName',
        selectedRecipe.displayName
      );

      if (isEmpty(selectedRecipe.displayName))
        errors.recipeDisplayName = 'Please enter recipe name above';
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
        console.log('Header Recipe', errors);
        this.props.setErrors(errors);
      } else {
        console.log('All good');
        selectedRecipe.confirmed = true;
        this.props.addOrEditRecipe(selectedRecipe);
      }
    } else {
      console.log('Direct user to select a recipe');
      errors.recipeDisplayName = 'Please select a recipe';
      if (!isEmpty(errors)) {
        this.props.setErrors(errors);
      }
    }
  };

  handleEnterKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.updateReduxSelectedRecipeName();
    }
  };

  render() {
    const { recipe, errors } = this.props;
    const { displayRecipeNameForm, selectedRecipe } = this.state;

    // console.log('selectedRecipe', selectedRecipe);

    return (
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
                <form onBlur={this.updateReduxSelectedRecipeName}>
                  <TextInput
                    value={
                      selectedRecipe && selectedRecipe.displayName
                    }
                    name="recipeName"
                    onChange={this.editRecipeName}
                    type="text"
                    autoFocus={true}
                    error={errors.displayName && errors.displayName}
                    onKeyDown={this.handleEnterKeyDown}
                  />
                </form>
              ) : (
                <h1>
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
          {isEmpty(recipe.selectedRecipe) ? (
            <Button
              onClick={this.handleCalculateRecipe}
              buttonTitle="Calculate Revenue"
              buttonColour="green"
            />
          ) : (
            !recipe.selectedRecipe.confirmed && (
              <Button
                onClick={this.handleCalculateRecipe}
                buttonTitle="Calculate Revenue"
                buttonColour="green"
              />
            )
          )}
          <Button
            onClick={this.handleSaveRecipe}
            buttonTitle="Save Recipe"
            buttonColour="orange"
            buttonClass="save"
          />
        </div>
      </div>
    );
  }
}

RecipeHeader.propTypes = {
  addOrEditRecipe: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired
};

const actions = {
  addOrEditRecipe,
  updateReduxSelectedRecipe,
  setErrors
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
)(RecipeHeader);
