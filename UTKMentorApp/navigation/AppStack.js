import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen'
import MenteeAppScreen from '../screens/MenteeAppScreen'
import MentorAppScreen from '../screens/MentorAppScreen'

export const MenteeForm = createStackNavigator({
  MenteeForm: MenteeAppScreen
});

export const MentorForm = createStackNavigator({
  MentorForm: MentorAppScreen
});

export default {MenteeForm, MentorForm};
