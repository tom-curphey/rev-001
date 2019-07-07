import {
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR,
  REMOVE_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT,
  STOP_INGREDIENTS_LOADING,
  PROFILE_LOADED
} from '../../../redux/types';
import axios from 'axios';
import { setSelectedSupplier } from '../supplier/supplierActions';
import { displayErrors } from '../../../redux/errorActions';
import { setAlert } from '../../layout/alert/alertActions';
import { isEmpty } from '../../../utils/utils';

export const loadIngredients = () => async dispatch => {
  // console.log('TRIGGER');

  try {
    const res = await axios.get('/api/ingredient/all');

    // console.log('Loaded res.data', res.data[0]);

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

export const getSelectedIngredient = (
  rawSelectedIngredient,
  profile,
  rawSelectedSupplier
) => async dispatch => {
  if (
    !isEmpty(rawSelectedIngredient._id) &&
    rawSelectedIngredient.suppliers.length !== 0
  ) {
    // // Check if profile has ingredients
    if (!isEmpty(profile.ingredients)) {
      // Filter profile ingredients to get selected ingredient from profile ingredients
      const pIngredient = profile.ingredients.filter(pi => {
        return pi.ingredient === rawSelectedIngredient._id;
      });
      // Check if profile has selected ingredient
      if (!isEmpty(pIngredient)) {
        // Check if profile ingredient has suppliers
        if (!isEmpty(pIngredient[0].suppliers)) {
          let preferredSupplier = {};

          const updatedSelectedIngredientSuppliers = rawSelectedIngredient.suppliers.map(
            rsiSuppiler => {
              const piSupplier = pIngredient[0].suppliers.filter(
                pis => {
                  return pis.supplier === rsiSuppiler.supplier._id;
                }
              );

              const usiSupplier = {
                ...rsiSuppiler
              };

              if (piSupplier.length !== 0) {
                usiSupplier.profilePacketCost =
                  piSupplier[0].packetCost;
                usiSupplier.profilePacketGrams =
                  piSupplier[0].packetGrams;
                usiSupplier.preferred = piSupplier[0].preferred;

                if (!rawSelectedSupplier) {
                  if (usiSupplier.preferred) {
                    preferredSupplier = usiSupplier;

                    dispatch(setSelectedSupplier(preferredSupplier));
                  }
                } else {
                  if (
                    usiSupplier.supplier._id ===
                    rawSelectedSupplier._id
                  ) {
                    const completeSelectedSupplier = {
                      ...usiSupplier,
                      supplier: {
                        ...usiSupplier.supplier,
                        address: rawSelectedSupplier.address,
                        confirmedDetails:
                          rawSelectedSupplier.confirmedDetails,
                        email: rawSelectedSupplier.email,
                        phone: rawSelectedSupplier.phone,
                        urlName: rawSelectedSupplier.urlName,
                        website: rawSelectedSupplier.website
                      }
                    };

                    dispatch(
                      setSelectedSupplier(completeSelectedSupplier)
                    );
                  }
                }
              } else {
                usiSupplier.preferred = false;
              }

              return usiSupplier;
            }
          );

          const updatedSelectedIngredient = {
            ...rawSelectedIngredient,
            suppliers: updatedSelectedIngredientSuppliers
          };

          // If preferred supplier is not found set the state for the selected
          if (isEmpty(preferredSupplier)) {
            console.log('Preferred supplier was not found');
          }

          // dispatch updated selected ingredient
          dispatch(setSelectedIngredient(updatedSelectedIngredient));
        } else {
          console.log('Profile ingredient has not suppliers');
        }
      } else {
        console.log('Profile does not have the selected ingredient');
      }
    } else {
      console.log('Profile has no ingredients');
    }
  } else {
    // User has added a new ingredient, no need to check suppliers
    dispatch(setSelectedIngredient(rawSelectedIngredient));
  }

  // dispatch(setSelectedIngredient(selectedIngredient));
};

export const setSelectedIngredient = selectedIngredient => async dispatch => {
  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: selectedIngredient
  });
};

export const addOrEditIngredientAndSupplier = (
  ingredientData,
  supplierData
) => async dispatch => {
  // console.log('ID', ingredientData);
  // console.log('SD', supplierData);

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

    // console.log('res', res.data);

    dispatch({ type: PROFILE_LOADED, payload: res.data.profile });
    dispatch(loadIngredients());
    dispatch(
      getSelectedIngredient(
        res.data.ingredient,
        res.data.profile,
        res.data.supplier
      )
    );
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
