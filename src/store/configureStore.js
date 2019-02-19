import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import authReducer from "./reducers/authReducer";
import errorReducer from "./reducers/errorReducer";
import collegeReducer from "./reducers/collegeReducer";
import researchReducer from "./reducers/researchReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  college: collegeReducer,
  research: researchReducer
});

const middleware = [thunk];
const initialState = {};

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      composeEnhancers()
    )
  );
};

export default configureStore;
