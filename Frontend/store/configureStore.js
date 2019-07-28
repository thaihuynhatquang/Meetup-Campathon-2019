import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk'; //import thunk
import { logger } from 'redux-logger';

export default (configureStore = () => {
  let store = createStore(rootReducer, applyMiddleware(thunk, logger)); // create store sử dụng thunk
  return store;
});
