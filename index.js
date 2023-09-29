/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import HeadlessTask from './src/utils/HeadlessTask';

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundNotificationAction', HeadlessTask);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => HeadlessTask);

AppRegistry.registerComponent(appName, () => App);
