import {
  SUPPLIERS_LOADED,
  SUPPLIERS_ERROR,
  REMOVE_SELECTED_SUPPLIER,
  SET_SELECTED_SUPPLIER,
  STOP_SUPPLIERS_LOADING,
  SET_UPDATED_SELECTED_SUPPLIER,
  SET_PREFERRED_SUPPLIER,
  REMOVE_PREFERRED_SUPPLIER
} from '../../../redux/types';
import axios from 'axios';
import { updateSelectedIngredientSupplier } from '../ingredient/ingredientActions';
import { displayErrors } from '../../../redux/errorActions';
import { setAlert } from '../../layout/alert/alertActions';
import {
  isEmpty,
  capitalizeFirstLetter,
  convertProfilePacketCostIntoCostPer1kg
} from '../../../utils/utils';

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

export const setSelectedSupplier = selectedSupplier => async dispatch => {
  dispatch({
    type: SET_SELECTED_SUPPLIER,
    payload: selectedSupplier
  });
};

export const getSelectedSupplier = (
  selectedSupplier,
  suppliers,
  selectedIngredient
) => async dispatch => {
  // Check if a new supplier was entered
  if (selectedSupplier.__isNew__) {
    console.log('NEW SUPPLIER', selectedSupplier);
    const updatedSelectedSupplier = {
      supplier: {
        _id: '',
        displayName: capitalizeFirstLetter(selectedSupplier.value)
      },
      packetCost: '',
      packetGrams: '',
      profilePacketCost: '',
      profilePacketGrams: '',
      preferred: false
    };
    dispatch(setSelectedSupplier(updatedSelectedSupplier));
  } else {
    // Find selected supplier in supplier list
    const sSupplier = suppliers.filter(ss => {
      return ss._id === selectedSupplier.value;
    });
    if (!isEmpty(sSupplier)) {
      // Check if selected ingredient has suppliers
      if (!isEmpty(selectedIngredient)) {
        // Check if selected supplier is in the selected ingredient supplier list
        const siSupplier = selectedIngredient.suppliers.filter(
          sis => {
            return sis.supplier._id === sSupplier[0]._id;
          }
        );
        // Check if selected supplier was found in the selected ingredient supplier list
        if (!isEmpty(siSupplier)) {
          // Create new object combining the selected suppliers

          const updatedSelectedSupplier = {
            ...siSupplier[0],
            supplier: {
              ...siSupplier[0].supplier,
              address: sSupplier[0].address,
              confirmedDetails: sSupplier[0].confirmedDetails,
              email: sSupplier[0].email,
              phone: sSupplier[0].phone,
              urlName: sSupplier[0].urlName,
              website: sSupplier[0].website
            }
          };
          // console.log('siSupplier', updatedSelectedSupplier);
          // console.log(
          //   'selectedIngredient',
          //   selectedIngredient.suppliers
          // );
          dispatch(setSelectedSupplier(updatedSelectedSupplier));
        } else {
          // Create new object combining the selected supplier from the suppliers list and the extra data as blank for formatting
          const newSelectedSupplier = {
            packetCost: '',
            packetGrams: '',
            preferred: false,
            profilePacketCost: '',
            profilePacketGrams: '',
            // profileSaveCount: 0,
            supplier: {
              _id: sSupplier[0]._id,
              displayName: sSupplier[0].displayName,
              address: sSupplier[0].address,
              confirmedDetails: sSupplier[0].confirmedDetails,
              email: sSupplier[0].email,
              phone: sSupplier[0].phone,
              urlName: sSupplier[0].urlName,
              website: sSupplier[0].website
            }
          };
          console.log('new Object', newSelectedSupplier);
          dispatch(setSelectedSupplier(newSelectedSupplier));
        }
      } else {
        console.log('Selected ingredient has no suppliers');
      }
    } else {
      console.log('Selected supplier could not be found');
    }
  }
};

export const updateSelectedSupplierState = usSupplier => async dispatch => {
  dispatch({
    type: SET_UPDATED_SELECTED_SUPPLIER,
    payload: usSupplier
  });
};

export const updatePreferredSupplier = (
  selectedSupplierState,
  selectedIngredientProps
) => async dispatch => {
  let ssID;

  // check if there are any suppliers in the selected ingredient props
  if (!isEmpty(selectedIngredientProps.suppliers)) {
    // Selected ingredient props has suppliers
    // check if selected ingredient props suppliers has a preferred supplier
    const pppSupplier = selectedIngredientProps.suppliers.filter(
      ppps => {
        return ppps.preferred === true;
      }
    );

    if (!isEmpty(pppSupplier)) {
      // Previous preferred props supplier was found
      if (
        pppSupplier[0].supplier._id ===
          selectedSupplierState.supplier._id &&
        selectedSupplierState.preferred === true
      ) {
        ssID = null;
      } else {
        ssID = pppSupplier[0].supplier._id;
      }
    } else {
      console.log('Previous preferred supplier was not found');
      ssID = selectedSupplierState.supplier._id;
    }
  } else {
    console.log('Selected ingredient props has no suppliers');
  }

  // check the status of the preferred supplier in the state
  if (selectedSupplierState.preferred === false) {
    ssID = selectedSupplierState.supplier._id;
  }

  dispatch(setPreferredSupplier(ssID));
};

export const setPreferredSupplier = supplierID => async dispatch => {
  console.log('setPreferredSupplier', supplierID);

  dispatch({ type: SET_PREFERRED_SUPPLIER, payload: supplierID });
};

export const removePreferredSupplier = () => async dispatch => {
  dispatch({ type: REMOVE_PREFERRED_SUPPLIER });
};

export const addOrEditSupplier = supplierData => async dispatch => {
  try {
    // dispatch(setVenueLoading());
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    supplierData.displayName = capitalizeFirstLetter(
      supplierData.displayName
    );
    const body = JSON.stringify(supplierData);
    const res = await axios.post('/api/supplier', body, config);
    const formattedSupplier = {
      supplier: {
        _id: res.data._id,
        displayName: res.data.displayName,
        address: res.data.address,
        confirmedDetails: res.data.confirmedDetails,
        email: res.data.email,
        phone: res.data.phone,
        urlName: res.data.urlName,
        website: res.data.website
      },
      packetCost: '',
      packetGrams: '',
      profilePacketCost: null,
      profilePacketGrams: null,
      preferred: false
    };

    dispatch(loadSuppliers());
    dispatch(setSelectedSupplier(formattedSupplier));
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
