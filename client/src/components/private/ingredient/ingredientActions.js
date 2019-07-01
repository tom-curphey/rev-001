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
import { loadProfile } from '../profile/profileActions';

export const loadIngredients = () => async dispatch => {
  // console.log('TRIGGER');

  try {
    const res = await axios.get('/api/ingredient/all');

    console.log('Loaded res.data', res.data[0]);

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
  selectedIngredient
  // profile,
  // selectIngredientSupplier
) => async dispatch => {
  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: selectedIngredient
  });
};

export const getSelectedIngredient = (
  selectedIngredient,
  ingredient,
  profile,
  selectIngredientSupplier
) => async dispatch => {
  console.log('selectedIngredient', selectedIngredient);

  if (
    selectedIngredient.suppliers.length !== 0 &&
    profile.ingredients.length !== 0
  ) {
    const pIngredient = profile.ingredients.filter(
      profileIngredient => {
        return (
          profileIngredient.ingredient === selectedIngredient._id
        );
      }
    );

    // console.log('pIngredient', pIngredient[0].suppliers);

    if (
      pIngredient.length !== 0 &&
      pIngredient[0].suppliers.length !== 0
    ) {
      for (let is = 0; is < pIngredient[0].suppliers.length; is++) {
        const piSupplier = pIngredient[0].suppliers[is];

        // console.log('** piSupplier', piSupplier);

        for (
          let sis = 0;
          sis < selectedIngredient.suppliers.length;
          sis++
        ) {
          const siSupplier = selectedIngredient.suppliers[sis];

          if (piSupplier.supplier === siSupplier.supplier._id) {
            // console.log('siSupplier', siSupplier);
            // console.log('piSupplier', piSupplier);
            siSupplier.packetCost =
              (piSupplier.packetCost / piSupplier.packetGrams) * 100;

            if (piSupplier.preferred) {
              siSupplier.preferred = true;
            } else {
              siSupplier.preferred = false;
            }
          }
        }
      }
    }
  }

  // console.log('selectedIngredient', selectedIngredient);
  console.log('res', selectedIngredient);

  dispatch(setSelectedIngredient(selectedIngredient));
};

export const addOrEditIngredientAndSupplier = (
  ingredientData,
  supplierData
) => async dispatch => {
  // console.log('ID', ingredientData);
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

    dispatch(loadProfile());
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
