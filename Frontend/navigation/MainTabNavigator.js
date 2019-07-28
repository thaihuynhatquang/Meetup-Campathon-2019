import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ListGroupScreen from '../screens/GroupScreen/ListGroupScreen';
import CreateGroupScreen from '../screens/GroupScreen/CreateGroupScreen';
import AddMemberScreen from '../screens/GroupScreen/AddMemberScreen';
import GroupChatScreen from '../screens/GroupScreen/GroupChatScreen';
import GroupDetailScreen from '../screens/GroupScreen/GroupDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthScreen from '../screens/AuthScreen';

const GroupChatStack = createStackNavigator({
  GroupChatScreen: {
    screen: GroupChatScreen,
    path: 'group/:chat',
  },
  GroupDetailScreen: {
    screen: GroupDetailScreen,
    path: 'group/:detailD',
  },
});

const ModalGroupStack = createStackNavigator(
  {
    CreateGroupScreen: {
      screen: CreateGroupScreen,
      path: 'group/:create',
    },
    AddMemberScreen: {
      screen: AddMemberScreen,
      path: 'group/:addMember',
    },
  },
  {
    headerMode: 'float',
  },
);

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
  },
  config,
);

HomeStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'} />,
};

HomeStack.path = '';

const MainGroupStack = createStackNavigator(
  {
    ListGroupScreen: {
      screen: ListGroupScreen,
      path: 'group/:list',
    },
  },
  {
    initialRouteName: 'ListGroupScreen',
  },
);

MainGroupStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'} />
  ),
};

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  config,
);

ProfileStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-contact` : 'md-contact'} />
  ),
};

ProfileStack.path = '';

const tabNavigator = createBottomTabNavigator(
  {
    MainGroupStack,
    HomeStack,
    ProfileStack,
  },
  {
    initialRouteName: 'HomeStack',
    tabBarOptions: {
      showLabel: false,
    },
  },
);

tabNavigator.path = '';

const overideTabNavigator = createStackNavigator(
  {
    tabNavigator: tabNavigator,
    GroupChatStack: GroupChatStack,
  },
  {
    headerMode: 'none',
  },
);

const AppStack = createStackNavigator(
  {
    overideTabNavigator: overideTabNavigator,
    ModalGroupStack: ModalGroupStack,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const AuthStack = createSwitchNavigator({
  AuthScreen: AuthScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
