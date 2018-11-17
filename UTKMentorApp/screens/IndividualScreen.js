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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { ListItem } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield';
import { LinearGradient } from 'expo';


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
    if (navi.form_data.honors == 'Yes') {
      headList.push({
        title: 'In honors program',
        avatar: require('../assets/star.png')
      })
    }
    if (navi.form_data.grad_interested == 'Yes' &&
        navi.form_data.grad_school != 'None') {
      headList.push({
        title: 'Pursuing '+ navi.form_data.grad_school.toLowerCase(),
        avatar: require('../assets/cap.png')
      })
    }

    var year = navi.form_data.class_year.split(' ').slice(0,1)
    if (year == 'Fifth') {
      year = 'Super Senior'
    }

    var minor = navi.form_data.minors
    if (minor == 'NULL') {
      minor = ''
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
        <LinearGradient style={styles.header}
          colors={['#87898C', '#FFFFFF']}>
          <View style={styles.headerContent}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require('../assets/andrey.jpeg')}
              />
            </View>
            <View style={styles.bio}>
              <Text style={styles.nameText}>{navi.name}</Text>
              <Text style={styles.subText}>{navi.form_data.major}{', '}{year}</Text>
              <Text style={styles.subText}>{minor}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.headForm}>
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
        </View>
        <View style={styles.line}></View>
        <Text style={styles.interestText}>Interested in</Text>
        <View style={styles.line}></View>
        <View style={styles.flexBlock}>
          <View style={styles.flexContainer}>
           {
              interestList1.map((l, i) => (
                <ListItem
                  containerStyle={styles.intListContainer}
                  key={i}
                  title={l.title}
                  titleStyle={styles.intListStyle}
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
                  containerStyle={styles.intListContainer}
                  key={i}
                  title={l.title}
                  titleStyle={styles.intListStyle}
                  avatarStyle={{backgroundColor:'#FFFFFF'}}
                  hideChevron
                />
              ))
            }
          </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.form}>
          <TextField
            label='My dream job'
            labelFontSize={16}
            value={navi.form_data.job}
            /*style={styles.input}*/
            secureTextEntry={false}
            blurOnSubmit={false}
            editable={false}
            baseColor='#E65933'
            underlineColorAndroid='transparent'
            multiline={true}
            lineWidth={0}
            /*placeholder='password'*/
          />
          <TextField
            label='My typical weekend'
            labelFontSize={16}
            value={navi.form_data.weekend}
            /*style={styles.input}*/
            secureTextEntry={false}
            blurOnSubmit={false}
            editable={false}
            baseColor='#E65933'
            underlineColorAndroid='transparent'
            multiline={true}
            lineWidth={0}
            /*placeholder='password'*/
          />
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
    borderColor: '#FFFFFF',
    borderWidth: 2,

  },
  header: {
    alignItems: 'center',
    backgroundColor: '#B9E1E2',
    justifyContent: 'center',
    padding: 10
  },
  headerContent: {
    alignItems: 'center',
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
    height: 44
  },
  intListContainer: {
    borderBottomColor: 'transparent',
    height: 40
  },
  interestText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#E65933'

  },
  intListStyle: {
    fontSize: 15,
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
    marginTop: 5,
    marginBottom: 10,
    marginLeft: '5%',
    marginRight: '5%',
  },
  form: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  headForm: {
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
  }
});
