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
import { addOrEditIngredientAndSupplier } from '../ingredient/ingredientActions';

class RecipeIngredientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      time: 0,
      start: 0,
      stateUpdated: false,
      isOn: false,
      saveLoading: false,
      addSupplierOption: true
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

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
    if (
      prevProps.item !== this.props.item &&
      this.state.saveLoading === false
    ) {
      console.log('this.state.stateUpdated', this.state.stateUpdated);
      console.log('saveLoading', this.state.saveLoading);

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

    if (this.state.time >= 2000 && this.state.isOn === true) {
      console.log('STOPPED');
      this.stopTimer();
    }

    if (prevState.item !== this.state.item) {
      console.log('ITEM CHANGED', prevState.item);
      console.log('ITEM CHANGED*', this.state.item);
      if (
        this.state.isOn === false &&
        this.state.stateUpdated === true
      ) {
        this.startTimer();
      }
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startTimer() {
    this.setState({
      time: 0,
      start: Date.now() - 0,
      isOn: true,
      saveLoading: false
    });
    this.timer = setInterval(
      () =>
        this.setState({
          time: Date.now() - this.state.start
        }),
      1000
    );
  }
  stopTimer() {
    this.setState({ isOn: false, stateUpdated: false });
    clearInterval(this.timer);
    console.log('timer', this.timer);
    this.updateSelectedRecipeIngredient();
  }
  resetTimer() {
    this.setState({ time: 0 });
  }

  editRecipeIngredient = e => {
    // console.log('ONCHANGE', e.target.value);
    const { name, value } = e.target;
    // console.log('this.state.item', this.state.item);

    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          ingredient: {
            ...prevState.item.ingredient,
            [name]: value
          }
        },
        isOn: true,
        stateUpdated: true
      }));
      clearInterval(this.timer);
      this.startTimer();
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
      isOn: true,
      stateUpdated: true
    }));
    clearInterval(this.timer);
    this.startTimer();
  };

  getSelectInputChange = inputValue => {
    console.log('inputValue', inputValue);
    if (!isEmpty(inputValue)) {
      this.setState({ addSupplierOption: false });
    } else {
      this.setState({ addSupplierOption: true });
    }
  };

  updateSelectedRecipeIngredient = () => {
    const { item } = this.state;

    if (!isEmpty(item.ingredient.preferedSupplier)) {
      console.log('this.state.item - SAVE', item);

      let updatedIngredient = {};
      let updatedSupplier = {};
      // Find updated ingredient

      updatedIngredient = {
        _id: item.ingredient._id,
        displayName: item.ingredient.displayName,
        suppliers: item.ingredient.suppliers,
        metrics: {
          cup: item.cup,
          whole: item.whole
        }
      };
      updatedSupplier = {
        packetCost: item.ingredient.profilePacketCost,
        packetGrams: item.ingredient.profilePacketGrams,
        preferred: true,
        _id: item.ingredient.preferedSupplier
      };

      console.log('updatedIngredients', updatedIngredient);
      console.log('updatedSupplier', updatedSupplier);
      this.setState({ saveLoading: true });
      this.props.addOrEditIngredientAndSupplier(
        updatedIngredient,
        updatedSupplier
      );
    } else {
      console.log('NO SUPPLIER SELECTED');
      let errors = {
        selectedSupplier: 'Select Supplier to save ingredient changes'
      };
      this.setState({ errors: errors });
    }
  };

  render() {
    const {
      item,
      displayPacketCostForm,
      addSupplierOption,
      errors
    } = this.state;

    let options = [];
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

    if (addSupplierOption === true) {
      let addSupplierOption = {
        label: '+ Add Supplier',
        value: 'add-supplier'
      };
      console.log('options', options);
      options.push(addSupplierOption);
    } else {
      options = options.filter(o => {
        console.log('o.value', o.value);
        return o.value !== 'add-supplier';
      });
      console.log('FILTERED OPTIONS', options);
    }

    console.log('options', options);
    // console.log('item', item);
    // console.log('selectedValue', selectedValue);

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
                getSelectInputChange={this.getSelectInputChange}
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
  loadIngredients,
  addOrEditIngredientAndSupplier
};

const mapState = state => ({
  ingredient: state.ingredient
});

export default connect(
  mapState,
  actions
)(RecipeIngredientForm);
