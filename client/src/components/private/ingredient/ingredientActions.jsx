import {
  SET_INGREDIENTS_LOADING,
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR,
  REMOVE_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT
} from '../../../redux/types';
import axios from 'axios';
import { displayErrors } from '../../../utils/utils';

export const loadIngredients = () => async dispatch => {
  console.log('TRIGGER');

  try {
    const res = await axios.get('/api/ingredient/all');

    dispatch({
      type: INGREDIENTS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: INGREDIENTS_ERROR
    });
  }
};

export const setSelectedIngredient = (
  selectedIngredient,
  profile,
  selectIngredientSupplier
) => async dispatch => {
  if (selectedIngredient.new) {
    dispatch({
      type: SET_SELECTED_INGREDIENT,
      payload: selectedIngredient
    });
  } else {
    dispatch({
      type: SET_SELECTED_INGREDIENT,
      payload: selectedIngredient
    });
  }
};

export const removeSelectedIngredient = () => async dispatch => {
  dispatch({
    type: REMOVE_SELECTED_INGREDIENT
  });
};
