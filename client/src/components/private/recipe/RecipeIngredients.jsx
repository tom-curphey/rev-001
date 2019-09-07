import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import editIcon from '../../../images/edit.svg';
import { updateReduxSelectedRecipe } from './recipeActions';
import { addOrEditIngredientAndSupplier } from '../ingredient/ingredientActions';
import {
  isEmpty,
  convert100gInto1Kg,
  convertProfilePacketCostIntoCostPer1kg
} from '../../../utils/utils';
import RecipeIngredientForm from './RecipeIngredientForm';

// Look up the supplier to get the ingredient price
// Pull the ingredient name in with recipe ingredient from the controller?

class RecipeIngredients extends Component {
  state = {
    selectedRecipe: {},
    timerRunning: false
  };

  componentDidMount() {
    const { selectedRecipe, ingredient, profile } = this.props;

    console.log('PROPS ****', selectedRecipe);

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
        // console.log('rIngredient', rIngredient);
        if (!isEmpty(foundIngredient)) {
          // Find ingredient cost in recipe & packet cost per 1kg
          let profilePacketCost = 0;
          let profilePacketGrams = 0;
          let preferedSupplier = null;
          if (!isEmpty(profile.profile.ingredients)) {
            // Check if profile has ingredient
            let profileIngredient = profile.profile.ingredients.filter(
              pIngredient => {
                return (
                  pIngredient.ingredient === foundIngredient[0]._id
                );
              }
            );

            // Check is user profile has ingredient
            if (!isEmpty(profileIngredient)) {
              // Check if profile ingredient has prefered supplier
              let preferedSupplierFound = profileIngredient[0].suppliers.filter(
                piSupplier => {
                  return piSupplier.preferred === true;
                }
              );

              // Check if prefered supplier was found
              if (!isEmpty(preferedSupplierFound)) {
                profilePacketCost =
                  preferedSupplierFound[0].packetCost;
                profilePacketGrams =
                  preferedSupplierFound[0].packetGrams;
                preferedSupplier = preferedSupplierFound[0].supplier;
              } else {
                console.log(
                  'Profile didnt have a preferred ingredient supplier'
                );
                profilePacketCost = convertProfilePacketCostIntoCostPer1kg(
                  foundIngredient[0].packetCost,
                  foundIngredient[0].packetGrams
                );
                profilePacketGrams = convert100gInto1Kg(
                  foundIngredient[0].packetGrams
                );
                preferedSupplier = null;
              }
            } else {
              profilePacketCost = convertProfilePacketCostIntoCostPer1kg(
                foundIngredient[0].packetCost,
                foundIngredient[0].packetGrams
              );
              profilePacketGrams = convert100gInto1Kg(
                foundIngredient[0].packetGrams
              );
              preferedSupplier = null;
            }
          }

          let updatedIngredient = {
            ...rIngredient,
            totalRecipeGrams: selectedRecipe.totalGrams,
            ingredient: {
              _id: foundIngredient[0]._id,
              displayName: foundIngredient[0].displayName,
              suppliers: foundIngredient[0].suppliers,
              profilePacketCost: profilePacketCost,
              profilePacketGrams: profilePacketGrams,
              preferedSupplier: preferedSupplier
            }
          };
          updatedRecipeIngredients.push(updatedIngredient);
        }
      }

