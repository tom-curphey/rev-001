import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import editIcon from '../../../images/edit.svg';
import { isEmpty } from '../../../utils/utils';
import RecipeIngredient from './RecipeIngredient';
import RecipeIngredientForm from './RecipeIngredientForm';

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
      let updatedRecipeIngredients = selectedRecipe.ingredients.map(
        rIngredient => {
          let foundIngredient = ingredient.ingredients.filter(ing => {
            return rIngredient.ingredient === ing._id;
          });
          console.log('foundIngredient', foundIngredient);
          console.log('rIngredient', rIngredient);
          if (!isEmpty(foundIngredient)) {
            let updatedIngredient = {
              ...rIngredient,
              ingredient: {
                _id: foundIngredient._id,
                displayName: foundIngredient.displayName,
                displayName: foundIngredient.displayName,
                displayName: foundIngredient.displayName
              }
            };
            return updatedIngredient;
          }
          return;
        }
      );
      console.log(
        'updatedRecipeIngredients',
        updatedRecipeIngredients
      );
    }
    this.setState({
      selectedRecipe: { ...this.props.selectedRecipe }
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.selectedRecipe !== this.props.selectedRecipe) {
      this.setState({
        selectedRecipe: { ...this.props.selectedRecipe }
      });
    }

    // if (
    //   !isEmpty(selectedRecipe.ingredients) &&
    //   !isEmpty(ingredient.ingredients)
    // ) {
    //   let updatedRecipeIngredients = selectedRecipe.ingredients.map(
    //     rIngredient => {
    //       let foundIngredient = ingredient.ingredients.filter(ing => {
    //         return rIngredient.ingredient === ing._id;
    //       });
    //       console.log('foundIngredient', foundIngredient);
    //       if (!isEmpty(foundIngredient)) {
    //         let updatedIngredient = {};
    //         return updatedIngredient;
    //       }
    //       return;
    //     }
    //   );
    //   console.log(
    //     'updatedRecipeIngredients',
    //     updatedRecipeIngredients
    //   );
    // }
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

    let recipeIngredients = [];
    if (!isEmpty(selectedRecipe.ingredients)) {
      recipeIngredients = selectedRecipe.ingredients.map(ri => {
        return (
          <RecipeIngredientForm
            item={ri}
            updateSelectedRecipeIngredient={
              this.updateSelectedRecipeIngredient
            }
          />
        );
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
