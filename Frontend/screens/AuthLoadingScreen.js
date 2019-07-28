import React from 'react';
import { Text, ActivityIndicator, AsyncStorage, StatusBar, Alert, View } from 'react-native';
import { connect } from 'react-redux';
import { getUser } from '../store/actions/authAction';
import { listUser } from '../store/actions/listUserAction';
import { listGroup } from '../store/actions/groupAction';
import axios from 'axios';
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['authorization'] = token;

      this.props.getUser();
      this.props.getListUser();
      this.props.getListGroup();
      setTimeout(() => {
        this.props.navigation.navigate('App');
      }, 5000);
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  fetchData = () => {};

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  getListUser: () => dispatch(listUser()),
  getListGroup: () => dispatch(listGroup()),
});

export default connect(
  null,
  mapDispatchToProps,
)(AuthLoadingScreen);
