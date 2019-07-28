import { AsyncStorage, Alert, Platform } from 'react-native';
import { iosClientId, androidClientId, API_URL } from '../constants/services';
import { Google } from 'expo';
import axios from 'axios';

export const onSignIn = async (token) => {
  try {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

export const onSignOut = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {}
};

export const signInWithGoogleAsync = async () => {
  try {
    const { type, idToken } = await Google.logInAsync({
      clientId: Platform.OS === 'android' ? androidClientId : iosClientId,
    });
    if (type === 'success') {
      return { idToken: idToken, platform: Platform.OS };
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
};

export const authenticate = (user) => {
  if (user !== null) return true;
};
