import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { GiftedChat,  Bubble } from 'react-native-gifted-chat';




export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }



  componentDidMount() {
    let name = this.props.route.params.name;
 //system messages and test avatar to welcome the user
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello ' + name,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: name + ' entered the chatroom',
          createdAt: new Date(),
          system: true,
        },
      ],

    })
  };

 //send function that keeps all messages visible
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#bf1d69'
          },
          left: {
            backgroundColor: '#d1cfd0',
          }
        }}
      />
    )
  }


  render() {
    let name = this.props.route.params.name;

    this.props.navigation.setOptions({ title: name });

    return (
      //setting View to fullscreen with flex be 1
    <View style={{flex:1, justifyContent: "center", /*color state given from the previous View*/ backgroundColor: this.props.route.params.color}}>

      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />

      {/*avoid keyboard of android to hide textfield*/ Platform.OS === "android" ? <KeyboardAvoidingView behavior="height"/> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
