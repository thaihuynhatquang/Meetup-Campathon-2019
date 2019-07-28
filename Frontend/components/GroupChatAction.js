import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { Overlay } from 'react-native-elements';
import { getLocationAsync, pickImageAsync, takePictureAsync } from './mediaUtils';
import DateTimePickerModal from './DateTimePickerModal';
import LocationPickerModal from './LocationPickerModal';
import SetPlanMeetup from './SetPlanMeetup';

export default class CustomActions extends React.Component {
  state = {
    isShowPickDateTimeModal: false,
    isShowPickLocationModal: false,
    isShowPlanMeetup: false,
  };

  pickDateTimeRange = () => {
    this.setState({ isShowPickDateTimeModal: true });
  };

  pickLocation = () => {
    this.setState({ isShowPickLocationModal: true });
  };

  setPlanMeetup = () => {
    this.setState({ isShowPlanMeetup: true });
  };

  addMember = () => {
    this.props.addMember();
  };

  onActionsPress = () => {
    const options = this.props.isAdminGroup
      ? ['Cancel', 'Set Location', 'Set List Free Time', 'Set Plan For Meetup', 'Add member']
      : ['Cancel', 'Set Location', 'Set List Free Time'];
    console.log(this.props.isAdminGroup);
    const cancelButtonIndex = 0;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        const { onSend } = this.props;
        switch (buttonIndex) {
          case 1:
            this.pickLocation();
            return;
          case 2:
            this.pickDateTimeRange();
            return;
          case 3:
            this.setPlanMeetup();
            return;
          case 4:
            this.addMember();
            return;
          default:
            return;
        }
      },
    );
  };

  renderIcon = () => {
    if (this.props.renderIcon) {
      return this.props.renderIcon();
    }
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
    );
  };

  render() {
    return (
      <View>
        <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={this.onActionsPress}>
          {this.renderIcon()}
        </TouchableOpacity>
        <Overlay
          isVisible={this.state.isShowPickDateTimeModal}
          fullScreen={true}
          onBackdropPress={() => this.setState({ isShowPickDateTimeModal: false })}>
          <DateTimePickerModal
            closeModal={() => {
              this.setState({ isShowPickDateTimeModal: false });
            }}
            setListFreeTime={() => {
              this.setState({ isShowPickDateTimeModal: false });
              this.props.onSend([{ _id: 1, text: 'Set Free Time Done', system: true }]);
            }}
          />
        </Overlay>
        <Overlay
          isVisible={this.state.isShowPickLocationModal}
          fullScreen={true}
          onBackdropPress={() => this.setState({ isShowPickLocationModal: false })}>
          <LocationPickerModal
            closeModal={() => {
              this.setState({ isShowPickLocationModal: false });
            }}
            setLocation={() => {
              this.setState({ isShowPickLocationModal: false });
              this.props.onSend([{ _id: 1, text: 'Set Location Done', system: true }]);
            }}
          />
        </Overlay>
        <Overlay
          isVisible={this.state.isShowPlanMeetup}
          fullScreen={true}
          onBackdropPress={() => this.setState({ isShowPlanMeetup: false })}>
          <SetPlanMeetup
            closeModal={() => {
              this.setState({ isShowPlanMeetup: false });
            }}
            setLocation={() => {
              this.setState({ isShowPlanMeetup: false });
              this.props.onSend([{ _id: 1, text: 'Set Plan Meetup Done', system: true }]);
            }}
          />
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  renderIcon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  renderIcon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};
