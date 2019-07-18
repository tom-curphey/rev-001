import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadIngredients } from '../ingredient/ingredientActions';
import SelectRecipe from './SelectRecipe';
import AccordionBox from '../../layout/AccordionBox';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import TextInput from '../../layout/input/TextInput';
import SelectInput from '../../layout/input/SelectInput';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
import timerIcon from '../../../images/timer.svg';
import appleIcon from '../../../images/apple.svg';
import binIcon from '../../../images/bin.svg';
import {
  getSelectedRecipe,
  updateReduxSelectedRecipe
} from './recipeActions';
import {
  isEmpty,
  calculateRecipeItemTotal
} from '../../../utils/utils';

class RecipeDetails extends Component {
  state = {
    updated: false,
    selectRecipeError: false,
    selectedRecipe: {
      serves: '',
      salePricePerServe: '',
      expectedSales: '',
      expectedSales: '',
      processTime: [
        {
          type: 'processTime',
          description: '',
          quantity: '',
          unit: 'sec',
          ordwer: ''
        }
      ],
      ingredients: []
    }
  };

  componentDidMount = () => {
    console.log('props', this.props);
    if (isEmpty(this.props.ingredient.ingredients)) {
      console.log('LI');

      this.props.loadIngredients();
    }

    if (!isEmpty(this.props.match.params.recipe_name)) {
      if (isEmpty(this.props.recipe.selectedRecipe)) {
        if (isEmpty(this.props.recipe.recipes)) {
          console.log('Load recipes');
        } else {
          console.log('Select recipe from state');
          const selectedRecipe = this.props.recipe.recipes.filter(
            recipe => {
              return (
                recipe.urlName === this.props.match.params.recipe_name
              );
            }
          );
          this.props.getSelectedRecipe(
            selectedRecipe[0],
            this.props.profile.profile
          );
        }
      } else {
        if (
          this.props.recipe.selectedRecipe.urlName !==
          this.props.match.params.recipe_name
        ) {
          console.log('get recipe params name');
        } else {
          console.log('Set selected recipe');

          const { selectedRecipe } = this.props.recipe;

          const recipeData = {
            ...selectedRecipe,
            serves: selectedRecipe.serves.toString()
          };

          this.setState({
            selectedRecipe: recipeData
          });
        }
      }
    }

    if (this.props.recipe.selectedRecipe) {
      const { selectedRecipe } = this.props.recipe;
      console.log('SRR', selectedRecipe);
      let recipeData;
      if (selectedRecipe.ingredient === '__isNew__') {
        recipeData = {
          // displayName: '',
          serves: '',
          salePricePerServe: '',
          expectedSales: '',
          expectedSales: '',
          processTime: [
            {
              type: 'processTime',
              description: '',
              quantity: '',
              unit: 'sec',
              ordwer: ''
            }
          ],
          ingredients: []
        };
      } else {
        recipeData = {
          ...selectedRecipe,
          serves: selectedRecipe.serves
            ? selectedRecipe.serves.toString()
            : ''
        };
      }

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
        // serves: selectedRecipe.serves.toString(),
        serves: selectedRecipe.serves
          ? selectedRecipe.serves.toString()
          : '',
        salePricePerServe: selectedRecipe.salePricePerServe
          ? selectedRecipe.salePricePerServe.toString()
          : '',
        expectedSales: selectedRecipe.expectedSales
          ? selectedRecipe.expectedSales.toString()
          : '',
        processTime: selectedRecipe.processTime
          ? selectedRecipe.processTime
          : [],
        ingredients: selectedRecipe.ingredients
          ? selectedRecipe.ingredients
          : []
      };

      if (
        isEmpty(recipeData.processTime) &&
        isEmpty(recipeData.ingredients)
      ) {
        recipeData.processTime = [
          {
            type: 'processTime',
            description: '',
            quantity: '',
            unit: 'hour',
            ordwer: ''
          }
        ];
      } else {
        if (!isEmpty(recipeData.processTime)) {
          const updatedProcessTime = recipeData.processTime.map(
            pt => {
              pt.quantity = pt.quantity.toString();
              return pt;
            }
          );
          recipeData.processTime = updatedProcessTime;
        }
        if (!isEmpty(recipeData.ingredients)) {
          const updatedIngredients = recipeData.ingredients.map(i => {
            i.quantity = i.quantity ? i.quantity.toString() : '';
            return i;
          });
          recipeData.ingredients = updatedIngredients;
        }
      }

      this.setState({
        updated: false,
        selectRecipeError: false,
        selectedRecipe: recipeData
      });
    }

