import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat,  Bubble } from 'react-native-gifted-chat';

//import firebase
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();

    //connect to firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAJ29yfD7tPW3_9l6wvIKXtf7Pu39STBTg",
        authDomain: "mychatapp-9c706.firebaseapp.com",
        databaseURL: "https://mychatapp-9c706.firebaseio.com",
        projectId: "mychatapp-9c706",
        storageBucket: "mychatapp-9c706.appspot.com",
        messagingSenderId: "138091787214",
      });
    }
    //read all documents in the messages collection
    this.referenceMessages = firebase.firestore().collection("messages");

    // default state
    this.state = {
      messages: [],
      uid: "",
      user: {
        _id: "",
        name: "",
      },
    };
  }



  //update messages in the state
  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages
    });
  };



  //authenticate the user to see recent messages
  componentDidMount() {

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if(!user) {
        await firebase.auth().signInAnonymously();
      } else {
        //update user state with currently active user data
      this.setState({
        uid: user.uid,
      });
    }
    this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(
        this.onCollectionUpdate
      );
    });

  }


  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  //pushes messages to firestore database
  addMessages() {
   this.referenceMessages.add({
     _id: this.state.messages[0]._id,
     text: this.state.messages[0].text,
     createdAt: this.state.messages[0].createdAt,
     user: this.state.messages[0].user
   });
 }

 //send function that keeps all messages visible
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessages();
    }
  );
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
          _id: this.state.uid,
        }}
      />

      {/*avoid keyboard of android to hide textfield*/ Platform.OS === "android" ? <KeyboardAvoidingView behavior="height"/> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
