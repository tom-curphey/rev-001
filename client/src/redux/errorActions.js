import { REMOVE_ERRORS, GET_ERRORS } from './types';

export const removeErrors = () => async dispatch => {
  dispatch({
    type: REMOVE_ERRORS
  });
};

export const displayErrors = err => async dispatch => {
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
