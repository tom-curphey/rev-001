import {
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
    case PROFILE_LOADED:
      return {
        ...state,
        profile: payload,
        loading: false
      };

    case CLEAR_PROFILE:
    case PROFILE_ERROR:
      return {
        ...state,
        profile: null,
        loading: false
      };

    default:
      return state;
  }
}
