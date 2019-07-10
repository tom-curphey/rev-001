import {
  INGREDIENTS_LOADED,
  INGREDIENTS_ERROR,
  REMOVE_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT,
  STOP_INGREDIENTS_LOADING,
  PROFILE_LOADED
} from '../../../redux/types';
import axios from 'axios';
import {
  setSelectedSupplier,
  removeSelectedSupplier,
  removePreferredSupplier
} from '../supplier/supplierActions';
import { displayErrors } from '../../../redux/errorActions';
import { setAlert } from '../../layout/alert/alertActions';
import { isEmpty } from '../../../utils/utils';

export const loadIngredients = () => async dispatch => {
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
  console.log('rawSelectedSupplier', rawSelectedSupplier);

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

                    console.log('HIT', completeSelectedSupplier);

                    dispatch(
                      setSelectedSupplier(completeSelectedSupplier)
                    );
                    if (completeSelectedSupplier.preferred) {
                      preferredSupplier = completeSelectedSupplier;
                    }
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

          // dispatch updated selected ingredient
          dispatch(setSelectedIngredient(updatedSelectedIngredient));

          // console.log('preferredSupplier ****', preferredSupplier);
          // console.log(
          //   'updatedSelectedIngredient ****',
          //   updatedSelectedIngredient
          // );
          // console.log('rawSelectedSupplier', rawSelectedSupplier);

          // If preferred supplier is not found set the state for the selected
          if (
            isEmpty(preferredSupplier) &&
            isEmpty(rawSelectedSupplier)
          ) {
            console.log('Preferred supplier was not found', profile);
            console.log('Overhere - 3', rawSelectedSupplier);
            dispatch(removeSelectedSupplier());
            dispatch(removePreferredSupplier());
          } else {
            console.log('Overhere - 4', rawSelectedSupplier);
            console.log('preferredSupplier - 4', preferredSupplier);

            console.log(
              '---- Needs to trigger when there is a profile preferred supplier'
            );
            // Check if there is a preferred supplier
            if (!isEmpty(preferredSupplier)) {
              dispatch(setSelectedSupplier(preferredSupplier));
              // dispatch(
              //   setPreferredSupplier(preferredSupplier.supplier._id)
              // );
            }
          }
        } else {
          console.log('Profile ingredient has not suppliers');
          dispatch(removeSelectedSupplier());
          dispatch(removePreferredSupplier());
        }
      } else {
        console.log('Profile does not have the selected ingredient');
        dispatch(removeSelectedSupplier());
        dispatch(removePreferredSupplier());
      }
    } else {
      console.log('Profile has no ingredients');
    }
  } else {
    console.log('Overhere - 1', rawSelectedSupplier);

    // User has added a new ingredient, no need to check suppliers
    dispatch(setSelectedIngredient(rawSelectedIngredient));
    // dispatch(removeSelectedSupplier());
    // dispatch(removePreferredSupplier());
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

    console.log('****** res', res.data);

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
