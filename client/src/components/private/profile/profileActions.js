import axios from 'axios';
import { PROFILE_LOADED, PROFILE_ERROR } from '../../../redux/types';

// Load User
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
