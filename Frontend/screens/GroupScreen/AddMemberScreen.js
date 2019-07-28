import React, { Component } from 'react';
import { StyleSheet, Platform, FlatList, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Text, Button, Container, Body, ListItem, Content, Thumbnail, Left, Header, Item, Input } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import TextSize from '../../constants/TextSize';
import { connect } from 'react-redux';
import { listGroup, addMember } from '../../store/actions/groupAction';
import axios from 'axios';
import { API_URL } from '../../constants/services';

class AddMemberScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      gesturesEnabled: false,
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
          onPress={() => navigation.navigate('GroupChatScreen')}
        />
      ),
      headerRight: (
        <View style={{ justifyContent: 'center', marginRight: 5 }}>
          <Button
            onPress={() => {
              if (navigation.getParam('addMember', null)) {
                return navigation.getParam('addMember')();
              }
            }}
            small
            rounded
            style={{ backgroundColor: Colors.tintColor }}>
            <Text>Add</Text>
          </Button>
        </View>
      ),
      tabBarOptions: {
        showLabel: false,
      },
    };
  };

  async componentDidMount() {
    await this.props.navigation.setParams({
      addMember: () => this.addMember(),
    });
    await this.setState({
      currentListMember: this.props.groupInfo.member || [],
    });
  }

  addMember = async () => {
    let listMemberID = [];
    this.state.data.forEach((item) => {
      if (item.checked === true) {
        listMemberID.push(item.userName);
      }
    });

    let groupID = this.props.groupInfo.groupName + '.' + this.props.userInfo.userName;
    await this.props.addMember(groupID, listMemberID);
    setTimeout(() => {
      this.props.listGroup();
    }, 3000);

    this.props.navigation.navigate('GroupChatScreen');
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      inputSearch: null,
      currentListMember: [],
    };
  }

  _handleSearchEvent = (event) => {
    value = event.nativeEvent.text;
    this.setState({ inputSearch: value });
    if (value && value !== '') {
      axios
        .get(`${API_URL}/user/search`, { params: { userName: value } })
        .then((res) => {
          let data = res.data;
          this.setState({ data: data });
        })
        .catch((err) => {
          Alert.alert('Timeout of 0ms Exceeded. Server Error');
        });
    } else {
      this.setState({ data: [] });
    }
  };

  _renderItem = ({ item }) => {
    // if (item.userName !== this.props.userInfo.userName)
    return (
      <TouchableOpacity
        disabled={this.state.currentListMember.includes(item.userName)}
        onPress={() => {
          item.checked = !item.checked;
          this.setState({ data: this.state.data });
        }}>
        <ListItem thumbnail selected noIndent>
          <Left>
            <Thumbnail small source={{ uri: item.avatar }} />
          </Left>
          <Body>
            <Text style={{ fontWeight: 'bold', color: Colors.tintColor }}>{item.name}</Text>
          </Body>
          {this.state.currentListMember.includes(item.userName) ? (
            <Text style={{ color: Colors.tintColor }}>Joined</Text>
          ) : item.checked ? (
            <Icon
              name={Platform.OS === 'ios' ? 'ios-checkmark-circle' : 'md-checkmark-circle'}
              iconStyle={{ color: Colors.tintColor, fontSize: 24 }}
              type='ionicon'
              color={Colors.tintColor}
            />
          ) : (
            <Icon
              name={Platform.OS === 'ios' ? 'ios-radio-button-off' : 'md-radio-button-off'}
              iconStyle={{ color: Colors.tintColor, fontSize: 24 }}
              type='ionicon'
              color={Colors.tintColor}
            />
          )}
        </ListItem>
      </TouchableOpacity>
    );
    // else return null;
  };

  render() {
    return (
      <Container>
        <Header searchBar rounded style={{ paddingBottom: 10 }}>
          <Item style={{ alignSelf: 'center', paddingLeft: 10, paddingRight: 10 }}>
            <Icon name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} type='ionicon' color={Colors.tintColor} />
            <Input
              placeholder='Search'
              value={this.state.inputSearch}
              onChangeText={(text) => this.setState({ inputSearch: text })}
              onSubmitEditing={this._handleSearchEvent}
            />
            <Icon name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'} type='ionicon' color={Colors.tintColor} />
          </Item>
        </Header>
        <Content>
          <FlatList
            style={{ padding: 5 }}
            data={this.state.data}
            renderItem={(item) => this._renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.authReducer.userInfo,
  groupInfo: state.groupReducer.groupInformation,
  listUser: state.listUserReducer.listUser,
});

const mapDispatchToProps = (dispatch) => ({
  listGroup: () => dispatch(listGroup()),
  addMember: (groupID, listMemberID) => dispatch(addMember(groupID, listMemberID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddMemberScreen);

const styles = StyleSheet.create({});
