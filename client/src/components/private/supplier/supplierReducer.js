import {
  SUPPLIERS_LOADED,
  REMOVE_SELECTED_SUPPLIER,
  SET_SELECTED_SUPPLIER,
  CLEAR_SUPPLIERS,
  SET_SUPPLIERS_LOADING,
  STOP_SUPPLIERS_LOADING,
  SET_UPDATED_SELECTED_SUPPLIER,
  SET_PREFERRED_SUPPLIER,
  REMOVE_PREFERRED_SUPPLIER
} from '../../../redux/types';

const initialState = {
  suppliers: null,
  selectedSupplier: null,
  preferredIngredientSupplierId: null,
  loading: true,
  errors: null
};

export default function(state = initialState, actions) {
  const { type, payload } = actions;
  switch (type) {
    case SET_SUPPLIERS_LOADING:
      return {
        ...state,
        loading: true
      };

    case SUPPLIERS_LOADED:
      return {
        ...state,
        suppliers: payload,
        loading: false
      };

    case SET_SELECTED_SUPPLIER:
      return {
        ...state,
        selectedSupplier: payload,
        loading: false
      };

    case SET_UPDATED_SELECTED_SUPPLIER:
      return {
        ...state,
        selectedSupplier: payload,
        loading: false
      };

    case SET_PREFERRED_SUPPLIER:
      return {
        ...state,
        preferredIngredientSupplierId: payload
      };

    case REMOVE_PREFERRED_SUPPLIER:
      return {
        ...state,
        preferredIngredientSupplierId: null
      };

    case CLEAR_SUPPLIERS:
      return {
        ...state,
        suppliers: null,
        selectedSupplier: null,
        preferredIngredientSupplierId: null,
        loading: true,
        errors: null
      };

    case REMOVE_SELECTED_SUPPLIER:
      return {
        ...state,
        selectedSupplier: null,
        loading: false,
        errors: null
      };

    case STOP_SUPPLIERS_LOADING:
      return {
        ...state,
        loading: false
      };

    default:
      return {
        ...state
      };
  }
}