      let updatedRecipe = {
        ...selectedRecipe,
        ingredients: updatedRecipeIngredients
      };
      this.setState({
        selectedRecipe: updatedRecipe
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { selectedRecipe, ingredient, profile } = this.props;

    // console.log('profile', profile);
    // console.log('selectedRecipe', selectedRecipe);
    // console.log('ingredient', ingredient);

    if (
      prevProps.selectedRecipe !== selectedRecipe ||
      prevProps.profile !== profile
    ) {
      // console.log('HIT');

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
          if (!isEmpty(foundIngredient)) {
            // Find ingredient cost in recipe & packet cost per 1kg
            let profilePacketCost = 0;
            let profilePacketGrams = 0;
            let preferedSupplier = null;

            if (!isEmpty(profile.profile.ingredients)) {
              // Check if profile has ingredient
              let profileIngredient = profile.profile.ingredients.filter(
                pIngredient => {
                  return (
                    pIngredient.ingredient === foundIngredient[0]._id
                  );
                }
              );

              // Check is user profile has ingredient
              if (!isEmpty(profileIngredient)) {
                console.log('Profile has the ingredient');

                // Check if profile ingredient has prefered supplier
                let preferedSupplierFound = profileIngredient[0].suppliers.filter(
                  piSupplier => {
                    return piSupplier.preferred === true;
                  }
                );

                // Check if prefered supplier was found
                if (!isEmpty(preferedSupplierFound)) {
                  profilePacketCost =
                    preferedSupplierFound[0].packetCost;
                  profilePacketGrams =
                    preferedSupplierFound[0].packetGrams;
                  preferedSupplier =
                    preferedSupplierFound[0].supplier;
                } else {
                  console.log(
                    'Profile didnt have a preferred ingredient supplier'
                  );
                  profilePacketCost = convertProfilePacketCostIntoCostPer1kg(
                    foundIngredient[0].packetCost,
                    foundIngredient[0].packetGrams
                  );
                  profilePacketGrams = convert100gInto1Kg(
                    foundIngredient[0].packetGrams
                  );
                  preferedSupplier = null;
                }
              } else {
                console.log('Profile didnt have the ingredient');
                profilePacketCost = convertProfilePacketCostIntoCostPer1kg(
                  foundIngredient[0].packetCost,
                  foundIngredient[0].packetGrams
                );
                profilePacketGrams = convert100gInto1Kg(
                  foundIngredient[0].packetGrams
                );
                preferedSupplier = null;
              }
            }

            let updatedIngredient = {
              ...rIngredient,
              totalRecipeGrams: selectedRecipe.totalGrams,
              ingredient: {
                _id: foundIngredient[0]._id,
                displayName: foundIngredient[0].displayName,
                suppliers: foundIngredient[0].suppliers,
                profilePacketCost: profilePacketCost,
                profilePacketGrams: profilePacketGrams,
                preferedSupplier: preferedSupplier
              }
            };
            updatedRecipeIngredients.push(updatedIngredient);
          }
        }

        let updatedRecipe = {
          ...selectedRecipe,
          ingredients: updatedRecipeIngredients
        };

        this.setState({
          selectedRecipe: updatedRecipe
        });
      }
    }
  };

  updateSelectedRecipeIngredient = updatedItem => {
    console.log('updatedItem', updatedItem);

    const { selectedRecipe } = this.state;
    const recipeData = { ...selectedRecipe };

    let updatedIngredients = recipeData.ingredients.map(item => {
      if (item.order === updatedItem.order) {
        item = updatedItem;
      }
      return item;
    });

    recipeData.ingredients = updatedIngredients;

    console.log('recipeData --->', recipeData);

    this.setState({ timerRunning: true });
    // setTimeout(() => {
    //   this.setState({
    //     selectedRecipe: recipeData,
    //     timerRunning: false
    //   });
    // }, 5000);
  };

  checkToSaveIngredient = updatedItem => {
    console.log('FOCUSED updatedItem', updatedItem);
  };

  render() {
    const { selectedRecipe } = this.state;
    let content = null;
    let isOpen = false;

    if (!isEmpty(selectedRecipe)) {
      let recipeIngredients = [];
      if (!isEmpty(selectedRecipe.ingredients)) {
        console.log(
          'selectedRecipe.ingredients',
          selectedRecipe.ingredients
        );

        recipeIngredients = selectedRecipe.ingredients.map(ri => {
          if (ri.ingredient._id) {
            return (
              <RecipeIngredientForm
                key={ri.ingredient._id + ri.order}
                item={ri}
                updateSelectedRecipeIngredient={
                  this.updateSelectedRecipeIngredient
                }
                checkToSaveIngredient={this.checkToSaveIngredient}
              />
            );
          }
          return;
        });
      }

      content = (
        <ul>
          <li>
            <div />
            <div className="ingredientHeader">Ingredient Name</div>
            <div className="ingredientHeader">Recipe Cost</div>
            <div className="ingredientHeader">Packet Cost</div>
            <div className="ingredientHeader">Packet Grams</div>
            <div className="ingredientHeader">Supplier</div>
          </li>
          {recipeIngredients && recipeIngredients}
        </ul>
      );
    }

    if (!isEmpty(content)) {
      isOpen = true;
    }

    return (
      <section className="recipeIngredients">
        <AccordionBoxWithOpenHeader
          headerText={`Ingredient Results + Analyse ingredients to optimise the profitability of ${selectedRecipe.displayName}`}
          isOpen={isOpen}
        >
          {!isEmpty(content) && content}
        </AccordionBoxWithOpenHeader>
      </section>
    );
  }
}

const actions = {
  addOrEditIngredientAndSupplier
};

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe,
  ingredient: state.ingredient,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(RecipeIngredients);
