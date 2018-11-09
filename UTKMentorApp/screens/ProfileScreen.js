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
  state = {
    user_id: '',
    name: '',
    role: '',
    form_data: {},
    goals: {},
    mentor: '',
    parings: []
  }

  async getData() {
    const get_response = await API.get('dynamoAPI', '/items/' + this.state.user_id);
    return get_response;
  }

  async getUser() {
    const info = await Auth.currentAuthenticatedUser()
    return info
  }

  setData() {
    this.getData()
    .then((rv) => this.setState({
      form_data: rv[0].form_data,
      goals: rv[0].goals,
      mentor: rv[0].mentor,
      pairings: rv[0].pairings
    }))
  }

  setUserAttributes() {
    this.getUser().then((data) => this.setState({
      user_id: data.attributes.email,
      name: data.attributes.name,
      role: data.attributes['custom:role']
    }))
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

  render () {
    if (this.state.user_id == '') {
      this.setUserAttributes();
    }
    if (this.state.mentor == '') {
      this.setData();
    }
    let body;
    let appButton;
    if (this.state.role === 'Mentee') {
      body = <Text style={styles.formText}>You have signed up as a
        <Text style={{fontWeight: 'bold'}}> Mentee</Text>.
          To help us learn more about your interests and find your mentor,
          please fill out the survey below.
        </Text>
      appButton = <Button title="Begin Survey" onPress={() => this.props.navigation.navigate('MenteeForm', { user_id: this.state.user_id })} />
    }
    else if (this.state.role === 'Mentor') {
      body = <Text style={styles.formText}>You have signed up as a
        <Text style={{fontWeight: 'bold'}}> Mentor</Text>.
          To help us learn more about your interests and match you with mentees,
          please fill out the survey below.
        </Text>
      appButton = <Button title="Begin Survey" onPress={() => this.props.navigation.navigate('MentorForm', { user_id: this.state.user_id })} />
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageBlock}>
          <View style={styles.imageContainer}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Individual')}>
              <Image
                style={styles.image}
                source={require('../assets/andrey.jpeg')}
                />
            </TouchableHighlight>
          </View>
          <Text>{this.state.name}</Text>
          <View style={styles.imageContainer}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Individual')}>
              <Image
                style={styles.image}
                source={require('../assets/mentor.png')}
                />
            </TouchableHighlight>
          </View>
          <Text>?</Text>
        </View>
        <Button
          onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}
          title="Search People"
          />
        <View style={styles.goals}>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Goals')}>
            <Text>Hi</Text>
          </TouchableHighlight>
        </View>
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
        <Button style={styles.btnSignOut} title="Sign Out" onPress={this.signOut.bind(this)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom: 50
  },
  bio: {
    marginTop: 25,
  },
  aboutTitle: {
    textAlign: 'center'
  },
  baseText: {
    textAlign: 'center'
  },
  imageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '25%',
    backgroundColor: '#B9E1E2',
    justifyContent: 'center'
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden'
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  image: {
    marginBottom: 20,
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  inputs: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
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
