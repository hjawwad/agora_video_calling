import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
// import {
//   AudioFileRecordingType,
//   AudioRecordingQualityType,
//   ChannelProfileType,
//   ClientRoleType,
//   createAgoraRtcEngine,
//   ExternalVideoSourceType,
//   IRtcEngine,
//   RtcSurfaceView,
//   VideoBufferType,
//   VideoPixelFormat,
//   VideoSourceType,
// } from 'react-native-agora';

import RNFS from 'react-native-fs';
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;

import {
  Camera,
  FrameInternal,
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';

import {styles} from './styles';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  requestCameraAndAudioPermission,
  requestCameraAndAudioPermissionIOS,
} from '../../helpers/utils';
import {createResizePlugin} from 'vision-camera-resize-plugin';
import {recordFrame} from './RecordFramesPlugin';
import {sendFrame} from './SendFrameToAgoraPlugin';

const config = {
  appId: 'ca953841bcfe4bf094504b8aa6d56c7c',
  token:
    '007eJxTYPh/rjBvsr5QAt/Szfdqub8lcc56Zmvf9iLGZrtv4YznN58pMCQnWpoaW5gYJiWnpZokpRlYmpgamCRZJCaapZiaJZsne/oEpDUEMjKUblnKwAiFID4/Q0hqcUlmXnq8c0ZiXl5qDgMDACspJOs=',
  channelName: 'Testing_Channel',
};

