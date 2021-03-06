import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatableSelectInputBorder from '../../layout/input/CreatableSelectInputBorder';
import {
  setSelectedIngredient,
  getSelectedIngredient,
  removeSelectedIngredient
} from './ingredientActions';
import {
  removePreferredSupplier,
  removeSelectedSupplier
} from '../supplier/supplierActions';
import { isEmpty, capitalizeFirstLetter } from '../../../utils/utils';

class SelectIngredient extends Component {
  state = {
    selectedValue: {
      label: 'Type ingredient name to start..',
      value: 'no-ingredient-selected'
    }
  };

  componentDidMount() {
    // console.log('SELECT MOUNT this.props: ', this.props.ingredient);

    if (!isEmpty(this.props.ingredient.selectedIngredient)) {
      const { selectedIngredient } = this.props.ingredient;

      // console.log('selectedIngredient', selectedIngredient);

      let selectedValue = {};
      selectedValue.label = selectedIngredient.displayName;
      if (!selectedIngredient._id) {
        selectedValue.value = 'new';
      } else {
        selectedValue.value = selectedIngredient._id;
      }
      this.setState({ selectedValue: selectedValue });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEmpty(this.props.ingredient.selectedIngredient) &&
      prevProps.ingredient.selectedIngredient !==
        this.props.ingredient.selectedIngredient
    ) {
      const { selectedIngredient } = this.props.ingredient;
      console.log('selectedIngredient - UP', selectedIngredient);
      // if (!selectedIngredient.new) {
      let selectedValue = {};
      selectedValue.label = selectedIngredient.displayName;

      if (!selectedIngredient._id) {
        selectedValue.value = 'new';
      } else {
        selectedValue.value = selectedIngredient._id;
      }
      this.setState({ selectedValue: selectedValue });
    }
  }

  componentWillUnmount() {
    // console.log('SELECT INGREDIENT UNMOUNTED');
  }

  getSelectedValue = selectedValue => {
    // let addIngredient = false;
    let selectedIngredient = [];
    if (selectedValue.__isNew__) {
      this.props.removeSelectedIngredient();
      this.props.removeSelectedSupplier();
      // addIngredient = true;
      const newIngredient = {};
      newIngredient.metrics = {};
      newIngredient.displayName = capitalizeFirstLetter(
        selectedValue.label
      );

      // newIngredient.new = true;
      newIngredient.metrics.cup = '';
      newIngredient.metrics.whole = '';
      newIngredient.suppliers = [];
      selectedIngredient.push(newIngredient);
    } else {
      if (this.props.ingredient.ingredients !== null) {
        selectedIngredient = this.props.ingredient.ingredients.filter(
          ingredient => {
            return ingredient._id === selectedValue.value;
          }
        );
      }
    }
    if (!isEmpty(selectedIngredient)) {
      this.props.removePreferredSupplier();
      this.props.getSelectedIngredient(
        selectedIngredient[0],
        this.props.profile.profile
      );
    }
  };

  render() {
    const { ingredients } = this.props.ingredient;
    const { selectedValue } = this.state;

    let formContent = '';

    if (ingredients !== null) {
      const options = ingredients.map(ingredient => {
        let selectData = {};
        selectData.label = ingredient.displayName;
        selectData.value = ingredient._id;
        return selectData;
      });

      console.log('selectedValue', selectedValue);

      formContent = (
        <CreatableSelectInputBorder
          value={selectedValue}
          name="ingredient"
          options={options}
          getSelectedValue={this.getSelectedValue}
          placeholder="Type ingredient name to select ingredient.."
          createLabel="+ Add Ingredient"
          largeSelect={true}
        />
      );
    } else {
      formContent = (
        <CreatableSelectInputBorder
          value={selectedValue}
          name="ingredient"
          getSelectedValue={this.getSelectedValue}
          placeholder="Type ingredient name to select ingredient.."
          createLabel="+ Add Ingredient"
          largeSelect={true}
        />
      );
    }
    return (
      <React.Fragment>{formContent && formContent}</React.Fragment>
    );
  }
}

SelectIngredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired,
  getSelectedIngredient: PropTypes.func.isRequired,
  removeSelectedIngredient: PropTypes.func.isRequired,
  removePreferredSupplier: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  setSelectedIngredient,
  getSelectedIngredient,
  removeSelectedIngredient,
  removePreferredSupplier,
  removeSelectedSupplier
};

const mapState = state => ({
  ingredient: state.ingredient,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(SelectIngredient);
