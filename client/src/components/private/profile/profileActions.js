import axios from 'axios';
import {
  SET_PROFILE_LOADING,
  PROFILE_LOADED,
  UPDATE_PROFILE,
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
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
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

export const setProfileLoading = () => async dispatch => {
  dispatch({
    type: SET_PROFILE_LOADING
  });
};
