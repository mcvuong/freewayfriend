import * as React from 'react'
import { Text, Button, StyleSheet, View } from 'react-native'
import * as Speech from 'expo-speech'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
//import { Camera } from 'expo-camera';
 
import * as signs from './assets/all-data.json';
import { setStatusBarHidden } from 'expo-status-bar'

export default class App extends React.Component{  

    //currently need: variables to contain current text/previous text and to overwrite whenever NativeSpeech is reached
    //Location Functions
    state= {
        location: {latitude: 0,longitude: 0},
        current: "",
        previous: [""],
		    signIndex: 0,
        errorMessage: "",
    }

	  THRESHOLD = 0.025;

    TTSqueue = [signs.data[0]];
    
    componentDidMount(){
      this.getLocationAsync()
    }
    getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
  
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
      const { latitude , longitude } = location.coords
      this.setState({ location: {latitude, longitude}});
    };

    //Distance Function
    getDistance = (xA, yA, xB, yB) => { 
      var xDiff = xA - xB; 
      var yDiff = yA - yB;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    //Checking Signs
    signCheck = async () => {
      await this.getLocationAsync();
      const {latitude, longitude} = this.state.location;
      for (var i = this.state.signIndex; i < this.state.signIndex + 20; ++i) {
        var s = signs.data[i];
        var d = this.getDistance(latitude, longitude, s.lat, s.lon);
        if (d < this.THRESHOLD) {
          this.TTSqueue.push(s);
          console.log("Added sign id " + s.id);
          ++this.state.signIndex;
        }
	  }
    }

    //Checking TTS Queue
    checkTTSQueue = async () => {
      while(this.TTSqueue.length != 0){
        Speech.speak(this.TTSqueue[0].value);
        this.state.current = this.TTSqueue[0].value;
        this.state.previous.push(this.TTSqueue[0].value);
        if (this.state.previous.length > 5) {
          this.state.previous.splice(0,1);
        }
        this.TTSqueue.splice(0,1);
      }
    }
  
    //Speech Function
    NativeSpeech = async () => {
        await this.getLocationAsync();
        const {latitude, longitude } = this.state.location;
        //Speech.speak("Your coordinates are: " + latitude + ", " + longitude);
        this.checkTTSQueue();
    };

    render(){ //Need to implement: https://docs.expo.io/versions/latest/sdk/camera/ but don't know how to yet
        const {location,current, previous, errorMessage } = this.state
        return (
            <View style={styles.container}>
              <View style={{marginBottom: 100}}><Button title="Home" onPress={this.NativeSpeech} /></View>
              
              <View style = {styles.buttons}>
              <View style={{marginBottom: 10}}><Button title="Start" onPress={this.NativeSpeech}/></View>
              {/* <View style={{marginTop: 10}}><Button title="Repeat" onPress={this.NativeSpeech} temporarily does nothing/> </View> */}
              </View>
              <View style={styles.box}>
                <Text style={styles.textBox}>
                  <Text style={{fontWeight: 'bold'}}>Current</Text>
                  {"\n"}
                  <Text>Current sign temp. text, change with variable current or whatever later</Text>
                  {"\n"}
                  {"\n"}
                </Text>
                <Text style={styles.textBox}>
                  <Text style={{fontWeight: 'bold'}}>Previous</Text>
                  {"\n"}
                  <Text>Previous sign temp. text, change with variable previous or whatever later</Text>
                  {"\n"}
                  {"\n"}
                </Text>
              </View>
            </View>
          );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent: 'space-evenly',
      backgroundColor: '#ecf0f1',
    },
    buttons: {
      justifyContent: 'space-evenly',
    },
    box: {
      borderWidth: 1,
      paddingTop: 10,
      marginTop: 20,
      borderColor: 'grey',
      marginLeft: 50,
      marginRight: 50,
      paddingLeft: 5,
      paddingRight: 5,
    },
    textBox: {
      textAlign: 'center',
      fontSize: 16,
    }
  });
 
//export default NativeSpeech