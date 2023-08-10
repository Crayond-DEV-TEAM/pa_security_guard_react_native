import messaging from '@react-native-firebase/messaging';

import { onDisplayNotificationFun } from './notificationHandler';

export default async (remoteMessage) => {
  messaging().onMessage(async (message) => {
    onDisplayNotificationFun(message);
  });
  // Perform tasks, update data, show notifications, etc.
  // Note: This function runs in the background, so avoid UI-related actions.
};