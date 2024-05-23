import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/Home/Index';
import Chunking from './src/screens/chunking';
import AudioRecorder from './src/screens/Audio/Index';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AudioRecorder">
        <Stack.Screen name="VideoChat" component={HomeScreen} />
        <Stack.Screen name="Chunking" component={Chunking} />
        <Stack.Screen name="AudioRecorder" component={AudioRecorder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
