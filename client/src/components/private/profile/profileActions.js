import axios from 'axios';
import {
  PROFILE_LOADED,
  PROFILE_ERROR,
  GET_ERRORS
} from '../../../redux/types';

// Load Profile
export const loadProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile');
    dispatch({
      type: PROFILE_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR
    });
  }
};

export const updateProfile = profileData => async dispatch => {
  try {
    const res = await axios.post('/api/profile', profileData);
    console.log('res', res);
  } catch (err) {
    console.log('err', err);
    // console.log('err.response.data.errors', err.response.data.errors);

    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    dispatch({
      type: PROFILE_ERROR
    });
    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
  }
};
