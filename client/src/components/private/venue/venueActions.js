import axios from 'axios';
import {
  SELECTED_VENUE_SUCCESS,
  SELECTED_VENUE_FAILED,
  VENUES_LOADED,
  VENUES_ERROR,
  GET_ERRORS,
  REMOVE_ERRORS
} from '../../../redux/types';
import { loadProfile } from '../profile/profileActions';

// Load Venues
export const loadVenues = () => async dispatch => {
  try {
    const res = await axios.get('/api/venue');
    dispatch({
      type: VENUES_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: VENUES_ERROR
    });
  }
};

// Add or Edit Venue
export const addOrEditVenue = venueData => async dispatch => {
  console.log('Yes');

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(venueData);
  try {
    const res = await axios.post('/api/venue', body, config);
    await dispatch({
      type: SELECTED_VENUE_SUCCESS,
      payload: res.data
    });
    dispatch(loadProfile());
    dispatch(loadVenues());
  } catch (err) {
    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    dispatch({
      type: SELECTED_VENUE_FAILED
    });
    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
  }
};

// Add Personal Venue
export const addPersonalVenue = userEmail => async dispatch => {
  console.log('User Data:', userEmail);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const personalVenue = {
    displayName: 'Personal',
    personal: true,
    email: userEmail,
    type: 'Personal'
  };

  const body = JSON.stringify(personalVenue);

  try {
    const res = await axios.post('/api/venue', body, config);
    await dispatch({
      type: SELECTED_VENUE_SUCCESS,
      payload: res.data
    });
    dispatch(loadProfile());
    dispatch(loadVenues());
  } catch (err) {
    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});
    dispatch({
      type: SELECTED_VENUE_FAILED
    });
    dispatch({
      type: GET_ERRORS,
      payload: errObj
    });
  }
};
