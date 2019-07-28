import {
  UPDATE_FREETIME,
  UPDATE_FREETIME_SUCCESS,
  UPDATE_FREETIME_FAIL,
  UPDATE_LOCATION,
  UPDATE_LOCATION_SUCCESS,
  UPDATE_LOCATION_FAIL,
} from './types';
import axios from 'axios';
import { API_URL } from '../../constants/services';
import { Alert } from 'react-native';

export const updateFreetime = (groupName, listFreeTimes) => {
  return (dispatch, getState) => {
    dispatch(updateFreetimeStarted());
    axios
      .post(`${API_URL}/user/freetime`, { groupName, listFreeTimes })
      .then((res) => {
        let data = res.data;
        dispatch(updateFreetimeSuccess(data.freetimes));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(updateFreetimeFailure(err.message));
      });
  };
};

const updateFreetimeStarted = () => ({
  type: UPDATE_FREETIME,
});

const updateFreetimeSuccess = (listFreeTimes) => ({
  type: UPDATE_FREETIME_SUCCESS,
  listFreeTimes,
});

const updateFreetimeFailure = (error) => ({
  type: UPDATE_FREETIME_FAIL,
  error,
});

export const updateLocation = (groupName, location) => {
  return (dispatch, getState) => {
    dispatch(updateLocationStarted());
    axios
      .post(`${API_URL}/user/location`, { groupName, location })
      .then((res) => {
        let data = res.data;
        dispatch(updateLocationSuccess(data.location));
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(updateLocationFailure(err.message));
      });
  };
};

const updateLocationStarted = () => ({
  type: UPDATE_LOCATION,
});

const updateLocationSuccess = (location) => ({
  type: UPDATE_LOCATION_SUCCESS,
  location,
});

const updateLocationFailure = (error) => ({
  type: UPDATE_LOCATION_FAIL,
  error,
});
