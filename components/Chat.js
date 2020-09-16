import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, AsyncStorage, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import CustomActions from "./CustomActions";

import MapView from 'react-native-maps';

// Dealing with yellow banner warnings
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Animated: `useNativeDriver`', 'Animated.event']);



//import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();

    //connect to firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyAJ29yfD7tPW3_9l6wvIKXtf7Pu39STBTg',
        authDomain: 'mychatapp-9c706.firebaseapp.com',
        databaseURL: 'https://mychatapp-9c706.firebaseio.com',
        projectId: 'mychatapp-9c706',
        storageBucket: 'mychatapp-9c706.appspot.com',
        messagingSenderId: '138091787214',
      });
    }
    //read all documents in the messages collection
    this.referenceMessages = firebase.firestore().collection('messages');




    // default state
    this.state = {
      messages: [],
      uid: '',
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
      isConnected: ''
    };
  }

  //authenticate the user to see recent messages
  componentDidMount() {
    //check on- or offline status of the user with NetInfo, to let the machine decide where to fetch messages

    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({
          isConnected: true
        });
        console.log('online');
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if(!user) {
              await firebase.auth().signInAnonymously();
          }

          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            isConnected: true,
          });
          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.getMessages();
        this.setState({
          isConnected: false
        });
      };
    });
  };



  componentWillUnmount() {
    if(this.state.isConnected){
    this.unsubscribe();
    this.authUnsubscribe();
    }
  };


  // fetch messages from AsyncStorage when user is offline
  getMessages = async () => {
     let messages = '';
     try {
       messages = (await AsyncStorage.getItem('messages')) || [];
       this.setState({
         messages: JSON.parse(messages)
       });
     } catch (e) {
       console.log(e.message);
     }
   };


  // save messages in AsyncStorage in case user has to use app once offline in the future
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (e) {
      console.log(e.message);
    }
  }

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (e) {
      console.log(e.message);
    }
  }



  //pushes messages to firestore database
  addMessages = () => {
   this.referenceMessages.add({
     _id: this.state.messages[0]._id,
     text: this.state.messages[0].text || '',
     createdAt: this.state.messages[0].createdAt,
     user: this.state.messages[0].user,
     image: this.state.messages[0].image || '',
     location: this.state.messages[0].location ||''
   });
  }


 //send function that keeps all messages visible
  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessages();
      this.saveMessages();
    }
  );
};

//update messages in the state
onCollectionUpdate = (querySnapshot) => {
  const messages = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    messages.push({
      _id: data._id,
      text: data.text.toString(),
      createdAt: data.createdAt.toDate(),
      user: {
        _id: data.user._id,
        name: data.user.name,
        avatar: data.user.avatar
      },
      image: data.image || '',
      location: data.location || ''
    });
  });
  this.setState({
    messages
  });
};


  //unable UI send new messages in case the user is offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
        return <InputToolbar {...props} />;
    }
  };

  renderBubble = (props) => {
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


  renderCustomActions = (props) => {
    return <CustomActions {...props} />
  };

  renderCustomView = (props) => {
    const { currentMessage } = props;
    if(currentMessage.location) {
      return (
        <MapView
          style={{width:150,
            height: 100,
            borderRadius: 13,
            margin: 3}}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };



  render() {
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });


    return (
      //setting View to fullscreen with flex be 1
    <View style={{flex:1, justifyContent: "center", /*color state given from the previous View*/ backgroundColor: this.props.route.params.color}}>

    {this.state.location &&
      <MapView
      style={{width: 300, height: 200}}
      region={{
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        }}
      />}

    {this.state.image &&
    <Image source={{ uri: this.state.image.uri }} style={{width: 200, height: 200}}/>}

      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        renderActions={this.renderCustomActions}
        renderCustomView={this.renderCustomView}
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
