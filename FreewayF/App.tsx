import 'react-native-gesture-handler';
import * as React from 'react';
import { Image, Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as signs from './assets/all-data.json';

const testsigns = {
	data: [
		{"id":59,	"lat":1,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"Emergency Detour E"},
		{"id":510,	"lat":5,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"I390 North Airport Greece"},
		{"id":511,	"lat":7,	"lon":-77.6,	"dir":"N",	"type":"guid",	"value":"Exit 15"},
		{"id":512,	"lat":14,	"lon":-77.6,	"dir":"N",	"type":"guid",	"value":"I590 North Downtown Rochester 1/4 Mile Exit Only"},
		{"id":513,	"lat":18,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"Emergency Detour F"},
		{"id":514,	"lat":26,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"Emergency Detour E"},
		{"id":515,	"lat":29,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"I390 North Airport Greece Ramp 50 MPH"},
		{"id":516,	"lat":38,	"lon":-77.6,	"dir":"N",	"type":"guid",	"value":"Exit 15"},
		{"id":517,	"lat":43,	"lon":-77.6,	"dir":"N",	"type":"guid",	"value":"I590 North Downtown Rochester"},
		{"id":518,	"lat":50,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"Emergency Detour F"},
		{"id":519,	"lat":52,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"Exit 15"},
		{"id":520,	"lat":57,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"Exits 16 B-A"},
		{"id":521,	"lat":62,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"15A East Henrietta Road 15 West Henrietta Road 3/4 Mile"},
		{"id":522,	"lat":66,	"lon":-77.6,	"dir":"N",	"type":"guid",  "value":"MCC U of R U of R Medical Center Exit 16A"}
	]
}

const state = {
  loc: {latitude: 0, longitude: 0},
  testloc:	{latitude: 0, longitude: -77.6},
  current: "",
  previous: [""],
  signIndex: 1,
  errorMessage: "",
}

const THRESHOLD = 0.025;
const TTSqueue = [signs.data[0]];

function componentDidMount(){
  getLocationAsync()
}

async function getLocationAsync () {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    state.errorMessage = 'Permission to access location was denied';
  }

  let loc = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
  const { latitude , longitude } = loc.coords
  state.loc = {latitude, longitude}};

//Distance Function
function getDistance (xA, yA, xB, yB) { 
  var xDiff = xA - xB; 
  var yDiff = yA - yB;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

async function signCheck () {
  await getLocationAsync();
  //state.testloc.latitude += Math.random() * 0.05
  const {latitude, longitude} = state.loc;
  for (var i = state.signIndex; i < state.signIndex + 2 && i < signs.data.length; ++i) {
    var s = testsigns.data[i];
    var d = getDistance(latitude, longitude, s.lat, s.lon);
	var found = false;
    if (d < THRESHOLD) {
      TTSqueue.push(s);
      console.log("Added sign id " + s.id);
      ++state.signIndex;
	  found = true;
    }
	if (found == true) {
		checkTTSQueue();
	}
  }
}

//Checking TTS Queue
async function checkTTSQueue () {
  while(TTSqueue.length != 0){
    Speech.speak(TTSqueue[0].value);
    state.previous.push(state.current);
    state.current = TTSqueue[0].value;
    if (state.previous.length > 5) {
      state.previous.splice(0,1);
    }
    TTSqueue.splice(0,1);
  }
}

// Start checking for signs every 0.2 seconds
async function StartDict () {
	console.log("Dictation Started");
	setInterval(signCheck, 200);
}

//Speech Function
async function NativeSpeech () {
  await getLocationAsync();
  const {latitude, longitude } = state.loc;
  //Speech.speak("Your coordinates are: " + latitude + ", " + longitude);
  checkTTSQueue();
};

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 50}}>
      <View style={styles.tinyLogo}><Image style={styles.image} source={require('./assets/adaptive-icon.png',)} /></View>
      <View><TouchableOpacity style={styles.button} onPress={() => {StartDict(); navigation.navigate('Dictation')}}><Text style={{color: 'white', fontWeight: 'bold'}}>START</Text></TouchableOpacity></View>
      <View><TouchableOpacity style={styles.settings} onPress={() => navigation.navigate('Settings')}><Text style={{color: 'white', fontWeight: 'bold'}}>SETTINGS</Text></TouchableOpacity></View>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 50}}>
     
    </View>
  );
}

async function displayCurrent() {
	return state.current;
}

function DictationScreen({ navigation }) {
  return (
    <View style={{ flex: 1, marginLeft: 20, marginRight: 20, marginTop: 50}}> 
      <View style={{marginBottom: 50}}>
          <View><TouchableOpacity style={styles.button} onPress={NativeSpeech}><Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>START</Text></TouchableOpacity></View>
          <View><TouchableOpacity style={styles.button} /*onPress={this.NativeSpeech}*/><Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>REPEAT</Text></TouchableOpacity></View>
      </View>
      <View style={{marginLeft: 15, marginRight: 15}}>
          <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom:5, textAlign: 'center'}}>Current</Text>
          <Text style={{marginBottom:20, fontSize: 20}}>{state.current}</Text>
          <Text style={{fontWeight: 'bold', marginBottom:5, fontSize: 25, textAlign: 'center'}}>Previous</Text>
          <Text style= {{fontSize: 20}}>{state.previous}</Text>
        </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App(){
  //render{
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Dictation" component={DictationScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  //}
}

//export default App;

const styles = StyleSheet.create({
  settings: {
    alignItems:'center', 
    borderRadius: 10,  
    backgroundColor: '#8c8c8c', 
    paddingLeft: 89, 
    paddingRight: 89,
    paddingTop:50,
    paddingBottom:50,
    marginBottom: 10
  },

  button: {
    alignItems:'center', 
    borderRadius: 10,  
    backgroundColor: '#FF5000', 
    paddingLeft: 100, 
    paddingRight:100,
    paddingTop:50,
    paddingBottom:50,
    marginBottom: 10
  },
  image: {
    width: 400,
    height: 400,
  },
  tinyLogo: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 30
  }
});
 
//export default NativeSpeech