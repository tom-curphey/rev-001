import { VENUE_SUCCESS, VENUE_FAILED } from '../../../redux/types';

const initialState = {
  venue: null,
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case VENUE_SUCCESS:
      return {
        ...state,
        venue: payload,
        loading: false
      };

    case VENUE_FAILED:
      return {
        ...state,
        venue: null,
        loading: false
      };

    default:
      return state;
  }
}
