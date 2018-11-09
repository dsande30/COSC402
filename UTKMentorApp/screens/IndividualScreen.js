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
  TouchableHighlight,
  Keyboard
} from 'react-native';
import { ListItem } from 'react-native-elements'

import Amplify, { Auth, API } from 'aws-amplify';

export default class Individual extends Component {
  state = {
    user_id: ''
  }

  render () {
    const { navigation } = this.props
    navi = navigation.getParam('data')
    console.log(navi)

    const list = []
    if (navi.form_data.grad_interested == 'Yes' &&
        navi.form_data.grad_school != 'None') {
      list.push({
        title: 'Interested in '+ navi.form_data.grad_school,
        avatar: require('../assets/cap.png')
      })
    }
    if (navi.honors == 'Yes') {
      list.push({
        title: 'In honors program',
        avatar: require('../assets/star.png')
      })
    }
    if (navi.role == 'Mentor') {
      if (navi.form_data.research == 'Yes') {
        list.push({
          title: 'Doing research on campus',
          avatar: require('../assets/flask.png')
        })
      }
    }
    else if (navi.role == 'Mentee') {
      if (navi.form_data.research == 'Yes') {
        list.push({
          title: 'Interested in doing research',
          avatar: require('../assets/flask.png')
        })
      }
      else if (navi.form_data.research == 'Currently') {
        list.push({
          title: 'Doing research on campus',
          avatar: require('../assets/flask.png')
        })
      }
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
          <View style={styles.bio}>
            <Text style={styles.nameText}>{navi.name}</Text>
            <Text style={styles.subText}>{navi.form_data.major}{', '}{navi.form_data.class_year}</Text>
            <Text style={styles.subText}>{navi.form_data.minors}</Text>
          </View>
        </View>
        {
          list.map((l, i) => (
            <ListItem
              key={i}
              avatar={l.avatar}
              title={l.title}
              avatarStyle={{backgroundColor:'#FFFFFF'}}
            />
          ))
        }
        <View style={styles.flexBlock}>
          <View style={styles.flexContainer}>
            <Text>Entrepreneurship / Business</Text>
          </View>
          <View style={styles.flexContainer}>
            <Text>Entrepreneurship / Business</Text>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 5
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderColor: '#517C96',
    borderWidth: 2,

  },
  header: {
    alignItems: 'center',
    backgroundColor: '#B9E1E2',
    justifyContent: 'center',
    padding: 10
  },
  subText: {
    fontSize: 18,
    color: '#58595B',
    textAlign: 'center',
    padding: 0,
  },
  nameText: {
    fontWeight: 'bold',
    color: '#58595B',
    fontSize: 26,
    textAlign: 'center',
    padding: 0,
    marginBottom: 5
  },
  bio: {

  },
  aboutTitle: {
    textAlign: 'center'
  },
  baseText: {
    textAlign: 'center'
  },
  flexBlock: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flexContainer: {
    flex: 1,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  inputs: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  },
  line: {
    borderBottomColor: '#888888',
    borderBottomWidth: 1,
    marginLeft: '10%',
    marginRight: '10%',
  }
});
