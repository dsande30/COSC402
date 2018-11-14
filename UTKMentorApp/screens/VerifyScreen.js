import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { TextField } from 'react-native-material-textfield';


import Amplify, { Auth, API } from 'aws-amplify';

export default class Verify extends React.Component {
  state = {
    user_id: '',
    code: '',
    code_error: '',
    phone: '',
    user_pass: '',
    name: '',
    role: '',
  }

  static navigationOptions = {
    header: null
  }

  onChangeText(key, value) {
    console.log(value);
    this.setState({
      [key]: value,
      [key+'_error']: ''
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
        this.props.navigation.navigate('Profile', { data: user })
        console.log('successful sign in!')
      })
      .catch(err => console.log('error signing in: ', err))
    })
    .catch(err => {
      console.log(err.code)
      if (err.code == 'CodeMismatchException') {
        console.log('in mismatch')
        this.setState({
          ['code']: '',
          ['code_error']: 'Incorrect validation code, please try again'
        })
      }
      else {
        console.log('in empty')
        this.setState({
          ['code_error']: 'Code cannot be empty'
        })
      }
    })
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
        <View style={styles.form}>
          <TextField
            onChangeText={value => this.onChangeText('code', value)}
            label='Confirmation Code'
            value={this.state.code}
            error={this.state.code_error}
            title='Check the email provided (and your spam folder)'
            secureTextEntry={false}
            blurOnSubmit={false}
            tintColor='#FF8200'
            underlineColorAndroid='transparent'
            keyboardAppearance='dark'
            keyboardType='number-pad'
            returnKeyType='done'
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnSubmit}
              onPress={this.confirmSignUp.bind(this)}>
              <Text style={styles.btnText}>Verify Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  btnSubmit: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 20
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingBottom: 40
  },
  form: {
    paddingLeft: 40,
    paddingRight: 40,
  }
});
