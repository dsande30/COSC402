import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Picker
} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);
console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isAuthenticated: false
  }
  render() {
    return (
      <AppNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
