import React from 'react';
import { View, Image, Dimensions, StyleSheet, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { onSignIn, signInWithGoogleAsync } from '../utils/auth';
import { getToken } from '../store/actions/authAction';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextSize from '../constants/TextSize';
const WIDTH = Dimensions.get('window').width;

class AuthScreen extends React.Component {
  _loginGoogle = () => {
    signInWithGoogleAsync().then((item) => {
      if (item.cancelled) return;
      this._onLogin(item);
    });
  };

  _onLogin = (item) => {
    this.props.getToken({ token: item.idToken, platform: item.platform });
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.token !== this.props.token) {
      onSignIn(nextProps.token).then(() => {
        nextProps.navigation.navigate('AuthLoading');
      });
      return true;
    }
    return false;
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/images/logo.png')} resizeMode='center' />
        <Button
          buttonStyle={styles.googleButtonLogin}
          onPress={() => this._loginGoogle()}
          icon={<Icon name='logo-google' type='ionicon' color='white' iconStyle={{ marginRight: 15 }} />}
          title='Continue with Google'
          titleStyle={{
            fontSize: TextSize.TEXT_MEDIUM_SIZE,
            color: 'white',
          }}
          type='clear'
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.authReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  getToken: (userInfo) => dispatch(getToken(userInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f3f8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  logo: {
    height: WIDTH * 0.8,
    width: WIDTH * 0.8,
    shadowColor: 'gray',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  googleButtonLogin: {
    backgroundColor: Colors.tintColor,
    borderRadius: 4,
    height: Layout.window.height * 0.07,
    width: Layout.window.width * 0.6,
    shadowColor: Colors.tintColor,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.35,
    shadowRadius: 9,
    elevation: 14,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 20,
  },
});
