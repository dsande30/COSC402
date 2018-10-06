import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen'

const AppStack = createStackNavigator({
  Home: HomeScreen,
});

export default AppStack;
