// import React, {useState, useEffect} from 'react';
// import {View, Button, PermissionsAndroid, Platform, Alert} from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import RNFS from 'react-native-fs';
// import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

// const audioRecorderPlayer = new AudioRecorderPlayer();

// const App: React.FC = () => {
//   const [recording, setRecording] = useState<boolean>(false);
//   const [recordingPath, setRecordingPath] = useState<string | null>(null);
//   const [recordingChunks, setRecordingChunks] = useState<string[]>([]);

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         ]);

//         const allPermissionsGranted = Object.values(granted).every(
//           status => status === PermissionsAndroid.RESULTS.GRANTED,
//         );

//         if (!allPermissionsGranted) {
//           Alert.alert(
//             'Permissions required',
//             'All permissions are required to use this app.',
//           );
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     } else {
//       try {
//         const microphoneResult = await request(PERMISSIONS.IOS.MICROPHONE);
//         const storageResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);

//         if (
//           microphoneResult !== RESULTS.GRANTED ||
//           storageResult !== RESULTS.GRANTED
//         ) {
//           Alert.alert(
//             'Permissions required',
//             'All permissions are required to use this app.',
//           );
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };

//   const getNewFilePath = (ext: string = 'mp3'): string => {
//     const timestamp = new Date().getTime();
//     return `${RNFS.DocumentDirectoryPath}/${timestamp}_record.${ext}`;
//   };

//   const startRecording = async () => {
//     const path = getNewFilePath();
//     setRecordingPath(path);
//     setRecording(true);

//     await audioRecorderPlayer.startRecorder(path);
//     audioRecorderPlayer.addRecordBackListener(async e => {
//       console.log('coming');
//       if (
//         Math.floor(e.currentPosition / 1000) % 6 === 0 &&
//         Math.floor(e.currentPosition / 1000) !== 0
//       ) {
//         saveChunk(path);
//       }
//       return;
//     });
//   };

//   const saveCompleteRecording = async (
//     inputPath: string,
//     outputPath: string,
//   ) => {
//     try {
//       const ffmpegCommand = `-i ${inputPath} -c copy ${outputPath}`;
//       console.log('FFmpeg Command:', ffmpegCommand); // Log the FFmpeg command for debugging
//       await FFmpegKit.execute(ffmpegCommand);
//     } catch (error) {
//       console.error('Error saving complete recording:', error);
//     }
//   };

//   const saveChunk = async (path: string) => {
//     try {
//       const outputPath = `${path}_chunk${recordingChunks.length + 1}.m4a`;
//       const ffmpegCommand = `-i ${path} -ss ${
//         recordingChunks.length * 6
//       } -t 6 -c copy ${outputPath}`;
//       console.log('FFmpeg Command:', ffmpegCommand);
//       await FFmpegKit.execute(ffmpegCommand);
//       setRecordingChunks(prevChunks => [...prevChunks, outputPath]);
//     } catch (error) {
//       console.error('Error saving chunk:', error);
//     }
//   };

//   //   const saveChunk = async (path: string) => {
//   //     const outputPath = `${path}_chunk${recordingChunks.length + 1}.m4a`;
//   //     console.log({outputPath});
//   //     const response = await FFmpegKit.execute(
//   //       `-i ${path} -ss ${recordingChunks.length * 6} -t 6 -c copy ${outputPath}`,
//   //     );
//   //     console.log({response});
//   //     setRecordingChunks(prevChunks => [...prevChunks, outputPath]);
//   //   };

//   const stopRecording = async () => {
//     setRecording(false);
//     await audioRecorderPlayer.stopRecorder();
//     audioRecorderPlayer.removeRecordBackListener();
//   };

//   return (
//     <View>
//       <Button
//         title="Start Recording"
//         onPress={startRecording}
//         disabled={recording}
//       />
//       <Button
//         title="Stop Recording"
//         onPress={stopRecording}
//         disabled={!recording}
//       />
//     </View>
//   );
// };

// export default App;

// import React, {useState, useEffect, useRef} from 'react';
// import {View, Button, PermissionsAndroid, Platform, Alert} from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import RNFS from 'react-native-fs';
// import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
// import createAgoraRtcEngine, {
//   ChannelProfileType,
//   IRtcEngine,
// } from 'react-native-agora';

// const audioRecorderPlayer = new AudioRecorderPlayer();

// const App: React.FC = () => {
//   let engine = useRef<IRtcEngine | null>(null);
//   const [recording, setRecording] = useState<boolean>(false);
//   const [recordingPath, setRecordingPath] = useState<string | null>(null);
//   const [recordingComplete, setRecordingComplete] = useState<boolean>(false);

//   const init = async () => {
//     engine.current = await createAgoraRtcEngine();

//     const deviceInfo = engine.current?.getAudioDeviceInfo();
//     console.log({deviceInfo});
//     const deviceManager = engine.current?.getAudioDeviceManager();
//     // const audioDevices = deviceManager.enumerateRecordingDevices() || [];
//     console.log('---');
//   };

