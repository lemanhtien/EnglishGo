import React, { Component } from 'react';

import {
  Text,
  View,
  Button,
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { StackNavigator,NavigationActions } from 'react-navigation';
import HomeScreen from '../App';

const { width, height } = Dimensions.get("window");
let width3= 3/4*width;
let height3= 3/4*height;

export default class Lessons extends Component {
  static navigationOptions = {
    header:null,
    title: 'Lesson',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
      <Image
          style={styles.background}
          source={require('../images/background.png')}>
        <View style={styles.wrapper}>
          <View style={styles.starTopContainer}>
            <Image source={require('../images/lesson-logo.png')}/>
          </View>
          <Image
          style={styles.lessonContainer}
          source={require('../images/menu-lessons.png')}>
            <Image
            style={styles.buttonContainer}
            source={require('../images/button-level-lessons.png')}>
            <Text style={styles.textLesson}>1</Text>
            </Image>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
              style={styles.buttonHome}
              source={require('../images/button-home.png')}/>
            </TouchableOpacity>
          </Image>

        </View>
      </Image>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  background: {
    width,
    height,
  },
  wrapper: {
    paddingTop: 20,
    padding: 10,
    backgroundColor:'transparent'
  },
  starTopContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lessonContainer:{
    alignSelf:'center',
    width:300,
    height:270,
    padding:30,
    marginTop:150
  },
  buttonContainer:{
    marginTop:20,
    marginLeft:-10,
  },
  textLesson:{
    alignSelf:'center',
    color:'white',
    fontSize:36,
    padding:10,
  },
  buttonHome:{
    marginTop:70,
    marginLeft:20,

  }
})
