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
import Button from '../../layout/menu/Button';
import TextInput from '../../layout/input/TextInput';

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
import { empty } from 'rxjs';

class RecipeDetails extends Component {
  state = {
    updated: false,
    selectRecipeError: false,
    displayRecipeNameForm: false,
    selectedRecipe: {
      serves: '',
      salePricePerServe: '',
      expectedSales: '',
      processTime: [
        {
          _id: '__isNew__',
          description: '',
          quantity: '',
          unit: 'sec',
          order: 'x',
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
        if (
          this.props.recipe.selectedRecipe.urlName !==
          this.props.match.params.recipe_name
        ) {
          console.log('get recipe params name');
        } else {
          const { selectedRecipe } = this.props.recipe;

          const recipeData = {
            ...selectedRecipe
          };

          if (
            isEmpty(recipeData.processTime) &&
            isEmpty(recipeData.ingredients)
          ) {
            recipeData.processTime = [
              {
                _id: '__isNew__',
                description: '',
                quantity: '',
                unit: 'sec',
                order: 'x',
                totalTime: 0
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
              id: '__isNew__',
              type: 'processTime',
              description: '',
              quantity: '',
              unit: 'sec',
              order: 'x'
            }
          ],
          ingredients: [],
          totalGrams: 0,
          totalTime: 0
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
      if (this.props.recipe.selectedRecipe !== null) {
        const { selectedRecipe } = this.props.recipe;
        let updateReduxState = false;
        const recipeData = {
          ...selectedRecipe,
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
        let totalGrams = 0;
        let totalTime = 0;
        let totalProcessTime = 0;
        let totalStaffTime = 0;
        if (
          isEmpty(recipeData.processTime) &&
          isEmpty(recipeData.ingredients)
        ) {
          recipeData.processTime = [
            {
              id: '__isNew__',
              type: 'processTime',
              description: '',
              quantity: '',
              unit: 'sec',
              order: 'x',
              staffTime: false,
              total: 0
            }
          ];
          recipeData.totalGrams = totalGrams;
          recipeData.totalTime = totalTime;
          recipeData.totalProcessTime = totalProcessTime;
          recipeData.totalStaffTime = totalStaffTime;
        } else {
          if (!isEmpty(recipeData.processTime)) {
            const updatedProcessTime = recipeData.processTime.map(
              pt => {
                console.log('PT', pt);

                totalTime = totalTime + pt.total;
                if (pt.staffTime === false) {
                  totalProcessTime = totalProcessTime + pt.total;
                }
                if (pt.staffTime === true) {
                  totalStaffTime = totalStaffTime + pt.total;
                }

                pt.quantity = pt.quantity
                  ? pt.quantity.toString()
                  : '';
                return pt;
              }
            );
            recipeData.totalTime = totalTime;
            recipeData.totalProcessTime = totalTime;
            recipeData.totalProcessTime = totalProcessTime;
            recipeData.totalStaffTime = totalStaffTime;

            if (
              recipeData.totalTime !==
              this.props.recipe.selectedRecipe.totalTime
            ) {
              updateReduxState = true;
            }
          }
          if (!isEmpty(recipeData.ingredients)) {
            const updatedIngredients = recipeData.ingredients.map(
              i => {
                totalGrams = totalGrams + i.total;
                i.quantity = i.quantity ? i.quantity.toString() : '';
                return i;
              }
            );
            recipeData.totalGrams = totalGrams;
            recipeData.ingredients = updatedIngredients;
            if (
              recipeData.totalGrams !==
              this.props.recipe.selectedRecipe.totalGrams
            ) {
              updateReduxState = true;
            }
          }
        }
        // updateReduxState is a boolean that alternates if the redux state needs to be updated
        this.setState({
          updated: updateReduxState,
          selectRecipeError: false,
          selectedRecipe: recipeData
        });
      } else {
        let recipeData = {
          // displayName: '',
          serves: '',
          salePricePerServe: '',
          expectedSales: '',
          processTime: [
            {
              id: '__isNew__',
              type: 'processTime',
              description: '',
              quantity: '',
              unit: 'sec',
              order: 'x'
            }
          ],
          ingredients: [],
          totalGrams: 0,
          totalTime: 0
        };

        this.setState(prevState => ({
          selectedRecipe: recipeData
        }));
      }
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
            id: '__isNew__',
            type: 'processTime',
            description: '',
            quantity: '',
            unit: 'sec',
            order: 'x',
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
        this.setState({ updated: false });
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
      console.log();
      if (!isEmpty(processTime)) {
        if (processTime[0].order === 'x') {
          processTime.shift();
        }
      }
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
      if (!isEmpty(processTime)) {
        if (processTime[0].order === 'x') {
          processTime.shift();
        }
      }
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
        updatedItem.order =
          updatedItem.order === 'x' ? 1 : updatedItem.order;
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
        if (item.order === itemOrder) {
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
      if (!isEmpty(processTime)) {
        if (processTime[0].order === 'x') {
          processTime.shift();
        }
      }
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
    const {
      selectRecipeError,
      selectedRecipe,
      displayRecipeNameForm
    } = this.state;
    const { errors } = this.props;

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
          <RecipeDetailsHeader
            selectRecipeError={selectRecipeError}
          />
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
                <li
                  onClick={this.addRecipeIngredient}
                  className={
                    selectedRecipe._id === '__isNew__' &&
                    isEmpty(selectedRecipe.ingredients)
                      ? 'highlight'
                      : ''
                  }
                >
                  <div className="buttonIcon">
                    <img
                      src={appleIcon}
                      alt="Apple icon to represent the recipe ingredient item"
                    />
                  </div>
                  <span> Add Ingredient</span>
                </li>
              </ul>
              <div className="recipeDetailsFooter">
                <ul className="recipeProcessTotal">
                  <li>
                    <span>Total Grams</span>
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
                    <span>Process Time</span>
                    <span>
                      {selectedRecipe.totalProcessTime
                        ? `${roundNumber(
                            selectedRecipe.totalProcessTime / 60
                          )} min`
                        : '0.00 min'}
                    </span>
                  </li>
                  <li>
                    <span>Staff Time</span>
                    <span>
                      {selectedRecipe.totalStaffTime
                        ? `${roundNumber(
                            selectedRecipe.totalStaffTime / 60
                          )} min`
                        : '0.00 min'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </form>
          <div id="recipeResults" />
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
