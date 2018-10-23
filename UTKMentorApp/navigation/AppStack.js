import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen'
import MenteeAppScreen from '../screens/MenteeAppScreen'
import MentorAppScreen from '../screens/MentorAppScreen'

const AppStack = createStackNavigator({
  Home: HomeScreen,
  MenteeApp: MenteeAppScreen,
  MentorApp: MentorAppScreen
});

export default AppStack;
