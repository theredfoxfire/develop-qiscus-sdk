import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import {View, Platform, TouchableOpacity} from 'react-native';
import autobind from 'class-autobind';
import FileUploader from 'react-native-file-uploader';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet'
import styles from './styles';

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 2;
const options = [ 'Cancel', 'Image' ];
const title = 'File type?';

export default class FilePicker extends Component {
  constructor() {
    super();
    this.state = {
      imageSource: null,
      selected: 0,
    };
    autobind(this);
  }
  _showActionSheet() {
    this.ActionSheet.show();
  }

  _handlePress(i) {
    this.setState({
      selected: i
    });
  }
  _pickImage() {
    let {props: {sendMessage}} = this;
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let file = {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        };
        let source = Platform.OS === 'ios' ? response.uri : response.path;
        const settings = {
          uri: source,
          uploadUrl: `https://sdksample.qiscus.com/api/v2/sdk/upload`,
          method: 'POST', // default to 'POST'
          fileName: response.fileName,
          fieldName: 'file',
          contentType: `multipart/form-data`, // default to 'application/octet-stream'
          data: {
            token: this.state.token,
          }
        };

        FileUploader.upload(settings, (err, res) => {
          const data = JSON.parse(res.data);
          sendMessage(`[file] ${data.results.file.url} [/file]`);
        }, (sent, expectedToSend) => {
            // do something when uploading
        });

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageSource: source,
          selected: 0,
        });
      }
    });
  }
  render() {
    let {state: {selected}} = this;
    if (selected === 1) {
      this._pickImage();
    }
    return (
      <View>
        <TouchableOpacity style={{padding: 2}} onPress={() => this._showActionSheet()}>
          <Icon name="paperclip" size={30} color="#444" style={{marginRight: 5}}/>
        </TouchableOpacity>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._handlePress}
        />
      </View>
    );
  }
}
