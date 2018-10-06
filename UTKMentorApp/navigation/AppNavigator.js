import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import AuthNavigator from './AuthNavigator';
import AppStack from './AppStack';

export default createSwitchNavigator({
  Auth: AuthNavigator,
  App: AppStack,
});
