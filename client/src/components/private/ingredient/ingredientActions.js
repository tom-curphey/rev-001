import {
  SELECTED_INGREDIENT_SUCCESS,
  SELECTED_INGREDIENT_FAILED,
  SET_INGREDIENTS_LOADING,
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR,
  REMOVE_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT,
  GET_ERRORS
} from '../../../redux/types';
import axios from 'axios';
import { displayErrors } from '../../../utils/utils';
import { setAlert } from '../../layout/alert/alertActions';

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

export const addOrEditIngredient = ingredientData => async dispatch => {
  console.log('SI', ingredientData);

  try {
    // dispatch(setVenueLoading());
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify(ingredientData);
    const res = await axios.post('/api/ingredient', body, config);
    console.log('res', res);
    dispatch({
      type: SELECTED_INGREDIENT_SUCCESS,
      payload: res.data
    });
    dispatch(loadIngredients());
    dispatch(setSelectedIngredient(res.data));
    dispatch(setAlert('Ingredient Saved', 'success'));
  } catch (err) {
    dispatch(displayErrors(err, dispatch, GET_ERRORS));
    dispatch(setAlert('Ingredient Error', 'error'));
  }
};

export const removeSelectedIngredient = () => async dispatch => {
  dispatch({
    type: REMOVE_SELECTED_INGREDIENT
  });
};
