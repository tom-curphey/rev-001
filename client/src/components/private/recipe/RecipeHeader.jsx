import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from '../../../utils/utils';
import {
  addOrEditRecipe,
  updateReduxSelectedRecipe
} from './recipeActions';
import TextInput from '../../layout/input/TextInput';
import Button from '../../layout/menu/Button';

class RecipeHeader extends Component {
  state = {
    selectedRecipe: null,
    displayRecipeNameForm: false,
    updated: false
  };

  componentDidMount = () => {
    const { recipe } = this.props;
    if (!isEmpty(recipe.selectedRecipe)) {
      this.setState({
        selectedRecipe: recipe.selectedRecipe
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { recipe } = this.props;
    // console.log('recipe', recipe);
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
        displayName: e.target.value,
        urlName: e.target.value
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase()
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
      this.props.addOrEditRecipe(selectedRecipe);
    } else {
      console.log('Direct user to select a recipe');
    }
  };

  render() {
    const { recipe, errors } = this.props;
    const { displayRecipeNameForm, selectedRecipe } = this.state;

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
                    value={selectedRecipe.displayName}
                    name="recipeName"
                    onChange={this.editRecipeName}
                    type="text"
                    autoFocus={true}
                    error={errors.displayName && errors.displayName}
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
    );
  }
}

RecipeHeader.propTypes = {
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
)(RecipeHeader);
