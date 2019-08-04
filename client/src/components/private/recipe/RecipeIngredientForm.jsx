import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadIngredients } from '../ingredient/ingredientActions';
import TextInput from '../../layout/input/TextInput';
import SelectInput from '../../layout/input/SelectInput';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
import HoverTextInput from '../../layout/input/HoverTextInput';
import {
  isEmpty,
  calculateRecipeItemTotal,
  roundNumber,
  calculateRecipeIngredientContribution,
  calclulateRecipeIngredientCost
} from '../../../utils/utils';
import editIcon from '../../../images/edit.svg';

class RecipeIngredientForm extends Component {
  state = {
    item: {
      ingredient: '',
      displayName: '',
      quantity: '',
      unit: 'gram',
      total: 0,
      totalRecipeGrams: 0,
      order: 0
    },
    displayPacketCostForm: false
  };

  componentDidMount() {
    if (!isEmpty(this.props.item)) {
      this.setState({ item: this.props.item });
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.item !== this.props.item) {
      this.setState({ item: this.props.item });
    }
  };

  updateSelectedRecipeIngredient = () => {
    console.log('this.state.item', this.state.item);

    this.props.updateSelectedRecipeIngredient(this.state.item);
  };

  editRecipeIngredientPacketCost = e => {
    console.log('ONCHANGE', e.target);
  };

  getSelectedSupplier = selectedValue => {
    console.log('sv', selectedValue);
  };

  render() {
    const { item, displayPacketCostForm } = this.state;

    let options;
    let selectedValue = {
      label: 'Select Supplier..',
      value: 'no-supplier-selected'
    };
    if (!isEmpty(item.ingredient.suppliers)) {
      options = item.ingredient.suppliers.map(supplier => {
        let selectData = {};
        selectData.label = supplier.supplier.displayName;
        selectData.value = supplier.supplier._id;

        if (
          !isEmpty(item.ingredient.preferedSupplier) &&
          item.ingredient.preferedSupplier === supplier.supplier._id
        ) {
          selectedValue.label = supplier.supplier.displayName;
          selectedValue.value = supplier.supplier._id;
        }

        return selectData;
      });
    }

    console.log('options', options);
    console.log('selectedValue', selectedValue);

    let content = null;
    if (!isEmpty(item.ingredient)) {
      content = (
        <li>
          <div className="ingredientIcon">
            <img
              src={editIcon}
              alt="Editing icon to indicate that you can edit the ingredient"
            />
          </div>
          <div className="ingredientName">
            <span>
              {item.ingredient.displayName} -{' '}
              {calculateRecipeIngredientContribution(item)}%
            </span>
          </div>
          <div className="ingredientNumberCost">
            <span>${calclulateRecipeIngredientCost(item)}</span>
          </div>
          <div className="ingredientNumber">
            <HoverTextInput
              value={roundNumber(
                item.ingredient.profilePacketCost
              ).toString()}
              name="packetCost"
              onChange={this.editRecipeIngredientPacketCost}
              onBlur={this.updateSelectedRecipeIngredient}
              type="text"
              // error={errors.displayName && errors.displayName}
              onKeyDown={this.handleEnterKeyDown}
              isForm={displayPacketCostForm}
            />
          </div>
          <div className="ingredientNumber">
            <HoverTextInput
              value={roundNumber(
                item.ingredient.profilePacketGrams
              ).toString()}
              name="packetGrams"
              onChange={this.editRecipeIngredientPacketCost}
              onBlur={this.updateSelectedRecipeIngredient}
              type="text"
              // error={errors.displayName && errors.displayName}
              onKeyDown={this.handleEnterKeyDown}
              isForm={displayPacketCostForm}
            />
          </div>
          <div className="ingredientSuppler">
            <span>
              <CreatableSelectInput
                name="type"
                placeholder="Type supplier name.."
                value={selectedValue && selectedValue}
                options={options}
                getSelectedValue={this.getSelectedSupplier}
                createLabel="+ Add Supplier"
              />
            </span>
          </div>
        </li>
      );
    }

    return !isEmpty(content) && content;
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
