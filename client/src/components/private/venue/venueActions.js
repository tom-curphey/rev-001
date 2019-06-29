import axios from 'axios';
import {
  SELECTED_VENUE_SUCCESS,
  SELECTED_VENUE_FAILED,
  VENUES_LOADED,
  VENUES_ERROR,
  GET_ERRORS,
  SET_SELECTED_VENUE,
  SET_VENUE_LOADING,
  STOP_VENUE_LOADING
} from '../../../redux/types';
import { isEmpty } from '../../../utils/utils';
import { loadProfile } from '../profile/profileActions';
import { addSelectedNameToEndOfArray } from '../../../utils/utils';
import { displayErrors } from '../../../utils/utils';
import { setAlert } from '../../layout/alert/alertActions';
import { loadRecipes } from '../recipe/recipeActions';

export const setVenueLoading = () => dispatch => {
  dispatch({ type: SET_VENUE_LOADING });
};

// Load Venues
export const loadVenues = (
  selectedVenue,
  venueID
) => async dispatch => {
  // console.log('SV: ', selectedVenue);
  // console.log('SV id: ', id);

  try {
    const res = await axios.get('/api/venue/all');

    // console.log('CHECK: ', res.data);

    const filteredVenues = addSelectedNameToEndOfArray(
      res.data,
      'personal'
    );
    dispatch({
      type: VENUES_LOADED,
      payload: filteredVenues
    });

    if (!isEmpty(venueID)) {
      const sV = filteredVenues.filter(
        venue => venue._id === venueID
      );
      dispatch(setSelectedVenue(sV[0]));
    } else {
      if (!isEmpty(selectedVenue)) {
        dispatch(setSelectedVenue(selectedVenue));
      } else {
        if (res.data.length !== 1) {
          // Filter response to get selected venue
          const selectedVenues = res.data.filter(venue => {
            return venue.personal === false;
          });
          dispatch(setSelectedVenue(selectedVenues[0]));
        } else {
          dispatch(setSelectedVenue(res.data[0]));
        }
      }
    }
    // dispatch(setAlert('Venues Loaded', 'success'));
  } catch (err) {
    dispatch({
      type: VENUES_ERROR
    });
  }
};

// Set Selected Venue
export const setSelectedVenue = selectedVenue => async dispatch => {
  // console.log('SV', selectedVenue);
  // Pass selected venue object to reducer
  dispatch({
    type: SET_SELECTED_VENUE,
    payload: selectedVenue
  });
};

// Add or Edit Venue
export const addOrEditVenue = venueData => async dispatch => {
  dispatch(setVenueLoading());
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

    console.log('res.data', res.data);

    await dispatch(loadProfile());
    await dispatch(loadRecipes());
    await dispatch(loadVenues(res.data));
    dispatch(setAlert('Venue Saved', 'success'));
  } catch (err) {
    dispatch(displayErrors(err, dispatch, GET_ERRORS));
    dispatch({
      type: STOP_VENUE_LOADING
    });
    dispatch(setAlert('Venue Error', 'error'));
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
    dispatch({
      type: SELECTED_VENUE_FAILED
    });
    displayErrors(err, dispatch, GET_ERRORS);
  }
};
