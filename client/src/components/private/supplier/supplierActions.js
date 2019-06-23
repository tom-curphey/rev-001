import {
  SET_SUPPLIERS_LOADING,
  SUPPLIERS_LOADED,
  SUPPLIERS_ERROR,
  REMOVE_SELECTED_SUPPLIER,
  SET_SELECTED_SUPPLIER
} from '../../../redux/types';
import axios from 'axios';
import { displayErrors } from '../../../utils/utils';

export const loadSuppliers = () => async dispatch => {
  try {
    const res = await axios.get('/api/supplier/all');

    dispatch({
      type: SUPPLIERS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SUPPLIERS_ERROR
    });
  }
};
