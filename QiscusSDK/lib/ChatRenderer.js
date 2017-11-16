//@flow
import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import autobind from 'class-autobind';
import styles from './styles';
import {ChatComponent} from './ChatComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import FilePicker from './FileUploader';
const {height, width} = Dimensions.get('window');

export class ChatRenderer extends Component {
  constructor() {
    super();
    autobind(this);
    this.state = {
      comments: null,
      newMessage: null,
      clicked: null,
      formStyle: styles.formStyle,
      containerHeight: 0,
    };
  }
  componentWillMount() {
    const {props: {room, initApp, qiscus}} = this;
    qiscus.chatGroup(room.id)
    .then((data) => {
      initApp(qiscus);
      this._updateComments(data.comments);
    }).catch(err => console.log(err));
  }
  componentWillReceiveProps(nextProps) {
    this._updateComments(nextProps.message);
    this._measureChatContainer(this.state.containerHeight);
  }
  _updateComments(comments: Array<{}>) {
    this.setState({
      comments: comments,
    });
  }
  _measureChatContainer(commentsHeight) {
    if (this.refs.chatContainer) {
      this.refs.chatContainer.measure((a, b, width, height, px, py) => {
          if (commentsHeight > height) {
            this._scrollAction(commentsHeight);
          }
        }
      );
    }
  }
  _setToken(token: string) {
    this.setState({
      token: token,
    });
  }
  _scrollAction(height: number) {
    _scrollView.scrollTo({x: 0, y: height, animated: true});
    _scrollView.scrollToEnd({animated: true});
  }
  _setNewMessage(text: string) {
    this.setState({
      newMessage: text,
    });
  }
  _sendMessage(message: string) {
    let {props: {room, qiscus}} = this;
    Keyboard.dismiss();
    this.setState({
      newMessage: null,
    });
    if (message) {
      qiscus.submitComment(room.id, message, null, null, null);
    }
  }

  render() {
    let {props: {message, room, qiscus}, state: {comments, newMessage}} = this;
    if (!comments) {
      return <View style={{marginTop: 30, alignItems: 'center', justifyContent: 'center'}}><Text>Loading chats...</Text></View>
    }
    return (
      <View style={styles.chatContainer}>
        <View style={styles.commentList} ref="chatContainer">
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
          >
            <ChatComponent qiscus={qiscus} updateHeight={(height) => {this._measureChatContainer(height); this.setState({containerHeight: height});}} />
            <View style={styles.breaker} />
          </ScrollView>
        </View>
        <View style={this.state.formStyle}>
          <TextInput style={styles.textInput} underlineColorAndroid='transparent'
            value={newMessage} placeholder="Say something" multiline={true}
            onChangeText={(text) => this._setNewMessage(text)}
          />
          <FilePicker sendMessage={this._sendMessage} />
          <TouchableOpacity style={{padding: 2}} onPress={() => this._sendMessage(newMessage)}>
            <Icon name="send" size={30} color="#444" style={{marginRight: 5}}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
