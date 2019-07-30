import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadIngredients } from '../ingredient/ingredientActions';
import TextInput from '../../layout/input/TextInput';
import SelectInput from '../../layout/input/SelectInput';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
import {
  isEmpty,
  calculateRecipeItemTotal,
  roundNumber,
  calculateRecipeIngredientContribution
} from '../../../utils/utils';
import editIcon from '../../../images/edit.svg';
import binIcon from '../../../images/bin.svg';

class RecipeIngredientForm extends Component {
  state = {
    item: {
      ingredient: '',
      displayName: '',
      quantity: '',
      unit: 'gram',
      total: 0,
      order: 0
    }
  };

  componentDidMount() {
    if (isEmpty(this.props.ingredient.ingredients)) {
      this.props.loadIngredients();
    }
    if (!isEmpty(this.props.item)) {
      this.setState({ item: this.props.item });
    }
  }

  componentDidUpdate = prevState => {
    if (prevState.item !== this.state.item) {
      this.setState({ item: this.props.item });
    }
  };

  getSelectedIngredientValue = selectedIngredientValue => {
    const ingredientData = this.props.ingredient.ingredients.filter(
      ing => {
        return ing._id === selectedIngredientValue.value;
      }
    );

    console.log('ingredientData', ingredientData);

    const updatedItem = {
      ...this.state.item,
      ingredient: selectedIngredientValue.value,
      cup: ingredientData[0].metrics.cup
        ? ingredientData[0].metrics.cup
        : null,
      whole: ingredientData[0].metrics.whole
        ? ingredientData[0].metrics.whole
        : null
    };

    this.setState(prevState => ({
      item: {
        ...prevState.item,
        ingredient: updatedItem.ingredient,
        cup: updatedItem.cup,
        whole: updatedItem.whole,
        total: calculateRecipeItemTotal(
          Number(updatedItem.quantity),
          updatedItem.unit,
          updatedItem
        )
      }
    }));
  };

  updateIngredientQuantity = e => {
    e.persist();
    const { name, value } = e.target;

    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          [name]: value,
          total: calculateRecipeItemTotal(
            Number(value),
            prevState.item.unit,
            prevState.item
          )
        }
      }));
    }
  };

  getSelectedUnitMetricValue = selectedValue => {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        unit: selectedValue.value,
        total: calculateRecipeItemTotal(
          prevState.item.quantity,
          selectedValue.value,
          prevState.item
        )
      }
    }));
  };

  updateSelectedRecipeIngredient = () => {
    this.props.updateSelectedRecipeIngredient(this.state.item);
  };

  render() {
    const { item } = this.state;
    const { ingredient } = this.props;

    let ingredientOptions = [];
    if (!isEmpty(ingredient.ingredients)) {
      ingredientOptions = ingredient.ingredients.map(i => {
        let selectData = {};
        selectData.label = i.displayName;
        selectData.value = i._id;
        return selectData;
      });
    }

    let ingredientMetricOptions = [];
    if (isEmpty(item.cup)) {
      ingredientMetricOptions.push(
        { value: 'gram', label: 'Gram' },
        { value: 'kilo', label: 'Kilo' }
      );
    } else {
      ingredientMetricOptions.push(
        { value: 'cup', label: 'Cup' },
        { value: 'gram', label: 'Gram' },
        { value: 'kilo', label: 'Kilo' },
        { value: 'tablespoon', label: 'Tablespoon' },
        { value: 'teaspoon', label: 'Teaspoon' }
      );
    }

    let ingredientMetricOptionsPlural = [];
    if (isEmpty(item.cup)) {
      ingredientMetricOptionsPlural.push(
        { value: 'gram', label: 'Grams' },
        { value: 'kilo', label: 'Kilos' }
      );
    } else {
      ingredientMetricOptionsPlural.push(
        { value: 'cup', label: 'Cups' },
        { value: 'gram', label: 'Grams' },
        { value: 'kilo', label: 'Kilos' },
        { value: 'tablespoon', label: 'Tablespoons' },
        { value: 'teaspoon', label: 'Teaspoons' }
      );
    }

    if (!isEmpty(item.whole)) {
      ingredientMetricOptions.push({
        value: 'whole',
        label: 'Whole'
      });
    }

    if (!isEmpty(item.whole)) {
      ingredientMetricOptionsPlural.push({
        value: 'whole',
        label: 'Whole'
      });
    }

    console.log('ITEM', item);

    return (
      <li>
        <div className="ingredientIcon">
          <img
            src={editIcon}
            alt="Editing icon to indicate that you can edit the ingredient"
          />
        </div>
        <div className="ingredientName">
          <span>{item.ingredient.displayName}</span>
        </div>
        <div className="ingredientNumber">
          <span>$0.00</span>
        </div>
        <div className="ingredientNumber">
          <span>{item.total}g</span>
        </div>
        <div className="ingredientNumber">
          <span>{calculateRecipeIngredientContribution(item)}%</span>
        </div>
        <div className="ingredientNumber">
          <span>$0.00</span>
        </div>
      </li>
    );
  }
}

const actions = {
  loadIngredients
};

const mapState = state => ({
  ingredient: state.ingredient
});

export default connect(
  mapState,
  actions
)(RecipeIngredientForm);
