import { combineReducers } from 'redux';
import alert from '../components/layout/alert/alertReducer';
import authReducer from '../components/public/auth/authReducer';

export default combineReducers({
  alert: alert,
  auth: authReducer
});
