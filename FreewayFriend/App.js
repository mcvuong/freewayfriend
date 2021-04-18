import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tts from 'react-native-tts';

import * as signdata from './assets/ryan_data.json';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Beep boop</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Tts.getInitStatus().then(() => {
//   Tts.speak('Hello, world!');
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
