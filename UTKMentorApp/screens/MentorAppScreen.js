import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native';

import Amplify, { Auth, API } from 'aws-amplify';

export default class MentorApplication extends Component {
  state = {
    name: '',
    role: ''
  }

  render () {
    return (
      <Text>Hey Mentor</Text>
    );
  }
}
