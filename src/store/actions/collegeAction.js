import {
  GET_COLLEGES,
  GET_COLLEGE,
  COLLEGE_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";
import axios from "axios";

export const getColleges = () => dispatch => {
  dispatch(setCollegeLoading());
  dispatch(clearErrors());
  axios
    .get("http://capstong.herokuapp.com/api/colleges/all")
    .then(res =>
      dispatch({
        type: GET_COLLEGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COLLEGES,
        payload: null
      })
    );
};

// Create / Update College collegeData, history
export const createCollege = collegeData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("http://capstong.herokuapp.com/api/colleges/", collegeData)
    .then(res => {
      dispatch(getColleges());
      //console.log(res);
      //history.push(`/colleges/${collegeData.initials}`);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Change College Logo
export const changeCollegeLogo = collegeData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("http://capstong.herokuapp.com/api/colleges/changeLogo", collegeData)
    .then(res => {
      dispatch(getColleges());
      // history.push(`/colleges`);
      // history.push(`/colleges/${collegeData.initials}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete College
export const deleteCollege = data => dispatch => {
  dispatch(clearErrors());
  dispatch(setCollegeLoading());
  axios
    .post(`http://capstong.herokuapp.com/api/colleges/remove/${data.id}`, data)
    .then(res => {
      dispatch(getColleges());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Restore College
export const restoreCollege = data => dispatch => {
  dispatch(clearErrors());
  dispatch(setCollegeLoading());
  axios
    .post(`http://capstong.herokuapp.com/api/colleges/restore/${data.id}`, data)
    .then(res => {
      dispatch(getColleges());
      // dispatch({
      //   type: GET_COLLEGE,
      //   payload: res.data
      // })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Course
export const addCourse = courseData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("http://capstong.herokuapp.com/api/colleges/course/", courseData)
    .then(res => {
      dispatch(getColleges());
      //history.push(`/colleges/${courseData.college.college.name.initials}`)
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Course
export const editCourse = courseData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("http://capstong.herokuapp.com/api/colleges/editcourse", courseData)
    .then(res => {
      dispatch(getColleges());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Course
export const deleteCourse = course => dispatch => {
  dispatch(clearErrors());
  dispatch(setCollegeLoading());
  axios
    .post(`http://capstong.herokuapp.com/api/colleges/deletecourse`, course)
    .then(res => {
      dispatch(getColleges());
    })
    .catch(err =>
      dispatch({
        type: GET_COLLEGES,
        payload: err.response.data
      })
    );
};

// set loading state
export const setCollegeLoading = () => {
  return {
    type: COLLEGE_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
