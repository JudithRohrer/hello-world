import React, { Component } from 'react';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// to make multiple page views possible
import 'react-native-gesture-handler';



const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor() {
   super();
   this.state = { text: "" };
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">

          <Stack.Screen name="Welcome" component={Start}/>
          <Stack.Screen name="Chat" component={Chat}/>

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};
