import {
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  REMOVE_USER,
  GET_TOKEN,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_FAIL,
} from './types';
import axios from 'axios';
import { API_URL } from '../../constants/services';
import { Alert } from 'react-native';

export const getToken = (userInfo) => {
  return (dispatch, getState) => {
    dispatch(getTokenStarted());
    axios
      .post(`${API_URL}/user/loginWithGoogle`, userInfo)
      .then((res) => {
        let data = res.data;
        axios.defaults.headers.common['authorization'] = data.token;
        dispatch(getTokenSuccess(data.token));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(getTokenFailure(err.message));
      });
  };
};

export const getUser = () => {
  return (dispatch, getState) => {
    dispatch(loginUserStarted());
    axios
      .get(`${API_URL}/user/auth`)
      .then((res) => {
        let data = res.data;
        dispatch(loginUserSuccess(data));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(loginUserFailure(err.message));
      });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch({ type: REMOVE_USER });
  };
};

const getTokenStarted = () => ({
  type: GET_TOKEN,
});

const getTokenSuccess = (token) => ({
  type: GET_TOKEN_SUCCESS,
  token,
});

const getTokenFailure = (error) => ({
  type: GET_TOKEN_FAIL,
  error,
});

const loginUserStarted = () => ({
  type: GET_USER,
});

const loginUserSuccess = (userInformation) => ({
  type: GET_USER_SUCCESS,
  userInformation,
});

const loginUserFailure = (error) => ({
  type: GET_USER_FAIL,
  error,
});
