import {
  UPDATE_FREETIME,
  UPDATE_FREETIME_SUCCESS,
  UPDATE_FREETIME_FAIL,
  UPDATE_LOCATION,
  UPDATE_LOCATION_SUCCESS,
  UPDATE_LOCATION_FAIL,
} from '../actions/types';

const initialState = {
  listFreeTimes: [],
  location: {},
  isFreetimeLoading: false,
  isLocationLoading: false,
  error: null,
};

export default (timeLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FREETIME:
      return { ...state, isFreetimeLoading: true };
    case UPDATE_FREETIME_SUCCESS:
      return {
        ...state,
        isFreetimeLoading: false,
        listFreeTimes: action.listFreeTimes,
      };
    case UPDATE_FREETIME_FAIL:
      return {
        ...state,
        isFreetimeLoading: false,
        error: action.error,
      };
    case UPDATE_LOCATION:
      return { ...state, isLocationLoading: true };
    case UPDATE_LOCATION_SUCCESS:
      return {
        ...state,
        isLocationLoading: false,
        location: action.location,
      };
    case UPDATE_LOCATION_FAIL:
      return {
        ...state,
        isLocationLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
});
