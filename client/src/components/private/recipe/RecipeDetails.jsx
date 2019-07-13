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
import { updateReduxSelectedRecipe } from './recipeActions';

class RecipeDetails extends Component {
  state = {
    updated: false,
    selectedRecipe: {
      serves: '',
      salePricePerServe: '',
      expectedSales: '',
      expectedSales: '',
      items: []
      // steps: {
      //   processItem: '',
      //   processQuantity: '',
      //   processUnit: 'min'
      // }
    }
  };

  componentDidMount = () => {
    if (this.props.recipe.selectedRecipe) {
      const { selectedRecipe } = this.props.recipe;

      const recipeData = {
        ...selectedRecipe,
        serves: selectedRecipe.serves.toString()
      };

      this.setState({
        selectedRecipe: recipeData
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      const { selectedRecipe } = this.props.recipe;

      const recipeData = {
        _id: selectedRecipe._id,
        displayName: selectedRecipe.displayName,
        serves: selectedRecipe.serves.toString(),
        salePricePerServe: selectedRecipe.salePricePerServe
          ? selectedRecipe.salePricePerServe.toString()
          : '',
        expectedSales: selectedRecipe.expectedSales
          ? selectedRecipe.expectedSales.toString()
          : ''
      };

      this.setState({
        updated: false,
        selectedRecipe: recipeData
      });
      // this.setState(prevState => ({
      //   ...prevState.selectedRecipe,
      //   selectedRecipe: this.props.recipe.selectedRecipe
      // }));
    }

    if (prevState.selectedRecipe !== this.state.selectedRecipe) {
      if (this.state.updated) {
        this.props.updateReduxSelectedRecipe(
          this.state.selectedRecipe
        );
      }
    }
  };

  getSelectedUnitValue = selectedValue => {
    console.log('SV', selectedValue);
  };

  handleRecipeNumberChange = e => {
    e.persist();
    let value = e.target.value;
    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        updated: true,
        selectedRecipe: {
          ...prevState.selectedRecipe,
          [e.target.name]: value
        }
      }));
    }
  };

  addProcessTime = () => {
    const { items } = this.state.selectedRecipe;

    const item = {
      type: 'processTime',
      description: '',
      quantity: '',
      unit: 'min'
    };

    items.push(item);

    this.setState({ items: items });
  };

  render() {
    const { recipe, errors } = this.props;
    const {
      selectedRecipe: {
        serves,
        salePricePerServe,
        expectedSales
        // steps: { processItem, processQuantity, processUnit }
      }
    } = this.state;

    console.log('serves', serves);

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
                value={salePricePerServe}
                name="salePricePerServe"
                onChange={this.handleRecipeNumberChange}
                type="text"
                error={
                  errors.salePricePerServe && errors.salePricePerServe
                }
                labelClass="alignTitleRight"
                inputClass="number"
              />
              <TextInputHorizontal
                label="Expected Weekly Serve Sales"
                value={expectedSales}
                name="expectedSales"
                onChange={this.handleRecipeNumberChange}
                type="text"
                error={errors.expectedSales && errors.expectedSales}
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
                    value=""
                    // value={processItem}
                    name="processItem"
                    onChange={this.handleRecipeNumberChange}
                    // error={errors.processItem && errors.processItem
                    // error={errors.processItem && errors.processItem}
                  />
                </div>
                <div className="processQuantity">
                  <TextInput
                    placeholder="0"
                    value=""
                    // value={processQuantity}
                    name="processQuantity"
                    onChange={this.handleRecipeNumberChange}
                    // error={
                    //   errors.processQuantity && errors.processQuantity
                    // }
                    inputClass="number"
                  />
                </div>
                <div className="processUnit">
                  <SelectInput
                    name="processUnit"
                    options={unitTimeOptions}
                    getSelectedValue={this.getSelectedUnitValue}
                    error={errors.processUnit && errors.processUnit}
                    value="min"
                    // value={processUnit}
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
              <li onClick={this.addProcessTime}>
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

const actions = {
  updateReduxSelectedRecipe
};

RecipeDetails.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(RecipeDetails);
