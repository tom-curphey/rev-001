import {
  UPDATE_PROFILE,
  SET_PROFILE_LOADING,
  REMOVE_PROFILE_LOADING,
  PROFILE_LOADED,
  PROFILE_ERROR,
  CLEAR_PROFILE
} from '../../../redux/types';

const initialState = {
  profile: null,
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PROFILE:
    case PROFILE_LOADED:
      return {
        ...state,
        profile: payload,
        loading: false
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: true
      };

    case PROFILE_ERROR:
      return {
        ...state,
        profile: null,
        loading: false
      };

    case SET_PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };

    case REMOVE_PROFILE_LOADING:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}
