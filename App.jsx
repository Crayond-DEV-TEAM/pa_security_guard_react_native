// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */


// App.jsx
import React, {useState, useEffect} from 'react';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { onDisplayNotificationFun } from './src/utils/notificationHandler';
import { firebase } from '@react-native-firebase/app';

import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  PermissionsAndroid
} from 'react-native';

import WebScreen from "./src/screen/webScreen";
const App = () => {

  const [token, setToken] = useState("");
  const [webUrl, setWebUrl] = React.useState("https://dev-security-guard-v2.propertyautomate.com/login");

  useEffect(() => {
    if(token){
    setWebUrl(`https://dev-security-guard-v2.propertyautomate.com/login?deviceToken=${token}`);
    }
  }, [token]);

  useEffect(() => {
    setupNotifications();
    permission()
  }, []);

  const permission=async()=>{

    const grantedMic = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Audio Permission",
        message: "App needs access to your audio/microphone",
        neutralButtonLabel: "Ask Me Later",
        negativeButtonLabel: "Cancel",
        positiveButtonLabel: "OK"
      }
    );
  
    if (grantedMic === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Microphone");
    } else {
      console.log("Microphone permission denied");
    } 
    
    
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message:
          "App needs access to your camera " +
          "so others can see you.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  
 
  }

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      // eslint-disable-next-line no-undef
      SplashScreen.hide();
    }
  }, []);

  
  
  const setupNotifications = async () => {
    // Check if the app has been granted notification permissions    
    
    const settings = await notifee.getNotificationSettings();
    // await notifee.requestPermission();
    await messaging().registerDeviceForRemoteMessages();
    setupFCM();
    

    if (settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED) {
      // Ask for notification permission if it's not determined yet
      const permissionResult = await notifee.requestPermission();

      if (!permissionResult) {
        return;
      }
    } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      return;
    }
  };

  const setupFCM = async () => {
    // Get the FCM token for this device
    // 
    const enabled = await firebase.messaging().hasPermission();
    console.log('FCM Token:', token);
    if (enabled) {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      setToken(token);
    }

    // Listen for incoming FCM messages when the app is in the foreground
    messaging().onMessage(async (message) => {
      // console.log('FCM Message received:', message);
      onDisplayNotificationFun(message);
    });

    // Listen for incoming FCM messages when the app is in the background or terminated
    messaging().setBackgroundMessageHandler(async (message) => {
        onDisplayNotificationFun(message);
    });


      // For handling notification press events in the foreground
      notifee.onForegroundEvent(async ({type, detail}) => {
        let url = '';
        if (detail?.pressAction?.id === 'rejected') {
          url = `${detail?.notification?.data?.redirect_url}&status=rejected`;
        } else if (detail?.pressAction?.id === 'accept') {
          url = `${detail?.notification?.data?.redirect_url}&status=accept`;
        } else if (type === 1 && !detail?.pressAction?.id) {
          url = `${detail?.notification?.data?.redirect_url}`;
        }
        console.log(url, 'url');
  
        if (url?.length > 0) {
          setWebUrl(url);
        }
  
        console.log('Notification Press in Foreground:', type);
      });
  
      // For handling notification press events in the background
      notifee.onBackgroundEvent(async ({type, detail}) => {
  
  
        let url = '';
        if (detail?.pressAction?.id === 'rejected') {
          url = `${detail?.notification?.data?.redirect_url}&status='rejected`;
        } else if (detail?.pressAction?.id === 'accept') {
          url = `${detail?.notification?.data?.redirect_url}&status='accept`;
        } else if (type === 1 && !detail?.pressAction?.id) {
          url = `${detail?.notification?.data?.redirect_url}`;
        }
  
        if (url?.length > 0) {
          setWebUrl(url);
        }
  
        console.log('Notification Press in background:', type);
      });

  };

  return (
    <WebScreen webUrl={webUrl}/>
  );
};

export default App;