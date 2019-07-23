import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadIngredients } from '../ingredient/ingredientActions';
import SelectRecipe from './SelectRecipe';
import RecipeDetailsHeader from './RecipeDetailsHeader';
import RecipeProcessTime from './RecipeProcessTime';
import RecipeIngredient from './RecipeIngredient';
import AccordionBox from '../../layout/AccordionBox';

import timerIcon from '../../../images/timer.svg';
import appleIcon from '../../../images/apple.svg';
import chefIcon from '../../../images/chef.svg';
import {
  getSelectedRecipe,
  updateReduxSelectedRecipe
} from './recipeActions';
import {
  isEmpty,
  updateRecipeItemsOrder,
  compareItems,
  roundNumber
} from '../../../utils/utils';

class RecipeDetails extends Component {
  state = {
    updated: false,
    selectRecipeError: false,
    selectedRecipe: {
      serves: '',
      salePricePerServe: '',
      expectedSales: '',
      processTime: [
        {
          _id: '__isNew__',
          type: 'processTime',
          description: '',
          quantity: '',
          unit: 'sec',
          order: 1,
          total: 0
        }
      ],
      ingredients: [],
      totalGrams: 0,
      totalTime: 0
    }
  };

  componentDidMount = () => {
    if (isEmpty(this.props.ingredient.ingredients)) {
      this.props.loadIngredients();
    }

    if (!isEmpty(this.props.match.params.recipe_name)) {
      if (isEmpty(this.props.recipe.selectedRecipe)) {
        if (isEmpty(this.props.recipe.recipes)) {
          console.log('Load recipes');
        } else {
          // console.log('Select recipe from state');
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
        console.log('HIT');

        if (
          this.props.recipe.selectedRecipe.urlName !==
          this.props.match.params.recipe_name
        ) {
          console.log('get recipe params name');
        } else {
          console.log('Set selected recipe');

          const { selectedRecipe } = this.props.recipe;

          const recipeData = {
            ...selectedRecipe
            // serves: selectedRecipe.serves.toString()
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
                unit: 'sec',
                order: '1'
              }
            ];
          }

          this.setState({
            selectedRecipe: recipeData
          });
        }
      }
    }

    if (this.props.recipe.selectedRecipe) {
      const { selectedRecipe } = this.props.recipe;
      // console.log('SRR', selectedRecipe);
      let recipeData;
      if (selectedRecipe.ingredient === '__isNew__') {
        recipeData = {
          // displayName: '',
          serves: '',
          salePricePerServe: '',
          expectedSales: '',
          processTime: [
            {
              type: 'processTime',
              description: '',
              quantity: '',
              unit: 'sec',
              order: '1'
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
    // console.log('prevProps', prevProps.recipe.selectedRecipe);
    // console.log('thisProps', this.props.recipe.selectedRecipe);
    // console.log('prevState', prevState);
    // console.log('thisState', this.state);

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
            unit: 'sec',
            order: '1'
          }
        ];
      } else {
        if (!isEmpty(recipeData.processTime)) {
          let totalTime = 0;
          const updatedProcessTime = recipeData.processTime.map(
            pt => {
              totalTime = totalTime + pt.total;
              pt.quantity = pt.quantity ? pt.quantity.toString() : '';
              return pt;
            }
          );
          recipeData.totalTime = totalTime;
          recipeData.processTime = updatedProcessTime;
        }
        if (!isEmpty(recipeData.ingredients)) {
          let totalGrams = 0;
          const updatedIngredients = recipeData.ingredients.map(i => {
            totalGrams = totalGrams + i.total;
            i.quantity = i.quantity ? i.quantity.toString() : '';
            return i;
          });
          recipeData.totalGrams = totalGrams;
          recipeData.ingredients = updatedIngredients;
        }
      }

      this.setState({
        updated: false,
        selectRecipeError: false,
        selectedRecipe: recipeData
      });
    }

    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      if (
        isEmpty(this.state.selectedRecipe.processTime) &&
        isEmpty(this.state.selectedRecipe.ingredients)
      ) {
        const { selectedRecipe } = this.props.recipe;
        const recipeData = {
          ...selectedRecipe
        };

        recipeData.processTime = [
          {
            type: 'processTime',
            description: '',
            quantity: '',
            unit: 'sec',
            order: 0,
            total: 0
          }
        ];
        recipeData.ingredients = [];

        this.setState({
          selectedRecipe: recipeData
        });
      }
    }

