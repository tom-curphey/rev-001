import axios from 'axios';
import {
  VENUE_SUCCESS,
  VENUE_FAILED,
  GET_ERRORS
} from '../../../redux/types';
import { loadProfile } from '../profile/profileActions';

// Register User
export const addOrEditVenue = venueData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(venueData);
  try {
    const res = await axios.post('/api/venue', body, config);
    await dispatch({
      type: VENUE_SUCCESS,
      payload: res.data
    });
    dispatch(loadProfile());
  } catch (err) {
    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});
    dispatch({
      type: VENUE_FAILED
    });
    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
  }
};
