import {Alert, Platform} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

export async function requestCameraPermission() {
  try {
    let CameraPermission = null;
    switch (Platform.OS) {
      case 'android':
        CameraPermission = PERMISSIONS.ANDROID.CAMERA;
        break;
      case 'ios':
        CameraPermission = PERMISSIONS.IOS.CAMERA;
        break;
      default:
        return;
    }
    if (!CameraPermission) return null;

    const response = await check(CameraPermission);
    console.log(response)
    if (response === RESULTS.GRANTED) return true;
    else {
      const result = await request(CameraPermission);
      if (result === RESULTS.GRANTED) return true;
      else {
        console.log(result)
        Alert.alert(
          'Permission Denied',
          'Need Camera Permissions to continue',
          [{text: 'OK', onPress: () => openSettings()}],
          {cancelable: false},
        );
      }
    }
  } catch (err) {
    console.warn(err);
  }
}

export async function requestMicrophonePermission() {
    try {
      let MicrophonePermission = null;
      switch (Platform.OS) {
        case 'android':
          MicrophonePermission = PERMISSIONS.ANDROID.RECORD_AUDIO;
          break;
        case 'ios':
          MicrophonePermission = PERMISSIONS.IOS.MICROPHONE;
          break;
        default:
          return;
      }
      if (!MicrophonePermission) return null;
  
      const response = await check(MicrophonePermission);
      if (response === RESULTS.GRANTED) return true;
      else {
        const result = await request(MicrophonePermission);
        if (result === RESULTS.GRANTED) return true;
        else {
          Alert.alert(
            'Permission Denied',
            'Need Microphone Permissions to continue',
            [{text: 'OK', onPress: () => openSettings()}],
            {cancelable: false},
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }
  