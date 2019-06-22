import {
  SET_INGREDIENTS_LOADING,
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR
} from '../../../redux/types';
import axios from 'axios';
import { displayErrors } from '../../../utils/utils';

export const loadRecipes = () => async dispatch => {
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
