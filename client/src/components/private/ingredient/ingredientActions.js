import {
  SELECTED_INGREDIENT_FAILED,
  SET_INGREDIENTS_LOADING,
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR,
  REMOVE_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT,
  GET_ERRORS,
  STOP_INGREDIENTS_LOADING
} from '../../../redux/types';
import axios from 'axios';
import { displayErrors } from '../../../redux/errorActions';
import { setAlert } from '../../layout/alert/alertActions';

export const loadIngredients = () => async dispatch => {
  // console.log('TRIGGER');

  try {
    const res = await axios.get('/api/ingredient/all');

    dispatch({
      type: INGREDIENTS_LOADED,
      payload: res.data
    });
  } catch (err) {
    // console.log('ERR', err.response);

    dispatch({
      type: INGREDIENTS_ERROR
    });
    dispatch({
      type: STOP_INGREDIENTS_LOADING
    });
    dispatch(displayErrors(err));
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

export const addOrEditIngredientAndSupplier = (
  ingredientData,
  supplierData
) => async dispatch => {
  console.log('ID', ingredientData);
  console.log('SD', supplierData);

  try {
    // dispatch(setVenueLoading());
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const data = {
      ...ingredientData,
      ...supplierData,
      ingredientID: ingredientData._id,
      supplierID: supplierData._id
    };

    const body = JSON.stringify(data);
    const res = await axios.post('/api/ingredient', body, config);

    console.log('res', res.data);

    dispatch(loadIngredients());
    dispatch(setSelectedIngredient(res.data.ingredient));
    dispatch(setAlert('Ingredient Saved', 'success'));
  } catch (err) {
    dispatch(displayErrors(err));
    dispatch(setAlert('Ingredient Error', 'error'));
  }
};

export const removeSelectedIngredient = () => async dispatch => {
  dispatch({
    type: REMOVE_SELECTED_INGREDIENT
  });
};
