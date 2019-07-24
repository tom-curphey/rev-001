import { REMOVE_ERRORS, GET_ERRORS, SET_ERRORS } from './types';
import { isEmpty } from '../utils/utils';

export const removeErrors = () => async dispatch => {
  dispatch({
    type: REMOVE_ERRORS
  });
};

export const displayErrors = err => async dispatch => {
  console.log('err.response.data.errors', err.response.data.errors);

  if (err.response.data.errors) {
    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    // console.log('err.response.data.', errObj);
    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
  } else {
    console.log('ERR: ', err);
  }
};

export const setErrors = err => async dispatch => {
  // Object of errors that are set from the user directly
  console.log('err', err);

  if (!isEmpty(err)) {
    dispatch({
      type: SET_ERRORS,
      payload: err
    });
  }
};
