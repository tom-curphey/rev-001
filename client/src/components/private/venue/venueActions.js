import axios from 'axios';
import { VENUE_SUCCESS, VENUE_FAILED } from '../../../redux/types';
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
    console.log('Error', err);
    dispatch({
      type: VENUE_FAILED
    });
  }
};
