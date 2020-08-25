import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default class Chat extends React.Component {

  render() {
    let name = this.props.route.params.name;


    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, justifyContent: "center", alignItems: "center", /*color state given from the previous View*/ backgroundColor: this.props.route.params.color}}>
      <Text style={styles.text}>See your chats here soon...</Text>
      </View>
    )
  };
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF'
  }
});
