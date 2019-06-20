import { SET_ALERT, REMOVE_ALERT } from '../../../redux/types';
import { randomID } from '../../../utils/utils';

export const setAlert = (
  msg,
  alertType,
  timeout = 3000
) => dispatch => {
  const id = randomID();
  dispatch({
    type: SET_ALERT,
    payload: { msg, id, alertType }
  });

  setTimeout(
    () => dispatch({ type: REMOVE_ALERT, payload: id }),
    timeout
  );
};
