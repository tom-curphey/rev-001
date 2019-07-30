import axios from 'axios';
import {
  SET_RECIPES_LOADING,
  RECIPES_LOADED,
  RECIPES_ERROR,
  ADD_NEW_RECIPE,
  SET_SELECTED_RECIPE,
  STOP_RECIPES_LOADING,
  UPDATE_SELECTED_RECIPE_STATE
  // GET_ERRORS
} from '../../../redux/types';
import { displayErrors } from '../../../utils/utils';
import { setAlert } from '../../layout/alert/alertActions';
import { removeErrors } from '../../../redux/errorActions';

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
) => async dispatch => {
  // console.log('rawSelectedRecipe', rawSelectedRecipe);
  // if (rawSelectedRecipe._id !== '__isNew__') {
  //   try {
  //     const res = await axios.get(
  //       `/api/recipe/${rawSelectedRecipe._id}`
  //     );
  //     console.log('RES', res);
  //     dispatch(setSelectedRecipe(res.data));
  //     dispatch(removeErrors());
  //   } catch (err) {
  //     console.log('err', err);
  //     dispatch({
  //       type: RECIPES_ERROR
  //     });
  //     dispatch({
  //       type: STOP_RECIPES_LOADING
  //     });
  //     dispatch(displayErrors(err));
  //   }
  // } else {
  dispatch(setSelectedRecipe(rawSelectedRecipe));
  // }
};

export const setSelectedRecipe = selectedRecipe => dispatch => {
  dispatch({ type: SET_SELECTED_RECIPE, payload: selectedRecipe });
};

export const removeSelectedRecipe = () => {
  console.log('REMOVE RECIPE..');
};

export const addOrEditRecipe = selectedRecipe => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify(selectedRecipe);
    const res = await axios.post('/api/recipe', body, config);
    console.log('RES', res);
    dispatch(setSelectedRecipe(res.data));
    dispatch(removeErrors());
    dispatch(setAlert('Recipe Saved', 'success'));
  } catch (err) {
    console.log('err', err);
    dispatch({
      type: RECIPES_ERROR
    });
    dispatch({
      type: STOP_RECIPES_LOADING
    });
    dispatch(displayErrors(err));
  }
};

export const updateReduxSelectedRecipe = selectedRecipe => dispatch => {
  // console.log('recipe', selectedRecipe);
  dispatch({
    type: UPDATE_SELECTED_RECIPE_STATE,
    payload: selectedRecipe
  });
};

export const addNewRecipe = () => async dispatch => {
  dispatch({
    type: SET_RECIPES_LOADING
  });
  dispatch({
    type: ADD_NEW_RECIPE
  });
};
