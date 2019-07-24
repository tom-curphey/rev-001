import React, { Component } from 'react';
import TextInput from '../../layout/input/TextInput';
import SelectInput from '../../layout/input/SelectInput';
import {
  isEmpty,
  calculateRecipeItemTotal,
  roundNumber,
  convertSecondsToMinutes
} from '../../../utils/utils';
import timerIcon from '../../../images/timer.svg';
import chefIcon from '../../../images/chef.svg';
import binIcon from '../../../images/bin.svg';

class RecipeProcessTime extends Component {
  state = {
    item: {
      description: '',
      quantity: '',
      unit: 'sec',
      order: 0,
      staffTime: false,
      total: 0
    }
  };

  componentDidMount() {
    // console.log('this.props.item', this.props.item);

    if (!isEmpty(this.props.item)) {
      this.setState({ item: this.props.item });
    }
  }

  componentDidUpdate = prevProps => {
    // console.log('this.props.item', this.props.item);
    if (prevProps.item !== this.props.item) {
      if (!isEmpty(this.props.item)) {
        this.setState({ item: this.props.item });
      }
    }
  };

  onChangeProcessType = e => {
    e.persist();

    this.setState(prevState => ({
      item: {
        ...prevState.item,
        staffTime: !prevState.item.staffTime
      }
    }));
  };

  updateProcessTimeDescription = e => {
    if (!isEmpty(this.props.selectedRecipe._id)) {
      e.persist();
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          [e.target.name]: e.target.value
        }
      }));
    } else {
      this.props.selectRecipeError();
    }
  };

  updateProcessTimeQuantity = e => {
    if (!isEmpty(this.props.selectedRecipe._id)) {
      e.persist();
      const { name, value } = e.target;
      if (!isNaN(value) || value === '') {
        this.setState(prevState => ({
          item: {
            ...prevState.item,
            [name]: value,
            total: calculateRecipeItemTotal(
              Number(value),
              prevState.item.unit
            )
          }
        }));
      }
    } else {
      this.props.selectRecipeError();
    }
  };

  getSelectedUnitTimeValue = selectedValue => {
    if (!isEmpty(this.props.selectedRecipe._id)) {
      this.setState(prevState => ({
        item: {
          ...prevState.item,
          unit: selectedValue.value,
          total: calculateRecipeItemTotal(
            prevState.item.quantity,
            selectedValue.value
          )
        }
      }));
    } else {
      this.props.selectRecipeError();
    }
  };

  updateSelectedRecipeProcessTime = () => {
    if (!isEmpty(this.props.selectedRecipe._id)) {
      this.props.updateSelectedRecipeProcessTime(this.state.item);
    } else {
      this.props.selectRecipeError();
    }
  };

  render() {
    const { item } = this.state;

    const unitTimeOptions = [
      { value: 'sec', label: 'Second' },
      { value: 'min', label: 'Minute' },
      { value: 'hour', label: 'Hour' }
    ];
    const unitTimeOptionsPlural = [
      { value: 'sec', label: 'Seconds' },
      { value: 'min', label: 'Minutes' },
      { value: 'hour', label: 'Hours' }
    ];

    return (
      <li>
        <div
          className="processIcon"
          onClick={this.props.changeProcessTimeType(item.order)}
        >
          <img
            src={item.staffTime ? chefIcon : timerIcon}
            alt="Time icon to represent the recipe process item"
          />
        </div>
        <div className="processItem">
          <TextInput
            placeholder="Process Step Description"
            value={item.description}
            name="description"
            onChange={this.updateProcessTimeDescription}
            onBlur={this.updateSelectedRecipeProcessTime}
            // error={errors.processItem && errors.processItem
            // error={errors.processItem && errors.processItem}
          />
        </div>
        <div className="processQuantity">
          <TextInput
            value={item.quantity}
            name="quantity"
            onChange={this.updateProcessTimeQuantity}
            inputClass="number"
            onBlur={this.updateSelectedRecipeProcessTime}
            // error={
            //   errors.processQuantity && errors.processQuantity
            // }
          />
        </div>
        <div className="processUnit">
          <SelectInput
            name="processUnit"
            options={
              item.quantity >= 2
                ? unitTimeOptionsPlural
                : unitTimeOptions
            }
            getSelectedValue={this.getSelectedUnitTimeValue}
            // error={errors.processUnit && errors.processUnit}
            value={item.unit}
            onBlur={this.updateSelectedRecipeProcessTime}
            // value={processUnit}
          />
        </div>
        <div className="processTotal">
          {item.total &&
            roundNumber(convertSecondsToMinutes(item.total))}{' '}
          min
        </div>
        <div
          className="processIcon delete"
          onClick={this.props.deleteProcessTime(item.order)}
        >
          <img
            src={binIcon}
            alt="Bin icon to represent the ability to delete a recipe process item"
          />
        </div>
      </li>
    );
  }
}

export default RecipeProcessTime;
