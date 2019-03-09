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
  dispatch(clearErrors());
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

// Create / Update Research
export const createResearch = researchData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("http://capstong.herokuapp.com/api/researches", researchData)
    .then(res => {
      dispatch(getResearches());
      // if (researchData.id) {
      //   history.push(`/researches/${researchData.id}`);
      // } else {
      //   history.push(`/researches`);
      // }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Research
export const deleteResearch = data => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post(`http://capstong.herokuapp.com/api/researches/remove/${data.id}`)
    .then(res => {
      dispatch(getResearches());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Research
export const restoreResearch = data => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post(`http://capstong.herokuapp.com/api/researches/restore/${data.id}`)
    .then(res => {
      dispatch(getResearches());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
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

// Add Document
export const addDocument = docuData => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post("http://capstong.herokuapp.com/api/researches/document", docuData)
    .then(res => {
      dispatch(getResearches());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Images
export const addImages = data => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  axios
    .post("http://capstong.herokuapp.com/api/researches/images", data)
    .then(res => {
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Delete Document
export const deleteDocument = (researchId, filename) => dispatch => {
  dispatch(setResearchLoading());
  axios
    .delete(
      `http://capstong.herokuapp.com/api/researches/document/${researchId}/${filename}`
    )
    .then(res => {
      dispatch(getResearches());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
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

/*
      history.push("/researches"),
      history.push(`/researches/${data.id}`),

      window.location.reload(),
      dispatch(
        {
          type: GET_RESEARCHES,
          payload: res.data
        },
        {
          type: GET_RESEARCH,
          payload: res.data
        }
      )
*/
