import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Modal,
  ImageBackground,
  TouchableHighlight,
  Keyboard
} from 'react-native';

import Amplify, { Auth, API } from 'aws-amplify';

export default class Individual extends Component {
  state = {
    user_id: ''
  }
  render () {
    let { navigation } = this.props;
    let user_id = navigation.getParam('user_id', 'NO-ID');
    if (this.state.user_id == '') {
      this.setState({
        user_id: user_id,
      });
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require('../assets/andrey.jpeg')}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    overflow: 'hidden'
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderColor: 'white',
    borderWidth: 2,
  },
  header: {
    alignItems: 'center',
    height: '30%',
    backgroundColor: '#B9E1E2',
    justifyContent: 'center'
  },
  topHalf: {

  },
  bottomHalf: {

  }
})
