import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import * as Speech from 'expo-speech'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
 
import * as signdata from './assets/all-data.json';

export default class App extends React.Component{
    //Location Functions
    state= {
        location:{latitude: 0,longitude: 0},
        geocode:null,
        errorMessage:""
      }
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
        //this.getGeocodeAsync({latitude, longitude})
        this.setState({ location: {latitude, longitude}});
    
      };
      getGeocodeAsync= async (location) => {
        let geocode = await Location.reverseGeocodeAsync(location, {useGoogleMaps:false})
        this.setState({ geocode})
      }
    
    //Speech Function
    NativeSpeech = async ()=> {
            //const latitude = this.state.location.latitude
            //const latitude = this.state.location.latitude
        await this.getLocationAsync()
        const { latitude , longitude } = this.state.location
       
        Speech.speak("Your coordinates are: " + latitude + ", " + longitude);
    };

    render(){
        const {location,geocode, errorMessage } = this.state
        return (
            <View style={styles.container}>
              <Button title="Press to hear some words" onPress={this.NativeSpeech} />
            </View>
          );
    }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
  });
 
//export default NativeSpeech