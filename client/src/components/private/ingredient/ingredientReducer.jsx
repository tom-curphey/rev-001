import {
  SET_INGREDIENTS_LOADING,
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR,
  CLEAR_INGREDIENTS,
  REMOVE_SELECTED_INGREDIENT
} from '../../../redux/types';

const initialState = {
  ingredients: null,
  selectedIngredient: null,
  loading: true,
  errors: null
};

export default function(state = initialState, actions) {
  const { type, payload } = actions;
  switch (type) {
    case INGREDIENTS_LOADED:
      return {
        ...state,
        ingredients: payload,
        loading: false
      };

    case CLEAR_INGREDIENTS:
      return {
        ...state,
        ingredients: null,
        selectedIngredient: null,
        loading: true,
        errors: null
      };

    case REMOVE_SELECTED_INGREDIENT:
      return {
        ...state,
        selectedIngredient: null,
        loading: false,
        errors: null
      };

    default:
      return {
        ...state
      };
  }
}
