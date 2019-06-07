import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED
} from '../../../redux/types';

// Register User
export const register = ({
  name,
  email,
  password
}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/user', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    console.log(res.data);
  } catch (err) {
    console.log('Error', err);

    dispatch({
      type: REGISTER_FAILED
    });
  }
};
