# React Native Chat App

 :shipit: 
A chat app for mobile devices using React Native,  leveraging the Gifted Chat library.
The app will provide users with a chat interface and the possibility to share images and their location.

##### Key Features
- offline-use
- cloud-based file and message storing in Firebase
- ability to send location or a photo off your mobile


<p align="center">
  <img width="150" src="https://i.postimg.cc/W4dkFYjj/Bildschirmfoto-2020-09-17-um-15-24-40.png">
  <img width="150" src="https://i.postimg.cc/59L8Srz2/Bildschirmfoto-2020-09-17-um-15-23-47.png">
</p>

 

 
 
 ### How to get started:
 
 1. Clone the repo on your computer
 2. To download expo client enter 
 ```
 nmp install expo-cli -g
 ```
 3. To install the project's dependencies enter
 ```
 npm install --save
 ```
 
 4. Configurate your firebase for data storage 
 Create a [Firebase](https://console.firebase.google.com/) account, create a new project and update these credentials (in Chat.js file) to have chat messages and files stored on Firebase server. 
 <p align="center">
  <img width="450" src="https://i.postimg.cc/xT6tD713/Bildschirmfoto-2020-09-17-um-16-38-23.png">
 </p>
 
 5. Download the expo app on your mobile device
 6. To start the Chat app enter 
 ```
 expo start
 ```
 7. Afterwards open your project within the expo app to see it run
 
 #### Dependencies 
 
 ```
 "@react-native-community/masked-view": "0.1.10",
 "@react-native-community/netinfo": "^5.9.2",
 "@react-navigation/native": "^5.7.3",
 "@react-navigation/stack": "^5.9.0",
 "expo": "^38.0.10",
 "expo-image-picker": "~8.3.0",
 "expo-location": "~8.2.1",
 "expo-permissions": "~9.0.1",
 "expo-status-bar": "^1.0.2",
 "firebase": "^7.9.0",
 "react": "~16.11.0",
 "react-dom": "~16.11.0",
 "react-native": "https://github.com/expo/react-native/archive/sdk-38.0.2.tar.gz",
 "react-native-gesture-handler": "~1.6.0",
 "react-native-gifted-chat": "^0.16.3",
 "react-native-maps": "0.27.1",
 "react-native-reanimated": "~1.9.0",
 "react-native-safe-area-context": "~3.0.7",
 "react-native-screens": "~2.9.0",
 "react-native-web": "~0.11.7",
 "react-navigation": "^4.4.0",
 "@react-native-community/async-storage": "~1.11.0"
 ```
 
 #### Kanban
 For tracking the process of this project and keeping an overview over the different steps I worked with this [Kanban](https://trello.com/b/R7TdIZHc/native-react-chat-app).
 
 ## Happy Coding!
