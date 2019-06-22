import { combineReducers } from 'redux';
import alert from '../components/layout/alert/alertReducer';
import errorReducer from './errorReducer';
import authReducer from '../components/public/auth/authReducer';
import profileReducer from '../components/private/profile/profileReducer';
import venueReducer from '../components/private/venue/venueReducer';
import recipeReducer from '../components/private/recipe/recipeReducer';
import ingredientReducer from '../components/private/ingredient/ingredientReducer';

export default combineReducers({
  errors: errorReducer,
  alert: alert,
  auth: authReducer,
  profile: profileReducer,
  venues: venueReducer,
  recipes: recipeReducer,
  ingredients: ingredientReducer
});
