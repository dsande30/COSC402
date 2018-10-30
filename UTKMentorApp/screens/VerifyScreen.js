/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Keyboard
} from 'react-native';

import Amplify, { Auth, API } from 'aws-amplify';

export default class Verify extends Component {
  state = {
    user_id: '',
    code: '',
    phone: '',
    user_pass: '',
    name: '',
    role: '',
  }

  onChangeText(key, value) {
    console.log(value);
    this.setState({
      [key]: value
    })
  }

  confirmSignUp(){
    Auth.confirmSignUp(this.state.user_id, this.state.code)
    .then(data => {
      Auth.signIn(this.state.user_id, this.state.user_pass)
      .then( async () => {
        let user_data = {}
        let sample_goals = {}
        let sample_pair = []
        let sample_form = {}
        let user_role = false
        user_data.name = this.state.name
        user_data.email = this.state.user_id
        user_data.phone = this.state.phone
        if (this.state.role === 'Mentee') {
          user_role = false
        }
        else {
          user_role = true
        }
        console.log('calling api');
        const response = await API.post('dynamoAPI', '/items', {
          body: {
            userid: this.state.user_id,
            user_data: user_data,
            form_data: sample_form,
            mentor: user_role,
            pairings: sample_pair,
            goals: sample_goals
          }
        });
      })
      .then(user => {
        this.props.navigation.navigate('Home', { data: user })
        console.log('successful sign in!')
      })
      .catch(err => console.log('error signing in: ', err))
    })
    .catch(err => console.log('error signing up: ', err))
  }

  render() {
    let { navigation } = this.props;
    let user_id = navigation.getParam('username', 'NO-ID');
    let user_pass = navigation.getParam('password', 'NO-ID');
    let phone = navigation.getParam('phone_number', 'NO-ID');
    let name = navigation.getParam('name', 'NO-ID');
    let role = navigation.getParam('role', 'NO-ID');
    if (this.state.user_id == '') {
      this.setState({
        user_id: user_id,
        user_pass: user_pass,
        phone: phone,
        name: name,
        role: role,
      });
    }

    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={value => this.onChangeText('code', value)}
          style={styles.input}
          blurOnSubmit={false}
          keyboardType='phone-pad'
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='confirmation code'
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Button
          title="Submit"
          onPress={this.confirmSignUp.bind(this)}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  }
});
{/*
Auth.signIn(this.state.email, this.state.password)
.then( async () => {
  let user_data = {}
  let sample_goals = {}
  let sample_pair = []
  let sample_form = {}
  let user_role = false
  user_data.name = this.state.name
  user_data.email = this.state.email
  user_data.phone = this.state.phone_number
  if (this.state.role === 'Mentee') {
    user_role = false
  }
  else {
    user_role = true
  }
  console.log('calling api');
  const response = await API.post('dynamoAPI', '/items', {
    body: {
      userid: this.state.email,
      user_data: user_data,
      form_data: sample_form,
      mentor: user_role,
      pairings: sample_pair,
      goals: sample_goals
    }
  });
})
.then(user => {
  this.props.navigation.navigate('Home', { data: user })
  console.log('successful sign in!')
})
.catch(err => console.log('error signing in: ', err))
})
.catch(err => console.log('error signing up: ', err))
}
*/}
