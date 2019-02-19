import axios from "axios";

import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

// Get all researches
export const getResearches = () => dispatch => {
  dispatch(setResearchLoading());
  axios
    .get("http://capstong.herokuapp.com/api/researches")
    .then(res =>
      dispatch({
        type: GET_RESEARCHES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_RESEARCHES,
        payload: null
      })
    );
};

// Add Author
export const addAuthor = authorData => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  axios
    .post("http://capstong.herokuapp.com/api/researches/author", authorData)
    .then(res => {
      dispatch(getResearches());
      //history.push(`/researches/${authorData.researchId}`)
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Author
export const deleteAuthor = (research, id) => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  axios
    .delete(
      `http://capstong.herokuapp.com/api/researches/author/${research}/${id}`
    )
    .then(res => {
      dispatch(getResearches());
    })
    .catch(err =>
      dispatch({
        type: GET_RESEARCH,
        payload: err.response.data
      })
    );
};

// set loading state
export const setResearchLoading = () => {
  return {
    type: RESEARCH_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
