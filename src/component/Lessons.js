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
let width3= 3/4*width;
let height3= 3/4*height;

export default class Lessons extends Component {
  static navigationOptions = {
    header:null,
    title: 'Lesson',
  };
  
  renderPage1() {
    return (
      <View style={{overflow: 'visible', paddingLeft: 7}}>
        <View style={{height: '45%', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '1'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>1</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '2'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>2</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '3'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>3</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '4'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>4</Text>
            </Image>
          </TouchableOpacity>
        </View>
        <View style={{
          height: '50%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%', marginLeft: 2, paddingLeft: 8, paddingRight: 8}}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '5'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>5</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '6'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>6</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '7'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>7</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '8'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>8</Text>
            </Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  
  renderPage2() {
    return (
      <View style={{overflow: 'visible', paddingLeft: 7}}>
        <View style={{height: '45%', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '9'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>9</Text>
            </Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '10'})}>
            <Image
              style={{}}
              source={require('../images/button-level-lessons.png')}>
              <Text style={styles.textLesson}>10</Text>
            </Image>
          </TouchableOpacity>
          <View
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '11'})}>
            <View
              style={{width: 65}}>
            </View>
          </View>
          <View
            style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LessonTitle', {lesson: '12'})}>
            <View
              style={{width: 65}}>
            </View>
          </View>
        </View>
      </View>
    )
  }
  
  
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
              <View style={{height: '75%', overflow: 'visible'}}>
                <ScrollableTabView
                  style={{overflow: 'visible', flex: 1}}
                  renderTabBar={() => <View/>}>
                  {this.renderPage1()}
                  {this.renderPage2()}
                </ScrollableTabView>
              </View>
              <View style={{height: '20%', alignSelf: 'center'}}>
                <TouchableOpacity
                  style={{height: '100%', width: '30%'}}
                  onPress={() => this.props.navigation.navigate('Home')}>
                  <Image
                    style={{}}
                    source={require('../images/button-home.png')}/>
                </TouchableOpacity>
              </View>
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
    paddingTop:30,
    marginTop:150,
    flexDirection: 'column',
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
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
  }
})
