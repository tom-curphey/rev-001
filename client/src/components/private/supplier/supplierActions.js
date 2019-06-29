import {
  SET_SUPPLIERS_LOADING,
  SUPPLIERS_LOADED,
  SUPPLIERS_ERROR,
  REMOVE_SELECTED_SUPPLIER,
  SET_SELECTED_SUPPLIER,
  GET_ERRORS,
  STOP_SUPPLIERS_LOADING
} from '../../../redux/types';
import axios from 'axios';
import { displayErrors } from '../../../redux/errorActions';
import { setAlert } from '../../layout/alert/alertActions';

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
    dispatch(displayErrors(err));
    dispatch({
      type: STOP_SUPPLIERS_LOADING
    });
  }
};

export const setSelectedSupplier = (
  selectedSupplier,
  profile
  // selectIngredientSupplier
) => async dispatch => {
  console.log('selectedSupplier', selectedSupplier);

  if (selectedSupplier.new) {
    dispatch({
      type: SET_SELECTED_SUPPLIER,
      payload: selectedSupplier
    });
  } else {
    dispatch({
      type: SET_SELECTED_SUPPLIER,
      payload: selectedSupplier
    });
  }
};

export const addOrEditSupplier = supplierData => async dispatch => {
  console.log('SI', supplierData);

  try {
    // dispatch(setVenueLoading());
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify(supplierData);
    const res = await axios.post('/api/supplier', body, config);
    console.log('res', res);
    dispatch(loadSuppliers());
    dispatch(setSelectedSupplier(res.data));
    dispatch(setAlert('Supplier Saved', 'success'));
  } catch (err) {
    dispatch(displayErrors(err));
    dispatch(setAlert('Supplier Error', 'error'));
  }
};

export const removeSelectedSupplier = () => async dispatch => {
  dispatch({
    type: REMOVE_SELECTED_SUPPLIER
  });
};

// export const closeAddSupplierModal = () => async dispatch => {
//   dispatch({
//     type: REMOVE_SELECTED_SUPPLIER
//   });
// };
