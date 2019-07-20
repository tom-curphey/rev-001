import axios from 'axios';
import {
  SET_PROFILE_LOADING,
  REMOVE_PROFILE_LOADING,
  PROFILE_LOADED,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  GET_ERRORS
} from '../../../redux/types';
// import { displayErrors } from '../../../utils/utils';
import { setAlert } from '../../layout/alert/alertActions';
import { displayErrors } from '../../../redux/errorActions';

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
  console.log('profileData', profileData);

  try {
    const res = await axios.post('/api/profile', profileData);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Profile Saved', 'success'));
  } catch (err) {
    console.log('err', err);
    // dispatch({
    //   type: PROFILE_ERROR
    // });
    dispatch(displayErrors(err));
    dispatch(removeProfileLoading());
    dispatch(setAlert('Profile Error', 'error'));
  }
};

export const setProfileLoading = () => async dispatch => {
  dispatch({
    type: SET_PROFILE_LOADING
  });
};

export const removeProfileLoading = () => async dispatch => {
  dispatch({
    type: REMOVE_PROFILE_LOADING
  });
};
