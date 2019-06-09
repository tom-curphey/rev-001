import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT
} from '../../../redux/types';
import setAuthToken from '../../utils/setAuthToken';
import { loadProfile } from '../../private/profile/profileActions';

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
    console.log('Error', err);

    dispatch({
      type: REGISTER_FAILED
    });
  }
};

// Login User
export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    // Can dispatch an alert..

    // Calling load User so it fires off immediately
    dispatch(loadUser());
    dispatch(loadProfile());
  } catch (err) {
    console.log('Error', err);

    dispatch({
      type: LOGIN_FAILED
    });
    // can dispatch an alert
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
