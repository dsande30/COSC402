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
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
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

    const headList = []

    if (navi.role == 'Mentor') {
      if (navi.form_data.research == 'Yes') {
        headList.push({
          title: 'Doing research on campus',
          avatar: require('../assets/flask.png')
        })
      }
    }
    else if (navi.role == 'Mentee') {
      if (navi.form_data.research == 'Yes') {
        headList.push({
          title: 'Interested in doing research',
          avatar: require('../assets/flask.png')
        })
      }
      else if (navi.form_data.research == 'Currently') {
        headList.push({
          title: 'Doing research on campus',
          avatar: require('../assets/flask.png')
        })
      }
    }
    if (navi.honors == 'Yes') {
      headList.push({
        title: 'In honors program',
        avatar: require('../assets/star.png')
      })
    }
    if (navi.form_data.grad_interested == 'Yes' &&
        navi.form_data.grad_school != 'None') {
      headList.push({
        title: 'Pursuing '+ navi.form_data.grad_school,
        avatar: require('../assets/cap.png')
      })
    }

    const interestList1 = []
    const interestList2 = []


    for (var i in navi.form_data.interests) {
      if ( i < navi.form_data.interests.length / 2) {
        console.log('1')
        interestList1.push({
          title: navi.form_data.interests[i]
        })
      } else {
        console.log('2')
        interestList2.push({
          title: navi.form_data.interests[i]
        })
      }
    }

    return (
      <KeyboardAwareScrollView style={styles.container} enableOnAndroid={true}
       enableAutoAutomaticScroll={(Platform.OS === 'ios')}>
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
          headList.map((l, i) => (
            <ListItem
              containerStyle={styles.listContainer}
              key={i}
              avatar={l.avatar}
              title={l.title}
              avatarStyle={{backgroundColor:'#FFFFFF'}}
              hideChevron
            />
          ))
        }
        <Text style={styles.interestText}>Interested in</Text>
        <View style={styles.flexBlock}>
          <View style={styles.flexContainer}>
           {
              interestList1.map((l, i) => (
                <ListItem
                  containerStyle={styles.listContainer}
                  key={i}
                  title={l.title}
                  avatarStyle={{backgroundColor:'#FFFFFF'}}
                  hideChevron
                />
              ))
            }
          </View>
          <View style={styles.flexContainer}>
            {
              interestList2.map((l, i) => (
                <ListItem
                  containerStyle={styles.listContainer}
                  key={i}
                  title={l.title}
                  avatarStyle={{backgroundColor:'#FFFFFF'}}
                  hideChevron
                />
              ))
            }
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  listContainer: {
    borderBottomColor: 'transparent',
  },
  interestText: {
    fontSize: 18,
    textAlign: 'center',
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
  },
  flexContainer: {
    flex: 1,
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