    if (prevState.selectedRecipe !== this.state.selectedRecipe) {
      if (this.state.updated) {
        this.props.updateReduxSelectedRecipe(
          this.state.selectedRecipe
        );
      }
    }
  };

  selectRecipeError = () => {
    console.log('Error');
    this.setState({ selectRecipeError: true });
  };

  handleRecipeNumberChange = e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
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
    } else {
      this.selectRecipeError();
    }
  };

  getSelectedUnitTimeValue = (selectedValue, itemOrder) => {
    console.log('SV', selectedValue);
    console.log('E', itemOrder);
    // let value = 0;
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      // const { name, value } = e.target;
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedProcessTime = recipeData.processTime.map(item => {
        if (item.order === itemOrder) {
          item.unit = selectedValue.value;
        }
        return item;
      });

      recipeData.processTime = updatedProcessTime;
      this.setState({ updated: true, selectedRecipe: recipeData });
    } else {
      this.selectRecipeError();
    }
  };

  getSelectedUnitMetricValue = (selectedValue, itemOrder) => {
    console.log('SV', selectedValue);
    console.log('E', itemOrder);
    // let value = 0;
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      // const { name, value } = e.target;
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedIngredients = recipeData.ingredients.map(item => {
        if (item.order === itemOrder) {
          item.unit = selectedValue.value;
        }
        return item;
      });

      recipeData.ingredients = updatedIngredients;
      this.setState({ updated: true, selectedRecipe: recipeData });
    } else {
      this.selectRecipeError();
    }
  };

  addProcessTime = () => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { processTime } = this.state.selectedRecipe;

      // const ptCount = processTime.length;
      // console.log('pt', ptCount);

      const step = {
        _id: '__isNew__',
        description: '',
        quantity: '',
        unit: 'min',
        total: '',
        order: processTime.length + 1
      };

      processTime.push(step);

      this.setState(prevState => ({
        updated: true,
        selectedRecipe: {
          ...prevState.selectedRecipe,
          processTime: processTime
        }
      }));
    } else {
      this.selectRecipeError();
    }
  };

  updateProcessTime = itemOrder => e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { name, value } = e.target;
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedProcessTime = recipeData.processTime.map(item => {
        if (item.order === itemOrder) {
          switch (name) {
            case 'description':
              item.description = value;
              break;
            case 'quantity':
              if (!isNaN(value) || value === '') {
                item.quantity = value;
              }
              break;
            default:
              break;
          }
        }
        return item;
      });

      recipeData.processTime = updatedProcessTime;
      this.setState({ updated: true, selectedRecipe: recipeData });

      // console.log('updatedProcessTime---', updatedProcessTime);
    } else {
      this.selectRecipeError();
    }
  };

  deleteProcessTime = itemOrder => e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      // const { name, value } = e.target;
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedProcessTime = recipeData.processTime.filter(item => {
        return item.order !== itemOrder;
      });

      recipeData.processTime = updatedProcessTime;

      console.log('RD', recipeData);

      this.setState({ updated: true, selectedRecipe: recipeData });
    } else {
      this.selectRecipeError();
    }
  };

  addRecipeIngredient = () => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { ingredients } = this.state.selectedRecipe;

      // const ptCount = processTime.length;
      // console.log('pt', ptCount);

      const ingredient = {
        ingredient: '__isNew__',
        quantity: '',
        unit: 'gram',
        total: '',
        order: ingredients.length + 1
      };

      ingredients.push(ingredient);

      console.log('ingredients', ingredients);

      this.setState(prevState => ({
        updated: true,
        selectedRecipe: {
          ...prevState.selectedRecipe,
          ingredients: ingredients
        }
      }));
    } else {
      this.selectRecipeError();
    }
  };

  updateIngredientQuantity = itemOrder => e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { name, value } = e.target;
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedIngredients = recipeData.ingredients.map(item => {
        if (item.order === itemOrder) {
          if (!isNaN(value) || value === '') {
            item.quantity = value;
          }
        }
        return item;
      });

      recipeData.ingredients = updatedIngredients;
      this.setState({ updated: true, selectedRecipe: recipeData });

      // console.log('updatedIngredients---', updatedIngredients);
    } else {
      this.selectRecipeError();
    }
  };

  getSelectedIngredientValue = (
    selectedIngredientValue,
    itemOrder
  ) => {
    console.log('selectedIngredientValue', selectedIngredientValue);
    const { selectedRecipe } = this.state;
    const recipeData = { ...selectedRecipe };

    let updatedRecipeIngredients = recipeData.ingredients.map(
      item => {
        if (item.order === itemOrder) {
          item.ingredient = selectedIngredientValue.value;
        }
        return item;
      }
    );

    recipeData.ingredients = updatedRecipeIngredients;
    this.setState({ updated: true, selectedRecipe: recipeData });
  };

  render() {
    const { recipe, ingredient, profile, errors } = this.props;
    const {
      selectRecipeError,
      selectedRecipe: {
        serves,
        salePricePerServe,
        expectedSales,
        processTime,
        ingredients
        // steps: { processItem, processQuantity, processUnit }
      }
    } = this.state;

    let ingredientOptions = [
      {
        label: 'No Ingredients Avaliable',
        value: ''
      }
    ];
    if (!isEmpty(ingredient.ingredients)) {
      ingredientOptions = ingredient.ingredients.map(i => {
        let selectData = {};
        selectData.label = i.displayName;
        selectData.value = i._id;
        return selectData;
      });
    }

    const unitTimeOptions = [
      { value: 'sec', label: 'Seconds' },
      { value: 'min', label: 'Minutes' },
      { value: 'hour', label: 'Hours' }
    ];
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

    let ri = [];
    if (!isEmpty(processTime) || !isEmpty(ingredients)) {
      for (let pt = 0; pt < processTime.length; pt++) {
        const process = processTime[pt];
        ri.push(process);
      }
      for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        ri.push(ingredient);
      }
    }

    let recipeItems;
    if (!isEmpty(ri)) {
      // console.log('recipeItems', ri);
      recipeItems = ri.map((item, i) => {
        // console.log('item', item);

        if (item.description || item.description === '') {
          return (
            <li key={i}>
              <div className="processIcon">
                <img
                  src={timerIcon}
                  alt="Time icon to represent the recipe process item"
                />
              </div>
              <div className="processItem">
                <TextInput
                  placeholder="Process Step Description"
                  value={item.description}
                  name="description"
                  onChange={this.updateProcessTime(item.order)}
                  // data={'323232'}
                  // error={errors.processItem && errors.processItem
                  // error={errors.processItem && errors.processItem}
                />
              </div>
              <div className="processQuantity">
                <TextInput
                  placeholder="0"
                  value=""
                  value={item.quantity}
                  name="quantity"
                  onChange={this.updateProcessTime(item.order)}
                  inputClass="number"
                  // error={
                  //   errors.processQuantity && errors.processQuantity
                  // }
                />
              </div>
              <div className="processUnit">
                <SelectInput
                  name="processUnit"
                  options={unitTimeOptions}
                  getSelectedValue={this.getSelectedUnitTimeValue}
                  error={errors.processUnit && errors.processUnit}
                  value={item.unit}
                  data={item.order}
                  // value={processUnit}
                />
              </div>
              <div className="processTotal">
                {calculateRecipeItemTotal(item.quantity, item.unit)}{' '}
                min
              </div>
              <div
                className="processIcon delete"
                onClick={this.deleteProcessTime(item.order)}
              >
                <img
                  src={binIcon}
                  alt="Bin icon to represent the ability to delete a recipe process item"
                />
              </div>
            </li>
          );
        }
        if (item.ingredient || item.ingredient === '') {
          return (
            <li key={i}>
              <div className="ingredientIcon">
                <img
                  src={timerIcon}
                  alt="Ingredeint icon to represent the recipe ingredient item"
                />
              </div>
              <div className="ingredientSelect">
                <CreatableSelectInput
                  value={item.ingredient}
                  name="ingredient"
                  options={ingredientOptions}
                  getSelectedValue={this.getSelectedIngredientValue}
                  placeholder="Type ingredient name to start.."
                  createLabel="+ Add Ingredient"
                  data={item.order}
                  styles={{ fontWeight: '400' }}
                />
                {/* <TextInput
                  placeholder="Ingredient Name"
                  value={item.ingredient}
                  name="ingredient"
                  onChange={this.updateProcessTime(item.order)}
                  // data={'323232'}
                  // error={errors.processItem && errors.processItem
                  // error={errors.processItem && errors.processItem}
                /> */}
              </div>
              <div className="ingredientQuantity">
                <TextInput
                  placeholder="0"
                  value=""
                  value={item.quantity}
                  name="quantity"
                  onChange={this.updateIngredientQuantity(item.order)}
                  inputClass="number"
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
                  error={
                    errors.ingredientUnit && errors.ingredientUnit
                  }
                  value={item.unit}
                  data={item.order}
                  // value={ingredientUnit}
                />
              </div>
              <div className="ingredientTotal">
                {calculateRecipeItemTotal(item.quantity, item.unit)} g
              </div>
              <div
                className="ingredientIcon delete"
                onClick={this.deleteProcessTime(item.order)}
              >
                <img
                  src={binIcon}
                  alt="Bin icon to represent the ability to delete a recipe ingredient item"
                />
              </div>
            </li>
          );
        }
      });
    }

    return (
      <AccordionBox
        isOpen={true}
        headerText="Recipe Details + Edit form for name, serves, weekly sales and recipe process"
        onClick="handleAccordianClick"
      >
        <section className="recipeDetails">
          <form onSubmit={this.handleOnSubmit}>
            <div className="recipeDetailsHeader">
              <div>
                <div className="selectRecipe">
                  <SelectRecipe />
                  {selectRecipeError && (
                    <span>Please select a recipe to start</span>
                  )}
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
                    errors.salePricePerServe &&
                    errors.salePricePerServe
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
                {recipeItems && recipeItems}
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
                <li onClick={this.addRecipeIngredient}>
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
      </AccordionBox>
    );
  }
}

const actions = {
  updateReduxSelectedRecipe,
  getSelectedRecipe,
  loadIngredients
};

RecipeDetails.propTypes = {
  recipe: PropTypes.object.isRequired,
  ingredient: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateReduxSelectedRecipe: PropTypes.func.isRequired,
  getSelectedRecipe: PropTypes.func.isRequired,
  loadIngredients: PropTypes.func.isRequired
};

const mapState = state => ({
  recipe: state.recipe,
  ingredient: state.ingredient,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(withRouter(RecipeDetails));
