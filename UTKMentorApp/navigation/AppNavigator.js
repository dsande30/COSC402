import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import AuthNavigator from './AuthNavigator';
import ProfileStack from './ProfileStack';

export default createSwitchNavigator({
  Auth: AuthNavigator,
  Profile: ProfileStack,
});
