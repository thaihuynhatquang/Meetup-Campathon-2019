import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import * as NativeBaseComponent from 'native-base';

import { categoryPlaces } from '../../data/SampleData';
import TextSize from '../../constants/TextSize';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import DatePicker from 'react-native-datepicker';

import { connect } from 'react-redux';
import { API_URL } from '../../constants/services';
import { FlatList } from 'react-native-gesture-handler';
class GroupDetailScreen extends Component {
  state = {
    groupAvatar: null,
    description: 'Nothing here',
    groupName: null,
    hasExplorePermission: null,
    type: Camera.Constants.Type.back,
    startDate: null,
    endDate: null,
    editMode: false,
    category: null,
  };

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Groups Detail',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: TextSize.TEXT_TITLE,
        color: Colors.tintColor,
      },
      headerLeft: (
        <Icon
          name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
          type='ionicon'
          size={28}
          color={Colors.tintColor}
          iconStyle={{
            marginLeft: 15,
          }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: (
        <View style={{ justifyContent: 'center', marginRight: 5 }}>
          {navigation.getParam('isAdmin', false) === true ? (
            <NativeBaseComponent.Button
              onPress={() => {
                return navigation.getParam('handleMode')();
              }}
              small
              rounded
              style={{ backgroundColor: Colors.tintColor }}>
              <NativeBaseComponent.Text>
                {navigation.getParam('editMode', false) === true ? 'Save' : 'Edit'}
              </NativeBaseComponent.Text>
            </NativeBaseComponent.Button>
          ) : null}
        </View>
      ),
    };
  };

  async componentDidMount() {
    await this.props.navigation.setParams({ handleMode: () => this.switchMode() });
    const isAdmin = this.props.groupInfo.adminEmail == this.props.userInfo.userName;
    await this.props.navigation.setParams({ isAdmin: isAdmin });
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { groupInfo } = this.props;
    this.setState({ hasExplorePermission: status === 'granted' });
    this.setState({
      groupAvatar: API_URL + groupInfo.groupAvatar,
      groupName: groupInfo.groupName,
      description: groupInfo.description,
      category: groupInfo.category,
      endDate: new Date(parseInt(groupInfo.endDate)),
      startDate: new Date(parseInt(groupInfo.startDate)),
    });
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

  switchMode = async () => {
    await this.setState({
      editMode: !this.state.editMode,
    });
    this.props.navigation.setParams({ editMode: this.state.editMode });
  };

  render() {
    const { groupAvatar, editMode, groupName, description, category, startDate, endDate } = this.state;
    const placeholder = {
      label: 'Select category place...',
      value: null,
      color: '#9EA0A4',
    };
    return (
      <NativeBaseComponent.Content style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() =>
                this._pickImageFromExplorer()
                  .then((r) => console.log(r))
                  .catch((e) => console.log(e))
              }
              disabled={!editMode}>
              {groupAvatar ? (
                <Image
                  style={[styles.avatar, { borderColor: editMode ? 'white' : Colors.disableInputBackground }]}
                  source={{ uri: groupAvatar }}
                />
              ) : (
                <Image
                  style={[styles.avatar, { borderColor: editMode ? 'white' : Colors.disableInputBackground }]}
                  source={{ uri: groupAvatar }}
                />
              )}
            </TouchableOpacity>
            <Input
              inputStyle={[styles.name, { color: editMode ? Colors.silver : '#fff' }]}
              value={groupName}
              editable={editMode}
              onChangeText={(text) => this.setState({ groupName: text })}
            />
          </View>
        </View>
        <View style={{ flex: 3, justifyContent: 'flex-start', paddingHorizontal: 30 }}>
          <Text style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold' }}>Description</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: editMode ? 'white' : Colors.disableInputBackground }]}
            onChangeText={(text) => this.setState({ description: text })}
            value={description}
            placeholder='Describe something about this...'
            placeholderTextColor={Colors.placeHolderLightColor}
            editable={editMode}
          />
          <Text style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold' }}>Category</Text>
          <RNPickerSelect
            placeholder={placeholder}
            items={categoryPlaces}
            onValueChange={(value) => {
              this.setState({
                category: value,
              });
            }}
            style={{
              inputIOS: [styles.textInput, { backgroundColor: editMode ? 'white' : Colors.disableInputBackground }],
              inputAndroid: [styles.textInput, { backgroundColor: editMode ? 'white' : Colors.disableInputBackground }],
            }}
            value={category}
            placeholderTextColor={Colors.placeHolderLightColor}
            disabled={!editMode}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold' }}>From Date</Text>
              <DatePicker
                style={{ flex: 1 }}
                disabled={!editMode}
                date={startDate}
                mode='date'
                showIcon={false}
                placeholder='select date'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: null,
                  disabled: {
                    backgroundColor: Colors.disableInputBackground,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    color: 'black',
                    borderRadius: 4,

                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  dateInput: {
                    backgroundColor: 'white',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    color: 'black',
                    borderRadius: 4,

                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  dateText: {
                    fontSize: 16,
                    color: 'black',
                  },
                  btnTextConfirm: {
                    color: Colors.tintColor,
                    fontWeight: '600',
                  },
                  btnTextCancel: {
                    color: Colors.tintColor,
                    fontWeight: '600',
                  },
                }}
                onDateChange={(date) => this.setState({ toDate: date })}
              />
            </View>
            <View>
              <Text style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold' }}>To Date</Text>
              <DatePicker
                style={{ flex: 1 }}
                disabled={!editMode}
                date={endDate}
                mode='date'
                showIcon={false}
                placeholder='select date'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: null,
                  disabled: {
                    backgroundColor: Colors.disableInputBackground,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    color: 'black',
                    borderRadius: 4,
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  dateInput: {
                    backgroundColor: 'white',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    color: 'black',
                    borderRadius: 4,
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  dateText: {
                    fontSize: 16,
                    color: 'black',
                  },
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
          <FlatList />
        </View>
        {/* <View style={styles.meetingInformation}>
          <Text style={{ fontSize: 20, fontWeight: '600', margin: 20, color: 'white' }}>Meeting Information</Text>
          <View style={{ alignItems: 'flex-start', padding: 30 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', margin: 20, color: 'white' }}>Time: </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', margin: 20, color: 'white' }}>Place: </Text>
          </View>
        </View> */}
      </NativeBaseComponent.Content>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.authReducer.userInfo,
  groupInfo: state.groupReducer.groupInformation,
});

const mapDispatchToProps = (dispatch) => ({
  reloadListGroup: () => dispatch(listGroup()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupDetailScreen);

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
    // flex: 1,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    // marginBottom: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  category: {
    flex: 1,
    justifyContent: 'center',
    margin: 30,
  },
  textDecription: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    borderRadius: 4,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  meetingInformation: {
    backgroundColor: Colors.tintColor,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
