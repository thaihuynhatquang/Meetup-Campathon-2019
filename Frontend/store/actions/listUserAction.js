import { GET_LIST_USER, GET_LIST_USER_SUCCESS, GET_LIST_USER_FAIL } from './types';
import axios from 'axios';
import { API_URL } from '../../constants/services';
import { Alert } from 'react-native';

export const listUser = () => {
  return (dispatch, getState) => {
    dispatch(getListUser());
    axios
      .get(`${API_URL}/user/`)
      .then((res) => {
        let data = res.data;
        dispatch(getListUserSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(getListUserFailure(err.message));
      });
  };
};

const getListUser = () => ({
  type: GET_LIST_USER,
});

const getListUserSuccess = (listUser) => ({
  type: GET_LIST_USER_SUCCESS,
  listUser,
});

const getListUserFailure = (error) => ({
  type: GET_LIST_USER_FAIL,
  error,
});
