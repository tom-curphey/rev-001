import React, { Component } from 'react';
import TextInput from '../../layout/input/TextInput';
import SelectInput from '../../layout/input/SelectInput';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
import {
  isEmpty,
  calculateRecipeItemTotal
} from '../../../utils/utils';
import appleIcon from '../../../images/apple.svg';
import binIcon from '../../../images/bin.svg';

class RecipeIngredient extends Component {
  state = {
    item: {
      ingredient: '',
      quantity: '',
      unit: 'gram',
      total: 0,
      order: 0
    }
  };

  componentDidMount() {
    if (!isEmpty(this.props.item)) {
      this.setState({ item: this.props.item });
    }
  }

  getSelectedIngredientValue = selectedIngredientValue => {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        ingredient: selectedIngredientValue.value
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
          [name]: value
        }
      }));
    }
  };

  getSelectedUnitMetricValue = selectedValue => {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        unit: selectedValue.value
      }
    }));
  };

  updateSelectedRecipeIngredient = () => {
    this.props.updateSelectedRecipeIngredient(this.state.item);
  };

  render() {
    const { item } = this.state;
    const ingredientMetricOptions = [
      { value: 'cup', label: 'Cup' },
      { value: 'gram', label: 'Gram' },
      { value: 'tablepoon', label: 'Tablespoon' },
      { value: 'teaspoon', label: 'Teaspoon' }
    ];
    const ingredientMetricOptionsPlural = [
      { value: 'cup', label: 'Cups' },
      { value: 'gram', label: 'Grams' },
      { value: 'tablepoon', label: 'Tablespoons' },
      { value: 'teaspoon', label: 'Teaspoons' }
    ];

    return (
      <li>
        <div className="ingredientIcon">
          <img
            src={appleIcon}
            alt="Ingredeint icon to represent the recipe ingredient item"
          />
        </div>
        <div className="ingredientSelect">
          <CreatableSelectInput
            value={item.ingredient}
            name="ingredient"
            options={this.props.ingredientOptions}
            getSelectedValue={this.getSelectedIngredientValue}
            placeholder="Type ingredient name to start.."
            createLabel="+ Add Ingredient"
            data={item.order}
            styles={{ fontWeight: '400' }}
            onBlur={this.updateSelectedRecipeIngredient}
          />
        </div>
        <div className="ingredientQuantity">
          <TextInput
            value=""
            value={item.quantity}
            name="quantity"
            onChange={this.updateIngredientQuantity}
            inputClass="number"
            onBlur={this.updateSelectedRecipeIngredient}
            // error={
            //   errors.processQuantity && errors.processQuantity
            // }
          />
        </div>
        <div className="ingredientUnit">
          <SelectInput
            name="ingredientUnit"
            options={
              item.quantity >= 2
                ? ingredientMetricOptionsPlural
                : ingredientMetricOptions
            }
            getSelectedValue={this.getSelectedUnitMetricValue}
            // error={errors.ingredientUnit && errors.ingredientUnit}
            value={item.unit}
            data={item.order}
            onBlur={this.updateSelectedRecipeIngredient}
            // value={ingredientUnit}
          />
        </div>
        <div className="ingredientTotal">
          {calculateRecipeItemTotal(item.quantity, item.unit)} g
        </div>
        <div
          className="ingredientIcon delete"
          onClick={this.props.deleteRecipeIngredient(item.order)}
          // onClick={this.deleteProcessTime(item.order)}
        >
          <img
            src={binIcon}
            alt="Bin icon to represent the ability to delete a recipe ingredient item"
          />
        </div>
      </li>
    );
  }
}

export default RecipeIngredient;
