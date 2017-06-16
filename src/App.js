import React, { Component } from 'react';
// import { Provider } from 'react-redux';
// import createStore from './createStore';
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
import { StackNavigator } from 'react-navigation';
import Tts from 'react-native-tts'
import Lessons from './component/Lessons';
import Exams from './component/Exams';
import LessonTitle from './component/LessonTitle'
import LessonDetail from './component/LessonDetail'
import Multisensory from './component/Multisensory'
import LessonArray from './component/LessonArray'
// const store = createStore();
const { width, height } = Dimensions.get("window");

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };
  
  componentDidMount() {
    //Tts.speak('air plane')
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
      <Image
          style={styles.background}
          source={require('./images/background.png')}>
        <View style={styles.wrapper}>
          <Image
              style={styles.centerItem}
              source={require('./images/logo.png')}/>
          <TouchableOpacity onPress={() => navigate('Lessons')}>
            <Image
              style={styles.centerItemButton}
              source={require('./images/button-main1.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Exams')}>
          <Image
              style={styles.centerItemButton}
              source={require('./images/button-main2.png')}/>
          </TouchableOpacity>
        </View>
      </Image>
      </View>
    );
  }

}
const EnglishGo = StackNavigator({
  Home: { screen: HomeScreen },
  Lessons: { screen: Lessons },
  Exams: { screen: Exams },
  LessonTitle: {screen: LessonTitle},
  Multisensory: {screen: Multisensory},
  LessonDetail: {
    screen: LessonArray,
    gesturesEnabled: false
  }
});
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
  centerItem:{
    alignSelf:'center'
  },
  centerItemButton:{
    alignSelf:'center',
    margin: 20,

  }
});
AppRegistry.registerComponent('EnglishGo', () => EnglishGo);
