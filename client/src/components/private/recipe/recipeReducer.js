import {
  SET_RECIPES_LOADING,
  RECIPES_LOADED,
  CLEAR_RECIPES,
  RECIPES_ERROR,
  GET_ERRORS
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
