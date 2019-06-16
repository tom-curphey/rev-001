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
  CLEAR_VENUES
} from '../../../redux/types';
import setAuthToken from '../../../utils/setAuthToken';
import { loadProfile } from '../../private/profile/profileActions';
import { loadVenues } from '../../private/venue/venueActions';

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
    console.log('err', err);
    // console.log('err.response.data.errors', err.response.data.errors);

    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    dispatch({
      type: REGISTER_FAILED
    });
    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
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
  } catch (err) {
    console.log('err', err);
    // console.log('err.response.data.errors', err.response.data.errors);

    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
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
  } catch (err) {
    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    console.log('err: ', err);

    dispatch({
      type: SIGNIN_FAILED
    });
    // can dispatch an alert

    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch({ type: REMOVE_ERRORS });
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: CLEAR_VENUES });
};
