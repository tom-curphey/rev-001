import { combineReducers } from 'redux';
import alert from '../components/layout/alert/alertReducer';
import errorReducer from './errorReducer';
import authReducer from '../components/public/auth/authReducer';
import profileReducer from '../components/private/profile/profileReducer';
import venueReducer from '../components/private/venue/venueReducer';

export default combineReducers({
  errors: errorReducer,
  alert: alert,
  auth: authReducer,
  profile: profileReducer,
  venues: venueReducer
});