    if (prevState.selectedRecipe !== this.state.selectedRecipe) {
      if (this.state.updated) {
        this.props.updateReduxSelectedRecipe(
          this.state.selectedRecipe
        );
      }
    }
  };

  // Trigger recipe error when the user tries to edit input before selecting a recipe
  selectRecipeError = () => {
    console.log('Error');
    this.setState({ selectRecipeError: true });
  };

  addProcessTime = () => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { processTime, ingredients } = this.state.selectedRecipe;
      const step = {
        _id: '__isNew__',
        description: '',
        quantity: '',
        unit: 'sec',
        total: 0,
        staffTime: false,
        order: processTime.length + ingredients.length + 1
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

  addStaffTime = () => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { processTime, ingredients } = this.state.selectedRecipe;
      const step = {
        _id: '__isNew__',
        description: '',
        quantity: '',
        unit: 'sec',
        total: 0,
        staffTime: true,
        order: processTime.length + ingredients.length + 1
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

  updateSelectedRecipeProcessTime = updatedItem => {
    const { selectedRecipe } = this.state;
    const recipeData = { ...selectedRecipe };

    let updatedProcessTime = recipeData.processTime.map(item => {
      if (item.order === updatedItem.order) {
        item = updatedItem;
      }
      return item;
    });

    recipeData.processTime = updatedProcessTime;
    this.setState({ updated: true, selectedRecipe: recipeData });
  };

  deleteProcessTime = itemOrder => e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedProcessTime = recipeData.processTime.filter(item => {
        return item.order !== itemOrder;
      });

      console.log('over here');

      recipeData.processTime = updatedProcessTime;
      const updatedRecipeData = updateRecipeItemsOrder(recipeData);

      this.setState({
        updated: true,
        selectedRecipe: updatedRecipeData
      });
    } else {
      this.selectRecipeError();
    }
  };

  changeProcessTimeType = itemOrder => e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };

      let updatedProcessTime = recipeData.processTime.map(item => {
        if (item.order == itemOrder) {
          item.staffTime = !item.staffTime;
        }
        return item;
      });

      console.log('over here');

      recipeData.processTime = updatedProcessTime;
      const updatedRecipeData = updateRecipeItemsOrder(recipeData);

      this.setState({
        updated: true,
        selectedRecipe: updatedRecipeData
      });
    } else {
      this.selectRecipeError();
    }
  };

  addRecipeIngredient = () => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { processTime, ingredients } = this.state.selectedRecipe;
      const ingredient = {
        ingredient: '__isNew__',
        quantity: '',
        unit: 'gram',
        total: 0,
        order: processTime.length + ingredients.length + 1
      };
      ingredients.push(ingredient);
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

  updateSelectedRecipeIngredient = updatedItem => {
    const { selectedRecipe } = this.state;
    const recipeData = { ...selectedRecipe };

    let updatedIngredients = recipeData.ingredients.map(item => {
      if (item.order === updatedItem.order) {
        item = updatedItem;
      }
      return item;
    });

    recipeData.ingredients = updatedIngredients;
    this.setState({ updated: true, selectedRecipe: recipeData });
  };

  deleteRecipeIngredient = itemOrder => e => {
    if (!isEmpty(this.props.recipe.selectedRecipe)) {
      const { selectedRecipe } = this.state;
      const recipeData = { ...selectedRecipe };
      let updatedIngredients = recipeData.ingredients.filter(item => {
        return item.order !== itemOrder;
      });
      recipeData.ingredients = updatedIngredients;
      const updatedRecipeData = updateRecipeItemsOrder(recipeData);

      this.setState({
        updated: true,
        selectedRecipe: updatedRecipeData
      });
    } else {
      this.selectRecipeError();
    }
  };

  render() {
    const { selectRecipeError, selectedRecipe } = this.state;

    let ri = [];
    if (
      !isEmpty(selectedRecipe.processTime) ||
      !isEmpty(selectedRecipe.ingredients)
    ) {
      for (let pt = 0; pt < selectedRecipe.processTime.length; pt++) {
        const process = selectedRecipe.processTime[pt];
        ri.push(process);
      }
      for (let i = 0; i < selectedRecipe.ingredients.length; i++) {
        const ingredient = selectedRecipe.ingredients[i];
        ri.splice(ingredient.order, 0, ingredient);
      }
    }

    // Sort Recipe items in order
    const recipeItemsInOrder = ri.sort(compareItems);

    let recipeItems;
    if (!isEmpty(ri)) {
      recipeItems = recipeItemsInOrder.map((item, i) => {
        if (item.description || item.description === '') {
          // console.log('---item', item);
          return (
            <RecipeProcessTime
              key={i}
              item={item}
              deleteProcessTime={this.deleteProcessTime}
              changeProcessTimeType={this.changeProcessTimeType}
              updateSelectedRecipeProcessTime={
                this.updateSelectedRecipeProcessTime
              }
              selectedRecipe={selectedRecipe}
              selectRecipeError={this.selectRecipeError}
            />
          );
        }
        if (item.ingredient || item.ingredient === '') {
          return (
            <RecipeIngredient
              key={i}
              item={item}
              deleteRecipeIngredient={this.deleteRecipeIngredient}
              updateSelectedRecipeIngredient={
                this.updateSelectedRecipeIngredient
              }
            />
          );
        }
        return null;
      });
    }

    return (
      <AccordionBox
        isOpen={true}
        headerText="Recipe Details + Edit form for name, serves, weekly sales and recipe process"
        onClick="handleAccordianClick"
      >
        <section className="recipeDetails">
          <div className="recipeDetailsHeader">
            <div>
              <div className="selectRecipe">
                <SelectRecipe />
                {selectRecipeError && (
                  <span>Please select a recipe to start</span>
                )}
              </div>
            </div>
            <RecipeDetailsHeader
              // selectedRecipe={selectedRecipe}
              selectRecipeError={this.selectRecipeError}
            />
          </div>
          <form>
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
                <li onClick={this.addStaffTime}>
                  <div className="buttonIcon">
                    <img
                      src={chefIcon}
                      alt="Time icon to represent the recipe process item"
                    />
                  </div>
                  <span> Add Staff Input Time</span>
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
                  <span>
                    {selectedRecipe.totalGrams
                      ? `${roundNumber(
                          selectedRecipe.totalGrams,
                          4
                        )}g`
                      : '0.00g'}
                  </span>
                </li>
                <li>
                  <span>Recipe Time</span>
                  <span>
                    {selectedRecipe.totalTime
                      ? `${roundNumber(selectedRecipe.totalTime)} min`
                      : '0.00 min'}
                  </span>
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
