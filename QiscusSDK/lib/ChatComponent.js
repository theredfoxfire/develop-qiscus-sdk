import React, { Component } from 'react';
import {View, Image, Text, ActivityIndicator} from 'react-native';
import autobind from 'class-autobind';
import styles from "./styles";

function renderMessage(isFile: boolean, message: string) {
  if (isFile) {
    let uri = message.split("[file] ")[1].split(" [/file]")[0];
    return (
      <Image
        style={styles.picture}
        source={{uri: uri}}
      />
    );
  } else {
    return (
      <Text>
        {message}
      </Text>
    );
  }
}

export function ChatComponent(props: Object) {
  const {qiscus, updateHeight, isSending} = props;
  const comments = qiscus.selected.comments;
  const user = qiscus.userData;
  let currentUserName = '';
  let isSamePerson = true;
  let marginChat = 10;
  let marginMessage = 0;
  let heighChat = 0;
  return (
    <View onLayout={(event) => {
      updateHeight(event.nativeEvent.layout.height);
    }}
    >
      {comments.map((data, index) => {
        let isFile = data.message.substring(0, 6) === '[file]' ? true : false;
        if (currentUserName !== data.username_as) {
          currentUserName = data.username_as;
          isSamePerson = false;
          marginChat = 10;
          marginMessage = 0;
        } else {
          marginChat = 0;
          marginMessage = 6;
          isSamePerson = true;
        }
        heighChat = comments.length - 1 == index ? 35 : 0;
        if (user.username === data.username_as) {
          if (data.username_real) {
            return (
              <View
                key={data.id}
                style={[styles.messageContainerRight, {paddingTop: marginChat, marginBottom: heighChat}]}>
              <View style={styles.cardContainerRight}>
                <View style={[styles.cardRightContent, {marginRight: marginMessage}]}>
                  {isSamePerson ? null : <View style={{paddingBottom: 5, borderBottomColor: '#b3bab5', borderBottomWidth: 1, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>{data.username_as}</Text></View>}
                  <View>
                    {renderMessage(isFile, data.message)}
                  </View>
                </View>
                {
                  isSamePerson ? null : <View style={styles.arrowRight} />
                }
              </View>
              {!isSamePerson ?
                <Image
                  style={{height: 40, width: 40, borderRadius: 20, marginRight: 5}}
                  source={{uri: data.avatar}}
                /> : <View style={{height: 40, width: 40, borderRadius: 20, marginRight: 5}} />
              }
              </View>
            );
          } else {
            return <ActivityIndicator key={data.id} style={[{marginBottom: heighChat, alignItems: 'center', justifyContent: 'center'}]} size="large" color="#6fbf15" />;
          }
        } else {
          return (
            <View
              style={[styles.messageContainerLeft, {paddingTop: marginChat, marginBottom: heighChat}]} key={data.id}>
              {!isSamePerson ?
                <Image
                  style={{height: 40, width: 40, borderRadius: 20, marginLeft: 5}}
                  source={{uri: data.avatar}}
                /> : <View style={{height: 40, width: 40, borderRadius: 20, marginLeft: 5}} />
              }
              <View style={styles.cardContainerLeft}>
                {
                  isSamePerson ? null : <View style={styles.arrowLeftTop} />
                }
                <View style={[styles.cardLeftContent, {marginLeft: marginMessage}]}>
                  {isSamePerson ? null : <View style={{paddingBottom: 5, borderBottomColor: '#b3bab5', borderBottomWidth: 1, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>{data.username_as}</Text></View>}
                  <View>
                    {renderMessage(isFile, data.message)}
                  </View>
                </View>
              </View>
            </View>
          );
        }
      })}
    </View>
  );
}
