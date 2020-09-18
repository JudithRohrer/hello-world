import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import the screens for navigation
import Start from './components/Start';
import Chat from './components/Chat';
// to make multiple page views possible
import 'react-native-gesture-handler';

// create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { };
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
}
