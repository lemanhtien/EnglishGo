import React, { Component } from 'react';

import {
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class Exams extends Component {
  static navigationOptions = {
    title: 'Lesson',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Hello, Lessons</Text>

      </View>
    );
  }

}
