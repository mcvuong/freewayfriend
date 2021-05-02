import * as React from 'react';
import { Image, Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as signs from './assets/all-data.json';

export default class App extends React.Component{  

  testsigns = {
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
   
    state= {
        location: {latitude: 0,longitude: 0},
        testloc:	{latitude: 0, longitude: -77.6},
        current: "",
        previous: [""],
        signIndex: 1,
        errorMessage: "",
        start: "START"
    }

	  THRESHOLD = 0.150;

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
      for (var i = this.state.signIndex; i < this.state.signIndex + 2 && i < signs.data.length; ++i) {
        var s = this.testsigns.data[i];
        var d = this.getDistance(latitude, longitude, s.lat, s.lon);
        var found = false;
          if (d < this.THRESHOLD) {
            this.TTSqueue.push(s);
            console.log("Added sign id " + s.id);
            ++this.state.signIndex;
          found = true;
          }
      if (found == true) {
        this.checkTTSQueue();
	}
  }
    }

    //Checking TTS Queue
    checkTTSQueue = async () => {
      while(this.TTSqueue.length != 0){
        var q = this.TTSqueue[0];
        if (q.type != "spdl") {
          Speech.speak(q.value);
        } else {
          Speech.speak("Speed Limit: " + q.value);
        }
        this.state.previous.unshift(this.state.current);
        this.state.current = q.value;
          if (this.state.previous.length > 5) {
            this.state.previous.pop();
          }
          this.TTSqueue.splice(0,1);
        }
      }
  
    StartDict () {
      console.log("Dictation Started");
      setInterval(this.signCheck, 200);
    }

    //Speech Function
    NativeSpeech = async () => {
        this.changeText();
        await this.getLocationAsync();
        const {latitude, longitude } = this.state.location;
        //Speech.speak("Your coordinates are: " + latitude + ", " + longitude);
        this.checkTTSQueue();
        this.render();
    };

     changeText = async () => {
      if (this.state.start. match("START")) {
          this.state.start = "DICTATING...";
      }
      else this.state.start  = "START";
    }

    RepeatLast = async() => {
      Speech.speak(this.state.current);
    };

    render(){ //Need to implement: https://docs.expo.io/versions/latest/sdk/camera/ but don't know how to yet
        const {location,current, previous, errorMessage } = this.state
        return (
          <><View style={styles.tinyLogo}><Image style={styles.image} source={require('./assets/adaptive-icon.png')} /></View>
            <View style={{ flex: 1, marginLeft: 20, marginRight: 20}}>
              <View style={{ marginBottom: 20 }}>
                <View><TouchableOpacity style={styles.button} onPress={this.NativeSpeech}><Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>{this.state.start}</Text></TouchableOpacity></View>
                <View><TouchableOpacity style={styles.button} onPress={this.RepeatLast}><Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>REPEAT</Text></TouchableOpacity></View>
              </View>
              <View style={{ marginLeft: 15, marginRight: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 25, marginBottom: 5, textAlign: 'center' }}>Current</Text>
                <Text style={{ marginBottom: 20, fontSize: 20 }}> {this.state.current}</Text>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 25, textAlign: 'center' }}>Previous</Text>
                <Text style={{ fontSize: 20 }}> {this.state.previous} </Text>
              </View>
            </View></>
          );
    }
}

const styles = StyleSheet.create({
  settings: {
    alignItems:'center', 
    borderRadius: 10,  
    backgroundColor: '#8c8c8c', 
    paddingLeft: 89, 
    paddingRight: 89,
    paddingTop:20,
    paddingBottom:20,
    marginBottom: 80
  },

  button: {
    alignItems:'center', 
    borderRadius: 10,  
    backgroundColor: '#FF5000', 
    paddingLeft: 100, 
    paddingRight:100,
    paddingTop:50,
    paddingBottom:50,
    marginBottom: 20
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 40
  },
  tinyLogo: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 30
  }
});