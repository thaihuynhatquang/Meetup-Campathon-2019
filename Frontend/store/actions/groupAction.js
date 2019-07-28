import {
  CREATE_GROUP,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_FAIL,
  GET_LIST_GROUP,
  GET_LIST_GROUP_SUCCESS,
  GET_LIST_GROUP_FAIL,
} from './types';
import axios from 'axios';
import { API_URL } from '../../constants/services';
import { Alert } from 'react-native';

export const updateGroup = (groupInformation) => {
  return (dispatch, getState) => {
    dispatch(fetchGroupStarted());
    axios({
      method: 'put',
      url: `${API_URL}/group/updateGroupInfo/`,
      data: groupInformation,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((res) => {
        let data = res.data;
        dispatch(fetchGroupSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(fetchGroupFailure(err.message));
      });
  };
};

export const createGroup = (groupInformation) => {
  return (dispatch, getState) => {
    dispatch(fetchGroupStarted());
    axios({
      method: 'post',
      url: `${API_URL}/group/`,
      data: groupInformation,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((res) => {
        let data = res.data;
        dispatch(fetchGroupSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(fetchGroupFailure(err.message));
      });
  };
};

export const addMember = (groupID, listMemberID) => {
  return (dispatch, getState) => {
    dispatch(fetchGroupStarted());
    axios
      .put(`${API_URL}/group/updateGroupMembers`, { groupID, listMemberID })
      .then((res) => {
        let data = res.data;
        dispatch(fetchGroupSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(fetchGroupFailure(err.message));
      });
  };
};

export const getGroup = (groupID) => {
  return (dispatch, getState) => {
    dispatch(fetchGroupStarted());
    axios
      .post(`${API_URL}/group/groupID`, groupID)
      .then((res) => {
        let data = res.data;
        dispatch(fetchGroupSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(fetchGroupFailure(err.message));
      });
  };
};

const fetchGroupStarted = () => ({
  type: CREATE_GROUP,
});

const fetchGroupSuccess = (groupInformation) => ({
  type: CREATE_GROUP_SUCCESS,
  groupInformation,
});

const fetchGroupFailure = (error) => ({
  type: CREATE_GROUP_FAIL,
  error,
});

export const listGroup = () => {
  return (dispatch, getState) => {
    dispatch(getlistGroup());
    axios
      .get(`${API_URL}/group/`)
      .then((res) => {
        let data = res.data;
        dispatch(getlistGroupSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(getlistGroupFailure(err.message));
      });
  };
};

const getlistGroup = () => ({
  type: GET_LIST_GROUP,
});

const getlistGroupSuccess = (listGroup) => ({
  type: GET_LIST_GROUP_SUCCESS,
  listGroup,
});

const getlistGroupFailure = (error) => ({
  type: GET_LIST_GROUP_FAIL,
  error,
});
