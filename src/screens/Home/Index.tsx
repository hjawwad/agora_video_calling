// HomeScreen.tsx
import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Modal} from 'react-native';
import {styles} from './styles';

import RoomForm from '../../components/RoomForm/Index';

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');

  const onDone = (name: string, roomName: string) => {
    setIsVisible(false);
  };

  const onRoomCreate = () => {
    setButtonText('Create Room');
    setIsVisible(true);
  };

  const onRoomJoin = () => {
    setButtonText('Join Room');
    setIsVisible(true);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onRoomCreate()}>
        <Text style={styles.buttonText}>Create Room</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRoomJoin()}>
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Record Video pressed')}>
        <Text style={styles.buttonText}>Record Video</Text>
      </TouchableOpacity>

      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <RoomForm onDone={onDone} buttonText={buttonText} />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
