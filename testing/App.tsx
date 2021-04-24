import 'react-native-gesture-handler'
import * as React from 'react'
import { Image, Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as Speech from 'expo-speech'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
 
import * as signs from './assets/all-data.json';
import { setStatusBarHidden } from 'expo-status-bar'

import * as signdata from './assets/all-data.json';



function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.tinyLogo}><Image style={styles.image} source={require('./assets/adaptive-icon.png',)} /></View>
      <View><TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dictation')}><Text style={{color: 'white', fontWeight: 'bold'}}>START</Text></TouchableOpacity></View>
    </View>
  );
}

function DictationScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
      <View style={{marginBottom: 50}}>
          <View><TouchableOpacity style={styles.button} /*onPress={this.NativeSpeech}*/><Text style={{color: 'white', fontWeight: 'bold'}}>START</Text></TouchableOpacity></View>
          <View><TouchableOpacity style={styles.button} /*onPress={this.NativeSpeech}*/><Text style={{color: 'white', fontWeight: 'bold'}}>REPEAT</Text></TouchableOpacity></View>
      </View>
      <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold',marginBottom:5}}>Current</Text>
          <Text style={{marginBottom:20}}>Current sign temp. text, change with variable current or whatever later</Text>
          <Text style={{fontWeight: 'bold',marginBottom:5}}>Previous</Text>
          <Text>Previous sign temp. text, change with variable previous or whatever later</Text>
        </View>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dictation" component={DictationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
    button: {
      alignItems:'center', 
      borderRadius: 10,  
      backgroundColor: '#FF5000', 
      paddingLeft: 100, 
      paddingRight:100,
      paddingTop:10,
      paddingBottom:10,
      marginBottom: 10
    },
    image: {
      marginLeft: 10,
      marginRight: 10,
      width: 500,
      height: 500,
    },
    tinyLogo: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginBottom: 30
    }
  });
 
//export default NativeSpeech