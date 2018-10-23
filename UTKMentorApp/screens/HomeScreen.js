import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native';

import Amplify, { Auth, API } from 'aws-amplify';

export default class Home extends Component {
  state = {
    name: '',
    role: ''
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

  async getUser() {
    const info = await Auth.currentAuthenticatedUser()
    return info
  }

  setAttributes() {
    this.getUser().then((data) => this.setState({
      name: data.attributes.name,
      role: data.attributes['custom:role']
    }))
  }

  post = async () => {
    let sample_form = {}
    let sample_goals = {}
    let sample_pair = ["james"]
    sample_form.whoThis = "andrey"
    sample_goals.getBitches = true
    console.log('calling api');
    const response = await API.post('dynamoAPI', '/items', {
      body: {
        userid: 'akarnauc@vols.utk.edu',
        form_data: sample_form,
        mentor: false,
        pairings: sample_pair,
        goals: sample_goals
      }
    });
    alert(JSON.stringify(response, null, 2));
  }
  get = async () => {
    console.log('calling api');
    const response = await API.get('dynamoAPI', '/items/akarnauc@vols.utk.edu');
    alert(JSON.stringify(response, null, 2));
  }
  list = async () => {
    console.log('calling api');
    const response = await API.get('dynamoAPI', '/items/akarnauc@vols.utk.edu');
    alert(JSON.stringify(response, null, 2));
  }

  render() {
    this.setAttributes();
    let body;
    let appButton;
    if (this.state.role === 'Mentee') {
      body = <Text style={styles.formText}>You have signed up as a
        <Text style={{fontWeight: 'bold'}}> Mentee</Text>.
          To help us learn more about your interests and find your mentor,
          please fill out the survey below.
        </Text>
      appButton = <Button title="Begin Survey" onPress={() => this.props.navigation.navigate('MenteeApp')} />
    }
    else if (this.state.role === 'Mentor') {
      body = <Text style={styles.formText}>You have signed up as a
        <Text style={{fontWeight: 'bold'}}> Mentor</Text>.
          To help us learn more about your interests and match you with mentees,
          please fill out the survey below.
        </Text>
      appButton = <Button title="Begin Survey" onPress={() => this.props.navigation.navigate('MentorApp')} />
    }
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.nameText}>{this.state.name}</Text>
        {body}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSurvey}
            onPress={console.log('pressed button')}>
            {appButton}
          </TouchableOpacity>
        </View>
        <Button onPress={this.post.bind(this)} title="POST" />
        <Button onPress={this.get.bind(this)} title="GET" />
        <Button onPress={this.list.bind(this)} title="LIST" />
        <Button style={styles.btnSignOut} title="Sign Out" onPress={this.signOut.bind(this)} />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center'
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
    marginBottom: 200,
  },
  welcomeText: {
    color: '#58595B',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  nameText: {
    color: '#FF8200',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  formText: {
    textAlign: 'center',
    padding: 20,
    marginTop: 100,
  }
});
