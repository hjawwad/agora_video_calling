import {Alert, PermissionsAndroid} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCameraAndAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);

    const allPermissionsGranted = Object.values(granted).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );

    if (!allPermissionsGranted) {
      Alert.alert(
        'Permissions required',
        'All permissions are required to use this app.',
      );
    } else {
      console.log('Permission Granted');
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
