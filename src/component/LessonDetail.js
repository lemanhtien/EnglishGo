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
    let passedProps = this.props.navigation.state.params
    console.log(passedProps.lesson)
    let lesson = passedProps.lesson
    let lessonTitle = null
    switch (lesson) {
      case '1':
        lessonTitle = 'airplane'
        break
      case '2':
        lessonTitle = 'apple'
        break
      case '3':
        lessonTitle = 'banana'
        break
      case '4':
        lessonTitle = 'bear'
        break
      case '5':
        lessonTitle = 'bird'
        break
      case '6':
        lessonTitle = 'book'
        break
      case '7':
        lessonTitle = 'bus'
        break
      case '8':
        lessonTitle = 'car'
        break
      case '9':
        lessonTitle = 'cake'
        break
      case '10':
        lessonTitle = 'cat'
        break
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
    let passedProps = this.props.navigation.state.params
    return(
      <View style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Image
          resizeMode="contain"
          style={styles.background}
          source={images[passedProps.lesson][this.state.firstPage]}/>
        <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50, position: 'absolute',
          fontWeight: 'bold', bottom: 20, alignSelf: 'center'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  renderPage2() {
    let passedProps = this.props.navigation.state.params
    return(
      <View style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Image
          resizeMode="contain"
          style={styles.background}
          source={images[passedProps.lesson][this.state.secondPage]}/>
        <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50, position: 'absolute',
          fontWeight: 'bold', bottom: 20, alignSelf: 'center'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  renderPage3() {
    let passedProps = this.props.navigation.state.params
    return(
      <View style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          style={{position: 'absolute', top: 20, zIndex: 10}}
          onPress={() => this.props.navigation.navigate('Lessons')}>
          <Image
            style={{}}
            source={require('../images/button-home.png')}/>
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.background}
          source={images[passedProps.lesson][this.state.thirdPage]}/>
        <Text style={{backgroundColor: 'transparent', color: 'white',
          fontSize: 50, position: 'absolute',
          fontWeight: 'bold', bottom: 20, alignSelf: 'center'}}>{this.state.title}</Text>
      </View>
    )
  }
  
  render() {
    let passedProps = this.props.navigation.state.params
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
  }
})