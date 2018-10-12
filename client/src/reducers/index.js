// This file is our root reducer. This is where we want to bring in all of our other reducers.
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
