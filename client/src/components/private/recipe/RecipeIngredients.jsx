import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import editIcon from '../../../images/edit.svg';
import { isEmpty } from '../../../utils/utils';
import RecipeIngredient from './RecipeIngredient';
import RecipeIngredientForm from './RecipeIngredientForm';

// Look up the supplier to get the ingredient price
// Pull the ingredient name in with recipe ingredient from the controller?

class RecipeIngredients extends Component {
  state = {
    selectedRecipe: {}
  };

  componentDidMount() {
    const { selectedRecipe, ingredient } = this.props;
    if (
      !isEmpty(selectedRecipe.ingredients) &&
      !isEmpty(ingredient.ingredients)
    ) {
      let updatedRecipeIngredients = [];

      for (let i = 0; i < selectedRecipe.ingredients.length; i++) {
        const rIngredient = selectedRecipe.ingredients[i];
        let foundIngredient = ingredient.ingredients.filter(ing => {
          return rIngredient.ingredient === ing._id;
        });
        console.log('rIngredient', rIngredient);
        if (!isEmpty(foundIngredient)) {
          let updatedIngredient = {
            ...rIngredient,
            totalRecipeGrams: selectedRecipe.totalGrams,
            ingredient: {
              _id: foundIngredient[0]._id,
              displayName: foundIngredient[0].displayName,
              suppliers: foundIngredient[0].suppliers
            }
          };
          updatedRecipeIngredients.push(updatedIngredient);
        }
      }

      let updatedRecipe = {
        ...selectedRecipe,
        ingredients: updatedRecipeIngredients
      };
      console.log(
        'updatedRecipeIngredients',
        updatedRecipeIngredients
      );
      this.setState({
        selectedRecipe: updatedRecipe
      });
    }
  }

  componentDidUpdate = prevProps => {
    const { selectedRecipe, ingredient } = this.props;
    if (prevProps.selectedRecipe !== selectedRecipe) {
      if (
        !isEmpty(selectedRecipe.ingredients) &&
        !isEmpty(ingredient.ingredients)
      ) {
        let updatedRecipeIngredients = [];

        for (let i = 0; i < selectedRecipe.ingredients.length; i++) {
          const rIngredient = selectedRecipe.ingredients[i];
          let foundIngredient = ingredient.ingredients.filter(ing => {
            return rIngredient.ingredient === ing._id;
          });
          console.log('rIngredient', rIngredient);
          if (!isEmpty(foundIngredient)) {
            let updatedIngredient = {
              ...rIngredient,
              totalRecipeGrams: selectedRecipe.totalGrams,
              ingredient: {
                _id: foundIngredient[0]._id,
                displayName: foundIngredient[0].displayName,
                suppliers: foundIngredient[0].suppliers
              }
            };
            updatedRecipeIngredients.push(updatedIngredient);
          }
        }

        let updatedRecipe = {
          ...selectedRecipe,
          ingredients: updatedRecipeIngredients
        };
        console.log(
          'updatedRecipeIngredients',
          updatedRecipeIngredients
        );
        this.setState({
          selectedRecipe: updatedRecipe
        });
      }
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

  render() {
    const { selectedRecipe } = this.state;

    console.log('selectedRecipe', selectedRecipe);

    let recipeIngredients = [];
    if (!isEmpty(selectedRecipe.ingredients)) {
      recipeIngredients = selectedRecipe.ingredients.map(ri => {
        if (ri.ingredient._id) {
          return (
            <RecipeIngredientForm
              key={ri.ingredient._id}
              item={ri}
              updateSelectedRecipeIngredient={
                this.updateSelectedRecipeIngredient
              }
            />
          );
        }
        return;
      });
    }

    return (
      <section className="recipeIngredients">
        <AccordionBoxWithOpenHeader
          headerText={`Ingredient Results + Analyse ingredients to optimise the profitability of ${
            selectedRecipe.displayName
          }`}
          isOpen={true}
        >
          <ul>
            <li>
              <div>
                <img
                  src={editIcon}
                  alt="Editing icon to indicate that you can edit the ingredient"
                />
              </div>
              <div>Ingredient Name</div>
              <div>Recipe Cost</div>
              <div>Recipe Grams</div>
              <div>Contribution</div>
              <div>Packet Cost (kg)</div>
            </li>
            {recipeIngredients && recipeIngredients}
          </ul>
        </AccordionBoxWithOpenHeader>
      </section>
    );
  }
}

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe,
  ingredient: state.ingredient
});

export default connect(mapState)(RecipeIngredients);
