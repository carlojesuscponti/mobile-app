import axios from "axios";

import { GET_ACTIVITIES, ACTIVITY_LOADING } from "./types";

// Get all activities
export const getActivities = () => dispatch => {
  dispatch(setActivityLoading());
  axios
    .get("http://34.229.6.94/api/activities/all")
    .then(res => {
      dispatch({
        type: GET_ACTIVITIES,
        payload: res.data
      });
    })
    .catch(err => {
      //alert(JSON.stringify(err));

      dispatch({
        type: GET_ACTIVITIES,
        payload: null
      });
    });
};

// set loading state
export const setActivityLoading = () => {
  return {
    type: ACTIVITY_LOADING
  };
};
