/**
 * Created by vjtc0n on 6/14/17.
 */
import React, { Component } from 'react';

import {
  Text,
  View,
  Button,
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { StackNavigator,NavigationActions } from 'react-navigation';
import HomeScreen from '../App';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const { width, height } = Dimensions.get("window");

import { images } from './images'

export default class LessonTitle extends Component {
  static navigationOptions = {
    header:null,
  };
  
  componentDidMount() {
    let passedProps = this.props.navigation.state.params
    //this.props.navigation.navigate('LessonDetail', {lesson: passedProps.lesson})
    this.props.navigation.navigate('Multisensory', {lesson: passedProps.lesson})
  
  }
  
  render() {
    let passedProps = this.props.navigation.state.params
    let lessonNumber = Number(passedProps.lesson)
    lessonNumber = parseInt(lessonNumber/3) + 1
    return(
      <View>
        <Image
          style={styles.background}
          source={require('../images/background.png')}>
          <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50,
          fontWeight: 'bold'}}>{'Lesson ' + lessonNumber.toString()}</Text>
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  background: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center'
  }
})