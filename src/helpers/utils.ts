import {Alert, PermissionsAndroid} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCameraAndAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export const requestCameraAndAudioPermissionIOS = async () => {
  try {
    const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
    const micStatus = await check(PERMISSIONS.IOS.MICROPHONE);

    if (cameraStatus === RESULTS.BLOCKED || micStatus === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Please go to Settings and enable camera and microphone permissions for this app.',
      );
    } else {
      const cameraGranted = await request(PERMISSIONS.IOS.CAMERA);
      const micGranted = await request(PERMISSIONS.IOS.MICROPHONE);

      if (cameraGranted === RESULTS.GRANTED && micGranted === RESULTS.GRANTED) {
        console.log('You can use the cameras & mic');
      } else {
        console.log('Permission denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};
