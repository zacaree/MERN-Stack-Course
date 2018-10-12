import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// createStore takes in 3 params: reducer, preloadedState aka initial state, enhancer.
// the spread operator ... allows us to add to whatever already exists in the array.
// The window.__REDUX etc makes our data available in the Redux Devtools.
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
