import { GET_ERRORS, SET_CURRENT_USER, CLEAR_CURRENT_PROFILE } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { AsyncStorage } from "react-native";
import startAuthScreen from "../../ScreensUI/startAuthScreen";

// Login - Get User Token
export const loginUser = userData => dispatch => {
  console.log(userData);
  axios
    .post("https://capstong.herokuapp.com/api/users/login", userData)
    .then(res => {
      // Save to Local storage
      const { token } = res.data;
      // Set token to local storage
      AsyncStorage.setItem("x-auth", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      //console.log(res.data.token);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// set Logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove the token from the localStorage
  AsyncStorage.removeItem("x-auth").then(() => {
    // Remove the auth header for future request
    setAuthToken(false);
    // Set the current to an empty object which will also set isAuthenticated FALSE
    dispatch(setCurrentUser({}));
    startAuthScreen();
  });
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
