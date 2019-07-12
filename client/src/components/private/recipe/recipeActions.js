import axios from 'axios';
import {
  // SET_RECIPES_LOADING,
  RECIPES_LOADED,
  RECIPES_ERROR,
  ADD_NEW_RECIPE,
  SET_SELECTED_RECIPE
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

export const getSelectedRecipe = (
  rawSelectedRecipe,
  profile
) => dispatch => {
  console.log('recipe', rawSelectedRecipe);
  dispatch(setSelectedRecipe(rawSelectedRecipe));
};

export const setSelectedRecipe = selectedRecipe => dispatch => {
  console.log('recipe', selectedRecipe);
  dispatch({ type: SET_SELECTED_RECIPE, payload: selectedRecipe });
};

export const removeSelectedRecipe = () => {
  console.log('recipe');
};

export const addNewRecipe = () => async dispatch => {
  dispatch({
    type: ADD_NEW_RECIPE
  });
};
