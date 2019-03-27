import {
  GET_COLLEGES,
  GET_COLLEGE,
  COLLEGE_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  CHANGE_BUTTON_STATUS_COLLEGE,
  CHANGE_STATUS_COLLEGE
} from "./types";
import axios from "axios";
import RNFetchBlob from "react-native-fetch-blob";
const { config, fs } = RNFetchBlob;

export const getColleges = () => dispatch => {
  dispatch(changeStatus(true));
  dispatch(setCollegeLoading());
  dispatch(clearErrors());
  axios
    .get("http://34.229.6.94/api/colleges/all")
    .then(res => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_COLLEGES,
        payload: res.data
      });
    })
    .catch(err => {
      //alert(JSON.stringify(err));
      dispatch({
        type: GET_COLLEGES,
        payload: null
      });
    });
};

// Create Report for all Colleges
export const createReportForColleges = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("http://34.229.6.94/api/colleges/createReport/colleges", reportData)
    .then(() =>
      axios
        .get("http://34.229.6.94/api/colleges/fetchReport/colleges", {
          responseType: "blob"
        })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });

          // send base64 to api for s3 upload -FOR ANDROID-
          if (reportData.android) {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = function() {
              const pdfData = {
                base64: reader.result
              };

              axios
                .post(
                  "http://34.229.6.94/api/colleges/uploadS3/android",
                  pdfData
                )
                .then(res => {})
                .catch(err => {
                  console.log(JSON.stringify(err));
                  let DownloadDir = fs.dirs.DownloadDir;
                  RNFetchBlob.config({
                    fileCache: true,
                    appendExt: "pdf",
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: false,
                      path: DownloadDir + "/CollegesReport.pdf",
                      description: "Downloading PDF."
                    }
                  })
                    .fetch(
                      "GET",
                      "http://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/androidReport/generatedReport.pdf"
                    )
                    .then(res => {
                      dispatch(changeButtonStatus(false));
                      console.log(JSON.stringify(res));
                    });
                });
            };
          }
        })
    )
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_COLLEGES,
        payload: null
      });
    });
};

// Create Report for individual College
export const createReportForCollege = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("http://34.229.6.94/api/colleges/createReport/college", reportData)
    .then(() =>
      axios
        .get("http://34.229.6.94/api/colleges/fetchReport/college", {
          responseType: "blob"
        })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });

          // send base64 to api for s3 upload -FOR ANDROID-
          if (reportData.android) {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = function() {
              const pdfData = {
                base64: reader.result
              };

              axios
                .post(
                  "http://34.229.6.94/api/colleges/uploadS3/android",
                  pdfData
                )
                .then(() => {})
                .catch(err => {
                  console.log(JSON.stringify(err));
                  let DownloadDir = fs.dirs.DownloadDir;
                  RNFetchBlob.config({
                    fileCache: true,
                    appendExt: "pdf",
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: false,
                      path: DownloadDir + "/CollegeReport.pdf",
                      description: "Downloading PDF."
                    }
                  })
                    .fetch(
                      "GET",
                      "http://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/androidReport/generatedReport.pdf"
                    )
                    .then(res => {
                      dispatch(changeButtonStatus(false));
                      console.log(JSON.stringify(res));
                    });
                });
            };
          }
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
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/colleges/", collegeData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Change College Logo
export const changeCollegeLogo = collegeData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/colleges/changeLogo", collegeData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Delete College
export const deleteCollege = data => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/colleges/remove/${data.id}`, data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Restore College
export const restoreCollege = data => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/colleges/restore/${data.id}`, data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Add Course
export const addCourse = courseData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/colleges/course/", courseData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
      //history.push(`/colleges/${courseData.college.college.name.initials}`)
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Edit Course
export const editCourse = courseData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/colleges/editcourse", courseData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Delete Course
export const deleteCourse = course => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/colleges/deletecourse`, course)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getColleges());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_COLLEGES,
        payload: err.response.data
      });
    });
};

export const changeButtonStatus = flag => {
  return {
    type: CHANGE_BUTTON_STATUS_COLLEGE,
    payload: flag
  };
};

export const changeStatus = flag => {
  return {
    type: CHANGE_STATUS_COLLEGE,
    payload: flag
  };
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
