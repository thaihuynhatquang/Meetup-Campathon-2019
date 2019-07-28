import { combineReducers } from 'redux';
import authReducer from './authReducer';
import groupReducer from './groupReducer';
import listUserReducer from './listUserReducer';
import timeLocationReducer from './timeLocationReducer'

const rootReducer = combineReducers({
  authReducer,
  groupReducer,
  listUserReducer,
  timeLocationReducer
});

export default rootReducer;
