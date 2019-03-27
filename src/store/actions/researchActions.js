import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  CHANGE_BUTTON_STATUS_RESEARCH,
  CHANGE_STATUS_RESEARCH
} from "./types";
import { getColleges } from "../actions/collegeAction";
import axios from "axios";
import RNFetchBlob from "react-native-fetch-blob";
const { config, fs } = RNFetchBlob;
import { AsyncStorage } from "react-native";

// Get all researches
export const getResearches = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  dispatch(changeStatus(true));
  axios
    .get("http://34.229.6.94/api/researches")
    .then(res => {
      // AsyncStorage.removeItem("objects")
      //   .then(res => {
      //     alert(JSON.stringify(res));
      //   })
      //   .catch(() => {
      //     alert("There was an error saving the product");
      //   });

      AsyncStorage.getItem("offlineResearches")
        .then(() => {
          AsyncStorage.setItem(
            "offlineResearches",
            JSON.stringify(res.data)
          ).then(() => {
            //alert("It was saved successfully");
          });
        })
        .catch(() => {
          alert("There was an error saving the product");
        });
      dispatch(changeStatus(false));
      dispatch({
        type: GET_RESEARCHES,
        payload: res.data
      });
    })
    .catch(err => {
      //alert(JSON.stringify(err));
      dispatch(changeStatus(false));
      dispatch({
        type: GET_RESEARCHES,
        payload: null
      });
    });
};

// Create Report for specific Research
export const createReportForResearch = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("http://34.229.6.94/api/researches/createReport/research", reportData)
    .then(() =>
      axios
        .get("http://34.229.6.94/api/researches/fetchReport/research", {
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
                      path: DownloadDir + "/ResearchReport.pdf",
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
        type: GET_RESEARCHES,
        payload: null
      })
    );
};

// Create Report for all Researches
export const createReportForResearches = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post(
      "http://34.229.6.94/api/researches/createReport/researches",
      reportData
    )
    .then(() =>
      axios
        .get("http://34.229.6.94/api/researches/fetchReport/researches", {
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
                      path: DownloadDir + "/ResearchesReport.pdf",
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
        type: GET_RESEARCHES,
        payload: null
      })
    );
};

// Create / Update Research
export const createResearch = researchData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/researches", researchData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
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

// Delete Research
export const deleteResearch = data => dispatch => {
  dispatch(clearErrors());
  //dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/researches/remove/${data.id}`, data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Delete Research
export const restoreResearch = data => dispatch => {
  dispatch(clearErrors());
  //dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/researches/restore/${data.id}`, data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Add Author
export const addAuthor = authorData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/researches/author", authorData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Delete Author
export const deleteAuthor = (research, id, name) => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .delete(
      `http://34.229.6.94/api/researches/author/${research}/${id}/${name}`
    )
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Add Document
export const addDocument = docuData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/researches/document", docuData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Add Images
export const addImages = data => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/researches/images", data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Delete Document
export const deleteDocument = (researchId, filename, name) => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .delete(
      `http://34.229.6.94/api/researches/document/${researchId}/${filename}/${name}`
    )
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getResearches());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const changeButtonStatus = flag => {
  return {
    type: CHANGE_BUTTON_STATUS_RESEARCH,
    payload: flag
  };
};

export const changeStatus = flag => {
  return {
    type: CHANGE_STATUS_RESEARCH,
    payload: flag
  };
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
