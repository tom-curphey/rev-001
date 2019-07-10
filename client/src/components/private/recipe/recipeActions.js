import axios from 'axios';
import {
  // SET_RECIPES_LOADING,
  RECIPES_LOADED,
  RECIPES_ERROR,
  ADD_NEW_RECIPE
  // GET_ERRORS
} from '../../../redux/types';
// import { displayErrors } from '../../../utils/utils';
// import { setAlert } from '../../layout/alert/alertActions';

// Load Profile
export const loadRecipes = () => async dispatch => {
  try {
    const res = await axios.get('/api/recipe/all');
    dispatch({
      type: RECIPES_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPES_ERROR
    });
  }
};

export const addNewRecipe = () => async dispatch => {
  dispatch({
    type: ADD_NEW_RECIPE
  });
};
