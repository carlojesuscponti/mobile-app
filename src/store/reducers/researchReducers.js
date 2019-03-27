import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING,
  CHANGE_BUTTON_STATUS_RESEARCH,
  CHANGE_STATUS_RESEARCH
} from "../actions/types";

const initialState = {
  research: {},
  researches: {},
  loading: false,
  changeStatus: false,
  buttonDisable: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_RESEARCH:
      return {
        ...state,
        research: action.payload,
        loading: false
      };
    case GET_RESEARCHES:
      return {
        ...state,
        researches: action.payload,
        loading: false
      };

    case CHANGE_BUTTON_STATUS_RESEARCH:
      return {
        ...state,
        buttonDisable: action.payload
      };

    case CHANGE_STATUS_RESEARCH:
      return {
        ...state,
        changeStatus: action.payload
      };

    default:
      return state;
  }
}
