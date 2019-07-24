import { GET_ERRORS, REMOVE_ERRORS, SET_ERRORS } from './types';

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ERRORS:
      // We only need to say action.payload as the payload contains the errors object
      return payload;
    case SET_ERRORS:
      // We only need to say action.payload as the payload contains the errors object
      return payload;

    case REMOVE_ERRORS:
      // We only need to say action.payload as the payload contains the empty errors object
      return {};

    default:
      return state;
  }
}
