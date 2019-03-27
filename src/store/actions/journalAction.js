import axios from "axios";
import {
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  CHANGE_BUTTON_STATUS_JOURNAL,
  CHANGE_STATUS_JOURNAL
} from "./types";
import RNFetchBlob from "react-native-fetch-blob";
const { config, fs } = RNFetchBlob;

// Get all journals
export const getJournals = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setJournalLoading());
  axios
    .get("http://34.229.6.94/api/journals")
    .then(res =>
      dispatch({
        type: GET_JOURNALS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_JOURNALS,
        payload: null
      })
    );
};

// Create Report for all Journals
export const createReportForJournals = reportData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeButtonStatus(true));
  axios
    .post("http://34.229.6.94/api/journals/createReport/journals", reportData)
    .then(() =>
      axios
        .get("http://34.229.6.94/api/journals/fetchReport/journals", {
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
                      path: DownloadDir + "/JournalsReport.pdf",
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
        type: GET_JOURNALS,
        payload: null
      })
    );
};

// Create Report for specific Journal
export const createReportForJournal = reportData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeButtonStatus(true));
  axios
    .post("http://34.229.6.94/api/journals/createReport/journal", reportData)
    .then(() =>
      axios
        .get("http://34.229.6.94/api/journals/fetchReport/journal", {
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
                .then()
                .catch(err => {
                  console.log(JSON.stringify(err));
                  let DownloadDir = fs.dirs.DownloadDir;
                  RNFetchBlob.config({
                    fileCache: true,
                    appendExt: "pdf",
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: false,
                      path: DownloadDir + "/JournalReport.pdf",
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
        type: GET_JOURNALS,
        payload: null
      })
    );
};

// Create / Update Journal
export const createJournal = journalData => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post("http://34.229.6.94/api/journals", journalData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Move to bin Journal
export const deleteJournal = data => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/journals/remove/${data.id}`, data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
    })
    .catch(err => {
      dispatch(changeStatus(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Restore Journal
export const restoreJournal = data => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .post(`http://34.229.6.94/api/journals/restore/${data.id}`, data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
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
    .post("http://34.229.6.94/api/journals/author", authorData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
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
export const deleteAuthor = (journal, id, name) => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .delete(`http://34.229.6.94/api/journals/author/${journal}/${id}/${name}`)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
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
    .post("http://34.229.6.94/api/journals/images", data)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
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
    .post("http://34.229.6.94/api/journals/document", docuData)
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
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
export const deleteDocument = (journalId, filename, name) => dispatch => {
  dispatch(clearErrors());
  dispatch(changeStatus(true));
  axios
    .delete(
      `http://34.229.6.94/api/journals/document/${journalId}/${filename}/${name}`
    )
    .then(res => {
      dispatch(changeStatus(false));
      dispatch(getJournals());
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
    type: CHANGE_BUTTON_STATUS_JOURNAL,
    payload: flag
  };
};

export const changeStatus = flag => {
  return {
    type: CHANGE_STATUS_JOURNAL,
    payload: flag
  };
};

// set loading state
export const setJournalLoading = () => {
  return {
    type: JOURNAL_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
