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
import Tts from 'react-native-tts'
import { StackNavigator,NavigationActions } from 'react-navigation';
import HomeScreen from '../App';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const { width, height } = Dimensions.get("window");

import { images } from './images'

export default class LessonDetail extends Component {
  static navigationOptions = {
    header:null,
    gesturesEnabled: false
  };
  
  constructor(props) {
    super(props)
    this.state = {
      firstPage: null,
      secondPage: null,
      thirdPage: null,
      title: ''
    }
    
  }
  
  randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
  }
  
  randomIntFromIntervalWithoutFirstValue(min,max, currentValue) {
    let random = null
    let success = false
    while (!success) {
      random = Math.floor(Math.random()*(max-min+1)+min)
      if (random != currentValue) {
        success = true
      }
    }
    return random
  }
  
  randomIntFromIntervalWithout2FirstValue(min,max, firstValue, secondValue) {
    let random = null
    let success = false
    while (!success) {
      random = Math.floor(Math.random()*(max-min+1)+min)
      if (random != firstValue && random != secondValue) {
        success = true
      }
    }
    return random
  }
  
  componentWillMount() {
    let lesson = this.props.lesson
    let lessonTitle = null
    switch (lesson) {
      case '1':
        lessonTitle = 'air plane'
        break
      case '2':
        lessonTitle = 'boat'
        break
      case '3':
        lessonTitle = 'bicycle'
        break
      case '4':
        lessonTitle = 'bear'
        break
      case '5':
        lessonTitle = 'bird'
        break
      case '6':
        lessonTitle = 'dog'
        break
      case '7':
        lessonTitle = 'bus'
        break
      case '8':
        lessonTitle = 'car'
        break
      case '9':
        lessonTitle = 'motorcycle'
        break
      case '10':
        lessonTitle = 'cat'
        break
      case '11':
        lessonTitle = 'sheep'
        break
      case '12':
        lessonTitle = 'zebra'
        break
      case '13':
        lessonTitle = 'boat'
        break
      case '14':
        lessonTitle = 'bicycle'
        break
      case '15':
        lessonTitle = 'bus'
        break
      case '16':
        lessonTitle = 'elephant'
        break
      case '17':
        lessonTitle = 'giraffe'
        break
      case '18':
        lessonTitle = 'horse'
        break
      case '19':
        lessonTitle = 'traffic light'
        break
      case '20':
        lessonTitle = 'stop sign'
        break
      case '21':
        lessonTitle = 'parking meter'
        break
      case '22':
        lessonTitle = 'bed'
        break
      case '23':
        lessonTitle = 'sink'
        break
      case '24':
        lessonTitle = 'potted plant'
        break
      case '25':
        lessonTitle = 'chair'
        break
      case '26':
        lessonTitle = 'couch'
        break
      case '27':
        lessonTitle = 'bench'
        break
      case '28':
        lessonTitle = 'apple'
        break
      case '29':
        lessonTitle = 'orange'
        break
      case '30':
        lessonTitle = 'banana'
    }
    console.log(lessonTitle)
    let firstPage = this.randomIntFromInterval(1, 10)
    let secondPage = this.randomIntFromIntervalWithoutFirstValue(1, 10, firstPage)
    let thirdPage = this.randomIntFromIntervalWithout2FirstValue(1, 10, firstPage, secondPage)
    this.setState({
      firstPage: firstPage,
      secondPage: secondPage,
      thirdPage: thirdPage,
      title: lessonTitle
    })
    setTimeout(() => {Tts.speak(lessonTitle)}, 500)
    //console.log(images[passedProps.lesson][1])
  }
  
  renderPageTitle() {
    return(
      <View style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50,
          fontWeight: 'bold'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  renderPage1() {
    return(
      <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => Tts.speak(this.state.title)}
          style={{height: '30%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            resizeMode="contain"
            style={styles.backgroundImage}
            source={images[this.props.lesson][this.state.firstPage]}/>
        </TouchableOpacity>
        <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50, position: 'absolute',
          fontWeight: 'bold', bottom: 20, alignSelf: 'center'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  renderPage2() {
    return(
      <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => Tts.speak(this.state.title)}
          style={{height: '30%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            resizeMode="contain"
            style={styles.backgroundImage}
            source={images[this.props.lesson][this.state.secondPage]}/>
        </TouchableOpacity>
        <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50, position: 'absolute',
          fontWeight: 'bold', bottom: 20, alignSelf: 'center'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  renderPage3() {
    return(
      <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          style={{position: 'absolute', top: 20, zIndex: 10, right: 10, width: 30, height: 30}}
          onPress={() => this.props.navigation.navigate('Lessons')}>
          <Image
            resizeMode="contain"
            style={{width: 30, height: 30}}
            source={require('../images/button-home.png')}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Tts.speak(this.state.title)}
          style={{height: '30%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            resizeMode="contain"
            style={styles.backgroundImage}
            source={images[this.props.lesson][this.state.thirdPage]}/>
        </TouchableOpacity>
        <Text style={{backgroundColor: 'transparent', color: 'white',
            fontSize: 50, position: 'absolute',
            fontWeight: 'bold', bottom: 20, alignSelf: 'center'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  render() {
    return(
      <View>
        <Image
          style={styles.background}
          source={require('../images/background.png')}>
          <ScrollableTabView
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            renderTabBar={() => <View/>}>
            {this.renderPageTitle()}
            {this.renderPage1()}
            {this.renderPage2()}
            {this.renderPage3()}
          </ScrollableTabView>
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
  },
  backgroundImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 20
  }
})