const HomeScreen = () => {
  // let engine = useRef<IRtcEngine | null>(null);
  const camera = useRef<Camera>(null);
  const customVideoTrackId = useRef<number>();
  const {resize} = createResizePlugin();

  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const [record, setRecord] = useState<string>('start');
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [isJoined, setJoined] = useState<boolean>(false);

  const [documentsFolder, setDocumentsFolder] = useState<string>('');

  const device: any = useCameraDevice('front');

  // const init = async () => {
  //   engine.current = await createAgoraRtcEngine();
  //   engine.current?.initialize({
  //     appId: config.appId,
  //     channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
  //   });

  //   engine.current
  //     ?.getMediaEngine()
  //     .setExternalVideoSource(true, false, ExternalVideoSourceType.VideoFrame);

  //   engine.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);

  //   engine.current?.enableVideo();
  //   engine.current?.enableAudio();
  //   engine.current?.startPreview();

  //   engine.current?.addListener('onUserJoined', (connection, uid) => {
  //     console.log('UserJoined', connection, uid);

  //     if (peerIds.indexOf(uid) === -1) {
  //       setPeerIds(prev => [...prev, uid]);
  //     }
  //   });

  //   engine.current?.addListener('onUserOffline', (connection, uid) => {
  //     console.log('UserOffline', connection, uid);
  //     setPeerIds(prev => prev.filter(id => id !== uid));
  //   });

  //   engine.current?.addListener('onJoinChannelSuccess', connection => {
  //     console.log('coming here');

  //     console.log('JoinChannelSuccess', connection);
  //     setJoined(true);
  //   });

  //   engine.current?.addListener('onError', error => {
  //     Alert.alert(`Getting an error ${error}`);
  //   });

  //   engine.current.addListener(
  //     'onFirstLocalVideoFrame',
  //     (uid, width, height, elapsed) => {
  //       console.log(
  //         'First local video frame received:',
  //         uid,
  //         width,
  //         height,
  //         elapsed,
  //       );
  //     },
  //   );

  //   engine.current?.addListener(
  //     'onFirstRemoteVideoFrame',
  //     (uid, width, height, elapsed) => {
  //       console.log(
  //         'First remote video frame received:',
  //         uid,
  //         width,
  //         height,
  //         elapsed,
  //       );
  //     },
  //   );
  // };

  const uid = 649;

  // const startCall = async () => {
  //   await init();
  //   customVideoTrackId.current = engine.current?.createCustomVideoTrack();

  //   console.log('customVideoTrackId.current', customVideoTrackId.current);
  //   const response = await engine.current?.joinChannel(
  //     config.token,
  //     config.channelName,
  //     uid,
  //     {
  //       publishCustomVideoTrack: true,
  //       customVideoTrackId: customVideoTrackId.current,
  //     },
  //   );
  //   console.log({response});
  // };

  // const endCall = async () => {
  //   engine.current?.leaveChannel();
  //   engine.current?.removeAllListeners();
  //   engine.current?.destroyCustomVideoTrack(customVideoTrackId.current!);
  //   try {
  //     engine.current?.release();
  //   } catch (e) {
  //     console.log('release error:', e);
  //   }

  //   setPeerIds([]);
  //   setJoined(false);
  // };

  // const toggleVideoMute = () => {
  //   if (!isVideoMuted) {
  //     engine.current?.disableVideo();
  //   } else {
  //     engine.current?.enableVideo();
  //   }
  //   setIsVideoMuted(!isVideoMuted);
  // };

  // const toggleAudioMute = () => {
  //   setIsAudioMuted(!isAudioMuted);

  //   if (!isAudioMuted) {
  //     engine.current?.disableAudio();
  //   } else {
  //     engine.current?.enableAudio;
  //   }
  // };

  // const toggleSwitchCamer = () => {
  //   engine.current?.switchCamera();
  // };

  // const generateNewFile = async (filePath: string) => {
  //   const audioData = 'Simulated audio data for AAC format.';

  //   try {
  //     RNFS.writeFile(filePath, audioData, 'base64')
  //       .then(() => {
  //         const recRes = engine.current?.startAudioRecording({
  //           filePath: filePath,
  //           encode: true,
  //           sampleRate: 44100,
  //           quality: AudioRecordingQualityType.AudioRecordingQualityLow,
  //           fileRecordingType:
  //             AudioFileRecordingType.AudioFileRecordingPlayback,
  //           recordingChannel: 1,
  //         });

  //         console.log({recRes});
  //       })
  //       .catch(err => {
  //         console.log(err.message);
  //       });
  //   } catch (error) {
  //     console.error('Error creating audio file:', error);
  //   }
  // };

  // const startRecording = () => {
  //   const timestamp = new Date().getTime();
  //   const filePath = `${RNFS.DownloadDirectoryPath}/${timestamp}_record.acc`;
  //   // generateNewFile(filePath);

  //   setRecord('stop');
  // };

  // const stopRecording = () => {
  //   console.log('stop recording');
  //   setRecord('start');
  //   const stopRes = engine.current?.stopAudioRecording();
  //   console.log({stopRes});
  // };

  const format = useCameraFormat(device, [
    {photoResolution: {width: 1280, height: 720}},
  ]);

  // const renderVideos = () => {
  //   return (
  //     <View style={styles.fullView}>
  //       <Camera
  //         ref={camera}
  //         frameProcessor={frameProcessor}
  //         format={format}
  //         fps={24}
  //         pixelFormat="yuv"
  //         preview={false}
  //         device={device}
  //         isActive={true}
  //         video={true}
  //         audio={true}
  //       />
  //       <RtcSurfaceView
  //         style={styles.max}
  //         canvas={{
  //           uid: 0,
  //         }}
  //       />
  //       {renderRemoteVideos()}
  //     </View>
  //   );
  // };

  // const renderRemoteVideos = () => {
  //   console.log({peerIds});
  //   return (
  //     <ScrollView
  //       style={styles.remoteContainer}
  //       contentContainerStyle={styles.padding}
  //       horizontal={true}>
  //       {peerIds.map(id => {
  //         console.log('ID Here', {id});
  //         return (
  //           <RtcSurfaceView
  //             style={styles.remote}
  //             canvas={{
  //               uid: id,
  //             }}
  //             key={id}
  //           />
  //         );
  //       })}
  //     </ScrollView>
  //   );
  // };

  // const pushVideoFrame = Worklets.createRunOnJS(async (resized: any) => {
  //   if (engine.current && customVideoTrackId.current) {
  //     const mediaEngine = engine.current?.getMediaEngine();
  //     if (mediaEngine) {
  //       try {
  //         const response = mediaEngine?.pushVideoFrame(
  //           {
  //             type: VideoBufferType.VideoBufferRawData,
  //             format: VideoPixelFormat.VideoPixelRgba,
  //             buffer: resized,
  //             stride: 50,
  //             height: 100,
  //           },
  //           customVideoTrackId.current,
  //         );
  //         console.log({response});
  //       } catch (error) {
  //         console.error('Error pushing video frame:', error);
  //       }
  //     }
  //   }
  // });

  const frameProcessor = useFrameProcessor((frame: any) => {
    'worklet';

    console.log(recordFrame(frame));

    runAtTargetFps(20, () => {
      'worklet';
      if (frame.pixelFormat === 'yuv') {
        const resized = resize(frame, {
          scale: {
            width: 50,
            height: 100,
          },
          pixelFormat: 'rgba',
          dataType: 'uint8',
        });

        // pushVideoFrame(resized!);
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission();
    } else if (Platform.OS === 'ios') {
      requestCameraAndAudioPermissionIOS();
    }
    setDocumentsFolder(RNFS.DocumentDirectoryPath);
  }, []);

  const onPress = () => {
    CalendarModule.createCalendarEvent('testName', 'testLocation');
  };
  return (
    <View style={{flex: 1}}>
      <Button
        title="Click to invoke your native module!"
        color="#841584"
        onPress={onPress}
      />
      {/* <Camera
        ref={camera}
        frameProcessor={frameProcessor}
        format={format}
        style={{flex: 1}}
        fps={24}
        pixelFormat="yuv"
        device={device}
        isActive={true}
        video={true}
        audio={true}
      /> */}
      {/* {!isJoined ? (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => startCall()}>
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => endCall()}>
            <Text style={styles.buttonText}>End Room</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Record Video pressed')}>
            <Text style={styles.buttonText}>Record Video</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1}}>
          {renderVideos()}

          <View
            style={{
              width: '100%',
              top: 500,
              position: 'absolute',
              alignSelf: 'center',
              flexDirection: 'row',
              paddingHorizontal: 50,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={toggleVideoMute}>
              <FeatherIcon
                name={isVideoMuted ? 'camera-off' : 'camera'}
                size={30}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleAudioMute}>
              <FeatherIcon name={isAudioMuted ? 'mic-off' : 'mic'} size={30} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSwitchCamer}>
              <IoniconsIcon name="camera-reverse-outline" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={endCall}>
              <MaterialIcons name={'call-end'} size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={record === 'start' ? startRecording : stopRecording}>
              <IoniconsIcon
                name={record === 'start' ? 'recording-sharp' : 'recording'}
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
      )} */}
    </View>
  );
};

export default HomeScreen;