//   useEffect(() => {
//     requestPermissions();
//     init();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         ]);

//         const allPermissionsGranted = Object.values(granted).every(
//           status => status === PermissionsAndroid.RESULTS.GRANTED,
//         );

//         if (!allPermissionsGranted) {
//           Alert.alert(
//             'Permissions required',
//             'All permissions are required to use this app.',
//           );
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     } else {
//       try {
//         const microphoneResult = await request(PERMISSIONS.IOS.MICROPHONE);
//         const storageResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);

//         if (
//           microphoneResult !== RESULTS.GRANTED ||
//           storageResult !== RESULTS.GRANTED
//         ) {
//           Alert.alert(
//             'Permissions required',
//             'All permissions are required to use this app.',
//           );
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };

//   const getNewFilePath = (ext: string = 'm4a'): string => {
//     const timestamp = new Date().getTime();
//     return `${RNFS.DocumentDirectoryPath}/${timestamp}_record.${ext}`;
//   };

//   const startRecording = async () => {
//     const path = getNewFilePath();
//     setRecordingPath(path);
//     setRecording(true);
//     setRecordingComplete(false);

//     await audioRecorderPlayer.startRecorder(path);
//   };

//   const stopRecording = async () => {
//     setRecording(false);
//     await audioRecorderPlayer.stopRecorder();
//     setRecordingComplete(true);

//     if (recordingPath) {
//       console.log('here');
//       const outputPath = `${recordingPath}_complete.m4a`;
//       await saveCompleteRecording(recordingPath, outputPath);
//     }
//   };

//   const saveCompleteRecording = async (
//     inputPath: string,
//     outputPath: string,
//   ) => {
//     try {
//       const ffmpegCommand = `-i ${inputPath} -c copy ${outputPath}`;
//       console.log('FFmpeg Command:', ffmpegCommand);

//       FFmpegKit.execute(ffmpegCommand).then(async session => {
//         const returnCode = await session.getReturnCode();

//         if (ReturnCode.isSuccess(returnCode)) {
//           console.log('Success');
//         } else if (ReturnCode.isCancel(returnCode)) {
//           console.log('CANCEL');
//         } else {
//           console.log('ERROR');
//         }
//       });
//     } catch (error) {
//       console.error('Error saving complete recording:', error);
//     }
//   };

//   return (
//     <View>
//       <Button
//         title="Start Recording"
//         onPress={startRecording}
//         disabled={recording}
//       />
//       <Button
//         title="Stop Recording"
//         onPress={stopRecording}
//         disabled={!recording}
//       />
//     </View>
//   );
// };

// export default App;
import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import Sound from 'react-native-sound';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  const [recordingChunks, setRecordingChunks] = useState<string[]>([]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
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
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      try {
        const microphoneResult = await request(PERMISSIONS.IOS.MICROPHONE);
        const storageResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);

        if (
          microphoneResult !== RESULTS.GRANTED ||
          storageResult !== RESULTS.GRANTED
        ) {
          Alert.alert(
            'Permissions required',
            'All permissions are required to use this app.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getNewFilePath = (ext: string = 'm4a'): string => {
    const timestamp = new Date().getTime();
    return `${RNFS.DocumentDirectoryPath}/${timestamp}_record.${ext}`;
  };

  const startRecording = async () => {
    const path = getNewFilePath();
    setRecordingPath(path);
    setRecording(true);

    await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener(async e => {
      if (
        Math.floor(e.currentPosition / 1000) % 6 === 0 &&
        Math.floor(e.currentPosition / 1000) !== 0
      ) {
        await stopAndSaveChunk();
        startRecording(); // Start a new 6-second recording
      }
      return;
    });
  };

  const stopAndSaveChunk = async () => {
    if (!recordingPath) return;

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    const mp3Path = await convertToMp3(recordingPath);
    setRecordingChunks(prevChunks => [...prevChunks, mp3Path]);
  };

  const convertToMp3 = async (filePath: string): Promise<string> => {
    const mp3FilePath = filePath
      .replace('.m4a', '.mp3')
      .replace('.mp4', '.mp3');
    await FFmpegKit.execute(
      `-i ${filePath} -codec:a libmp3lame -qscale:a 2 ${mp3FilePath}`,
    );
    return mp3FilePath;
  };

  const stopRecording = async () => {
    setRecording(false);
    await stopAndSaveChunk();
  };

  const playRecording = (path: string) => {
    const sound = new Sound(path, '', (error: any) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      sound.play((success: any) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <Button
        title="Start Recording"
        onPress={startRecording}
        disabled={recording}
      />
      <Button
        title="Stop Recording"
        onPress={stopRecording}
        disabled={!recording}
      />
      <ScrollView style={{marginTop: 20, width: '100%'}}>
        {recordingChunks.map((chunk, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => playRecording(chunk)}
            style={{marginBottom: 10}}>
            <Text>Play Recording {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default App;
