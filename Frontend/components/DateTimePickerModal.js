import React, { Component } from 'react';
import { Container, Left, Right, Body, Button, Header, Icon, Content, Input, Text, Item } from 'native-base';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextSize from '../constants/TextSize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';
import { updateFreetime } from '../store/actions/timeLocationAction';
class DateTimePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenTime: [],
      chosenShowTime: [],
      currentDate: null,
      currentStartTime: '0',
      currentEndTime: '0',
    };
  }

  _onUpdateListFreetime() {
    const groupName = this.props.groupInfo.groupName;
    this.props.updateFreetime(groupName, this.state.chosenTime);
    this.props.setListFreeTime();
  }

  setDate(newDate) {
    this.setState({ currentDate: newDate });
  }

  setStartTime(newTime) {
    this.setState({ currentStartTime: newTime });
  }

  setEndTime(newTime) {
    this.setState({ currentEndTime: newTime });
  }
  render() {
    const { currentStartTime, currentEndTime } = this.state;
    const timeError =
      !currentStartTime ||
      !currentEndTime ||
      parseInt(currentStartTime) > 23 ||
      parseInt(currentStartTime) < 0 ||
      parseInt(currentEndTime) > 23 ||
      parseInt(currentEndTime) < 0 ||
      parseInt(currentStartTime) >= parseInt(currentEndTime);
    const renderListTime = (
      <FlatList
        data={this.state.chosenShowTime}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={(item) => {
          return this.state.chosenShowTime.indexOf(item).toString();
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
    );
    return (
      <Container style={{ flex: 1, padding: 0, backgroundColor: 'white' }}>
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
            <Text style={{ fontWeight: 'bold', fontSize: TextSize.TEXT_TITLE, color: Colors.tintColor }}>Time</Text>
          </Body>
          <Right>
            <View style={{ justifyContent: 'center' }}>
              <Button
                onPress={() => this._onUpdateListFreetime()}
                small
                rounded
                style={{ backgroundColor: this.state.chosenTime.length > 0 ? Colors.tintColor : undefined }}
                disabled={this.state.chosenTime.length === 0}>
                <Text>Done</Text>
              </Button>
            </View>
          </Right>
        </Header>
        <Content style={{ flex: 1, padding: 15 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.currentDate}
              mode='date'
              placeholder='select date'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
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
              onDateChange={(date) => this.setDate(date)}
            />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: '600', textAlign: 'center' }}>From</Text>
                <Input
                  onChangeText={(time) => this.setStartTime(time)}
                  style={{
                    textAlign: 'center',
                    fontSize: 17,
                    color: timeError ? Colors.torch_red : 'black',
                    maxWidth: 40,
                    height: 25,
                    maxHeight: 25,
                  }}
                  value={this.state.currentStartTime.toString()}
                  keyboardType={'numeric'}
                />
                <Text style={{ fontWeight: '600', textAlign: 'center' }}>h</Text>
                <Input
                  disabled={true}
                  style={{
                    height: 25,
                    maxHeight: 25,
                    maxWidth: 40,
                    textAlign: 'center',
                    fontSize: 17,
                    color: timeError ? Colors.torch_red : 'black',
                  }}
                  value='00'
                />
              </View>
              <View style={{ marginRight: 30 }} />
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: '600', textAlign: 'center' }}>to</Text>
                <Input
                  onChangeText={(time) => this.setEndTime(time)}
                  style={{
                    textAlign: 'center',
                    fontSize: 17,
                    color: timeError ? Colors.torch_red : 'black',
                    maxWidth: 40,
                    height: 25,
                    maxHeight: 25,
                  }}
                  value={this.state.currentEndTime.toString()}
                  keyboardType={'numeric'}
                />
                <Text style={{ fontWeight: '600', textAlign: 'center' }}>h</Text>
                <Input
                  disabled={true}
                  style={{
                    height: 25,
                    maxHeight: 25,
                    maxWidth: 40,
                    textAlign: 'center',
                    fontSize: 17,
                    color: timeError ? Colors.torch_red : 'black',
                  }}
                  value='00'
                />
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Button
                style={[
                  styles.button,
                  {
                    shadowColor: this.state.currentDate === null || timeError ? undefined : Colors.tintColor,
                    backgroundColor: this.state.currentDate === null || timeError ? undefined : Colors.tintColor,
                  },
                ]}
                disabled={this.state.currentDate === null || timeError}
                onPress={async () => {
                  let currentDate = new Date(this.state.currentDate);
                  let startChosenTime = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    this.state.currentStartTime,
                    0,
                    0,
                  );
                  let endChosenTime = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    this.state.currentEndTime,
                    0,
                    0,
                  );
                  await this.setState({
                    chosenShowTime: [
                      ...this.state.chosenShowTime,
                      {
                        startChosenTime: startChosenTime,
                        endChosenTime: endChosenTime,
                      },
                    ],
                    chosenTime: [
                      ...this.state.chosenTime,
                      {
                        fromTime: parseInt(startChosenTime.getTime()),
                        toTime: parseInt(endChosenTime.getTime()),
                      },
                    ],
                    currentDate: null,
                    currentStartTime: '0',
                    currentEndTime: '0',
                  });
                }}>
                <Text style={{ fontSize: TextSize.TEXT_SMALL_SIZE }}>Add time</Text>
              </Button>
            </View>
            {renderListTime}
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  groupInfo: state.groupReducer.groupInformation,
});

const mapDispatchToProps = (dispatch) => ({
  updateFreetime: (groupName, listFreeTimes) => dispatch(updateFreetime(groupName, listFreeTimes)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimePickerModal);

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    height: Layout.window.height * 0.07,
    width: '100%',

    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.35,
    shadowRadius: 9,
    elevation: 14,
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
