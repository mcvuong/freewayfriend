import React from 'react'
import { Button } from 'react-native'
import * as Speech from 'expo-speech'
 
import * as signdata from './assets/all-data.json';

const NativeSpeech = () => (
 <Button title="Speak!" onPress={() => Speech.speak('Hello World!')} />
);
 
export default NativeSpeech