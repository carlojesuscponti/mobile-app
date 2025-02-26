import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Apply to everuy request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete Auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
