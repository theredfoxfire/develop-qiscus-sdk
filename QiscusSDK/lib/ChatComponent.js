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
  return (
    <View>
      {comments.map((data) => {
        let isFile = data.message.substring(0, 6) === '[file]' ? true : false;
        if (user.username === data.username_as) {
          return (
            <View style={styles.cardContainerRight} key={data.id}
              onLayout={(event) => {
                updateHeight(event.nativeEvent.layout.height);
              }}
            >
              <View style={styles.cardRightContent}>
                <View>
                  {renderMessage(isFile, data.message)}
                </View>
              </View>
              <View style={styles.arrowRight}></View>
            </View>
          );
        } else {
          return (
            <View style={styles.cardContainerLeft} key={data.id}
              onLayout={(event) => {
                updateHeight(event.nativeEvent.layout.height);
              }}
            >
              <View style={styles.arrowLeftTop}></View>
              <View style={styles.cardLeftContent}>
                <View>
                  {renderMessage(isFile, data.message)}
                </View>
              </View>
            </View>
          );
        }
      })}
    </View>
  );
}
