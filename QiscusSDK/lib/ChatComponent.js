import React, { Component } from 'react';
import {View, Image, Text} from 'react-native';
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
  const {qiscus, updateHeight} = props;
  const comments = qiscus.selected.comments;
  const user = qiscus.userData;
  let currentUserName = '';
  let isSamePerson = true;
  let marginChat = 10;
  return (
    <View onLayout={(event) => {
      updateHeight(event.nativeEvent.layout.height);
    }}
    >
      {comments.map((data) => {
        let isFile = data.message.substring(0, 6) === '[file]' ? true : false;
        if (currentUserName !== data.username_as) {
          currentUserName = data.username_as;
          isSamePerson = false;
          marginChat = 10;
        } else {
          marginChat = 0;
          isSamePerson = true;
        }
        if (user.username === data.username_as) {
          return (
            <View style={{flexDirection: 'row', marginTop: marginChat, justifyContent: 'flex-end',}} key={data.id}>
            <View style={styles.cardContainerRight}>
              <View style={styles.cardRightContent}>
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
          return (
            <View style={{flexDirection: 'row', marginTop: marginChat}} key={data.id}>
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
                <View style={styles.cardLeftContent}>
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
