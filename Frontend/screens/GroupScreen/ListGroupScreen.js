import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import TextSize from '../../constants/TextSize';
import Colors from '../../constants/Colors';
import { API_URL } from '../../constants/services';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';
import { getGroup } from '../../store/actions/groupAction';

class GroupScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Groups',
      headerStyle: {
        // backgroundColor: Colors.tintColor,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: TextSize.TEXT_TITLE,
        color: Colors.tintColor,
      },
      headerRight: (
        <Icon
          name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'}
          type='ionicon'
          size={28}
          color={Colors.tintColor}
          iconStyle={{
            marginRight: 15,
          }}
          onPress={() => navigation.navigate('CreateGroupScreen', { prevRoute: 'ListGroupScreen' })}
        />
      ),
      tabBarOptions: {
        showLabel: false,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.listGroup,
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.listGroup });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.listGroup !== this.props.listGroup) {
      this.setState({ data: nextProps.listGroup });
      return true;
    }
    return false;
  }

  render() {
    const { data } = this.state;
    return (
      <FlatList
        style={styles.root}
        data={data}
        extraData={this.props.listGroup}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={(item) => {
          const Group = item.item;
          let mainContentStyle;
          if (Group.attachment) {
            mainContentStyle = styles.mainContent;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                const groupID = Group.groupName + '.' + Group.adminEmail;
                const object = {
                  groupID: groupID,
                };
                this.props.getGroup(object);
                this.props.navigation.navigate('GroupChatScreen');
              }}
              style={styles.container}>
              <Image source={{ uri: `${API_URL}${Group.groupAvatar}` }} style={styles.avatar} />
              <View style={styles.content}>
                <View style={mainContentStyle}>
                  <View style={styles.text}>
                    <Text style={styles.groupName}>{Group.groupName}</Text>
                  </View>
                  <Text style={styles.countMembers}>{Group.member ? Group.member.length : '1'} members</Text>
                  <Text style={styles.category}>{Group.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  listGroup: state.groupReducer.listGroup,
});

const mapDispatchToProps = (dispatch) => ({
  getGroup: (groupID) => dispatch(getGroup(groupID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupScreen);

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 25,
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  memberImage: {
    height: 30,
    width: 30,
    marginRight: 4,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  countMembers: {
    color: '#20B2AA',
  },
  category: {
    fontSize: 12,
    color: '#696969',
  },
  groupName: {
    fontSize: 23,
    color: Colors.tintColor,
  },
  groupMembersContent: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
