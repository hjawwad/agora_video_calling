import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface RoomFormProps {
  onDone: (name: string, roomName: string) => void;
  buttonText: string;
}

const RoomForm: React.FC<RoomFormProps> = ({onDone, buttonText}) => {
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleStartRoom = () => {
    onDone(name, roomName);
    setName('');
    setRoomName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Room Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter room name"
        value={roomName}
        onChangeText={setRoomName}
      />
      <TouchableOpacity style={styles.button} onPress={handleStartRoom}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoomForm;
