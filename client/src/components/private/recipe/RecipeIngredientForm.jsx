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
    displayPacketCostForm: false,
    errors: {},
    updated: false
  };

  componentDidMount() {
    if (!isEmpty(this.props.item)) {
      let updateItem = {
        ...this.props.item
      };
      if (!isEmpty(updateItem.ingredient)) {
        updateItem.ingredient.profilePacketCost = roundNumber(
          updateItem.ingredient.profilePacketCost,
          3
        ).toString();
        updateItem.ingredient.profilePacketGrams = roundNumber(
          updateItem.ingredient.profilePacketGrams,
          3
        ).toString();
      }
      this.setState({ item: updateItem });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log('PREVSTATE:', this.state);

    if (prevProps.item !== this.props.item) {
      let updateItem = {
        ...this.props.item
      };
      if (!isEmpty(updateItem.ingredient)) {
        updateItem.ingredient.profilePacketCost = roundNumber(
          updateItem.ingredient.profilePacketCost,
          3
        ).toString();
        updateItem.ingredient.profilePacketGrams = roundNumber(
          updateItem.ingredient.profilePacketGrams,
          3
        ).toString();
      }
      this.setState({ item: updateItem });
    }

    if (prevState.item !== this.state.item) {
      if (this.state.updated === true) {
        console.log('YESY');
        this.setState({ updated: false });
        this.updateSelectedRecipeIngredient();
      }
    }
  };

  editRecipeIngredient = e => {
    console.log('ONCHANGE', e.target.value);
    const { name, value } = e.target;
    console.log('this.state.item', this.state.item);

    // this.setState(prevState => ({
    //   selectedIngredient: {
    //     ...prevState.selectedIngredient,
    //     metrics: {
    //       ...prevState.selectedIngredient.metrics,
    //       [e.target.name]: value
    //     }
    //   }
    // }));
    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          ingredient: {
            ...prevState.item.ingredient,
            [name]: value
          }
        }
      }));
    }
  };

  getSelectedSupplier = selectedValue => {
    console.log('sv', selectedValue);
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        ingredient: {
          ...prevState.item.ingredient,
          preferedSupplier: selectedValue.value
        }
      },
      updated: true
    }));
  };

  updateSelectedRecipeIngredient = () => {
    const { item } = this.state;

    if (!isEmpty(item.ingredient.preferedSupplier)) {
      console.log('this.state.item', this.state.item);
      this.props.updateSelectedRecipeIngredient(this.state.item);
    } else {
      console.log('NO SUPPLIER SELECTED');
      let errors = {
        selectedSupplier: 'Select Supplier to save ingredient changes'
      };
      this.setState({ errors: errors });
    }
  };

  render() {
    const { item, displayPacketCostForm, errors } = this.state;

    let options;
    let selectedValue = {
      label: 'Type Supplier..',
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
    console.log('item', item);
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
            <span>
              ${roundNumber(calclulateRecipeIngredientCost(item), 3)}
            </span>
          </div>
          <div className="ingredientNumber">
            <HoverTextInput
              value={item.ingredient.profilePacketCost}
              name="profilePacketCost"
              onChange={this.editRecipeIngredient}
              onBlur={this.updateSelectedRecipeIngredient}
              type="text"
              // error={errors.displayName && errors.displayName}
              onKeyDown={this.handleEnterKeyDown}
              isForm={displayPacketCostForm}
            />
          </div>
          <div className="ingredientNumber">
            <HoverTextInput
              value={item.ingredient.profilePacketGrams}
              name="profilePacketGrams"
              onChange={this.editRecipeIngredient}
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
                error={
                  errors.selectedSupplier && errors.selectedSupplier
                }
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
