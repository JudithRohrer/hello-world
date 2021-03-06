/**
* @description Chat.js is the second page view, displays the chat room
*/

/**
* @class Chat
* @requires React
* @requires React-Native
* @requires Keyboard Spacer
* @requires Custom Actions
* @requires React Native Maps
* @requires Expo Image Picker
* @requires Expo Permissions
* @requires Expo Location
* @requires Firebase
* @requires Firestore
*/

import React from 'react';
import {
  View,
  Platform,
  KeyboardAvoidingView,
  AsyncStorage,
  Image,
  YellowBox,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
// Dealing with yellow banner warnings
YellowBox.ignoreWarnings(['Animated: `useNativeDriver`', 'Animated.event']);

// import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();

    // connect to firestore
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
    // read all documents in the messages collection
    this.referenceMessages = firebase.firestore().collection('messages');

    // default state
    this.state = {
      messages: [],
      uid: '',
      isConnected: '',
    };
  }

  // authenticate the user to see recent messages
  componentDidMount() {
  // check online status of the user with NetInfo - machine can decide where to fetch messages

    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        this.setState({
          isConnected: true,
        });
        console.log('online');
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // update user state with currently active user data
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
          isConnected: false,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  /**
    * Get Messages from the current state When the user is offline
    * @async
    * @function getMessages
    * @param {string} messages References messages from current state
    * @return {state} messages
    */
  // fetch messages from AsyncStorage when user is offline
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
     * Saves Messages from the current state to the firestore database
     * @async
     * @function saveMessages
     * @param {string} messages References messages from current state
     * @return {state} Saves the messages to the databse
     */
  // save messages in AsyncStorage in case user has to use app once offline in the future
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
     * Deletes messages from AsyncStorage for development purposes
     * @async
     * @function deleteMessages
     * @param {string} messages
     * @return {AsyncStorage}
     */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
    * Add Messages
    * @function addMessages
    * @param {string} message References the last sent message
    * @param {string} _id Message ID
    * @param {string} _text Message contents
    * @param {string} createdAt Message time stamp
    * @param {string} user User info
    * @param {string} uid User Unique ID
    * @param {string} image  Image if applicable
    * @param {string} location Location coordinates if applicable
    * @return {object} All message data and adds it to the firestore database
    */
  // pushes messages to firestore database
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
  /**
     * Sends messages
     * @function onSend
     * @param {string} messages
     * @return {state} Gifted Chat UI
     */

  // send function that keeps all messages visible
  onSend = (messages = []) => {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessages();
      this.saveMessages();
    });
  };

  /**
   * Updates stored messages in firebase database
   * @function onCollectionUpdate
   * @param {string} _id Unique Message ID
   * @param {string} text Message written by the user
   * @param {string} createdAt Timestamp of message
   * @param {string} user User data consisting of user ID, avatar, and Name entered on start screen
   * @param {string} image Image URL if applicable
   * @param {string} location Location coordinates if applicable
   * @return {object} All message data and pushes it to the messages state
   */
// update messages in the state
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
        avatar: data.user.avatar,
      },
      image: data.image || '',
      location: data.location || '',
    });
  });
  this.setState({
    messages,
  });
};

/**
 * Renders input toolbar only if online
 * @function renderInputToolbar
 * @param {*} props
 * @returns {renderInputToolbar}
 */
  // unable UI send new messages in case the user is offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  /**
     * Renders text bubble UI from GiftedChat
     * @function renderBubble
     * @param {*} props
     * @returns {renderBubble}
     */
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
    );
  };

  /**
    * Renders custom actions giving the users options to Take an image, Choose and image, or send their location
    * @function renderCustomActions
    * @param {*} props
    * @returns {renderCustomActions}
    */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />
  };

  /**
     * Renders custom UI bubble for when the user sends their location
     * @function renderCustomView
     * @param {*} props
     * @returns {renderCustomView}
     */
  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
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
    // setting View to fullscreen with flex be 1
    <View style={{flex:1, justifyContent: "center", /*color state given from the previous View*/ backgroundColor: this.props.route.params.color}}>

      {this.state.location &&
      <MapView
        style={{
         width: 300,
         height: 200}}
       region={{
         titude: this.state.location.coords.latitude,
         longitude: this.state.location.coords.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421,
         }}
      />}

      {this.state.image &&
      <Image source={{ uri: this.state.image.uri }} style={{width: 200, height: 200}}/>}

      <GiftedChat
        renderBubble={this.renderBubble}
        renderInputToolbar={this.renderInputToolbar}
        renderActions={this.renderCustomActions}
        renderCustomView={this.renderCustomView}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: this.state.uid,
        }}
      />

      {/* avoid keyboard of android to hide textfield */ Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
    );
  }
}
