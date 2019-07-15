import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
import {
  setSelectedRecipe,
  getSelectedRecipe,
  removeSelectedRecipe
} from './recipeActions';
import {
  removePreferredSupplier,
  removeSelectedSupplier
} from '../supplier/supplierActions';
import { isEmpty, capitalizeFirstLetter } from '../../../utils/utils';

class SelectRecipe extends Component {
  state = {
    selectedValue: {
      label: 'Type recipe name to start..',
      value: 'no-recipe-selected'
    }
  };

  componentDidMount() {
    // console.log('SELECT MOUNT this.props: ', this.props.ingredient);

    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { selectedRecipe } = this.props.recipe;

      // console.log('selectedIngredient', selectedIngredient);

      let selectedValue = {};
      selectedValue.label = selectedRecipe.displayName;
      if (!selectedRecipe._id) {
        selectedValue.value = 'new';
      } else {
        selectedValue.value = selectedRecipe._id;
      }
      this.setState({ selectedValue: selectedValue });
    }
    // if (!isEmpty(this.props.ingredient.selectedIngredient)) {
    //   const { selectedIngredient } = this.props.ingredient;

    //   // console.log('selectedIngredient', selectedIngredient);

    //   let selectedValue = {};
    //   selectedValue.label = selectedIngredient.displayName;
    //   if (!selectedIngredient._id) {
    //     selectedValue.value = 'new';
    //   } else {
    //     selectedValue.value = selectedIngredient._id;
    //   }
    //   this.setState({ selectedValue: selectedValue });
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEmpty(this.props.recipe.selectedRecipe) &&
      prevProps.recipe.selectedRecipe !==
        this.props.recipe.selectedRecipe
    ) {
      const { selectedRecipe } = this.props.recipe;
      // console.log('selectedIngredient - UP', selectedIngredient);sss
      // if (!selectedIngredient.new) {
      let selectedValue = {};
      selectedValue.label = selectedRecipe.displayName;

      if (!selectedRecipe._id) {
        selectedValue.value = 'new';
      } else {
        selectedValue.value = selectedRecipe._id;
      }
      this.setState({ selectedValue: selectedValue });
    }
  }

  componentWillUnmount() {
    // console.log('SELECT INGREDIENT UNMOUNTED');
  }

  getSelectedValue = selectedValue => {
    // let addIngredient = false;
    let selectedRecipe = [];
    if (selectedValue.__isNew__) {
      // this.props.removeSelectedIngredient();
      // this.props.removeSelectedSupplier();
      // addIngredient = true;
      const newRecipe = {};
      newRecipe.displayName = capitalizeFirstLetter(
        selectedValue.label
      );

      // newRecipe.new = true;
      selectedRecipe.push(newRecipe);
    } else {
      if (this.props.recipe.recipes !== null) {
        selectedRecipe = this.props.recipe.recipes.filter(recipe => {
          return recipe._id === selectedValue.value;
        });
      }
    }
    if (!isEmpty(selectedRecipe)) {
      // this.props.removePreferredSupplier();

      console.log('SR', selectedRecipe);

      this.props.getSelectedRecipe(
        selectedRecipe[0],
        this.props.profile.profile
      );
      this.props.history.push(
        `/recipes/${selectedRecipe[0].urlName}`
      );
    }
  };

  render() {
    const { recipes } = this.props.recipe;
    const { selectedValue } = this.state;

    let formContent = '';

    if (recipes !== null) {
      const options = recipes.map(recipe => {
        let selectData = {};
        selectData.label = recipe.displayName;
        selectData.value = recipe._id;
        return selectData;
      });

      formContent = (
        <CreatableSelectInput
          value={selectedValue}
          name="recipe"
          options={options}
          getSelectedValue={this.getSelectedValue}
          placeholder="Type recipe name to start.."
          createLabel="+ Add Recipe"
          largeSelect={true}
        />
      );
    } else {
      formContent = (
        <CreatableSelectInput
          value={selectedValue}
          name="recipe"
          getSelectedValue={this.getSelectedValue}
          placeholder="Type recipe name to start.."
          createLabel="+ Add Recipe"
          largeSelect={true}
        />
      );
    }
    return (
      <React.Fragment>{formContent && formContent}</React.Fragment>
    );
  }
}

SelectRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  ingredient: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  setSelectedRecipe: PropTypes.func.isRequired,
  getSelectedRecipe: PropTypes.func.isRequired,
  removeSelectedRecipe: PropTypes.func.isRequired,
  removePreferredSupplier: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  setSelectedRecipe,
  getSelectedRecipe,
  removeSelectedRecipe,
  removePreferredSupplier,
  removeSelectedSupplier
};

const mapState = state => ({
  ingredient: state.ingredient,
  recipe: state.recipe,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(withRouter(SelectRecipe));