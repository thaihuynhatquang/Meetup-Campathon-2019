import { GET_LIST_USER, GET_LIST_USER_SUCCESS, GET_LIST_USER_FAIL } from '../actions/types';

const initialState = {
  listUser: [],
  loadingListUser: false,
  error: null,
};

export default (listUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_USER:
      return { ...state, loadingListUser: true };
    case GET_LIST_USER_SUCCESS:
      return {
        ...state,
        loadingListUser: false,
        listUser: action.listUser,
      };
    case GET_LIST_USER_FAIL:
      return {
        ...state,
        loadingListUser: false,
        error: action.error,
      };
    default:
      return state;
  }
});
