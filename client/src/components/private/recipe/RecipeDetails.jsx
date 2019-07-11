import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectRecipe from './SelectRecipe';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import TextInput from '../../layout/input/TextInput';
import SelectInput from '../../layout/input/SelectInput';
import timerIcon from '../../../images/timer.svg';
import appleIcon from '../../../images/apple.svg';
import binIcon from '../../../images/bin.svg';

class RecipeDetails extends Component {
  state = {
    selectedRecipe: {
      serves: '',
      pricePerServe: '',
      expectedWeeklyServesSales: '',
      steps: {
        processItem: '',
        processQuantity: '',
        processUnit: 'min'
      }
    }
  };

  handleRecipeNumberChange = e => {
    e.persist();
    let value = e.target.value;
    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        selectedRecipe: {
          ...prevState.selectedRecipe,
          [e.target.name]: value
        }
      }));
    }
  };

  getSelectedUnitValue = selectedValue => {
    console.log('SV', selectedValue);
  };

  render() {
    const { recipe, errors } = this.props;
    const {
      selectedRecipe: {
        serves,
        pricePerServe,
        expectedWeeklyServesSales,
        steps: { processItem, processQuantity, processUnit }
      }
    } = this.state;

    const unitTimeOptions = [
      { value: 'sec', label: 'Seconds' },
      { value: 'min', label: 'Minutes' },
      { value: 'hour', label: 'Hours' }
    ];

    return (
      <section className="recipeDetails">
        <form onSubmit={this.handleOnSubmit}>
          <div className="recipeDetailsHeader">
            <div>
              <div className="selectRecipe">
                <SelectRecipe />
              </div>
            </div>
            <div>
              <TextInputHorizontal
                label="Recipe Serves"
                value={serves}
                name="serves"
                onChange={this.handleRecipeNumberChange}
                type="text"
                error={errors.serves && errors.serves}
                labelClass="alignTitleRight"
                inputClass="number"
              />
              <TextInputHorizontal
                label="Sale price per serve"
                value={pricePerServe}
                name="pricePerServe"
                onChange={this.handleRecipeNumberChange}
                type="text"
                error={errors.pricePerServe && errors.pricePerServe}
                labelClass="alignTitleRight"
                inputClass="number"
              />
              <TextInputHorizontal
                label="Expected Weekly Serve Sales"
                value={expectedWeeklyServesSales}
                name="expectedWeeklyServesSales"
                onChange={this.handleRecipeNumberChange}
                type="text"
                error={
                  errors.expectedWeeklyServesSales &&
                  errors.expectedWeeklyServesSales
                }
                labelClass="alignTitleRight"
                inputClass="number"
              />
            </div>
          </div>
          <div className="recipeProcess">
            <ul className="recipeProcessHeader">
              <li />
              <li>Item</li>
              <li>Quantity</li>
              <li>Unit</li>
              <li>Total</li>
              <li />
            </ul>
            <ul className="recipeProcessItems">
              <li>
                <div className="processIcon">
                  <img
                    src={timerIcon}
                    alt="Time icon to represent the recipe process item"
                  />
                </div>
                <div className="processItem">
                  <TextInput
                    placeholder="Process Step Description"
                    value={processItem}
                    name="processItem"
                    onChange={this.onChange}
                    error={errors.processItem && errors.processItem}
                  />
                </div>
                <div className="processQuantity">
                  <TextInput
                    placeholder="0"
                    value={processQuantity}
                    name="processQuantity"
                    onChange={this.onChange}
                    error={
                      errors.processQuantity && errors.processQuantity
                    }
                    inputClass="number"
                  />
                </div>
                <div className="processUnit">
                  <SelectInput
                    name="processUnit"
                    options={unitTimeOptions}
                    getSelectedValue={this.getSelectedUnitValue}
                    error={errors.processUnit && errors.processUnit}
                    value={processUnit}
                  />
                </div>
                <div className="processTotal">0.00</div>
                <div className="processIcon delete">
                  <img
                    src={binIcon}
                    alt="Bin icon to represent the ability to delete a recipe process item"
                  />
                </div>
              </li>
            </ul>
            <ul className="recipeProcessButtons">
              <li>
                <div className="buttonIcon">
                  <img
                    src={timerIcon}
                    alt="Time icon to represent the recipe process item"
                  />
                </div>
                <span> Add Process Time</span>
              </li>
              <li>
                <div className="buttonIcon">
                  <img
                    src={appleIcon}
                    alt="Apple icon to represent the recipe ingredient item"
                  />
                </div>
                <span> Add Ingredient</span>
              </li>
            </ul>
            <ul className="recipeProcessTotal">
              <li>
                <span>Recipe Grams</span>
                <span>475g</span>
              </li>
              <li>
                <span>Recipe Time</span>
                <span>22min</span>
              </li>
            </ul>
          </div>
        </form>
      </section>
    );
  }
}

RecipeDetails.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

export default connect(mapState)(RecipeDetails);
