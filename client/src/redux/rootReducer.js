import { combineReducers } from 'redux';
import alert from '../components/layout/alert/alertReducer';
import authReducer from '../components/public/auth/authReducer';
import profileReducer from '../components/private/profile/profileReducer';

export default combineReducers({
  alert: alert,
  auth: authReducer,
  profile: profileReducer
});
