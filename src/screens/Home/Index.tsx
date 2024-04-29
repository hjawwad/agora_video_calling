import {View, Text, TouchableOpacity, Platform, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
} from 'react-native-agora';

import {styles} from './styles';
import RoomForm from '../../components/RoomForm/Index';
import {
  requestCameraAndAudioPermission,
  requestCameraAndAudioPermissionIOS,
} from '../../helpers/utils';

const config = {
  appId: 'ca953841bcfe4bf094504b8aa6d56c7c',
  token:
    '007eJxTYAj6f7D4tMZWhu8887mtdBvvJvI3uRxdfFTytH5oF8P5gzUKDMmJlqbGFiaGSclpqSZJaQaWJqYGJkkWiYlmKaZmyebJ7W76aQ2BjAy3VDmZGBkgEMTnZwhJLS7JzEuPT85IzMtLzWFgAACDTyKc',
  channelName: 'Testing_channel',
};

const HomeScreen = () => {
  let engine = useRef<IRtcEngine | null>(null);

  // New state variables for mute status
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [isJoined, setJoined] = useState<boolean>(false);

  const init = async () => {
    engine.current = await createAgoraRtcEngine();
    engine.current.initialize({appId: config.appId});
    engine.current.setChannelProfile(
      ChannelProfileType.ChannelProfileLiveBroadcasting,
    );

    engine.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    engine.current.enableVideo();
    engine.current.startPreview();

    engine.current.addListener('onUserJoined', (connection, uid) => {
      console.log('UserJoined', connection, uid);

      if (peerIds.indexOf(uid) === -1) {
        setPeerIds(prev => [...prev, uid]);
      }
    });

    engine.current.addListener('onUserOffline', (connection, uid) => {
      console.log('UserOffline', connection, uid);
      setPeerIds(prev => prev.filter(id => id !== uid));
    });

    engine.current.addListener('onJoinChannelSuccess', connection => {
      console.log('coming here');

      console.log('JoinChannelSuccess', connection);
      setJoined(true);
    });

    engine.current.addListener('onError', error => {
      console.log('Getting en error', error);
    });
  };

  const startCall = async () => {
    await init();
    await engine.current?.joinChannel(config.token, config.channelName, 0, {});
  };

  const endCall = async () => {
    engine.current?.leaveChannel();
    engine.current?.removeAllListeners();
    try {
      engine.current?.release();
    } catch (e) {
      console.log('release error:', e);
    }

    setPeerIds([]);
    setJoined(false);
  };

  // Function to toggle video mute
  const toggleVideoMute = () => {
    const newValue = !isVideoMuted;
    setIsVideoMuted(newValue);
    engine.current?.muteLocalVideoStream(newValue);
  };

  // Function to toggle audio mute
  const toggleAudioMute = () => {
    const newValue = !isAudioMuted;
    setIsAudioMuted(newValue);
    engine.current?.muteLocalAudioStream(newValue);
  };

  const renderVideos = () => {
    return (
      <View style={styles.fullView}>
        <RtcSurfaceView
          style={styles.max}
          canvas={{
            uid: 0,
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
              paddingHorizontal: 100,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={endCall}
              style={{
                width: 50,
                height: 50,
                backgroundColor: 'red',
                borderRadius: 50,
              }}></TouchableOpacity>
            <TouchableOpacity
              onPress={toggleVideoMute}
              style={{
                width: 50,
                height: 50,
                backgroundColor: isVideoMuted ? 'green' : 'red',
                borderRadius: 50,
              }}
            />
            <TouchableOpacity
              onPress={toggleAudioMute}
              style={{
                width: 50,
                height: 50,
                backgroundColor: isAudioMuted ? 'green' : 'red',
                borderRadius: 50,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
