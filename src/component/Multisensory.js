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
  ScrollView,
  LayoutAnimation
} from 'react-native';
import { StackNavigator,NavigationActions } from 'react-navigation';
import HomeScreen from '../App';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const { width, height } = Dimensions.get("window");
let width3= 3/4*width;
let height3= 3/4*height;

const CustomLayoutAnimation = {
  duration: 800,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.linear,
  },
  delete: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
};

export default class Multisensory extends Component {
  static navigationOptions = {
    header:null,
    gesturesEnabled: false
  };
  constructor(props) {
    super(props)
    this.state = {
      running: false
    }
  }
  
  
  componentDidMount() {
    let passedProps = this.props.navigation.state.params
    console.log(passedProps)
    setTimeout(() => {
      this.toggle()
    }, 1000)
    setTimeout(() => {
      this.props.navigation.navigate('LessonDetail', {lesson: passedProps.lesson})
    }, 2000)
  }
  
  toggle() {
    LayoutAnimation.configureNext(CustomLayoutAnimation, () => {});
    this.setState({
      running: !this.state.running
    })
  }
  
  render() {
    let right = (!this.state.running) ? (-80) : (width - 100)
    
    return(
      <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 45, color: 'orange'}}>Multisensory</Text>
        <Image
          style={{position: 'absolute', bottom: 30, height: 80, width: 80, right: right}}
          source={require('../images/arrows.png')}/>
      </View>
    )
  }
}