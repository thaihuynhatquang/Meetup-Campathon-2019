import React from 'react';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import TextSize from '../../constants/TextSize';
import Colors from '../../constants/Colors';
import { Icon } from 'react-native-elements';
import GroupChatAction from '../../components/GroupChatAction';
import { Platform } from 'react-native';

import { connect } from 'react-redux';

const currentUser = {
  _id: 1,
  avatar: 'https://placeimg.com/140/140/any',
};

class GroupChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      gesturesEnabled: false,
      title: 'Groups Chat',
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
          name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
          type='ionicon'
          size={28}
          color={Colors.tintColor}
          iconStyle={{
            marginLeft: 15,
          }}
          onPress={() => navigation.navigate('ListGroupScreen')}
        />
      ),
      headerRight: (
        <Icon
          name={Platform.OS === 'ios' ? 'ios-information-circle-outline' : 'md-information-circle-outline'}
          type='ionicon'
          size={28}
          color={Colors.tintColor}
          iconStyle={{
            marginRight: 15,
          }}
          onPress={() => navigation.navigate('GroupDetailScreen')}
        />
      ),
    };
  };
  state = {
    step: 0,
    messages: [],
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
          image: 'https://placeimg.com/140/140/any',
        },
        {
          _id: 2,
          text: 'Hello developer 2',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native 2',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 3,
          text: 'Hello developer 2',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native 2',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
  }

  onSend = (messages = []) => {
    const step = this.state.step + 1;
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
        step,
      };
    });
  };

  onSendFromUser = (messages = []) => {
    const createdAt = new Date();
    const messagesToUpload = messages.map((message) => ({
      ...message,
      user: currentUser,
      createdAt,
      _id: Math.round(Math.random() * 1000000),
    }));
    this.onSend(messagesToUpload);
  };

  render() {
    const { userInfo, groupInfo } = this.props;
    console.log(userInfo.username, 'username');
    console.log(groupInfo.adminEmail, 'admin');
    return (
      <GiftedChat
        messages={this.state.messages}
        renderUsernameOnMessage={true}
        onSend={(messages) => this.onSend(messages)}
        renderSend={(props) => {
          return <Send {...props} textStyle={{ color: Colors.tintColor }} />;
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.tintColor,
                },
              }}
            />
          );
        }}
        user={currentUser}
        renderActions={(props) => {
          return (
            <GroupChatAction
              {...props}
              isAdminGroup={groupInfo.adminEmail === userInfo.userName}
              onSend={this.onSendFromUser}
              addMember={() => this.props.navigation.navigate('AddMemberScreen')}
            />
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.authReducer.userInfo,
  groupInfo: state.groupReducer.groupInformation,
});

export default connect(
  mapStateToProps,
  null,
)(GroupChatScreen);
