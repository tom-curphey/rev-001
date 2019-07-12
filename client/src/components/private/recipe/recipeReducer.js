import {
  RECIPES_LOADED,
  CLEAR_RECIPES,
  ADD_NEW_RECIPE,
  SET_SELECTED_RECIPE
} from '../../../redux/types';

const initialState = {
  recipes: null,
  selectedRecipe: null,
  loading: true,
  errors: null
};

export default function(state = initialState, actions) {
  const { type, payload } = actions;
  switch (type) {
    case RECIPES_LOADED:
      return {
        ...state,
        recipes: payload,
        loading: false
      };

    case SET_SELECTED_RECIPE:
      return {
        ...state,
        selectedRecipe: payload,
        loading: false
      };

    case ADD_NEW_RECIPE:
      return {
        ...state,
        selectedRecipe: '__isNew__',
        loading: false
      };

    // case RECIPES_ERROR:
    case CLEAR_RECIPES:
      return {
        ...state,
        recipes: null,
        selectedRecipe: null,
        loading: true
      };

    default:
      return state;
  }
}
