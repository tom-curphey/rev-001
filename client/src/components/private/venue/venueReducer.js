import {
  VENUES_LOADED,
  VENUES_ERROR,
  SET_SELECTED_VENUE,
  SELECTED_VENUE_SUCCESS,
  SELECTED_VENUE_FAILED,
  CLEAR_VENUES
} from '../../../redux/types';

const initialState = {
  venues: null,
  selectedVenue: null,
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case VENUES_LOADED:
      return {
        ...state,
        venues: payload,
        loading: false
      };

    case VENUES_ERROR:
      return {
        ...state,
        venues: null,
        loading: false
      };

    case SET_SELECTED_VENUE:
    case SELECTED_VENUE_SUCCESS:
      return {
        ...state,
        selectedVenue: payload,
        loading: false
      };

    case SELECTED_VENUE_FAILED:
      return {
        ...state,
        selectedVenue: null,
        loading: false
      };

    case CLEAR_VENUES:
      return {
        ...state,
        venues: null,
        selectedVenue: null,
        loading: false
      };

    default:
      return state;
  }
}
