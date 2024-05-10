import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  ExternalVideoSourceType,
  IRtcEngine,
  RtcSurfaceView,
  VideoBufferType,
  VideoPixelFormat,
} from 'react-native-agora';

import {
  Camera,
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
import {useSharedValue} from 'react-native-worklets-core';

const config = {
  appId: 'ca953841bcfe4bf094504b8aa6d56c7c',
  token:
    '007eJxTYDjUGPrp4VVFSx/59ZzRPd2bb/y7EGT0cPLqO+e32//IndelwJCcaGlqbGFimJSclmqSlGZgaWJqYJJkkZholmJqlmyefCbDOq0hkJGh7+NBRkYGCATx+RlCUotLMvPS450zEvPyUnMYGADnGyd/',
  channelName: 'Testing_Channel',
};

const HomeScreen = () => {
  let engine = useRef<IRtcEngine | null>(null);
  const camera = useRef<Camera>(null);
  let latestFrame = useRef<Uint8Array>();

  const sharedlatestFrame = useSharedValue(new Uint8Array(0));

  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [record, setRecord] = useState<string>('start');
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [isJoined, setJoined] = useState<boolean>(false);
  const [videoTrackId, setVideoTrackId] = useState<number>();

  const device: any = useCameraDevice('front');

  const init = async () => {
    engine.current = await createAgoraRtcEngine();
    engine.current?.initialize({
      appId: config.appId,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    engine.current
      ?.getMediaEngine()
      .setExternalVideoSource(true, false, ExternalVideoSourceType.VideoFrame);

    engine.current?.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    engine.current?.enableVideo();
    engine.current?.startPreview();

    engine.current?.addListener('onUserJoined', (connection, uid) => {
      console.log('UserJoined', connection, uid);

      if (peerIds.indexOf(uid) === -1) {
        setPeerIds(prev => [...prev, uid]);
      }
    });

    engine.current?.addListener('onUserOffline', (connection, uid) => {
      console.log('UserOffline', connection, uid);
      setPeerIds(prev => prev.filter(id => id !== uid));
    });

    engine.current?.addListener('onJoinChannelSuccess', connection => {
      console.log('coming here');

      console.log('JoinChannelSuccess', connection);
      setJoined(true);
    });

    engine.current?.addListener('onError', error => {
      Alert.alert(`Getting an error ${error}`);
    });

    engine.current.addListener(
      'onFirstLocalVideoFrame',
      (uid, width, height, elapsed) => {
        console.log(
          'First local video frame received:',
          uid,
          width,
          height,
          elapsed,
        );
      },
    );

    engine.current?.addListener(
      'onFirstRemoteVideoFrame',
      (uid, width, height, elapsed) => {
        console.log(
          'First remote video frame received:',
          uid,
          width,
          height,
          elapsed,
        );
      },
    );

    ////// Using useRef it's value is getting undefine /////////
    setInterval(() => {
      //uncomment for useReff

      // if (latestFrame) {
      //   console.log('latestFrame = ', latestFrame.current);
      // }

      console.log(
        `latestFrame at 0,0: RGB(${sharedlatestFrame.value[0]}, ${sharedlatestFrame.value[1]}, ${sharedlatestFrame.value[2]})`,
      );
    }, 100);
  };

  const startCall = async () => {
    await init();
    const videoTrackID = engine.current?.createCustomVideoTrack();
    await engine.current?.joinChannel(config.token, config.channelName, 0, {
      customVideoTrackId: videoTrackID,
      publishCustomVideoTrack: true,
    });
    setVideoTrackId(videoTrackId);
  };

  const endCall = async () => {
    engine.current?.leaveChannel();
    engine.current?.removeAllListeners();
    engine.current?.destroyCustomVideoTrack(videoTrackId!);
    try {
      engine.current?.release();
    } catch (e) {
      console.log('release error:', e);
    }

    setPeerIds([]);
    setJoined(false);
  };

  const toggleVideoMute = () => {
    if (!isVideoMuted) {
      engine.current?.disableVideo();
    } else {
      engine.current?.enableVideo();
    }
    setIsVideoMuted(!isVideoMuted);
  };

  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);

    if (!isAudioMuted) {
      engine.current?.disableAudio();
    } else {
      engine.current?.enableAudio;
    }
  };

  const toggleSwitchCamer = () => {
    engine.current?.switchCamera();
  };

  const startRecording = () => {
    console.log('start recording');

    camera.current?.startRecording({
      onRecordingFinished: video => console.log(video),
      onRecordingError: error => console.error(error),
    });
    setRecord('stop');
  };

  const stopRecording = () => {
    console.log('stop recording');
    setRecord('start');
    camera.current?.stopRecording();
  };

  const format = useCameraFormat(device, [
    {photoResolution: {width: 1280, height: 720}},
  ]);

  const renderVideos = () => {
    return (
      <View style={styles.fullView}>
        <Camera
          ref={camera}
          frameProcessor={frameProcessor}
          format={format}
          style={styles.max}
          pixelFormat="rgb"
          device={device}
          isActive={true}
          video={true}
          audio={true}
        />
        <RtcSurfaceView
          style={styles.max}
          canvas={{
            uid: videoTrackId,
          }}
        />
        {renderRemoteVideos()}
      </View>
    );
  };

  const renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={styles.padding}
        horizontal={true}>
        {peerIds.map(id => {
          return (
            <RtcSurfaceView
              style={styles.remote}
              canvas={{
                uid: id,
              }}
              key={id}
            />
          );
        })}
      </ScrollView>
    );
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    if (frame.pixelFormat === 'rgb') {
      const buffer = frame.toArrayBuffer();
      const data = new Uint8Array(buffer);

      console.log(`Pixel at 0,0: RGB(${data[0]}, ${data[1]}, ${data[2]})`);
      // latestFrame.current = data;
      sharedlatestFrame.value = data;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission();
    } else if (Platform.OS === 'ios') {
      requestCameraAndAudioPermissionIOS();
    }
  }, []);
  return (
    <View>
      {!isJoined ? (
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
      )}
    </View>
  );
};

export default HomeScreen;
