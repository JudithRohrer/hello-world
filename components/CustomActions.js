import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require("firebase");
require("firebase/firestore");


export default class CustomActions extends React.Component {

/**
* Requests permission to view the users photo gallery, if accepted the user can pick image from their photo gallery
* @async
* @function pickImage
*/
pickImage = async () => {
  try {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(e => console.log(e));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};

/**
* Requests permission to the users camera, if accepted the user can take a picture from their phone
* @async
* @function takePhoto
*/
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        }).catch(e => console.log(e));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  /**
  * Requests permission to get the users location, if accepted the user can share their location
  * @async
  * @function getLocation
  */
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({});

        if(!result.cancelled) {
          const location = await Location.getCurrentPositionAsync({});
          console.log(location);
          this.props.onSend({
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  /**
  * Adds the image to the firebase database
  * @async
  * @function uploadImage
  * @returns {string} Image URL
  */
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError('Network Request Failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const getImageName = uri.split('/');
      const imageArrayLength = getImageName[getImageName.length -1];
      const ref = firebase.storage().ref().child(`images/${imageArrayLength}`);

      const snapshot = await ref.put(blob);
      blob.close();
      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (e) {
      console.log(e.message);
    }
  };

  /**
  * Adds the image to the firebase database
  * @function onActionPress
  * @returns {actionSheet}
  */
onActionsPress = () => {
  const options = ['Choose from library', 'Take a picture', 'Send location', 'Cancel'];
  const cancelButtonIndex = options.length -1;
  this.context.actionSheet().showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
    },
    async (buttonIndex) => {
      try {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a picture');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      } catch (e) {
        console.log(e);
      }
    },
  );
};

  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionsPress}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
