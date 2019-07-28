import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextSize from '../constants/TextSize';
import { events } from '../data/SampleData';

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: TextSize.TEXT_TITLE,
        color: Colors.tintColor,
      },
      tabBarOptions: {
        showLabel: false,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      data: events,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text h3>Upcoming Schedule</Text>
        </View>
        <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
          <FlatList
            horizontal
            data={this.state.data}
            renderItem={({ item: rowData }) => {
              return (
                <Card style={{ width: Layout.window.width * 0.7 }}>
                  <CardImage source={{ uri: rowData.imageUrl }} />
                  <CardTitle title={rowData.title} isDark={true} />
                  <CardContent text='Your device will reboot in few seconds once successful, be patient meanwhile' />
                  <CardAction style={{ justifyContent: 'flex-end' }}>
                    <CardButton onPress={() => {}} title='View' color={Colors.tintColor} style={{ margin: 15 }} />
                  </CardAction>
                </Card>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button
            title='New Meeting'
            buttonStyle={styles.button}
            titleStyle={{ fontSize: TextSize.TEXT_MEDIUM_SIZE }}
            onPress={() => this.props.navigation.navigate('CreateGroupScreen', { prevRoute: 'HomeScreen' })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.tintColor,
    borderRadius: 4,
    height: Layout.window.height * 0.07,
    width: Layout.window.width * 0.8,
    shadowColor: Colors.tintColor,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.35,
    shadowRadius: 9,
    elevation: 14,
  },
});
