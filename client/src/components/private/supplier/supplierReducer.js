import {
  SET_SUPPLIERS_LOADING,
  SUPPLIERS_LOADED,
  SUPPLIERS_ERROR,
  REMOVE_SELECTED_SUPPLIER,
  SET_SELECTED_SUPPLIER,
  CLEAR_SUPPLIERS,
  STOP_SUPPLIERS_LOADING
} from '../../../redux/types';

const initialState = {
  suppliers: null,
  selectedSupplier: null,
  loading: true,
  errors: null
};

export default function(state = initialState, actions) {
  const { type, payload } = actions;
  switch (type) {
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

    case CLEAR_SUPPLIERS:
      return {
        ...state,
        suppliers: null,
        selectedSupplier: null,
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
