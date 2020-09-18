/**
* @description start.js manages the starting screen of the application chat-app
*/

/**
* @class Start
* @requires React
* @requires React-Native
*/

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

// Page the user sees when opening the app
export default class Start extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      backgroundColor: '',
    };
  }

  render() {
    /**
    * @function render
    * @memberof Start - react class component
    * @returns ImageBackground
    * @returns app title
    * @returns TextInput
    * @returns TouchableOpacity with background color options
    */
    // source for background image
    const image = require('../assets/background.png');

    return (
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.title}>App Title</Text>
        <View style={styles.whiteBox}>
            <TextInput
            style={styles.input}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            placeholder="Your Name ..."
            />
            <Text style={styles.text}>Choose a Background Color:</Text>

        <View style={styles.colorChoice}>
          <TouchableOpacity style={styles.color1} onPress={() => this.setState({backgroundColor: "#090C08"})}>
          </TouchableOpacity>

          <TouchableOpacity style={styles.color2} onPress={() => this.setState({backgroundColor: "#474056"})}>
          </TouchableOpacity>

          <TouchableOpacity style={styles.color3} onPress={() => this.setState({backgroundColor: "#8A95A5"})}>
          </TouchableOpacity>

          <TouchableOpacity style={styles.color4} onPress={() => this.setState({backgroundColor: "#B9C6AE"})}>
          </TouchableOpacity>

        </View>

          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Chat', {//so state can be passed to next Screen
            name: this.state.name, color: this.state.backgroundColor})}>
            <Text style={styles.textButton}>Start Chatting</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({

  image: {
    flex: 1,
    // resizeMode: 'cover',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 44,
  },

  whiteBox: {
    flex: 1,
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    alignSelf: 'center',
    marginBottom: '5%',
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    borderWidth: 1.5,
    borderColor: '#757083',
    borderRadius: 3,
    width: '88%',
    height: '21%',
    marginBottom: '5%',
    paddingLeft: 10,
    marginTop: '5%',
    alignSelf: 'center',
  },

  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    marginBottom: '2%',
    marginLeft: '6%',
  },

  colorChoice: {
    flex: 4,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    marginTop: '2%',
    marginLeft: '3%',
  },

  button: {
    backgroundColor: '#757083',
    width: '88%',
    marginBottom: '5%',
    height: '21%',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  textButton: {
    color: '#FFFFFF',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  color1: {
    backgroundColor: '#090C08',
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  color2: {
    backgroundColor: '#474056',
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  color3: {
    backgroundColor: '#8A95A5',
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  color4: {
    backgroundColor: '#B9C6AE',
    width: 40,
    height: 40,
    borderRadius: 20,
  }
});
