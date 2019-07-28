import {
  CREATE_GROUP,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_FAIL,
  GET_LIST_GROUP,
  GET_LIST_GROUP_SUCCESS,
  GET_LIST_GROUP_FAIL,
} from '../actions/types';

const initialState = {
  groupInformation: {},
  listGroup: [],
  loadingGroup: false,
  loadingListGroup: false,
  error: null,
};

export default (groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GROUP:
      return {
        ...state,
        loadingGroup: true,
        groupInformation: {},
      };
    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loadingGroup: false,
        groupInformation: action.groupInformation,
      };
    case CREATE_GROUP_FAIL:
      return {
        ...state,
        loadingGroup: false,
        error: action.error,
        groupInformation: {},
      };
    case GET_LIST_GROUP:
      return { ...state, loadingListGroup: true };
    case GET_LIST_GROUP_SUCCESS:
      return {
        ...state,
        loadingListGroup: false,
        listGroup: action.listGroup,
      };
    case GET_LIST_GROUP_FAIL:
      return {
        ...state,
        loadingListGroup: false,
        error: action.error,
      };
    default:
      return state;
  }
});
