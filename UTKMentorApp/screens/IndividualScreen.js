import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Modal,
  TouchableHighlight,
  Keyboard
} from 'react-native';

import Amplify, { Auth, API } from 'aws-amplify';

export default class Individual extends Component {
  state = {
    user_id: ''
  }
  render () {
    let { navigation } = this.props;
    let user_id = navigation.getParam('user_id', 'NO-ID');
    if (this.state.user_id == '') {
      this.setState({
        user_id: user_id,
      });
    }
    return (
      <Text>Hello, {this.state.user_id} Bio</Text>
    )
  }
}
