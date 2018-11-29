import React, { Component } from 'react';
import {
  View,
  Alert,
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
import { Icon } from 'react-native-elements';
import { ListItem } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield';
import { LinearGradient } from 'expo';


import Amplify, { Auth, API } from 'aws-amplify';

export default class Individual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      user_data: {},
      navi: {},
      from: ''
    }
  }

  static navigationOptions = {
    title: <Icon
                name='account'
                type='material-community'
                color='rgba(255,255,255,0.70)'
                size={30}
              />,
    headerStyle: {
      backgroundColor: '#58595B',
    },
    headerTintColor: 'rgba(255,255,255,0.70)',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitle: null,
  }

  componentWillMount() {
    console.log('Fired')
    this.setData();
  }

  preferUserMentee() {
    let tmp = this.state.user_data
    tmp.pairings = [this.state.navi.userid]
    index = this.state.navi.pairings.indexOf(tmp.user_data.email);
    if (index != -1) {
      Alert.alert(
        'Congratulations!',
        'You have matched.',
        [
          {text: 'OK', onPress: () => { this.setState({ user_data: tmp}), this.putData().then((rv) => this.props.navigation.navigate('Profile')) }}
        ],
        { cancelable: false }
      )
    }
    this.setState({
      user_data: tmp
    }), this.putData()
  }

  preferUser() {
    console.log('prefered')
    console.log(this.state.user_data)
    let tmp = this.state.user_data
    if (tmp.mentor) {
      tmp.pairings.push(this.state.navi.userid)
      index = this.state.navi.pairings.indexOf(tmp.user_data.email);
      if (index != -1) {
        Alert.alert(
          'Congratulations!',
          'You have matched.',
          [
            {text: 'OK', onPress: () => { this.setState({ user_data: tmp}), this.putData().then((rv) => this.props.navigation.navigate('Profile')) }}
          ],
          { cancelable: false }
        )
      }
    }
    else {
      if (tmp.pairings.length != 0) {
        Alert.alert(
          'Warning!',
          'You have already preferred a mentor. To prefer this mentor instead, press OK. To keep your current preference, press Cancel.',
          [
            {text: 'OK', onPress: () => this.preferUserMentee()},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        )
      }
      else {
        tmp.pairings = [this.state.navi.userid]
        index = this.state.navi.pairings.indexOf(tmp.user_data.email);
        if (index != -1) {
          Alert.alert(
            'Congratulations!',
            'You have matched.',
            [
              {text: 'OK', onPress: () => { this.setState({ user_data: tmp}), this.putData().then((rv) => this.props.navigation.navigate('Profile')) }}
            ],
            { cancelable: false }
          )
        }
      }
    }
    this.setState({
      user_data: tmp
    }), this.putData()
  }

  preferUndo() {
    console.log('undo')
    let tmp = this.state.user_data
    var index = tmp.pairings.indexOf(this.state.navi.userid)
    if (index !== -1) {
      tmp.pairings.splice(index, 1);
    }
    this.setState({
      user_data: tmp
    }), this.putData()
  }

  setData() {
    let { navigation } = this.props;
    let from = navigation.getParam('from')
    let user_data = navigation.getParam('user_data')
    let navi = navigation.getParam('data')
    console.log("*************")
    console.log(navi)
    this.setState({
      user_data: user_data,
      navi: navi,
      from: from
    });
  }

  async putData() {
    let put_body = {
      body: {
        userid: this.state.user_data.user_id,
        user_data: this.state.user_data.user_data,
        form_data: this.state.user_data.form_data,
        goals: this.state.user_data.goals,
        mentor: this.state.user_data.mentor,
        pairings: this.state.user_data.pairings
      }
    }
    const put_response = await API.put('dynamoAPI', '/items?userid=' + this.state.user_data.userid, put_body);
    return put_response;
  }

  render () {
    const { navigation } = this.props

    const headList = []

    if (this.state.navi.mentor) {
      if (this.state.navi.form_data.research == 'Yes') {
        headList.push({
          title: 'Doing research on campus',
          avatar: require('../assets/flask.png')
        })
      }
    }
    else if (this.state.navi.mentor == false) {
      if (this.state.navi.form_data.research == 'Yes') {
        headList.push({
          title: 'Interested in doing research',
          avatar: require('../assets/flask.png')
        })
      }
      else if (this.state.navi.form_data.research == 'Currently') {
        headList.push({
          title: 'Doing research on campus',
          avatar: require('../assets/flask.png')
        })
      }
    }
    if (this.state.navi.form_data.honors == 'Yes') {
      headList.push({
        title: 'In honors program',
        avatar: require('../assets/star.png')
      })
    }
    if (this.state.navi.form_data.grad_interested == 'Yes' &&
        this.state.navi.form_data.grad_school != 'None') {
      headList.push({
        title: 'Pursuing '+ this.state.navi.form_data.grad_school.toLowerCase(),
        avatar: require('../assets/cap.png')
      })
    }

    var year = this.state.navi.form_data.class_year.split(' ').slice(0,1)
    if (year == 'Fifth') {
      year = 'Super Senior'
    }

    var minor = this.state.navi.form_data.minors
    console.log(minor)
    if (minor == 'NULL') {
      minor = ''
    }

    const interestList1 = []
    const interestList2 = []


    for (var i in this.state.navi.form_data.interests) {
      if ( i < this.state.navi.form_data.interests.length / 2) {
        console.log('1')
        interestList1.push({
          title: this.state.navi.form_data.interests[i]
        })
      } else {
        console.log('2')
        interestList2.push({
          title: this.state.navi.form_data.interests[i]
        })
      }
    }

    var prefer = null
    if (this.state.from == 'search') {
      console.log(this.state.user_data.pairings)
      if (this.state.user_data.pairings.includes(this.state.navi.userid)) {
        prefer = <TouchableOpacity style = {styles.preferBtn}
          onPress={this.preferUndo.bind(this)}>
          <Icon
            name='account-check'
            type='material-community'
            color='rgba(255,255,255,0.70)'
            size={18}
          />
          <Text style={styles.preferText}>Preferred</Text>
        </TouchableOpacity>
      }
      else {
        prefer = <TouchableOpacity style = {styles.preferBtn}
          onPress={this.preferUser.bind(this)}>
          <Icon
            name='account-plus'
            type='material-community'
            color='rgba(255,255,255,0.70)'
            size={18}
          />
          <Text style={styles.preferText}>Prefer</Text>
        </TouchableOpacity>
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
            {prefer}
            <View style={styles.bio}>
              <Text style={styles.nameText}>{this.state.navi.name}</Text>
              <Text style={styles.subText}>{this.state.navi.form_data.major}{', '}{year}</Text>
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
            value={this.state.navi.form_data.job}
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
            value={this.state.navi.form_data.weekend}
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
  },
  preferBtn: {
    backgroundColor: '#ABC178',
    borderRadius: 20,
    padding: 10,
    width: '50%',
    height: 36,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  preferText: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 8
  }
});
