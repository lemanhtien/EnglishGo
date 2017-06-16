/**
 * Created by vjtc0n on 6/15/17.
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

import LessonDetail from './LessonDetail'

const { width, height } = Dimensions.get("window");

import { images } from './images'

export default class LessonArray extends Component {
  static navigationOptions = {
    header:null,
    gesturesEnabled: false
  };
  constructor(props) {
    super(props)
    this.state = {
      lesson2: '',
      lesson3: ''
    }
  }
  
  componentWillMount() {
    this.setState({
      lesson2: (Number(this.props.navigation.state.params.lesson) + 1).toString(),
      lesson3: (Number(this.props.navigation.state.params.lesson) + 2).toString()
    })
  }
  
  renderLesson1() {
    return(
      <LessonDetail
        navigation={this.props.navigation}
        lesson={this.props.navigation.state.params.lesson}/>
    )
  }
  
  renderLesson2() {
    return(
      <LessonDetail
        navigation={this.props.navigation}
        lesson={this.state.lesson2}/>
    )
  }
  
  renderLesson3() {
    return(
      <LessonDetail
        navigation={this.props.navigation}
        lesson={this.state.lesson3}/>
    )
  }
  
  render() {
    return(
      <View style={{height: '100%', width: '100%'}}>
        <ScrollableTabView
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          renderTabBar={() => <View/>}>
          {this.renderLesson1()}
          {this.renderLesson2()}
          {this.renderLesson3()}
        </ScrollableTabView>
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