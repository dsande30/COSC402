import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Keyboard,
  View,
  Picker,
  Image,
  TouchableOpacity,
  Text,
  ScrollView
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { TextField } from 'react-native-material-textfield';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import Amplify, { Auth, API } from 'aws-amplify';

export default class SignUp extends React.Component {

  state = {
    email: '',
    email_error: '',
    password: '',
    password_error: '',
    confirm: '',
    confirm_error: '',
    phone_number: '',
    phone_error: '',
    name: '',
    name_error: '',
    role: 'Mentee',
    disabled: false
  };

  valid_email = [ 'utk.edu', 'tennessee.edu', 'vols.utk.edu', 'live.utk.edu',
                  'mail.tennessee.edu', 'volmail.utk.edu']

  onChangeText(key, value) {
    this.setState({
      [key]: value
    }, this.checkErrors())
  }

  onChangeEmail(value) {
    vals = value.split('@')
    if (vals.length != 2) {
      this.setState({
        ['email_error']: 'Invalid email address (starts with netID)',
        ['email']: value
      }, this.checkErrors())
    }
    else if (!(this.valid_email.includes(vals[1]))) {
      this.setState({
        ['email_error']: 'Invalid domain (try vols.utk.edu)',
        ['email']: value
      }, this.checkErrors())
    }
    else {
      this.setState({
        ['email_error']: '',
        ['email']: value
      }, this.checkErrors())
    }
  }

  onChangePassword(value) {
    if (!/[0-9]/.test(value)) {
      this.setState({
        ['password_error']: 'Must contain one number 0-9',
        ['password']: value
      }, this.checkErrors())
    }
    else if (!/[a-z]/.test(value)) {
      this.setState({
        ['password_error']: 'Must contain one lower case letter',
        ['password']: value
      }, this.checkErrors())
    }
    else if (!/[A-Z]/.test(value)) {
      this.setState({
        ['password_error']: 'Must contain one upper case letter',
        ['password']: value
      }, this.checkErrors())
    }
    else if (value.length < 8) {
      this.setState({
        ['password_error']: 'Must be at least 8 characters long',
        ['password']: value
      }, this.checkErrors())
    }
    else {
      this.setState({
        ['password_error']: '',
        ['password']: value
      }, this.checkErrors())
    }
  }

  onChangeConfirm(value) {
    if (value != this.state.password) {
      this.setState({
        ['confirm_error']: 'Passwords do not match',
        ['confirm']: value
      })
    }
    else {
      this.setState({
        ['confirm_error']: '',
        ['confirm']: value
      })
    }
  }

  onChangePhone(value){
    if (value.length != 10) {
      this.setState({
        ['phone_error']: 'Invalid phone number',
        ['phone_number']: value
      })
    }
    else {
      this.setState({
        ['phone_error']: '',
        ['phone_number']: value
      })
    }
  }

  checkFull(key) {
    if (this.state[key] == '') {
      this.setState({
        [key+'_error']: 'Oops! You forgot this one'
      })
    }
  }

  checkErrors() {
    if (this.state.email_error == '' &&
        this.state.password_error == '' &&
        this.state.confirm_error == '' &&
        this.state.name_error == '' &&
        this.state.phone_error == '')
    {
      console.log('enable button')
      this.setState({
        ['disabled']: false
      })
    } else {
      console.log('disable button')
      this.setState({
        ['disabled']: true
      })
    }
  }

  signUp() {
    Auth.signUp({
      username: this.state.email,
      password: this.state.password,
      attributes: {
        email: this.state.email,
        name: this.state.name,
        phone_number: '+1' + this.state.phone_number,
        'custom:role': this.state.role
      }
    })
    .then(data => {
      console.log("success!" + data)
      this.props.navigation.navigate('Verify', {
        username: this.state.email,
        password: this.state.password,
        name: this.state.name,
        phone_number: this.state.phone_number,
        role: this.state.role,
        name: this.state.name
      })
    })
    .catch(err => console.log("error signingup pt1" + err))
  }

  render() {
    let roles = [
      {label: 'Mentee', value: 'Mentee' },
      {label: 'Mentor', value: 'Mentor' }
    ];
    return (
      <KeyboardAwareScrollView enableOnAndroid={true}
       enableAutoAutomaticScroll={(Platform.OS === 'ios')}>
          <KeyboardAvoidingView style={styles.container}  behavior="padding" enabled>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
                />
            </View>
            <View style={styles.form}>

              <Text style={styles.title}>New Account Registration</Text>

              <TextField
                onChangeText={value => this.onChangeEmail(value)}
                label='UTK Email Address'
                value={this.state.email}
                error={this.state.email_error}
                title='Starts with your netID'
                /*style={styles.input}*/
                secureTextEntry={false}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                keyboardType='email-address'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  this.passwordInput.focus()
                  this.checkFull('email')
                  this.checkErrors()
                }}
              />

              <TextField
                onChangeText={value => this.onChangePassword(value)}
                label='Password'
                value={this.state.password}
                error={this.state.password_error}
                title={'Requires upper, lower, number, & length of 8'}
                /*style={styles.input}*/
                secureTextEntry={true}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  this.confirmInput.focus()
                  this.checkFull('password')
                  this.checkErrors()
                }}
                ref={(input) => this.passwordInput = input}
              />

              <TextField
                onChangeText={value => this.onChangeConfirm(value)}
                label='Confirm Password'
                value={this.state.confirm}
                error={this.state.confirm_error}
                /*style={styles.input}*/
                secureTextEntry={true}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  this.nameInput.focus()
                  this.checkFull('confirm')
                  this.checkErrors()
                }}
                ref={(input) => this.confirmInput = input}
              />

              <TextField
                onChangeText={value => this.onChangeText('name', value)}
                label='Name'
                value={this.state.name}
                error={this.state.name_error}
                /*style={styles.input}*/
                secureTextEntry={false}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  this.phoneInput.focus()
                  this.checkFull('name')
                  this.checkErrors()
                }}
                ref={(input) => this.nameInput = input}
              />

              <TextField
                onChangeText={value => this.onChangePhone(value)}
                label='Phone Number'
                value={this.state.phone_number}
                error={this.state.phone_error}
                prefix='+1'
                /*style={styles.input}*/
                secureTextEntry={false}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                keyboardType='number-pad'
                /*placeholder='password'*/
                returnKeyType='done'
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                  this.checkFull('phone')
                  this.checkErrors()
                }}
                ref={(input) => this.phoneInput = input}
              />


            <View style={styles.registeringAs}>
                <Text style={styles.registerText}>Registering as:</Text>
              </View>
              <View style={styles.radio}>
                <RadioForm
                  radio_props={roles}
                  initial={0}
                  buttonColor={'#FF8200'}
                  selectedButtonColor={'#FF8200'}
                  formHorizontal={true}
                  labelHorizontal={true}
                  radioStyle={{paddingRight: 20}}
                  onPress={(value) => this.onChangeText('role', value)}
                />
              </View>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnSignUp}
                disabled = {this.state.disabled}
                onPress={this.signUp.bind(this)}>
                <Text style={styles.btnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  fix: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 50,
  },
  title: {
    color: '#58595B',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 25,
  },
  btnSignUp: {
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
    marginBottom: 100,
  },
  radio: {
    margin: 10,
  },
  /*input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  },*/
  registeringAs: {
    margin: 10,
  },
});
