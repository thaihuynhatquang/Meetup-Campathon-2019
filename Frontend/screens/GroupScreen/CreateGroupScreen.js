import React, { Component } from 'react';
import { StyleSheet, Platform, View, Image, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';

import { categoryPlaces } from '../../data/SampleData';
import TextSize from '../../constants/TextSize';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import { createGroup, listGroup } from '../../store/actions/groupAction';
import { connect } from 'react-redux';

class CreateGroupScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const prevRoute = navigation.getParam('prevRoute', 'HomeScreen');
    return {
      title: 'New Meeting',
      headerStyle: {
        // backgroundColor: Colors.tintColor,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: TextSize.TEXT_TITLE,
        color: Colors.tintColor,
      },
      headerLeft: (
        <Icon
          name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
          type='ionicon'
          size={35}
          color={Colors.tintColor}
          iconStyle={{
            marginLeft: 15,
          }}
          onPress={() => navigation.navigate(prevRoute)}
        />
      ),
      tabBarOptions: {
        showLabel: false,
      },
    };
  };

  constructor(props) {
    super(props);

    this.inputRefs = {
      category: '',
    };

    this.state = {
      startDate: null,
      endDate: null,
      groupAvatar: null,
      description: null,
      groupName: null,
      category: 'Eating',
      hasExplorePermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasExplorePermission: status === 'granted' });
  }

  _getSelectedPickerValue = () => {
    Alert.alert('Selected country is : ' + this.state.PickerSelectedVal);
  };

  _pickImageFromExplorer = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      this.setState({ groupAvatar: result.uri });
      return Promise.resolve(result);
    }
    return Promise.reject();
  };

  createNewGroup = async (groupInformation) => {
    const bodyFormData = new FormData();

    const uri = groupInformation.groupAvatar;
    if (uri !== null) {
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      bodyFormData.append('groupAvatar', {
        uri,
        name: `groupAvatar.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    bodyFormData.append('adminEmail', this.props.userInfo.userName);
    bodyFormData.append('category', groupInformation.category);
    bodyFormData.append('description', groupInformation.description);
    bodyFormData.append('groupName', groupInformation.groupName);
    bodyFormData.append('startDate', groupInformation.startDate);
    bodyFormData.append('endDate', groupInformation.endDate);

    await this.props.onCreateGroup(bodyFormData);

    setTimeout(() => {
      this.props.reloadListGroup();
    }, 1000);

    await this.props.navigation.navigate('GroupChatScreen');
  };

  render() {
    const { groupAvatar } = this.state;
    const disabledButton =
      this.state.groupAvatar === null ||
      this.state.description === null ||
      this.state.groupName === null ||
      this.state.category === null ||
      this.state.startDate === null ||
      this.state.endDate === null;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() =>
                this._pickImageFromExplorer()
                  .then((r) => console.log(r))
                  .catch((e) => console.log(e))
              }>
              {groupAvatar ? (
                <Image style={styles.avatar} source={{ uri: groupAvatar }} />
              ) : (
                <Image
                  style={styles.avatar}
                  source={{ uri: 'https://uphinh.org/images/2019/07/18/Untitled-16446da271a5f9b7c.png' }}
                />
              )}
            </TouchableOpacity>
            <Input
              value={this.state.groupName}
              onChangeText={(groupName) => {
                this.setState({ groupName: groupName });
              }}
              inputStyle={styles.name}
              placeholder='Group name'
              placeholderTextColor={Colors.placeHolderLightColor}
            />
          </View>
        </View>
        <View style={{ flex: 2, justifyContent: 'flex-start', paddingHorizontal: 30 }}>
          <Text style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold' }}>Description</Text>
          <TextInput
            style={Platform.OS === 'ios' ? pickerSelectStyles.inputIOS : pickerSelectStyles.inputAndroid}
            onChangeText={(description) => this.setState({ description: description })}
            value={this.state.text}
            placeholder='Describe something about this...'
          />
          <Text style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold' }}>Category</Text>
          <RNPickerSelect
            items={categoryPlaces}
            onValueChange={(value) => {
              this.setState({
                category: value,
              });
            }}
            style={pickerSelectStyles}
            value={this.state.category}
            ref={(el) => {
              this.inputRefs.category = el;
            }}
          />
          <View
            style={{
              marginTop: 15,
              marginBottom: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>From Date</Text>
              <DatePicker
                style={{ width: Layout.window.width / 3 }}
                date={this.state.startDate}
                mode='date'
                placeholder='select date'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                showIcon={false}
                customStyles={{
                  btnTextConfirm: {
                    color: Colors.tintColor,
                    fontWeight: '600',
                  },
                  btnTextCancel: {
                    color: Colors.tintColor,
                    fontWeight: '600',
                  },
                }}
                onDateChange={(date) => this.setState({ startDate: date })}
              />
            </View>
            <View style={{ flexDirection: 'column', marginLeft: 50, alignItems: 'flex-start' }}>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>To Date</Text>
              <DatePicker
                style={{ width: Layout.window.width / 3 }}
                date={this.state.endDate}
                mode='date'
                showIcon={false}
                placeholder='select date'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: null,
                  btnTextConfirm: {
                    color: Colors.tintColor,
                    fontWeight: '600',
                  },
                  btnTextCancel: {
                    color: Colors.tintColor,
                    fontWeight: '600',
                  },
                }}
                onDateChange={(date) => this.setState({ endDate: date })}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button
              title='Continue'
              disabled={disabledButton}
              buttonStyle={styles.button}
              titleStyle={{ fontSize: TextSize.TEXT_MEDIUM_SIZE, color: disabledButton ? 'black' : 'white' }}
              onPress={() => {
                let groupInformation = {
                  groupAvatar: this.state.groupAvatar,
                  description: this.state.description,
                  groupName: this.state.groupName,
                  category: this.state.category,
                  adminEmail: this.props.userInfo.userName,
                  startDate: new Date(this.state.startDate).getTime(),
                  endDate: new Date(this.state.endDate).getTime(),
                };

                this.createNewGroup(groupInformation);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.authReducer.userInfo,
  listUser: state.listUserReducer.listUser,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateGroup: (groupInformation) => dispatch(createGroup(groupInformation)),
  reloadListGroup: () => dispatch(listGroup()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateGroupScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: Colors.tintColor,
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  category: {
    flex: 1,
    justifyContent: 'center',
    margin: 30,
  },
  button: {
    borderRadius: 4,
    height: Layout.window.height * 0.07,
    width: Layout.window.height * 0.3,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.35,
    shadowRadius: 9,
    elevation: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tintColor,
    shadowColor: Colors.tintColor,
  },
  datePicker: {},
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
