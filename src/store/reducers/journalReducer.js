import {
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_LOADING,
  CHANGE_BUTTON_STATUS_JOURNAL,
  CHANGE_STATUS_JOURNAL
} from "../actions/types";

const initialState = {
  journal: {},
  journals: {},
  loading: false,
  changeStatus: false,
  buttonDisable: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case JOURNAL_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_JOURNAL:
      return {
        ...state,
        journal: action.payload,
        loading: false
      };
    case GET_JOURNALS:
      return {
        ...state,
        journals: action.payload,
        loading: false
      };

    case CHANGE_BUTTON_STATUS_JOURNAL:
      return {
        ...state,
        buttonDisable: action.payload
      };

    case CHANGE_STATUS_JOURNAL:
      return {
        ...state,
        changeStatus: action.payload
      };

    default:
      return state;
  }
}
