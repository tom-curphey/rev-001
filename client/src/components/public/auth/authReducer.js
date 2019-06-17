import {
  USER_LOADED,
  AUTH_ERROR,
  SIGNIN_SUCCESS,
  SIGNIN_FAILED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  UPDATE_USER_SUCCESS,
  UPDATE_PASSWORD_SUCCESS,
  PASSWORD_FAILED,
  LOGOUT
} from '../../../redux/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };

    case UPDATE_USER_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
    case SIGNIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };

    case LOGOUT:
    case PASSWORD_FAILED:
    case SIGNIN_FAILED:
    case REGISTER_FAILED:
    case AUTH_ERROR:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };

    default:
      return state;
  }
}
