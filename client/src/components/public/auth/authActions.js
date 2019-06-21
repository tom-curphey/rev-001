import axios from 'axios';
import {
  UPDATE_USER_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  SIGNIN_SUCCESS,
  SIGNIN_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  GET_ERRORS,
  REMOVE_ERRORS,
  CLEAR_PROFILE,
  CLEAR_VENUES,
  CLEAR_RECIPES,
  UPDATE_PASSWORD_SUCCESS,
  LOAD_RESET_FORM,
  REMOVE_RESET_FORM_TOKEN,
  LOAD_RESET_TOKEN,
  REMOVE_RESET_TOKEN
} from '../../../redux/types';
import setAuthToken from '../../../utils/setAuthToken';
import { loadProfile } from '../../private/profile/profileActions';
import { loadVenues } from '../../private/venue/venueActions';
import { loadRecipes } from '../../private/recipe/recipeActions';
import { displayErrors } from '../../../utils/utils';
import { setAlert } from '../../layout/alert/alertActions';
import { removeErrors } from '../../../redux/errorActions';

// Load User
export const loadUser = () => async dispatch => {
  // Only checks the first time the user loads
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
    displayErrors(err, dispatch, GET_ERRORS);
  }
};

// Register User
export const register = ({
  firstName,
  email,
  password
}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ firstName, email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(loadProfile());
  } catch (err) {
    dispatch({
      type: REGISTER_FAILED
    });
    displayErrors(err, dispatch, GET_ERRORS);
  }
};

export const updateUser = updatedUser => async dispatch => {
  console.log('updatedUser ', updatedUser);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(updatedUser);
  try {
    const res = await axios.post('/api/auth/update', body, config);
    console.log('RES', res);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(loadProfile());
    dispatch(loadVenues());
    dispatch(loadRecipes());
  } catch (err) {
    displayErrors(err, dispatch, GET_ERRORS);
    console.log('err', err);
  }
};

export const updatePassword = updatedPassword => async dispatch => {
  console.log('updatedPassword ', updatedPassword);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(updatedPassword);
  try {
    const res = await axios.post('/api/auth/password', body, config);
    console.log('RES', res);

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(loadProfile());
    dispatch(loadVenues());
    dispatch(setAlert('Password Saved', 'success'));
  } catch (err) {
    // dispatch({
    //   type: PASSWORD_FAILED
    // });
    displayErrors(err, dispatch, GET_ERRORS);
    dispatch(setAlert('Password Error', 'error'));
    console.log('err', err);
  }
};

// Signin User
export const signin = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth/signin', body, config);
    dispatch({
      type: SIGNIN_SUCCESS,
      payload: res.data
    });
    // Can dispatch an alert..

    // Calling load User so it fires off immediately
    dispatch(loadUser());
    dispatch(loadProfile());
    dispatch(loadVenues());
    dispatch(loadRecipes());
  } catch (err) {
    console.log('err', err);

    dispatch({
      type: SIGNIN_FAILED
    });
    displayErrors(err, dispatch, GET_ERRORS);
    // can dispatch an alert
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  console.log('Logout');

  dispatch({ type: LOGOUT });
  dispatch({ type: REMOVE_ERRORS });
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: CLEAR_VENUES });
  dispatch({ type: CLEAR_RECIPES });
};

export const getForgotPasswordLink = ({
  email
}) => async dispatch => {
  dispatch(removeErrors());
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email });
  try {
    const res = await axios.post('/api/auth/forgot', body, config);
    console.log('RES', res.data);

    dispatch({
      type: LOAD_RESET_TOKEN,
      payload: res.data
    });
    // dispatch(loadUser());
  } catch (err) {
    displayErrors(err, dispatch, GET_ERRORS);
    console.log('err', err);

    // can dispatch an alert
  }
};

export const removeResetTokens = () => dispatch => {
  dispatch({ type: REMOVE_RESET_TOKEN });
};
export const removeResetFormToken = () => dispatch => {
  dispatch({ type: REMOVE_RESET_FORM_TOKEN });
};

export const decodeForgotPasswordLink = ({
  id,
  tempToken
}) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log('token:', tempToken);
    console.log('id:', id);

    const body = JSON.stringify({ id, tempToken });
    const res = await axios.post('/api/auth/check', body, config);
    console.log('RESDATA', res.data);

    if (res.data) {
      dispatch({ type: LOAD_RESET_FORM, payload: res.data });
    }
  } catch (err) {
    console.log('err', err);
    dispatch(removeResetFormToken());
  }
};

export const resetPassword = ({
  id,
  tempToken,
  newPassword
}) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ id, tempToken, newPassword });
    const res = await axios.post('/api/auth/reset', body, config);
    console.log('RES', res);

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(loadProfile());
    dispatch(loadVenues());
    dispatch(loadRecipes());
    dispatch(setAlert('Password Updated', 'success'));
  } catch (err) {
    displayErrors(err, dispatch, GET_ERRORS);
    console.log('err', err);
  }
};
