import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import AuthNavigator from './AuthNavigator';
import {MenteeForm} from './AppStack';
import {MentorForm} from './AppStack';
import ProfileStack from './ProfileStack';

export default createSwitchNavigator({
  Auth: AuthNavigator,
  Profile: ProfileStack,
  MenteeForm: MenteeForm,
  MentorForm: MentorForm
});
