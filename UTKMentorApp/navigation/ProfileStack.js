import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import ProfileScreen from '../screens/ProfileScreen';
import GoalScreen from '../screens/GoalScreen';
import CalendarScreen from '../screens/CalendarScreen';

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Goals: GoalScreen,
  Calendar: CalendarScreen
});

export default ProfileStack;
