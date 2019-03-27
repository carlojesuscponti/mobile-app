import {
  GET_COLLEGE,
  GET_COLLEGES,
  COLLEGE_LOADING,
  CHANGE_BUTTON_STATUS_COLLEGE,
  CHANGE_STATUS_COLLEGE
} from "../actions/types";

const initialState = {
  college: {},
  colleges: {},
  loading: false,
  changeStatus: false,
  buttonDisable: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case COLLEGE_LOADING:
      return {
        ...state,
        loading: true
      };

    case GET_COLLEGE:
      return {
        ...state,
        college: action.payload,
        loading: false
      };

    case GET_COLLEGES:
      return {
        ...state,
        colleges: action.payload,
        loading: false
      };

    case CHANGE_BUTTON_STATUS_COLLEGE:
      return {
        ...state,
        buttonDisable: action.payload
      };

    case CHANGE_STATUS_COLLEGE:
      return {
        ...state,
        changeStatus: action.payload
      };
    default:
      return state;
  }
}
