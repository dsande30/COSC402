import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native';

import { Auth } from 'aws-amplify';

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
  render() {
    this.setAttributes();
    let body;
    if (this.state.role === 'Mentee') {
      body = <Text style={styles.formText}>You have signed up as a
        <Text style={{fontWeight: 'bold'}}> Mentee</Text>.
          To help us learn more about your interests and find your mentor,
          please fill out the survey below.
        </Text>
    }
    else if (this.state.role === 'Mentor') {
      body = <Text style={styles.formText}>You have signed up as a
        <Text style={{fontWeight: 'bold'}}> Mentor</Text>.
          To help us learn more about your interests and match you with mentees,
          please fill out the survey below.
        </Text>
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
            <Text style={styles.btnText}>Begin Survey</Text>
          </TouchableOpacity>
        </View>
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
