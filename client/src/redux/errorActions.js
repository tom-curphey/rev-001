import { REMOVE_ERRORS } from './types';

export const removeErrors = () => async dispatch => {
  dispatch({
    type: REMOVE_ERRORS
  });
};
