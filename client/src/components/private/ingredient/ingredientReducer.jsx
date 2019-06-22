import {
  SET_INGREDIENTS_LOADING,
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR
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
    default:
      return {
        ...state
      };
  }
}
