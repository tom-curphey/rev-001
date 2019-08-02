import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import editIcon from '../../../images/edit.svg';
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
    selectedRecipe: {}
  };

  componentDidMount() {
    const { selectedRecipe, ingredient, profile } = this.props;
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
            console.log('profile', profile.profile.ingredients);
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
              console.log(
                'Profile has the ingredient',
                foundIngredient[0]
              );
              console.log('foundIngredient[0]', foundIngredient[0]);
              console.log(
                'profileIngredient[0]',
                profileIngredient[0]
              );

              // Check if profile ingredient has prefered supplier
              let preferedSupplierFound = profileIngredient[0].suppliers.filter(
                piSupplier => {
                  return piSupplier.preferred === true;
                }
              );

              // Check if prefered supplier was found
              if (!isEmpty(preferedSupplierFound)) {
                console.log(
                  'preferedSupplier',
                  preferedSupplierFound[0].supplier
                );
                profilePacketCost =
                  preferedSupplierFound[0].packetCost;
                profilePacketGrams =
                  preferedSupplierFound[0].packetGrams;
                preferedSupplier = preferedSupplierFound[0].supplier;

                console.log(
                  'preferedSupplier1---->',
                  preferedSupplier
                );
              } else {
                console.log(
                  'Profile didnt have a preferred ingredient supplier'
                );
                console.log(
                  'preferedSupplier2---->',
                  preferedSupplier
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
              console.log('preferedSupplier3---->', preferedSupplier);
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
            console.log('preferedSupplier5---->', preferedSupplier);
          }

          console.log('preferedSupplier4---->', preferedSupplier);

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

  componentDidUpdate = prevProps => {
    const { selectedRecipe, ingredient, profile } = this.props;
    if (prevProps.selectedRecipe !== selectedRecipe) {
      if (
        !isEmpty(selectedRecipe.ingredients) &&
        !isEmpty(ingredient.ingredients)
      ) {
        let updatedRecipeIngredients = [];

        for (let i = 0; i < selectedRecipe.ingredients.length; i++) {
          const rIngredient = selectedRecipe.ingredients[i];
          console.log('rIngredient **', rIngredient);
          let foundIngredient = ingredient.ingredients.filter(ing => {
            return rIngredient.ingredient === ing._id;
          });
          if (!isEmpty(foundIngredient)) {
            // Find ingredient cost in recipe & packet cost per 1kg
            let profilePacketCost = 0;
            let profilePacketGrams = 0;
            let preferedSupplier = null;
            console.log('ingredient', ingredient);
            console.log('rIngredient', rIngredient);

            if (!isEmpty(profile.profile.ingredients)) {
              console.log('profile', profile.profile.ingredients);
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
                  console.log(
                    'preferedSupplier',
                    preferedSupplierFound
                  );
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
    let content = null;
    let isOpen = false;

    console.log('selectedRecipe', selectedRecipe);

    if (!isEmpty(selectedRecipe)) {
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
          headerText={`Ingredient Results + Analyse ingredients to optimise the profitability of ${
            selectedRecipe.displayName
          }`}
          isOpen={isOpen}
        >
          {!isEmpty(content) && content}
          {console.log(isOpen)}
        </AccordionBoxWithOpenHeader>
      </section>
    );
  }
}

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe,
  ingredient: state.ingredient,
  profile: state.profile
});

export default connect(mapState)(RecipeIngredients);
