/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {InitApp, ChatRenderer} from './QiscusSDK/lib';

type Room = {
  name: string,
  id: number,
};

export default class AppSDK extends Component {
  constructor() {
    super();
    this.state = {
      qiscus: null,
      newMessage: null,
      rooms: null,
      selectedRoom: null,
      delivered: null,
      chatRoomCreated: null,
      groupRoomCreated: null,
      commentRead: null,
      loginError: null,
      presence: null,
      typing: null,
    };
  }
  componentWillMount() {
    const userAuth = {
      email: 'fikri@qiscus.com',
      password: 'password',
      displayName: 'Fikri',
      avatar: null,
      appID: 'sdksample',
    }
    // required callback function to set global state of rooms list
    const setRooms = (data) => this.setState({rooms: data});

    // required callback function to set global state of qiscus object
    const initApp = (data) => this.setState({qiscus: data});

    // required callback function to catch new received message
    const receiveNewMessage = (data) => this.setState({newMessage: data});

    // optional callback methods
    const commentDeliveredCallback = (data) => this.setState({delivered: data});
    const chatRoomCreatedCallback = (data) => this.setState({chatRoomCreated: data});
    const groupRoomCreatedCallback = (data) => this.setState({groupRoomCreated: data});
    const commentReadCallback = (data) => this.setState({commentRead: data});
    const loginErrorCallback = (data) => this.setState({loginError: data});
    const presenceCallback = (data) => this.setState({presence: data});
    const typingCallback = (data) => this.setState({typing: data});

    const callbackOptions = {
      commentDeliveredCallback,
      chatRoomCreatedCallback,
      groupRoomCreatedCallback,
      commentReadCallback,
      loginErrorCallback,
      presenceCallback,
      typingCallback,
    };

    InitApp({initApp, receiveNewMessage, setRooms, userAuth, callbackOptions});
  }

  // Open chat
  _openChat(room: Room) {
    this._chatTarget(room);
  }

  // Select a Room
  _chatTarget(room: Room) {
    this.setState({
      selectedRoom: room,
    });
  }

  // Create new group example
  _createNewGroup() {
    let {state: {qiscus}} = this;

    // required params
    //    string of group Name
    //    array of string members email
    qiscus.createGroupRoom('Group RN 10',['guest@qiscus.com', 'fikri@qiscus.com']).then(() => {
      this._openChat({name: this.state.groupRoomCreated.name, id: this.state.groupRoomCreated.id});
    });
  }
  render() {
    const {state: {rooms, selectedRoom, qiscus, newMessage}} = this;
    const initApp = (data) => this.setState({qiscus: data});
    if (!rooms) {
      return <View style={{marginTop: 40}}><Text>Initialize App...</Text></View>;
    }
    if (!selectedRoom) {
      return (
        <View style={styles.container}>
          {/* <TouchableOpacity style={styles.button} onPress={() => this._createNewGroup()}>
            <Text>New Group Chat</Text>
          </TouchableOpacity> */}
          <ScrollView>
          {rooms.map((item, i) => {
              const name = item.room_name;
              const avatar_url = item.avatar_url ? item.avatar_url : 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png';
              return (
                  <TouchableOpacity
                    key={i}
                    style={styles.row}
                    onPress={() =>
                      this._openChat({name: name, id: item.id})
                    }
                  >
                    <View style={styles.containerRow}>
                      <Image source={{ uri: avatar_url }} style={styles.photo} />
                      <Text style={styles.text}>
                        {name}
                      </Text>
                    </View>
                  </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={{marginLeft: 30, marginBottom: 10, marginTop: 0, justifyContent: 'center', alignItems: 'center', height: 40, width: 80, borderWidth: 1, borderColor: '#333131'}} onPress={() => this.setState({selectedRoom: null})}>
            <Text>Back</Text>
          </TouchableOpacity>
          <ChatRenderer
            qiscus={qiscus}
            message={newMessage}
            room={selectedRoom}
            initApp={initApp}
            chatListStyle={{backgroundColor: 'transparent'}}
            textInputStyle={{borderRadius: 5, borderColor: '#68a7f0', borderWidth: 2}}
            sendIconStyle={{color: '#c1de13'}}
            attachIconStyle={{color: '#c1de13'}}
            messageItemRightStyle={{backgroundColor: '#afa73e'}}
            messageItemLeftStyle={{backgroundColor: '#c93ea6'}}
            senderTextStyle={{color: '#84c2d1'}}
            messageTextStyle={{color: '#f4f4f4'}}
            loadingIndicatorColor="#f439ec"
          />
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  containerRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dce2e9',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    marginLeft: 30,
    marginBottom: 10,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 80,
    borderWidth: 1,
    borderColor: '#333131',
  },
});

AppRegistry.registerComponent('AppSDK', () => AppSDK);
