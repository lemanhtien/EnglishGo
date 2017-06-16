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
  Modal,
} from 'react-native';
import { StackNavigator,NavigationActions } from 'react-navigation';
import {images} from './images';

const { width, height } = Dimensions.get("window");
let width3= 9/10*width;
let height3= 3/4*height;
let randomWords=[];
let listWords = ["airplane","apple","banana","bear","bird","book","bus","car","cake","cat"]
export default class Exams extends Component {
  static navigationOptions = {
    header:null,
    title: 'Exams',
  };
  componentWillMount(){
    this.state={
      question:1,
      modalVisible: false,
      answerQuestion:null,
      lastQuestion:false,
    }
    randomWords = this.randomWord();
    console.log(images);
    console.log(randomWords);
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  //random word
  randomWord(){
    let numWords = [];
    numWords.push(Math.floor(Math.random() * 8) + 1);
    for (let i = 1; i<5;i++){
      let random = Math.floor(Math.random() * 8) + 1;
      let flag = false
      numWords.map(numWord=>{
        if(numWord==random) flag= true;
      })
      if (flag) numWords.push(random+1);
      else if(!flag) numWords.push(random);
    }
    return numWords;
  }
  // checkLastQuestion(){
  //   if(this.state.question==5){
  //     console.log("last qustion");
  //
  //     return(
  //     )
  //   }
  //   return;
  // }
  renderQuestion(){
    let randomImage = Math.floor(Math.random() * 9) + 1;
    console.log('aasd',randomWords[this.state.question], listWords[randomWords[this.state.question]]);
    return(
      <View style={{flex:2,marginTop:60}}>
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Home')}}>
          <Image
            style={{ marginLeft:20,}}
            source={require('../images/button-back-small.png')}/>
        </TouchableOpacity>
      <Text style={{backgroundColor:'transparent', textAlign:'center', fontSize:25, color:'white'}}>
        What is {listWords[randomWords[this.state.question]]} ?</Text>
        <View style={{borderRadius:5,shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.2, backgroundColor:'rgba(245,166,35,0.4)',borderColor:'white', margin:10, height: '60%',flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={()=>{
            let next = this.state.question +1;
            if(next>=5) {
              this.setState({lastQuestion:true});
              this.setModalVisible(true);
              setTimeout(()=>{
                this.setModalVisible(false);
              }, 1500);
              setTimeout(()=>{
                this.props.navigation.navigate('Home')
              }, 1600);
              return;
            }
            this.setState({answerQuestion:true});
            this.setModalVisible(true);
            setTimeout(()=>{
              this.setState({question:next});
              this.setModalVisible(false);
            }, 1500);
          }}>

            <Image
              resizeMode="contain"
              style={{ width:width3,height:200}}
              source={images[randomWords[this.state.question]+1][randomImage]}/>
              <View style={{paddingTop:10}}>
                <Text style={{backgroundColor:'transparent', fontSize:20, color:'white', textAlign:'center'}}>
                  This is!</Text>
              </View>
          </TouchableOpacity>
        </View>
        <View style={{borderRadius:5,shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.2, backgroundColor:'rgba(245,166,35,0.4)',borderColor:'white', margin:10, height: '40%',flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={()=>{
            let next = this.state.question +1;
            if(next>=5) {
              this.setState({lastQuestion:true});
              this.setModalVisible(true);
              setTimeout(()=>{
                this.setModalVisible(false);
              }, 1500);
              setTimeout(()=>{
                this.props.navigation.navigate('Home')
              }, 1600);
              return;
            }
            this.setState({answerQuestion:false});
            this.setModalVisible(true);
            setTimeout(()=>{
              this.setState({question:next});
              this.setModalVisible(false);
            }, 1500);
          }}>
            <Image
              resizeMode="contain"
              style={{width:width3,height:200}}
              source={images[randomWords[this.state.question]][randomImage]}/>
              <View style={{paddingTop:10}}>
                <Text style={{backgroundColor:'transparent', fontSize:20, color:'white', textAlign:'center' }}>
                  This is!</Text>
              </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
      <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            {(this.state.lastQuestion)?<View style={{ marginTop:'30%',flexDirection: 'column',alignItems:'center', justifyContent: 'center'}}>
              <Image source={require('../images/final-logo.gif')}/></View>:null}
            {(this.state.answerQuestion)?<View style={{ marginTop:'30%',flexDirection: 'column',alignItems:'center', justifyContent: 'center'}}>
              <Image source={require('../images/check-mark.gif')}/></View>
            :<View style={{ marginTop:'30%',flexDirection: 'column',alignItems:'center', justifyContent: 'center'}}>
            <Image source={require('../images/wrong-mark.gif')}/></View>}
          </View>
         </View>
        </Modal>
      <Image
        style={styles.background}
        source={require('../images/background.png')}>
          {this.renderQuestion()}
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
})
