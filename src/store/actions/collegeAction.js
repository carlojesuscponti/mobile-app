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
  axios
    .get("https://capstong.herokuapp.com/api/colleges/all")
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
  dispatch(setCollegeLoading());
  axios
    .post("https://capstong.herokuapp.com/api/colleges", collegeData)
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
  axios
    .post("https://capstong.herokuapp.com/api/colleges/changeLogo", collegeData)
    .then(res => {
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
    .post(`https://capstong.herokuapp.com/api/colleges/${data.id}`, data)
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

// Add Course
export const addCourse = courseData => dispatch => {
  dispatch(clearErrors());
  dispatch(setCollegeLoading());
  axios
    .post("https://capstong.herokuapp.com/api/colleges/course", courseData)
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

// Delete Course
export const deleteCourse = (collegeId, courseId) => dispatch => {
  dispatch(setCollegeLoading());
  axios
    .delete(
      `https://capstong.herokuapp.com/api/colleges/course/${collegeId}/${courseId}`
    )
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

// Get college by id
// export const getCollegeByInitials = initials => dispatch => {
//   dispatch(clearErrors());
//   dispatch(setCollegeLoading());
//   axios
//     .get(`https://capstong.herokuapp.com/api/colleges/${initials}`)
//     .then(res =>
//       dispatch({
//         type: GET_COLLEGE,
//         payload: res.data
//       })
//     )
//     .catch(err =>
//       dispatch({
//         type: GET_COLLEGE,
//         payload: null
//       })
//     );
// };

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
