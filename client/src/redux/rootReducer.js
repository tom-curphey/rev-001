import { combineReducers } from 'redux';
import alert from '../components/layout/alert/alertReducer';

export default combineReducers({
  alert: alert
});
