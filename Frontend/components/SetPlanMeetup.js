import React, { Component } from 'react';
import {
  Container,
  Left,
  Right,
  Body,
  Button,
  Header,
  Icon,
  Content,
  Card,
  CardItem,
  Text,
  Item,
  ListItem,
} from 'native-base';
import { View, StyleSheet, ScrollView, Platform, FlatList, Image } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextSize from '../constants/TextSize';
import PureChart from 'react-native-pure-chart';
import { timeListData } from '../data/SampleData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_URL } from '../constants/services';
import { connect } from 'react-redux';
import { appID, appCode, UETAddress } from '../constants/HeremapsApi';

class SetPlanMeetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowChart: false,
      selectedIndex: -1,
      timeListData: [],
      midPoint: null,
      listPlaceSuggess: [],
    };
  }

  loadTimeMeeting() {
    const groupID = this.props.groupInfo.groupName + '.' + this.props.groupInfo.adminEmail;
    axios
      .post(`${API_URL}/group/freeTime`, { groupID })
      .then((res) => {
        this.setState({ timeListData: res.data });
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(getTokenFailure(err.message));
      });
  }

  loadPlaceMeeting() {
    const groupName = this.props.groupInfo.groupName;
    axios
      .post(`${API_URL}/group/location`, { groupName })
      .then((res) => {
        this.setState({ midPoint: res.data });
        console.log(this.state.midPoint);
        this.loadListPlaceSuggest();
      })
      .catch((err) => {
        Alert.alert('Timeout of 0ms Exceeded. Server Error');
        dispatch(getTokenFailure(err.message));
      });
  }

  loadListPlaceSuggest() {
    // axios
    //   .get(
    //     `https://places.cit.api.here.com/places/v1/discover/explore?&at=${this.state.midPoint.lat}%2C${
    //       this.state.midPoint.lon
    //     }&cat=eat-drink${appID}${appCode}`,
    //   )
    //   .then((res) => {
    //     this.setState({ listPlaceSuggess: res.data() });
    //     console.log(this.state.listPlaceSuggess);
    //   })
    //   .catch((err) => {
    //     Alert.alert('Timeout of 0ms Exceeded. Server Error');
    //     dispatch(getTokenFailure(err.message));
    //   });
  }

  render() {
    const { isShowChart } = this.state;
    return (
      <Container
        style={{ flex: 1, padding: 0, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Header
          style={{
            height: 50,
            alignItems: 'center',
            backgroundColor: 'white',
            width: '100%',
            justifyContent: 'center',
            paddingBottom: 5,
          }}>
          <Left>
            <Button transparent onPress={() => this.props.closeModal()}>
              <Icon
                name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
                style={{ fontSize: 28, color: Colors.tintColor }}
              />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontWeight: 'bold', fontSize: TextSize.TEXT_TITLE, color: Colors.tintColor }}>
              Plan Meetup
            </Text>
          </Body>
          <Right />
        </Header>
        <Content style={{ flex: 1, padding: 15 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button
                onPress={() => {
                  this.setState({ isShowChart: !isShowChart });
                }}
                style={styles.button}>
                <Text style={{ fontWeight: '600', textAlign: 'center', fontSize: TextSize.TEXT_SMALL_SIZE }}>
                  Load List Time
                </Text>
              </Button>
            </View>
            {isShowChart ? (
              <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'flex-start' }}>
                <PureChart
                  data={[
                    {
                      seriesName: 'series1',
                      data: timeListData,
                      color: Colors.tintColor,
                    },
                  ]}
                  type='bar'
                />
              </ScrollView>
            ) : null}
          </View>
          <View style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Button
              onPress={() => {
                this.loadPlaceMeeting();
              }}
              style={styles.button}>
              <Text style={{ fontWeight: '600', textAlign: 'center', fontSize: TextSize.TEXT_SMALL_SIZE }}>
                Get Suitable Place For Meetup
              </Text>
            </Button>

            {this.state.midPoint ? (
              <View style={{ marginTop: 20 }}>
                <Image
                  source={{
                    uri: `https://image.maps.api.here.com/mia/1.6/mapview?c=${this.state.midPoint.lat}%2C${
                      this.state.midPoint.lon
                    }&z=15${appID}${appCode}`,
                  }}
                  style={{ height: 320, width: 240 }}
                />
                <Text />
              </View>
            ) : null}
          </View>
          <FlatList
            data={this.state.listPlaceSuggess}
            extraData={this.state}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            keyExtractor={(item) => {
              return this.state.listPlaceSuggess.indexOf(item).toString();
            }}
            renderItem={(listTime) => {
              const time = listTime.item;
              if (time.attachment) {
                mainContentStyle = styles.mainContent;
              }
              return (
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => {
                      let array = this.state.chosenTime;
                      array.splice(array.indexOf(time), 1);
                      this.setState({ chosenTime: array });
                    }}>
                    <Icon
                      type='Ionicons'
                      name='remove-circle-outline'
                      style={{ marginRight: 10, color: Colors.tintColor }}
                    />
                  </TouchableOpacity>
                  <Text>{time.startChosenTime.toString().slice(4, 21)}</Text>
                  <Text> -> </Text>
                  <Text>{time.endChosenTime.toString().slice(4, 21)}</Text>
                </View>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  groupInfo: state.groupReducer.groupInformation,
});

export default connect(
  mapStateToProps,
  null,
)(SetPlanMeetup);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.tintColor,
    borderRadius: 4,
    height: Layout.window.height * 0.07,
    width: Layout.window.width * 0.4,
    shadowColor: Colors.tintColor,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.35,
    shadowRadius: 9,
    elevation: 14,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
