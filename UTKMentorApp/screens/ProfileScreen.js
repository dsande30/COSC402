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

import { SearchableFlatList } from "react-native-searchable-list";
import Amplify, { Auth, API } from 'aws-amplify';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      name: '',
      role: '',
      form_data: {},
      goals: {},
      mentor: '',
      pairings: []
    }
    this.user_id = ''
    this.name = ''
    this.role = ''
    this.form_data = {}
    this.goals = {}
    this.mentor = ''
    this.pairings = []
  }

  //Get user's dynamo data
  async getData() {
    const get_response = await API.get('dynamoAPI', '/items/' + this.user_id);
    return get_response;
  }

  async getUser() {
    const info = await Auth.currentAuthenticatedUser();
    return info;
  }

  setData() {
    this.getData()
    .then((rv) =>
      {
        console.log('setting dynamo data')
        this.form_data = rv[0].form_data
        this.goals = rv[0].goals
        this.mentor = rv[0].mentor
        this.pairings = rv[0].pairings
      }
    )
  }

  setUserAttributes() {
    this.getUser()
    .then((data) =>
    {
      console.log('setting user data')
      this.user_id = data.attributes.email
      this.name = data.attributes.name
      this.role = data.attributes['custom:role']
      this.getData()
      .then((rv) => {
        console.log('setting dynamo data')
        console.log(rv)
        this.setState({
          user_id: this.user_id,
          name: this.name,
          role: this.role,
          form_data: rv[0].form_data,
          goals: rv[0].goals,
          mentor: rv[0].mentor,
          pairings: rv[0].pairings
        }, function () { console.log('set that state')})
      })
    })
  }

  signOut() {
    Auth.signOut()
      .then(data => {
        console.log('succesful sign out: ', data)
        this.props.navigation.navigate('SignIn')
      })
      .catch(err => console.log(err));
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  getApplication(screenName) {
    this.props.navigation.navigate(screenName)
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
  }

  componentWillMount() {
    this.setUserAttributes();
  }
  render () {
    let body;
    let appButton;

    {/* HomeScreen either shows "start survey" or goals and stuff*/}
    if (this.state.role == 'Mentee') {
      if (Object.keys(this.state.form_data).length == 0) {
        body = <Text style={styles.formText}>You have signed up as a
               <Text style={{fontWeight: 'bold'}}> Mentee</Text>.
                 To help us learn more about your interests and find your mentor,
                 please fill out the survey below.
               </Text>
       appButton = <TouchableOpacity
                      style={styles.btnSurvey}
                      onPress={() => this.props.navigation.navigate('MenteeForm', { user_id: this.state.user_id })}>
                      <Text style={styles.btnText}>Begin Survey</Text>
                   </TouchableOpacity>
      }
      else {
        body = <View style={styles.goals}>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate('Goals')}>
                  <Text>Hi</Text>
                </TouchableHighlight>
               </View>
        appButton = <TouchableOpacity
                      style={styles.btnSurvey}
                      onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}>
                      <Text style={styles.btnText}>Search Mentors</Text>
                    </TouchableOpacity>
      }
    }
    else if (this.state.role == 'Mentor') {
      if (Object.keys(this.state.form_data).length == 0) {
        body = <Text style={styles.formText}>You have signed up as a
               <Text style={{fontWeight: 'bold'}}> Mentor</Text>.
                 To help us learn more about your interests and match you with mentees,
                 please fill out the survey below.
               </Text>
       appButton = <TouchableOpacity
                      style={styles.btnSurvey}
                      onPress={() => this.props.navigation.navigate('MenteeForm', { user_id: this.state.user_id })}>
                      <Text style={styles.btnText}>Begin Survey</Text>
                   </TouchableOpacity>
      }
      else {
        body = <View style={styles.goals}>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate('Goals')}>
                  <Text>Hi</Text>
                </TouchableHighlight>
               </View>
        appButton = <TouchableOpacity
                      style={styles.btnSurvey}
                      onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}>
                      <Text style={styles.btnText}>Search Mentees</Text>
                    </TouchableOpacity>
      }
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.imageBlock}>
            <View style={styles.imageContainer}>
              <TouchableHighlight onPress={() => this.props.navigation.navigate('Individual', {data: this.state})}>
                <Image
                  style={styles.image}
                  source={require('../assets/andrey.jpeg')}
                  />
              </TouchableHighlight>
            </View>
            <View style={styles.imageContainer}>
              <TouchableHighlight onPress={() => this.props.navigation.navigate('Individual')}>
                <Image
                  style={styles.image}
                  source={require('../assets/question-mark.png')}
                  />
              </TouchableHighlight>
            </View>
          </View>
          <Text style={styles.nameText}>{this.state.name}</Text>
        </View>
        <View style={styles.btnContainer}>
          {appButton}
          {body}
        </View>
        <Button style={styles.btnSignOut} title="Sign Out" onPress={this.signOut.bind(this)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageBlock: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    padding: 10
  },
  imageContainer: {
    flex: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  btnSurvey: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnContainer: {
    alignItems: 'center',
  },
  nameText: {
    color: '#FF8200',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  formText: {
    textAlign: 'center',
  }
});
