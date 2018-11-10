import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import ProfileScreen from '../screens/ProfileScreen';
import GoalScreen from '../screens/GoalScreen';
import SearchScreen from '../screens/SearchScreen';
import IndividualScreen from '../screens/IndividualScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MenteeAppScreen from '../screens/MenteeAppScreen';
import MentorAppScreen from '../screens/MentorAppScreen';

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  MenteeForm: MenteeAppScreen,
  MentorForm: MentorAppScreen,
  Individual: IndividualScreen,
  Search: SearchScreen,
  Goals: GoalScreen,
  Calendar: CalendarScreen
});

export default ProfileStack;
