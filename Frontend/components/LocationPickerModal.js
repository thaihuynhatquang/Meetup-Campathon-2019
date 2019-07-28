import React, { Component } from 'react';
import { Container, Left, Right, Body, Button, Header, Icon, Content, Input, Text, Item, ListItem } from 'native-base';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextSize from '../constants/TextSize';
import axios from 'axios';
import { HereMapsAPI, appCode, appID, UETAddress } from '../constants/HeremapsApi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { updateLocation } from '../store/actions/timeLocationAction';

class LocationPickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      inputSearch: null,
      listPlaces: [],
      chosenPlace: {},
    };
  }

  _onUpdateLocation = () => {
    const groupName = this.props.groupInfo.groupName;
    this.props.updateLocation(groupName, this.state.chosenPlace);
    this.props.setLocation();
  };

  _handleSearchEvent = (event) => {
    value = event.nativeEvent.text;
    axios
      .get(HereMapsAPI + appCode + appID + UETAddress + '&q=' + value)
      .then(async (response) => {
        await this.setState({ listPlaces: response.data.results.items });
      })
      .catch(function(error) {
        console.log(error);
        console.log(HereMapsAPI + appCode + appID + UETAddress);
      });
  };

  _handleChangeText = (event) => {
    value = event.nativeEvent.text;
    this.setState({ inputSearch: value });
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await this.setState({
            chosenPlace: {
              lat: item.position[0],
              lon: item.position[1],
            },
          });
          this._onUpdateLocation();
          console.log(item);
        }}>
        <ListItem thumbnail selected noIndent>
          <Body>
            <Text style={{ fontWeight: 'bold', color: Colors.tintColor }}>{item.title}</Text>
            <Text style={{ color: Colors.tintColor }}>{item.vicinity}</Text>
          </Body>
        </ListItem>
      </TouchableOpacity>
    );
  };

  render() {
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
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: TextSize.TEXT_TITLE,
                color: Colors.tintColor,
              }}>
              Location
            </Text>
          </Body>
          <Right />
        </Header>
        <Header searchBar rounded style={{ paddingBottom: 10 }}>
          <Item style={{ alignSelf: 'center', paddingLeft: 10, paddingRight: 10 }}>
            <Icon name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} style={{ color: Colors.tintColor }} />
            <Input
              placeholder='Search'
              returnKeyType='search'
              value={this.state.inputSearch}
              onSubmitEditing={(event) => this._handleSearchEvent(event)}
              onChange={(event) => this._handleChangeText(event)}
            />
            <Icon
              name={Platform.OS === 'ios' ? 'ios-paper-plane' : 'md-paper-plane'}
              style={{ color: Colors.tintColor }}
            />
          </Item>
        </Header>
        <Content style={{ flex: 1, padding: 15 }}>
          <FlatList
            style={styles.root}
            data={this.state.listPlaces}
            extraData={this.state}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            renderItem={(item) => this._renderItem(item)}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  groupInfo: state.groupReducer.groupInformation,
});

const mapDispatchToProps = (dispatch) => ({
  updateLocation: (groupName, location) => dispatch(updateLocation(groupName, location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationPickerModal);

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
