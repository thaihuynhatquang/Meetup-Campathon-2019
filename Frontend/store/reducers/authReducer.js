import {
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  REMOVE_USER,
  GET_TOKEN,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_FAIL,
} from '../actions/types';

const initialState = {
  userInfo: {},
  token: '',
  loadingProfile: false,
  error: null,
};

export default (authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TOKEN:
      return { ...state, loadingProfile: true };
    case GET_TOKEN_SUCCESS:
      return {
        ...state,
        loadingProfile: false,
        token: action.token,
      };
    case GET_TOKEN_FAIL:
      return {
        ...state,
        loadingProfile: false,
        error: action.error,
      };
    case GET_USER:
      return { ...state, loadingProfile: true };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loadingProfile: false,
        userInfo: action.userInformation,
      };
    case GET_USER_FAIL:
      return {
        ...state,
        loadingProfile: false,
        error: action.error,
      };
    case REMOVE_USER:
      return {
        ...state,
        userInfo: {},
        token: '',
        loadingProfile: false,
        error: null,
      };
    default:
      return state;
  }
});
